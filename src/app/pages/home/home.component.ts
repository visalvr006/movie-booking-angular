import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MovieBookingComponent } from '../movie-booking/movie-booking.component';
import { SeatSelectionComponent } from '../seat-selection/seat-selection.component';
import { BookingSummaryComponent } from '../booking-summary/booking-summary.component';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  //styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    StepperModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    FormsModule,
    HttpClientModule,
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
  phoneNumber: string = '';
  showAllMovies: boolean = false;

  movieFilters: string[] = ['All', 'Action', 'Comedy', 'Drama', 'Horror'];
  selectedFilter: string = 'All';

  constructor(private movieService: MovieService, private apiService: ApiService) {}

  ngOnInit() {
    this.heroMovie = this.movieService.getHeroMovie();
    this.getNowShowing();
    this.offers = this.movieService.getOffers();
    this.reviews = this.movieService.getReviews();
    this.initSeats();
  }

  getNowShowing() {
    this.apiService.getMovies().subscribe(
      movies => {
        if (Array.isArray(movies.data)) {
          this.nowShowing = movies.data;
          this.filteredMovies = [...this.nowShowing];
          
          
          // Set hero movie from API data if available
        //  if (this.nowShowing.length > 0) {
          //  this.heroMovie = this.nowShowing[0];
        //  }
        } else {
          console.warn('Expected an array for movies, but received:', movies);
          this.nowShowing = [];
          this.filteredMovies = [];
        }
      },
      error => {
        console.error('Error fetching movies:', error);
      }
    );
  }

  onBookTickets(movie: any) {
    // Ensure we have the complete movie data with _id
    if (!movie._id) {
      console.error('Movie data is missing _id:', movie);
      return;
    }
    this.heroMovie = { ...movie, image: movie.posterUrl }; // Use posterUrl as the image for booking
    this.showBooking = true;
    this.currentStep = 1;
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
    // Convert date to YYYY-MM-DD format for backend
    const dateObj = new Date(date);
    const formattedDate = dateObj.toISOString().split('T')[0];
    this.selectedDate = formattedDate;
    this.selectedTime = time;
    this.selectedTheater = theater;
  }

  validatePhoneNumber(): boolean {
    const phoneRegex = /^[0-9]{10}$/;
    if (!this.phoneNumber || !phoneRegex.test(this.phoneNumber)) {
      alert('Please enter a valid 10-digit phone number.');
      return false;
    }
    return true;
  }

  onProceedToPayment() {
    if (!this.validatePhoneNumber()) {
      return;
    }

    const bookingDetails = {
      movie: this.heroMovie._id, // Assuming heroMovie has an _id property
      date: this.selectedDate, // Ensure date is in a format suitable for backend (e.g., YYYY-MM-DD)
      time: this.selectedTime,
      theater: this.selectedTheater,
      seats: this.selectedSeats.map(seat => seat.id),
      phoneNumber: this.phoneNumber,
      totalPrice: this.calculateTotalPrice() // You need to implement this method
    };

    this.apiService.bookTicket(bookingDetails).subscribe(
      (response: any) => {
        alert('Ticket booked successfully!');
        console.log('Booking successful:', response);
        this.showBooking = false; // Close booking view or navigate to confirmation
        this.currentStep = 1; // Reset stepper
        this.resetBookingForm(); // Implement a method to reset form fields
      },
      (error: any) => {
        console.error('Error booking ticket:', error);
        alert('Failed to book ticket. Please try again.');
      }
    );
  }

  calculateTotalPrice(): number {
    // Implement your total price calculation logic here based on selectedSeats, regularPrice, premiumPrice etc.
    // For demonstration, let's use dummy calculation
    const regularPrice = 12.00;
    const premiumPrice = 18.00;
    const bookingFee = 2.00;

    const regularSeatsCount = this.selectedSeats.filter(s => s.state === 'available').length; // Assuming 'available' seats are regular before selection
    const premiumSeatsCount = this.selectedSeats.filter(s => s.state === 'premium').length;

    return (regularSeatsCount * regularPrice) + (premiumSeatsCount * premiumPrice) + bookingFee;
  }

  resetBookingForm() {
    this.selectedSeats = [];
    this.phoneNumber = '';
    // Reset other form fields as necessary
  }

  filterMovies(filter: string) {
    this.selectedFilter = filter;
    if (filter === 'All') {
      this.filteredMovies = [...this.nowShowing];
    } else {
      this.filteredMovies = this.nowShowing.filter(movie => movie.genre.includes(filter));
    }
  }

  initSeats() {
    // Fetch booked seats from the API
    this.apiService.getBookedSeats(this.heroMovie._id, this.selectedDate, this.selectedTime, this.selectedTheater).subscribe(
      (data: any[]) => {
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
      },
      error => {
        console.error('Error fetching booked seats:', error);
      }
    );
  }
} 