import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChallengeService } from '../../../services/Community/challenge.service';
import { Challenge } from '../../../services/Community/challenge.model';

@Component({
  selector: 'app-update-challenges',
  templateUrl: './update-challenges.component.html',
  styleUrls: ['./update-challenges.component.css']
})
export class UpdateChallengesComponent implements OnInit, OnChanges {
  @Input() isOpen: boolean = false;
  @Input() challenge: Challenge | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() challengeUpdated = new EventEmitter<void>();

  updateForm!: FormGroup;
  
  loading: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  challengeTypes = ['FITNESS', 'RUNNING', 'NUTRITION'];

  constructor(
    private fb: FormBuilder,
    private challengeService: ChallengeService
  ) {}

  ngOnInit(): void {
    this.updateForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      type: ['FITNESS', [Validators.required]],
      targetValue: [null],
      reward: [''],
      endDate: ['', [Validators.required]],
      isTrending: [false]
    });
  }

  ngOnChanges(): void {
    if (this.challenge && this.updateForm) {
      this.resetLocalState();
      
      let formattedDate = '';
      if (this.challenge.endDate) {
        const dateObj = new Date(this.challenge.endDate);
        if (!isNaN(dateObj.getTime())) {
          formattedDate = dateObj.toISOString().split('T')[0];
        }
      }

      this.updateForm.patchValue({
        title: this.challenge.title,
        description: this.challenge.description,
        type: this.challenge.type,
        targetValue: this.challenge.targetValue,
        reward: this.challenge.reward,
        endDate: formattedDate,
        isTrending: this.challenge.isTrending || false
      });
    }
  }

  onSubmit(): void {
    if (this.updateForm.invalid || !this.challenge) return;

    this.loading = true;
    this.successMessage = null;
    this.errorMessage = null;

    const updatedData: Challenge = {
      ...this.challenge,
      ...this.updateForm.value
    };

    if (this.challenge.challengeId) {
      this.challengeService.updateChallenge(this.challenge.challengeId, updatedData).subscribe({
        next: () => {
          this.successMessage = 'Challenge updated successfully!';
          this.loading = false;
          setTimeout(() => {
            this.challengeUpdated.emit();
            this.closeModal();
          }, 1500);
        },
        error: (err: any) => {
          console.error('Error updating challenge:', err);
          this.errorMessage = err.error?.message || 'Failed to update challenge';
          this.loading = false;
        }
      });
    }
  }

  resetLocalState(): void {
    this.successMessage = null;
    this.errorMessage = null;
  }

  resetForm(): void {
    this.resetLocalState();
    if (this.updateForm && this.challenge) {
      let formattedDate = '';
      if (this.challenge.endDate) {
        const dateObj = new Date(this.challenge.endDate);
        if (!isNaN(dateObj.getTime())) {
          formattedDate = dateObj.toISOString().split('T')[0];
        }
      }
      this.updateForm.patchValue({
        title: this.challenge.title,
        description: this.challenge.description,
        type: this.challenge.type,
        targetValue: this.challenge.targetValue,
        reward: this.challenge.reward,
        endDate: formattedDate,
        isTrending: this.challenge.isTrending || false
      });
    }
  }

  closeModal(): void {
    this.resetForm();
    this.isOpen = false;
    this.close.emit();
  }

  isFormValid(): boolean {
    return this.updateForm?.valid ?? false;
  }
}
