import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-booking-summary',
  templateUrl: './booking-summary.component.html',
  styleUrls: ['./booking-summary.component.css']
})
export class BookingSummaryComponent {
  @Input() movie: any;
  @Input() date: string = '';
  @Input() time: string = '';
  @Input() theater: string = '';
  @Input() selectedSeats: any[] = [];
  @Output() proceed = new EventEmitter<void>();

  bookingFee = 2.00;
  regularPrice = 12.00;
  premiumPrice = 18.00;

  get regularSeats() {
    return this.selectedSeats.filter(s => s.state === 'available').length;
  }
  get premiumSeats() {
    return this.selectedSeats.filter(s => s.state === 'premium').length;
  }
  get total() {
    return this.regularSeats * this.regularPrice + this.premiumSeats * this.premiumPrice + this.bookingFee;
  }
  get seatLabels() {
    return this.selectedSeats.map(s => s.id).join(', ');
  }
} 