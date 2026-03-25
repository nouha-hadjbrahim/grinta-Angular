import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ChallengeService } from '../../../services/Community/challenge.service';
import { Challenge } from '../../../services/Community/challenge.model';

@Component({
  selector: 'app-challenges-main',
  templateUrl: './challenges-main.component.html',
  styleUrl: './challenges-main.component.css',
  
})
export class ChallengesMainComponent implements OnInit {
  challenges: Challenge[] = [];
  filteredChallenges: Challenge[] = [];
  searchTerm: string = '';
  isLoading = true;
  error = '';
  showAddModal = false;
  
  // View Modal logic matches Posts logic
  challengeToView: Challenge | null = null;
  participants: any[] = [];
  viewMode: 'details' | 'participants' = 'details';

  constructor(
    private challengeService: ChallengeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadChallenges();
  }

  loadChallenges(): void {
    this.isLoading = true;
    this.challengeService.getAllChallenges().subscribe({
      next: (data) => {
        this.challenges = data;
        this.filteredChallenges = data;
        this.isLoading = false;
        this.error = '';
        this.searchChallenges(); // Apply any existing search term
      },
      error: (err) => {
        console.error('Error fetching challenges', err);
        this.error = 'Failed to load challenges. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  searchChallenges(): void {
    if (!this.searchTerm || !this.searchTerm.trim()) {
      this.filteredChallenges = [...this.challenges];
      return;
    }
    
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredChallenges = this.challenges.filter(c => 
      c.title?.toLowerCase().includes(term) ||
      c.type?.toLowerCase().includes(term) ||
      c.reward?.toLowerCase().includes(term)
    );
  }

  deleteChallenge(id: number | undefined): void {
    if (!id) return;
    
    if (confirm('Are you sure you want to delete this challenge?')) {
      this.challengeService.deleteChallenge(id).subscribe({
        next: () => {
          this.loadChallenges(); // refresh the list after deletion
        },
        error: (err) => {
          console.error('Error deleting challenge', err);
          alert('Could not delete the challenge.');
        }
      });
    }
  }

  openAddModal(): void {
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  onChallengeAdded(): void {
    this.loadChallenges();
  }

  editChallenge(id: number | undefined): void {
    if (id) {
      // Assuming you have an update-challenges component route
      this.router.navigate(['/admin/community/update-challenge', id]);
    }
  }

  openViewModal(challenge: Challenge, mode: 'details' | 'participants' = 'details'): void {
    this.challengeToView = challenge;
    this.viewMode = mode;
    
    if (mode === 'participants' && challenge.challengeId) {
      this.challengeService.getChallengeParticipants(challenge.challengeId).subscribe({
        next: (users) => {
          this.participants = users;
        },
        error: (err) => console.error('Error loading participants', err)
      });
    }
  }

  closeViewModal(): void {
    this.challengeToView = null;
    this.participants = [];
  }
}
