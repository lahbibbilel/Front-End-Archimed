import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service'; // Import the CookieService
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(
    private logout: LoginService,
    private router: Router,
    private cookieService: CookieService
  ) { }

  ngOnInit(): void {
    this.logoutUser(); // Call the logout method on initialization
  }

  logoutUser() {
    this.logout.logout();  // Call your logout service

    this.clearCookies();   // Clear cookies
    this.router.navigate(['/auth']).then(() => {
      window.location.reload();  // Force a page reload after navigating
    });
  }

  clearCookies() {
    this.cookieService.delete('authToken');
    this.cookieService.delete('image');
    this.cookieService.delete('email');
    this.cookieService.delete('name');
    this.cookieService.delete('_id');
    this.cookieService.delete('lastname');
    this.cookieService.delete('role');
    this.cookieService.delete('username');
    this.cookieService.deleteAll();
  }
}
