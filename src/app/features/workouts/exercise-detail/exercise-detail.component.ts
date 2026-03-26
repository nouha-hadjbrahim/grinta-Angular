import { Component, OnInit, SecurityContext } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { WorkoutService } from '../../../services/Workouts/workout.service';
import { Exercise } from '../../../services/Workouts/workout.model';

@Component({
  selector: 'app-exercise-detail',
  templateUrl: './exercise-detail.component.html',
  styleUrls: ['./exercise-detail.component.css']
})
export class ExerciseDetailComponent implements OnInit {
  exercise: Exercise | null = null;
  loading = true;
  error = '';
  exerciseId: number = 0;
  videoUrl: SafeResourceUrl | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private workoutService: WorkoutService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.exerciseId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.exerciseId) {
      this.loadExercise();
    }
  }

  loadExercise(): void {
    this.loading = true;
    this.workoutService.getExercise(this.exerciseId).subscribe({
      next: (data) => {
        this.exercise = data;
        this.videoUrl = this.getEmbedUrl(data.videoUrl);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading exercise:', err);
        this.error = 'Failed to load exercise. Please try again.';
        this.loading = false;
      }
    });
  }

  /**
   * Convert YouTube URL to embed URL
   */
  getEmbedUrl(url: string): SafeResourceUrl {
    let videoId = '';

    // Handle different YouTube URL formats
    if (url.includes('youtube.com/embed/')) {
      videoId = url.split('youtube.com/embed/')[1];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(url.split('?')[1]);
      videoId = urlParams.get('v') || '';
    } else {
      // Assume it's already a video ID
      videoId = url;
    }

    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  goBack(): void {
    this.router.navigate(['/main/workouts']);
  }

  goBackToProgram(): void {
    // Navigate back if there's a parent program
    this.router.navigate(['/main/workouts']);
  }
}
