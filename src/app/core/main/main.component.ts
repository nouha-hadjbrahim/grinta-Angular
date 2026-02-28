import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  features = [
    { icon: 'bi-calendar-event', title: 'Live Events', desc: 'Join sports events and wellness activities across Tunisia' },
    { icon: 'bi-trophy', title: 'Expert Workouts', desc: 'Access professional training programs for all levels' },
    { icon: 'bi-people', title: 'Community', desc: 'Connect with athletes and reach goals together' },
    { icon: 'bi-award', title: 'Challenges', desc: 'Compete, track progress, and earn rewards' },
  ];
}
