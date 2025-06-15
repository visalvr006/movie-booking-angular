import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StepperModule } from 'primeng/stepper';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-movie-booking',
  imports: [StepperModule, ReactiveFormsModule, FormsModule, CommonModule, DropdownModule],
  templateUrl: './movie-booking.component.html',
  styleUrl: './movie-booking.component.css'
})
export class MovieBookingComponent {
  @Input() movie: any;
  @Output() closeBooking = new EventEmitter<void>();

  currentStep: number = 1;
  bookingForm: FormGroup;
  seatForm: FormGroup;
  paymentForm: FormGroup;

  dates = [
    { day: 'Wed', date: '05', month: 'Jun', selected: false },
    { day: 'Thu', date: '06', month: 'Jun', selected: true },
    { day: 'Fri', date: '07', month: 'Jun', selected: false },
    { day: 'Sat', date: '08', month: 'Jun', selected: false },
    { day: 'Sun', date: '09', month: 'Jun', selected: false },
    { day: 'Mon', date: '10', month: 'Jun', selected: false }
  ];

  theaters = [
    { label: 'CineFlex IMAX - Downtown', value: 'CineFlex IMAX - Downtown' }
  ];
  selectedTheater = this.theaters[0].value;

  showtimes = [
    { label: '10:30 AM', selected: false },
    { label: '1:15 PM', selected: false },
    { label: '4:00 PM', selected: true },
    { label: '6:45 PM', selected: false },
    { label: '9:30 PM', selected: false }
  ];

  constructor(private fb: FormBuilder) {
    this.bookingForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
    this.seatForm = this.fb.group({
      seat: ['', Validators.required]
    });
    this.paymentForm = this.fb.group({
      card: ['', Validators.required]
    });
  }

  onClose() {
    this.closeBooking.emit();
  }

  selectDate(date: any) {
    this.dates.forEach(d => d.selected = false);
    date.selected = true;
  }

  selectShowtime(time: any) {
    this.showtimes.forEach(t => t.selected = false);
    time.selected = true;
  }
}
