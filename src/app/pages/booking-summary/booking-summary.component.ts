import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-summary',
  imports: [CommonModule],
  templateUrl: './booking-summary.component.html',
  //styleUrls: ['./booking-summary.component.css']
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
  isSubmitting = false;
  error: string | null = null;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

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

  async onSubmit() {
    if (!this.movie || !this.movie._id) {
      this.error = 'Movie information is missing. Please try again.';
      return;
    }

    try {
      this.isSubmitting = true;
      this.error = null;

      const bookingData = {
        movie: this.movie._id,
        date: this.date,
        time: this.time,
        theater: this.theater,
        seats: this.selectedSeats.map(s => s.id),
        phoneNumber: '1234567890', // You might want to collect this from the user
        totalPrice: this.total
      };

      console.log('Submitting booking data:', bookingData); // Debug log

      const response = await this.apiService.createBooking(bookingData).toPromise();
      
      if (response.success) {
        // Navigate to a success page or show success message
        this.router.navigate(['/booking-success']);
      } else {
        this.error = response.error || 'Failed to create booking. Please try again.';
      }
    } catch (error: any) {
      console.error('Booking error:', error); // Debug log
      this.error = error.message || 'An error occurred while creating the booking.';
    } finally {
      this.isSubmitting = false;
    }
  }
} 