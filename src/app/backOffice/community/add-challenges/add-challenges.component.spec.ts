import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChallengesComponent } from './add-challenges.component';

describe('AddChallengesComponent', () => {
  let component: AddChallengesComponent;
  let fixture: ComponentFixture<AddChallengesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddChallengesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddChallengesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
