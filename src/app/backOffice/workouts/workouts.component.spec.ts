import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkoutsComponent } from './workouts.component';
import { WorkoutService } from '../shared/services/workout.service';
import { TableComponent } from '../shared/components/table/table.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('WorkoutsComponent', () => {
  let component: WorkoutsComponent;
  let fixture: ComponentFixture<WorkoutsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkoutsComponent, TableComponent],
      imports: [CommonModule, FormsModule],
      providers: [WorkoutService]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load workouts on init', () => {
    expect(component.workouts.length).toBeGreaterThan(0);
  });
});
