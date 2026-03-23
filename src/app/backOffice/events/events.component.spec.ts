import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventsComponent } from './events.component';
import { EventService } from '../shared/services/event.service';
import { TableComponent } from '../shared/components/table/table.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('EventsComponent', () => {
  let component: EventsComponent;
  let fixture: ComponentFixture<EventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventsComponent, TableComponent],
      imports: [CommonModule, FormsModule],
      providers: [EventService]
    }).compileComponents();

    fixture = TestBed.createComponent(EventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load events on init', () => {
    expect(component.events.length).toBeGreaterThan(0);
  });
});
