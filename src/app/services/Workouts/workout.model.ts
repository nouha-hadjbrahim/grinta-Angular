export interface Program {
  id: number;
  name: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: { min: number; max: number };
  exercises: Exercise[];
  caloriesBurned: { current: number; total: number };
  progress: number;
  completedExercises?: number;
}

export interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: number;
  videoUrl: string;
  instructions: string[];
  targetMuscles: string[];
  completed?: boolean;
}

/**
 * Exercise shape returned by /api/programs/generate
 * (subset of Exercise — id, videoUrl, instructions, targetMuscles may be absent)
 */
export interface GeneratedExercise {
  id?: number;
  name: string;
  sets: number;
  reps: number;
  videoUrl?: string;
  instructions?: string[];
  targetMuscles?: string[];
}

export interface GeneratedPrograms {
  beginner: GeneratedExercise[];
  intermediate: GeneratedExercise[];
  advanced: GeneratedExercise[];
}

export interface GenerateProgramsRequest {
  muscles: string[];
  equipment: string[];
}

/**
 * Actual backend response shape:
 * { programs: { beginner: [...], intermediate: [...], advanced: [...] } }
 */
export interface GenerateProgramsResponse {
  programs: GeneratedPrograms;
}
