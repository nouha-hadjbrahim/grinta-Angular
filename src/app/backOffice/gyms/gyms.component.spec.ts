import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GymsComponent } from './gyms.component';
import { GymService } from '../shared/services/gym.service';
import { TableComponent } from '../shared/components/table/table.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('GymsComponent', () => {
  let component: GymsComponent;
  let fixture: ComponentFixture<GymsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GymsComponent, TableComponent],
      imports: [CommonModule, FormsModule],
      providers: [GymService]
    }).compileComponents();

    fixture = TestBed.createComponent(GymsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load gyms on init', () => {
    expect(component.gyms.length).toBeGreaterThan(0);
  });
});
