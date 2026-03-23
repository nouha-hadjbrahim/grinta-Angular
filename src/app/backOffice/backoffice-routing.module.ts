import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { EventsComponent } from './events/events.component';
import { WorkoutsComponent } from './workouts/workouts.component';
import { GymsComponent } from './gyms/gyms.component';
import { TrainingComponent } from './training/training.component';
import { NutritionComponent } from './nutrition/nutrition.component';
import { CommunityComponent } from './community/community-main/community.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'events', component: EventsComponent },
      { path: 'workouts', component: WorkoutsComponent },
      { path: 'gyms', component: GymsComponent },
      { path: 'training', component: TrainingComponent },
      { path: 'nutrition', component: NutritionComponent },
      { path: 'community', component: CommunityComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackofficeRoutingModule { }
