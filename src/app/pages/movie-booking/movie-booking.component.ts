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
  //styleUrl: './movie-booking.component.css'
})
export class MovieBookingComponent implements OnInit {
  @Input() movie: any;
  @Output() closeBooking = new EventEmitter<void>();
  @Output() dateChange = new EventEmitter<string>();
  @Output() timeChange = new EventEmitter<string>();
  @Output() theaterChange = new EventEmitter<string>();

  currentStep: number = 1;
  bookingForm: FormGroup;
  seatForm: FormGroup;
  paymentForm: FormGroup;

  dates = [
    { day: 'Wed', date: '05', month: 'Jun', selected: false, fullDate: '2023-06-05' },
    { day: 'Thu', date: '06', month: 'Jun', selected: true, fullDate: '2023-06-06' },
    { day: 'Fri', date: '07', month: 'Jun', selected: false, fullDate: '2023-06-07' },
    { day: 'Sat', date: '08', month: 'Jun', selected: false, fullDate: '2023-06-08' },
    { day: 'Sun', date: '09', month: 'Jun', selected: false, fullDate: '2023-06-09' },
    { day: 'Mon', date: '10', month: 'Jun', selected: false, fullDate: '2023-06-10' }
  ];

  theaters: { label: string; value: string; }[] = [];
  _selectedTheater: any; // Use a private property to trigger setter
  
  @Input() set selectedTheater(value: any) {
    this._selectedTheater = value;
    this.theaterChange.emit(value);
  }

  get selectedTheater(): any {
    return this._selectedTheater;
  }

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
    // Emit initial selected date and time
    const initialDate = this.dates.find(d => d.selected);
    if (initialDate) {
      this.dateChange.emit(initialDate.fullDate);
    }
    const initialTime = this.showtimes.find(t => t.selected);
    if (initialTime) {
      this.timeChange.emit(initialTime.label);
    }
  }

  getTheaters() {
    this.apiService.getTheaters().subscribe(
      (response: any) => {
        if (response && Array.isArray(response.data)) {
          this.theaters = response.data.map((theater: any) => ({ label: theater.name, value: theater.name }));
          
          if (this.theaters.length > 0) {
            this.selectedTheater = this.theaters[0].value; // This will trigger the setter and emit
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
    this.dateChange.emit(date.fullDate);
  }

  selectShowtime(time: any) {
    this.showtimes.forEach(t => t.selected = false);
    time.selected = true;
    this.timeChange.emit(time.label);
  }
}
