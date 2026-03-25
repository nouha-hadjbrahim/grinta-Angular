import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChallengeService } from '../../../services/Community/challenge.service';
import { Challenge } from '../../../services/Community/challenge.model';

@Component({
  selector: 'app-add-challenges',
  templateUrl: './add-challenges.component.html',
  styleUrls: ['./add-challenges.component.css']
})
export class AddChallengesComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() challengeAdded = new EventEmitter<void>();

  challengeForm!: FormGroup;
  isSubmitting = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private challengeService: ChallengeService
  ) {}

  ngOnInit(): void {
    this.challengeForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      type: ['FITNESS', Validators.required],
      targetValue: [null],
      reward: [''],
      endDate: ['', Validators.required],
      isTrending: [false]
    });
  }

  onSubmit(): void {
    if (this.challengeForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.error = '';
    const newChallenge: Challenge = this.challengeForm.value;

    this.challengeService.createChallenge(newChallenge).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.challengeAdded.emit();
        this.closeModal();
      },
      error: (err) => {
        console.error('Error creating challenge:', err);
        this.error = 'Failed to create challenge. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  closeModal(): void {
    this.isOpen = false;
    this.challengeForm.reset({ type: 'FITNESS', isTrending: false });
    this.error = '';
    this.close.emit();
  }
}
