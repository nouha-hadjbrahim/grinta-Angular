import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService, RegisterRequest } from '../services/User/user.service';
import { AuthService } from '../services/User/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage = '';
  loading = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * Initialize the reactive form with validators
   */
  private initializeForm(): void {
    this.registerForm = this.fb.group(
      {
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            this.nameValidator()
          ]
        ],
        email: [
          '',
          [
            Validators.required,
            Validators.email
          ]
        ],
        phoneNumber: [
          '',
          [
            Validators.required,
            Validators.pattern(/^\d{8}$/)
          ]
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6)
          ]
        ],
        confirmPassword: [
          '',
          [Validators.required]
        ],
        terms: [
          false,
          [Validators.requiredTrue]
        ]
      },
      {
        validators: this.passwordMatchValidator()
      }
    );
  }

  /**
   * Custom validator for name: only alphabets and spaces
   */
  private nameValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const nameRegex = /^[a-zA-Z\s]+$/;
      return nameRegex.test(control.value) ? null : { invalidName: true };
    };
  }

  /**
   * Custom validator for password match
   */
  private passwordMatchValidator() {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get('password')?.value;
      const confirmPassword = group.get('confirmPassword')?.value;
      
      if (!password || !confirmPassword) {
        return null;
      }
      
      return password === confirmPassword ? null : { passwordMismatch: true };
    };
  }

  /**
   * Handle form submission
   */
  register(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    // Build properly typed RegisterRequest
    const registerData: any = {
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      phoneNumber: this.registerForm.value.phoneNumber,
      password: this.registerForm.value.password,
      confirmPassword: this.registerForm.value.confirmPassword
    };

    this.userService.register(registerData).subscribe({
      next: (response: any) => {
        this.loading = false;
        // Account created successfully
        setTimeout(() => {
          this.router.navigate(['/sign-in']);
        }, 500);
      },
      error: (error: any) => {
        this.loading = false;
        
        // Handle various error response formats
        let errorMessage = 'Registration failed. Please try again.';
        
        if (error?.status === 400) {
          // Bad request
          if (error?.error?.message) {
            errorMessage = error.error.message;
          } else if (error?.error?.errors) {
            // Extract validation errors
            const errors = error.error.errors;
            if (typeof errors === 'object') {
              errorMessage = Object.values(errors).join(', ');
            } else if (typeof errors === 'string') {
              errorMessage = errors;
            }
          } else if (error?.error?.error) {
            errorMessage = error.error.error;
          } else if (typeof error?.error === 'string') {
            errorMessage = error.error;
          }
        } else if (error?.status === 409) {
          errorMessage = 'Email already exists. Please use a different email.';
        } else if (error?.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error?.message) {
          errorMessage = error.message;
        }
        
        this.errorMessage = errorMessage;
      }
    });
  }

  /**
   * Check if a field has an error
   */
  hasError(fieldName: string, errorType: string): boolean {
    const field = this.registerForm.get(fieldName);
    if (!this.submitted || !field) {
      return false;
    }
    return !!(field.hasError(errorType) && (field.dirty || field.touched));
  }

  /**
   * Get form controls for template
   */
  get form() {
    return this.registerForm.controls;
  }

  /**
   * Check if form has password mismatch error
   */
  get passwordsMatch(): boolean {
    return this.registerForm.hasError('passwordMismatch');
  }
}
