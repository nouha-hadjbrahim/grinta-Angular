import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BackofficeRoutingModule } from './backoffice-routing.module';

// Components
import { AdminBookingsComponent } from './admin-bookings/admin-bookings.component';

// Layout Components
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { NavbarComponent } from './layout/navbar/navbar.component';

// Feature Components
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { UpdateUserComponent } from './users/update-user/update-user.component';
import { EventsComponent } from './events/events.component';
import { WorkoutsComponent } from './workouts/workouts.component';
import { GymsComponent } from './gyms/gyms.component';
import { TrainingComponent } from './training/training.component';
import { NutritionComponent } from './nutrition/nutrition.component';

import { CommunityComponent } from './community/community-main/community.component';
import { EventCreateAdminComponent } from './events/event-create-admin/event-create-admin.component';
import { EventEditAdminComponent } from './events/event-edit-admin/event-edit-admin.component';
import { EventDetailAdminComponent } from './events/event-detail-admin/event-detail-admin.component';

// Shared Components
import { TableComponent } from './shared/components/table/table.component';

// Services
import { UserService } from './shared/services/user.service';
import { EventService } from './shared/services/event.service';
import { WorkoutService } from './shared/services/workout.service';
import { GymService } from './shared/services/gym.service';
import { TrainingService } from './shared/services/training.service';
import { NutritionService } from './shared/services/nutrition.service';
import { CommunityService } from './shared/services/community.service';
import { ChallengesMainComponent } from './community/challenges-main/challenges-main.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AddChallengesComponent } from './community/add-challenges/add-challenges.component';
import { UpdateChallengesComponent } from './community/update-challenges/update-challenges.component';
import { AddCommunityComponent } from './community/add-community/add-community.component';
import { UpdateCommunityComponent } from './community/update-community/update-community.component';

@NgModule({
  declarations: [
    MainLayoutComponent,
    SidebarComponent,
    NavbarComponent,
    DashboardComponent,
    EventsComponent,
    WorkoutsComponent,
    GymsComponent,
    TrainingComponent,
    NutritionComponent,
    AdminBookingsComponent, // ✅ ici (PAS dans imports)
    TableComponent,
    CommunityComponent,
    ChallengesMainComponent,
    AddChallengesComponent,
    UpdateChallengesComponent,
    AddCommunityComponent,
    UpdateCommunityComponent,
    EventCreateAdminComponent,
    EventEditAdminComponent,
    EventDetailAdminComponent
  ],
  imports: [
    CommonModule,
    FormsModule, // ✅ IMPORTANT pour ngModel
    ReactiveFormsModule,
    BackofficeRoutingModule,

    // standalone components seulement ici
    UsersComponent,
    UpdateUserComponent
  ],
  providers: [
    UserService,
    EventService,
    WorkoutService,
    GymService,
    TrainingService,
    NutritionService,
    CommunityService
  ]
})
export class BackofficeModule { }