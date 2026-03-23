import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SignUpComponent } from './sign-up.component';
import { UserService } from '../services/user.service';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['register', 'login']);

    await TestBed.configureTestingModule({
      declarations: [SignUpComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: UserService, useValue: userServiceSpy }
      ]
    }).compileComponents();

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.registerForm.get('name')?.value).toBe('');
    expect(component.registerForm.get('email')?.value).toBe('');
    expect(component.registerForm.get('phoneNumber')?.value).toBe('');
    expect(component.registerForm.get('password')?.value).toBe('');
    expect(component.registerForm.get('confirmPassword')?.value).toBe('');
  });

  it('should validate name field - required', () => {
    const nameControl = component.registerForm.get('name');
    nameControl?.setValue('');
    expect(nameControl?.hasError('required')).toBeTruthy();
  });

  it('should validate name field - min length', () => {
    const nameControl = component.registerForm.get('name');
    nameControl?.setValue('A');
    expect(nameControl?.hasError('minlength')).toBeTruthy();
  });

  it('should validate name field - only alphabets and spaces', () => {
    const nameControl = component.registerForm.get('name');
    nameControl?.setValue('John123');
    expect(nameControl?.hasError('invalidName')).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.registerForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTruthy();
  });

  it('should validate phone number - 8 digits only', () => {
    const phoneControl = component.registerForm.get('phoneNumber');
    phoneControl?.setValue('123'); // Too short
    expect(phoneControl?.hasError('pattern')).toBeTruthy();
  });

  it('should validate password match', () => {
    component.registerForm.get('password')?.setValue('password123');
    component.registerForm.get('confirmPassword')?.setValue('password456');
    expect(component.registerForm.hasError('passwordMismatch')).toBeTruthy();
  });

  it('should validate matching passwords', () => {
    component.registerForm.get('password')?.setValue('password123');
    component.registerForm.get('confirmPassword')?.setValue('password123');
    expect(component.registerForm.hasError('passwordMismatch')).toBeFalsy();
  });
});
