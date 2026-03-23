import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NutritionComponent } from './nutrition.component';
import { NutritionService } from '../shared/services/nutrition.service';
import { TableComponent } from '../shared/components/table/table.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('NutritionComponent', () => {
  let component: NutritionComponent;
  let fixture: ComponentFixture<NutritionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NutritionComponent, TableComponent],
      imports: [CommonModule, FormsModule],
      providers: [NutritionService]
    }).compileComponents();

    fixture = TestBed.createComponent(NutritionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load nutritions on init', () => {
    expect(component.nutritions.length).toBeGreaterThan(0);
  });
});
