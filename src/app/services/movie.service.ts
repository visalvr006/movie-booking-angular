import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MovieService {
  getHeroMovie() {
    return {
      "_id": "6851687e9fb15d2aa9f63cdf",
      "title": "Quantum Horizon",
      description: 'When a brilliant physicist discovers a way to manipulate time, he becomes the target of shadowy organizations seeking to control his technology. Now he must race against time itself to protect the future of humanity.',
      "duration": 133,
      "language": "English",
      "releaseDate":  "1710374400000",
      "movieType": "3D",
      image: 'https://i.pinimg.com/736x/70/1f/5a/701f5a2df07a25a6784dc599a52e6a63.jpg',
      "genre": [
          'Action', 'Sci-Fi'
      ],
      "posterUrl": "https://upload.wikimedia.org/wikipedia/en/d/d5/A_Complete_Unknown_poster.jpg",
      "trailerUrl": "https://example.com/trailer.mp4",
      "isCurrentlyRunning": true,
      "rating": 9.1,
      "createdAt": {
          "$date": {
              "$numberLong": "1749916447428"
          }
      },
      "__v": {
          "$numberInt": "0"
      }
  }
  }

  getNowShowing() {
    return [
      { title: 'Stellar Odyssey', genres: ['Action', 'Adventure'], duration: '2h 15m', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80' },
      { title: 'Weekend Chaos', genres: ['Comedy'], duration: '1h 48m', image: 'https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=400&q=80' },
      { title: 'Silent Shadows', genres: ['Thriller', 'Mystery'], duration: '2h 10m', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80' },
      { title: 'Whispers in the Dark', genres: ['Horror', 'Supernatural'], duration: '1h 58m', image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80' }
    ];
  }

  getOffers() {
    return [
      { title: 'Movie Night Combo', desc: 'Get a large popcorn, two medium drinks, and a candy of your choice at a special discounted price.', price: 15.99, oldPrice: 19.90, image: 'https://th.bing.com/th/id/OIP.4m2o5qrlAHxGM_kVIuOrMAHaHa?r=0&pid=ImgDet&w=202&h=202&c=7&cb=idpwebpc1', badge: 'SAVE 20%' },
      { title: 'Premium Membership', desc: 'Join our premium membership program and enjoy exclusive benefits, discounts, and early access to blockbuster premieres.', price: 9.99, image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=200&q=80', badge: 'PREMIUM' }
    ];
  }

  getReviews() {
    return [
      { name: 'Emily Richardson', role: 'Movie Enthusiast', text: 'The booking experience was seamless and the premium seats were absolutely worth it. The IMAX screening of Quantum Horizon was mind-blowing!' },
      { name: 'Michael Thompson', role: 'Premium Member', text: 'I love the new seat selection interface. It\'s so easy to pick the perfect spot, and the premium membership discounts make it even better. Great service!' },
      { name: 'Sophia Martinez', role: 'Film Critic', text: 'The app is fantastic! I can book tickets, select seats, and order snacks all in one place. The 4DX experience for Silent Shadows was absolutely terrifying in the best way!' }
    ];
  }
} 