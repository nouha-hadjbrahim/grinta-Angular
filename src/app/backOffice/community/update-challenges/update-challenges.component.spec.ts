import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateChallengesComponent } from './update-challenges.component';

describe('UpdateChallengesComponent', () => {
  let component: UpdateChallengesComponent;
  let fixture: ComponentFixture<UpdateChallengesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateChallengesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateChallengesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
