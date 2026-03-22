import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { MainComponent } from './core/main/main.component';
import { HomeComponent } from './features/home/home-main/home.component';
import { HeaderComponent } from './core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';
import { EventsComponent } from './features/events/events-main/events.component';
import { EventCreateComponent } from './features/events/event-create/event-create.component';
import { EventEditComponent } from './features/events/event-edit/event-edit.component';
import { EventDetailComponent } from './features/events/event-detail/event-detail.component';
import { GymsComponent } from './features/gyms/gyms-main/gyms.component';
import { CoachingComponent } from './features/coaching/coaching-main/coaching.component';
import { BookingsComponent } from './features/bookings/bookings-main/bookings.component';
import { NutritionComponent } from './features/nutrition/nutrition-main/nutrition.component';
import { CommunityComponent } from './features/community/community-main/community.component';
import { WorkoutsComponent } from './features/workouts/workouts-main/workouts.component';


@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    MainComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    EventsComponent,
    EventCreateComponent,
    EventEditComponent,
    EventDetailComponent,
    GymsComponent,
    CoachingComponent,
    BookingsComponent,
    WorkoutsComponent,
    NutritionComponent,
    CommunityComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonModule
  ],
    providers: [
    provideHttpClient(withInterceptorsFromDi())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
