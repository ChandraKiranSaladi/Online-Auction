import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(
    private authService: AuthenticationService,
    public router: Router
  ) {}

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  signout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  isAdmin() {
    return this.authService.isAdmin();
  }


}
