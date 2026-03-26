import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WorkoutService } from '../../../services/Workouts/workout.service';
import { Program, GeneratedPrograms } from '../../../services/Workouts/workout.model';

@Component({
  selector: 'app-workouts',
  templateUrl: './workouts.component.html',
  styleUrl: './workouts.component.css'
})
export class WorkoutsComponent implements OnInit {
  muscles: string[] = [
    'abs', 'back', 'biceps', 'chest', 'forearms',
    'glutes', 'shoulders', 'triceps', 'upper legs', 'lower legs'
  ];

  equipments: string[] = [
    'barbell', 'dumbbell', 'machine', 'body only', 'cable',
    'kettlebells', 'bands', 'exercise ball', 'medicine ball',
    'foam roll', 'e-z curl bar'
  ];

  selectedMuscles: Set<string> = new Set();
  selectedEquipment: Set<string> = new Set();
  generatedPrograms: GeneratedPrograms | null = null;
  activePrograms: Program[] = [];
  selectedDifficulties: Set<string> = new Set();
  loading = false;
  error = '';

  private readonly durationMap = {
    beginner:     { min: 30, max: 40 },
    intermediate: { min: 45, max: 55 },
    advanced:     { min: 60, max: 75 }
  };

  private readonly caloriesMap = {
    beginner: 200,
    intermediate: 350,
    advanced: 500
  };

  constructor(
    private workoutService: WorkoutService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadActivePrograms();
  }

  toggleMuscle(muscle: string): void {
    this.selectedMuscles.has(muscle)
      ? this.selectedMuscles.delete(muscle)
      : this.selectedMuscles.add(muscle);
    this.generatePrograms();
  }

  toggleEquipment(equipment: string): void {
    this.selectedEquipment.has(equipment)
      ? this.selectedEquipment.delete(equipment)
      : this.selectedEquipment.add(equipment);
    this.generatePrograms();
  }

  generatePrograms(): void {
    if (this.selectedMuscles.size === 0 || this.selectedEquipment.size === 0) {
      this.generatedPrograms = null;
      this.selectedDifficulties.clear();
      return;
    }

    this.loading = true;
    this.error = '';

    const muscles = Array.from(this.selectedMuscles);
    const equipment = Array.from(this.selectedEquipment);

    this.workoutService.generatePrograms(muscles, equipment).subscribe({
      next: (programs) => {
        this.generatedPrograms = programs;
        this.selectedDifficulties.clear();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error generating programs:', err);
        this.error = 'Failed to generate programs. Please try again.';
        this.generatedPrograms = null;
        this.loading = false;
      }
    });
  }

  selectProgram(difficulty: 'beginner' | 'intermediate' | 'advanced'): void {
    if (!this.generatedPrograms || this.selectedDifficulties.has(difficulty)) return;

    const exercises = this.generatedPrograms[difficulty];
    const muscleLabel = Array.from(this.selectedMuscles).slice(0, 2).join(' & ');
    const label = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    const program: Program = {
      id: Date.now(),
      name: `${muscleLabel ? muscleLabel + ' ' : ''}${label}`,
      difficulty,
      duration: this.durationMap[difficulty],
      exercises: exercises.map((ex, i) => ({
        id: ex.id ?? i + 1,
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        videoUrl: ex.videoUrl ?? '',
        instructions: ex.instructions ?? [],
        targetMuscles: ex.targetMuscles ?? [],
        completed: false
      })),
      caloriesBurned: { current: 0, total: this.caloriesMap[difficulty] },
      progress: 0,
      completedExercises: 0
    };

    this.selectedDifficulties.add(difficulty);
    this.activePrograms.push(program);
    this.saveActivePrograms();
  }

  isProgramSelected(difficulty: string): boolean {
    return this.selectedDifficulties.has(difficulty);
  }

  removeProgram(index: number): void {
    this.activePrograms.splice(index, 1);
    this.saveActivePrograms();
  }

  openProgram(program: Program): void {
    this.router.navigate(['/main/workouts/program', program.id]);
  }

  getCompletedExercises(index: number): number {
    const program = this.activePrograms[index];
    return program ? program.exercises.filter(e => e.completed).length : 0;
  }

  getDifficultyClass(program: Program): string {
    const map: Record<string, string> = {
      beginner:     'difficulty-beginner',
      intermediate: 'difficulty-intermediate',
      advanced:     'difficulty-advanced'
    };
    return map[program.difficulty] ?? '';
  }

  private saveActivePrograms(): void {
    localStorage.setItem('activePrograms', JSON.stringify(this.activePrograms));
  }

  private loadActivePrograms(): void {
    const saved = localStorage.getItem('activePrograms');
    if (saved) {
      try {
        this.activePrograms = JSON.parse(saved);
      } catch {
        this.activePrograms = [];
      }
    }
  }
}
