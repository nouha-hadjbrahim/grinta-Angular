import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkoutService } from '../../../services/Workouts/workout.service';
import { Program, Exercise } from '../../../services/Workouts/workout.model';

@Component({
  selector: 'app-program-detail',
  templateUrl: './program-detail.component.html',
  styleUrls: ['./program-detail.component.css']
})
export class ProgramDetailComponent implements OnInit {
  program: Program | null = null;
  loading = true;
  error = '';
  programId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private workoutService: WorkoutService
  ) {}

  ngOnInit(): void {
    this.programId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.programId) {
      this.loadProgram();
    }
  }

  loadProgram(): void {
    this.loading = true;
    this.workoutService.getProgram(this.programId).subscribe({
      next: (data) => {
        this.program = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading program:', err);
        this.error = 'Failed to load program. Please try again.';
        this.loading = false;
      }
    });
  }

  getDifficultyColor(): string {
    const difficultyMap: { [key: string]: string } = {
      beginner: '#2FBF71',
      intermediate: '#FFC857',
      advanced: '#E63946'
    };
    return difficultyMap[this.program?.difficulty || 'beginner'];
  }

  getDifficultyBgColor(): string {
    const difficultyMap: { [key: string]: string } = {
      beginner: 'rgba(47, 191, 113, 0.1)',
      intermediate: 'rgba(255, 200, 87, 0.1)',
      advanced: 'rgba(230, 57, 70, 0.1)'
    };
    return difficultyMap[this.program?.difficulty || 'beginner'];
  }

  toggleExerciseCompletion(exercise: Exercise): void {
    if (!exercise) return;

    exercise.completed = !exercise.completed;

    this.workoutService.updateExerciseCompletion(exercise.id, exercise.completed).subscribe({
      error: (err) => {
        console.error('Error updating exercise:', err);
        exercise.completed = !exercise.completed;
      }
    });

    // Update program progress
    if (this.program) {
      this.program.completedExercises = this.program.exercises.filter(ex => ex.completed).length;
      this.program.progress = Math.round(
        (this.program.completedExercises / this.program.exercises.length) * 100
      );

      this.workoutService.updateProgramProgress(this.program.id, this.program.progress).subscribe({
        error: (err) => console.error('Error updating progress:', err)
      });
    }
  }

  openExerciseDetail(exercise: Exercise): void {
    this.router.navigate(['/main/workouts/exercise', exercise.id]);
  }

  goBack(): void {
    this.router.navigate(['/main/workouts']);
  }

  getProgressPercentage(): number {
    if (!this.program) return 0;
    return this.program.progress;
  }

  getCompletedCount(): number {
    if (!this.program) return 0;
    return this.program.exercises.filter(ex => ex.completed).length;
  }
}
