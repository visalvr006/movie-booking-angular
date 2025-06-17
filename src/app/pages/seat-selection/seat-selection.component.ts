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
  @Output() seatChange = new EventEmitter<any[]>();

  selectedSeats: any[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.fetchBookedSeats();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['movieId'] || changes['date'] || changes['time'] || changes['theater']) {
      this.fetchBookedSeats();
    }
  }

  fetchBookedSeats() {
    // Ensure all required parameters are available before making the API call
    if (!this.movieId || !this.date || !this.time || !this.theater) {
      console.warn('Missing parameters for fetching booked seats.', { movieId: this.movieId, date: this.date, time: this.time, theater: this.theater });
      return;
    }

    this.apiService.getBookedSeats(this.movieId, this.date, this.time, this.theater).subscribe(
      (data: any[]) => {
        // Re-initialize seats to all available before marking booked ones
        const rows = 6;
        const cols = 14;
        this.seats = Array.from({ length: rows }, (_, rowIdx) =>
          Array.from({ length: cols }, (_, colIdx) => ({
            id: `${String.fromCharCode(65 + rowIdx)}${colIdx + 1}`,
            state: 'available'
          }))
        );

        data.forEach(booking => {
          booking.seats.forEach((bookedSeatId: string) => {
            const rowLabel = bookedSeatId.charAt(0);
            const colNum = parseInt(bookedSeatId.substring(1), 10);

            const rowIndex = rowLabel.charCodeAt(0) - 'A'.charCodeAt(0);
            const colIndex = colNum - 1;

            if (this.seats[rowIndex] && this.seats[rowIndex][colIndex]) {
              this.seats[rowIndex][colIndex].state = 'booked';
            }
          });
        });

        // After updating booked seats, ensure selected seats are also handled
        this.selectedSeats = this.seats.flatMap(row => row.filter(seat => seat.state === 'selected'));

      },
      error => {
        console.error('Error fetching booked seats:', error);
      }
    );
  }

  onSeatClick(seat: any) {
    if (seat.state === 'booked') return;
    if (seat.state === 'selected') {
      seat.state = seat.originalState || 'available';
      this.selectedSeats = this.selectedSeats.filter(s => s.id !== seat.id);
    } else {
      seat.originalState = seat.state;
      seat.state = 'selected';
      this.selectedSeats.push(seat);
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