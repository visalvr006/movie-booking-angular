import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ImageModule } from 'primeng/image';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ImageModule, AvatarModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'online-movie-booking';
}
