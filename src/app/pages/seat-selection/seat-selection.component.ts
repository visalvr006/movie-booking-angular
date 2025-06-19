import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-seat-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seat-selection.component.html',
 // styleUrls: ['./seat-selection.component.css']
})
export class SeatSelectionComponent implements OnInit, OnChanges {
  @Input() seats: any[][] = [];
  @Input() movieId: string = '';
  @Input() date: string = '';
  @Input() time: string = '';
  @Input() theater: string = '';
  @Input() selectedSeats: any[] = [];
  @Output() seatChange = new EventEmitter<any[]>();

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.fetchBookedSeats();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['movieId'] || changes['date'] || changes['time'] || changes['theater']) {
      this.fetchBookedSeats();
    }
    if (changes['selectedSeats'] && changes['selectedSeats'].currentValue) {
      // Update the state of seats based on selectedSeats
      const selectedSeats = changes['selectedSeats'].currentValue;
      this.seats.forEach(row => {
        row.forEach(seat => {
          if (selectedSeats.some((s: { id: string }) => s.id === seat.id)) {
            seat.state = 'selected';
          }
        });
      });
    }
  }

  fetchBookedSeats() {
    // Ensure all required parameters are available before making the API call
    if (!this.movieId || !this.date || !this.time || !this.theater) {
      console.warn('Missing parameters for fetching booked seats.', { 
        movieId: this.movieId, 
        date: this.date, 
        time: this.time, 
        theater: this.theater 
      });
      return;
    }

    console.log('Fetching booked seats with params:', {
      movieId: this.movieId,
      date: this.date,
      time: this.time,
      theater: this.theater
    });

    this.apiService.getBookedSeats(this.movieId, this.date, this.time, this.theater).subscribe({
      next: (data: any[]) => {
        console.log('Received booked seats data:', data);
        
        // Initialize seats grid
        const rows = 6;
        const cols = 14;
        this.seats = Array.from({ length: rows }, (_, rowIdx) =>
          Array.from({ length: cols }, (_, colIdx) => ({
            id: `${String.fromCharCode(65 + rowIdx)}${colIdx + 1}`,
            state: 'available'
          }))
        );

        // Mark booked seats if data is valid
        if (Array.isArray(data)) {
          data.forEach(booking => {
            if (booking && Array.isArray(booking.seats)) {
              booking.seats.forEach((bookedSeatId: string) => {
                try {
                  const rowLabel = bookedSeatId.charAt(0);
                  const colNum = parseInt(bookedSeatId.substring(1), 10);

                  const rowIndex = rowLabel.charCodeAt(0) - 'A'.charCodeAt(0);
                  const colIndex = colNum - 1;

                  if (this.seats[rowIndex] && this.seats[rowIndex][colIndex]) {
                    this.seats[rowIndex][colIndex].state = 'booked';
                  }
                } catch (error) {
                  console.error('Error processing seat:', bookedSeatId, error);
                }
              });
            }
          });
        } else {
          console.warn('Invalid data format received:', data);
        }

        // Restore selected seats
        if (this.selectedSeats && this.selectedSeats.length > 0) {
          this.selectedSeats.forEach(selectedSeat => {
            try {
              const rowLabel = selectedSeat.id.charAt(0);
              const colNum = parseInt(selectedSeat.id.substring(1), 10);
              const rowIndex = rowLabel.charCodeAt(0) - 'A'.charCodeAt(0);
              const colIndex = colNum - 1;

              if (this.seats[rowIndex] && this.seats[rowIndex][colIndex] && this.seats[rowIndex][colIndex].state !== 'booked') {
                this.seats[rowIndex][colIndex].state = 'selected';
              }
            } catch (error) {
              console.error('Error processing selected seat:', selectedSeat, error);
            }
          });
        }
      },
      error: (error) => {
        console.error('Error fetching booked seats:', error);
        // Initialize seats as available in case of error
        const rows = 6;
        const cols = 14;
        this.seats = Array.from({ length: rows }, (_, rowIdx) =>
          Array.from({ length: cols }, (_, colIdx) => ({
            id: `${String.fromCharCode(65 + rowIdx)}${colIdx + 1}`,
            state: 'available'
          }))
        );
      }
    });
  }

  onSeatClick(seat: any) {
    if (seat.state === 'booked') return;
    if (seat.state === 'selected') {
      seat.state = seat.originalState || 'available';
      this.selectedSeats = this.selectedSeats.filter(s => s.id !== seat.id);
    } else {
      seat.originalState = seat.state;
      seat.state = 'selected';
      this.selectedSeats = [...this.selectedSeats, seat];
    }
    this.seatChange.emit(this.selectedSeats);
  }

  getSeatClass(seat: any) {
    return {
      'seat-available': seat.state === 'available',
      'seat-selected': seat.state === 'selected',
      'seat-booked': seat.state === 'booked',
      'seat-premium': seat.state === 'premium',
    };
  }

  getRowLabel(rowIndex: number): string {
    return String.fromCharCode(65 + rowIndex);
  }
} 