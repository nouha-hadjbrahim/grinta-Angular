import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { MainComponent } from './core/main/main.component';
import { HomeComponent } from './features/home/home-main/home.component';
import { EventsComponent } from './features/events/events-main/events.component';
import { EventCreateComponent } from './features/events/event-create/event-create.component';
import { EventEditComponent } from './features/events/event-edit/event-edit.component';
import { EventDetailComponent } from './features/events/event-detail/event-detail.component';
import { GymsComponent } from './features/gyms/gyms-main/gyms.component';
import { CoachingComponent } from './features/coaching/coaching-main/coaching.component';
import { BookingsComponent } from './features/bookings/bookings-main/bookings.component';
import { WorkoutsComponent } from './features/workouts/workouts-main/workouts.component';
import { NutritionComponent } from './features/nutrition/nutrition-main/nutrition.component';
import { CommunityComponent } from './features/community/community-main/community.component';
// ✅ Nouveaux imports payment
import { PaymentComponent } from './features/bookings/payment/payment.component';
import { PaymentSuccessComponent } from './features/bookings/payment-success/payment-success.component';
import { PaymentFailComponent } from './features/bookings/payment-fail/payment-fail.component';

const routes: Routes = [
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
  { path: 'sign-in', component: SignInComponent },
  {
    path: 'main', component: MainComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'events', component: EventsComponent },
      { path: 'events/create', component: EventCreateComponent },
      { path: 'events/edit/:id', component: EventEditComponent },
      { path: 'events/:id', component: EventDetailComponent },
      { path: 'workouts', component: WorkoutsComponent },
      { path: 'gyms', component: GymsComponent },
      { path: 'coaching', component: CoachingComponent },
      { path: 'bookings', component: BookingsComponent },
      // ✅ Routes payment
      { path: 'bookings/payment', component: PaymentComponent },
      { path: 'bookings/payment-success', component: PaymentSuccessComponent },
      { path: 'bookings/payment-fail', component: PaymentFailComponent },
      { path: 'nutrition', component: NutritionComponent },
      { path: 'community', component: CommunityComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }