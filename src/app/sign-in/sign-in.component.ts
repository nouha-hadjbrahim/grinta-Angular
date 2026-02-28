import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {

  email = '';
  password = '';
  errorMessage = '';

  constructor(private userService: UserService, private router: Router) {}

  signIn() {
    this.userService.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/main']);
      },
      error: () => {
        this.errorMessage = 'Invalid email or password.';
      }
    });
  }
}
