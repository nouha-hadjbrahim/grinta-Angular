import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrainingComponent } from './training.component';
import { TrainingService } from '../shared/services/training.service';
import { TableComponent } from '../shared/components/table/table.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('TrainingComponent', () => {
  let component: TrainingComponent;
  let fixture: ComponentFixture<TrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrainingComponent, TableComponent],
      imports: [CommonModule, FormsModule],
      providers: [TrainingService]
    }).compileComponents();

    fixture = TestBed.createComponent(TrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load trainings on init', () => {
    expect(component.trainings.length).toBeGreaterThan(0);
  });
});
