import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StepperModule } from 'primeng/stepper';
import { DropdownModule } from 'primeng/dropdown';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-movie-booking',
  imports: [StepperModule, ReactiveFormsModule, FormsModule, CommonModule, DropdownModule],
  templateUrl: './movie-booking.component.html',
  styleUrl: './movie-booking.component.css'
})
export class MovieBookingComponent implements OnInit {
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

  theaters: { label: string; value: string; }[] = [];
  selectedTheater: any;

  showtimes = [
    { label: '10:30 AM', selected: false },
    { label: '1:15 PM', selected: false },
    { label: '4:00 PM', selected: true },
    { label: '6:45 PM', selected: false },
    { label: '9:30 PM', selected: false }
  ];

  constructor(private fb: FormBuilder, private apiService: ApiService) {
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

  ngOnInit(): void {
    this.getTheaters();
  }

  getTheaters() {
    this.apiService.getTheaters().subscribe(
      (response: any) => {
        if (response && Array.isArray(response.data)) {
          this.theaters = response.data.map((theater: any) => ({ label: theater.name, value: theater.name }));
          
          if (this.theaters.length > 0) {
            this.selectedTheater = this.theaters[0].value;
          }
        } else {
          console.warn('API returned unexpected format for theaters:', response);
          this.theaters = [];
        }
      },
      (error: any) => {
        console.error('Error fetching theaters:', error);
        this.theaters = [];
      }
    );
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
