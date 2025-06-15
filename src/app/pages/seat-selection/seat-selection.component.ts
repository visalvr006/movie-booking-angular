import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seat-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seat-selection.component.html',
  styleUrls: ['./seat-selection.component.css']
})
export class SeatSelectionComponent {
  @Input() seats: any[][] = [];
  @Output() seatChange = new EventEmitter<any[]>();

  selectedSeats: any[] = [];

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