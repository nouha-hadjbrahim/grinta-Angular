import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/User/user.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {

  email = '';
  password = '';
  errorMessage = '';
  loading = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Handle sign-in with role-based redirect
   */
  signIn(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter email and password.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.userService.login(this.email, this.password).subscribe({
      next: (response) => {
        // Redirect based on user role
        if (response.user.role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/main']);
        }
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Invalid email or password.';
      }
    });
  }

  /**
   * Reset form
   */
  resetForm(): void {
    this.email = '';
    this.password = '';
    this.errorMessage = '';
  }
}
