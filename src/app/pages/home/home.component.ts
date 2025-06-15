import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { MovieBookingComponent } from '../movie-booking/movie-booking.component';
import { SeatSelectionComponent } from '../seat-selection/seat-selection.component';
import { BookingSummaryComponent } from '../booking-summary/booking-summary.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    StepperModule,
    ButtonModule,
    MovieBookingComponent,
    SeatSelectionComponent,
    BookingSummaryComponent
  ]
})
export class HomeComponent implements OnInit {
  heroMovie: any;
  nowShowing: any[] = [];
  filteredMovies: any[] = [];
  offers: any[] = [];
  reviews: any[] = [];
  showBooking: boolean = false;
  currentStep: number = 2;
  seats: any[][] = [];
  selectedSeats: any[] = [];
  selectedDate: string = 'June 6, 2025';
  selectedTime: string = '4:00 PM';
  selectedTheater: string = 'CineFlex IMAX - Downtown';

  movieFilters: string[] = ['All', 'Action', 'Comedy', 'Drama', 'Horror'];
  selectedFilter: string = 'All';

  constructor(private movieService: MovieService) {}

  ngOnInit() {
    this.heroMovie = this.movieService.getHeroMovie();
    this.nowShowing = this.movieService.getNowShowing();
    this.filteredMovies = [...this.nowShowing]; // Initialize filtered movies
    this.offers = this.movieService.getOffers();
    this.reviews = this.movieService.getReviews();
    this.initSeats();
  }

  onBookTickets() {
    this.showBooking = true;
    this.currentStep = 2;
  }

  onCloseBooking() {
    this.showBooking = false;
  }

  onStepChange(step: number) {
    this.currentStep = step;
  }

  onSeatsSelected(selectedSeats: any[]) {
    this.selectedSeats = selectedSeats;
  }

  onBookingDetails(date: string, time: string, theater: string) {
    this.selectedDate = date;
    this.selectedTime = time;
    this.selectedTheater = theater;
  }

  onProceedToPayment() {
    // Handle payment logic here
    alert('Proceeding to payment!');
  }

  filterMovies(filter: string) {
    this.selectedFilter = filter;
    if (filter === 'All') {
      this.filteredMovies = [...this.nowShowing];
    } else {
      this.filteredMovies = this.nowShowing.filter(movie => movie.genres.includes(filter));
    }
  }

  initSeats() {
    // Example: 6 rows, 12 seats per row, with some booked and premium
    const rows = 6;
    const cols = 12;
    this.seats = Array.from({ length: rows }, (_, rowIdx) =>
      Array.from({ length: cols }, (_, colIdx) => {
        let state = 'available';
        if (rowIdx === 1 && [4,5,6].includes(colIdx)) state = 'booked';
        if (rowIdx === 2 && [2,3,4,5,6,7,8,9].includes(colIdx)) state = 'premium';
        if (rowIdx === 2 && [5,6,7].includes(colIdx)) state = 'selected';
        return {
          id: `${String.fromCharCode(65+rowIdx)}${colIdx+1}`,
          state
        };
      })
    );
  }
} 