import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { UserService } from '../shared/services/user.service';
import { EventService } from '../shared/services/event.service';
import { WorkoutService } from '../shared/services/workout.service';
import { CommunityService } from '../shared/services/community.service';
import { CommonModule } from '@angular/common';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [CommonModule],
      providers: [UserService, EventService, WorkoutService, CommunityService]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load stats on init', () => {
    expect(component.stats.length).toBe(4);
  });

  it('should have weekly data', () => {
    expect(component.weeklyData.length).toBe(7);
  });

  it('should have monthly data', () => {
    expect(component.monthlyData.length).toBe(6);
  });
});
