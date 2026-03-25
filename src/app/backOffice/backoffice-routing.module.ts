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
import { AdminBookingsComponent } from './admin-bookings/admin-bookings.component';
import { AddChallengesComponent } from './community/add-challenges/add-challenges.component';
import { EventCreateAdminComponent } from './events/event-create-admin/event-create-admin.component';
import { EventEditAdminComponent } from './events/event-edit-admin/event-edit-admin.component';
import { EventDetailAdminComponent } from './events/event-detail-admin/event-detail-admin.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'events', component: EventsComponent },
      { path: 'workouts', component: WorkoutsComponent },
      { path: 'bookings', component: AdminBookingsComponent },
      { path: 'gyms', component: GymsComponent },
      { path: 'training', component: TrainingComponent },
      { path: 'nutrition', component: NutritionComponent },
      { path: 'community', component: CommunityComponent },
      { path: 'events/create', component: EventCreateAdminComponent },
      { path: 'events/edit/:id', component: EventEditAdminComponent },
      { path: 'events/view/:id', component: EventDetailAdminComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackofficeRoutingModule { }