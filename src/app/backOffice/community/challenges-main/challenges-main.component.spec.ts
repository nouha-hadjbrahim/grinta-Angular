import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengesMainComponent } from './challenges-main.component';

describe('ChallengesMainComponent', () => {
  let component: ChallengesMainComponent;
  let fixture: ComponentFixture<ChallengesMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChallengesMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChallengesMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
