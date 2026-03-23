import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'frontend-sport';

  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Auto-redirect users based on login status and role on app start
   */
  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      // User is already logged in, redirect based on role
      if (this.authService.isAdmin()) {
        this.router.navigate(['/admin']);
      } else if (this.authService.isUser()) {
        this.router.navigate(['/main']);
      }
    }
  }
}
