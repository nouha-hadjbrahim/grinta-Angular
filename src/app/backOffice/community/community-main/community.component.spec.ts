import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommunityComponent } from './community.component';
import { CommunityService } from '../../shared/services/community.service';
import {  } from '../../shared/components/table/table.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('CommunityComponent', () => {
  let component: CommunityComponent;
  let fixture: ComponentFixture<CommunityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommunityComponent, ],
      imports: [CommonModule, FormsModule],
      providers: [CommunityService]
    }).compileComponents();

    fixture = TestBed.createComponent(CommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load communities on init', () => {
    expect(component.communities.length).toBeGreaterThan(0);
  });
});
