import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { EventService } from '../shared/services/event.service';
import { WorkoutService } from '../shared/services/workout.service';
import { CommunityService } from '../shared/services/community.service';

interface DashboardStat {
  label: string;
  value: number;
  change: number;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStat[] = [];
  userCount = 0;
  eventCount = 0;
  workoutCount = 0;
  communityCount = 0;

  weeklyData: { day: string; count: number }[] = [];
  monthlyData: { month: string; revenue: number }[] = [];

  constructor(
    private userService: UserService,
    private eventService: EventService,
    private workoutService: WorkoutService,
    private communityService: CommunityService
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadChartData();
  }

  loadStats(): void {
    this.userService.getUsers().subscribe((users: any[]) => {
      this.userCount = users.length;
      this.updateStats();
    });

    this.eventService.getEvents().subscribe((events: any[]) => {
      this.eventCount = events.length;
      this.updateStats();
    });

    this.workoutService.getWorkouts().subscribe((workouts: any[]) => {
      this.workoutCount = workouts.length;
      this.updateStats();
    });

    this.communityService.getCommunities().subscribe((communities: any[]) => {
      this.communityCount = communities.length;
      this.updateStats();
    });
  }

  updateStats(): void {
    this.stats = [
      {
        label: 'Total Users',
        value: this.userCount,
        change: 12.5,
        icon: 'bi-people',
        color: '#e63946'
      },
      {
        label: 'Total Workouts',
        value: this.workoutCount,
        change: 8.2,
        icon: 'bi-heart-pulse',
        color: '#2fbf71'
      },
      {
        label: 'Total Revenue',
        value: 84250,
        change: 15.3,
        icon: 'bi-cash',
        color: '#ffc857'
      },
      {
        label: 'Active Members',
        value: 8642,
        change: 3.1,
        icon: 'bi-graph-up',
        color: '#1e1e1e'
      }
    ];
  }

  loadChartData(): void {
    // Weekly workout activity
    this.weeklyData = [
      { day: 'Mon', count: 45 },
      { day: 'Tue', count: 52 },
      { day: 'Wed', count: 38 },
      { day: 'Thu', count: 65 },
      { day: 'Fri', count: 72 },
      { day: 'Sat', count: 85 },
      { day: 'Sun', count: 62 }
    ];

    // Monthly revenue
    this.monthlyData = [
      { month: 'Jan', revenue: 4200 },
      { month: 'Feb', revenue: 5100 },
      { month: 'Mar', revenue: 4900 },
      { month: 'Apr', revenue: 6200 },
      { month: 'May', revenue: 7300 },
      { month: 'Jun', revenue: 8100 }
    ];
  }
}
