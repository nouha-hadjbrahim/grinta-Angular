# GRINTA - Frontend Sport Project Notes

## Project Structure
```
src/app/
├── app.component.html              # Root shell — contains only <router-outlet>
├── app.component.ts
├── app-routing.module.ts           # All routes defined here
│
├── guards/
│   └── auth.guard.ts               # Protects /main routes (TODO: enable)
│
├── services/
│   ├── user.service.ts             # HTTP calls — sign-in, sign-up, getAll, delete
│   └── auth.service.ts             # JWT token management (localStorage)
│
├── environments/
│   └── environment.ts              # apiUrl = http://localhost:8000/api
│
├── core/
│   ├── main/                       # Layout shell: header + <router-outlet> + footer
│   ├── header/                     # Navbar with routerLink + logout
│   └── footer/                     # Footer with links and social icons
│
└── features/
    ├── home/
    │   └── home-main/              # Hero, Features, Why GRINTA sections
    ├── auth/
    │   └── auth-main/              # Sign-in page
    ├── events/
    │   └── events-main/
    ├── workouts/
    │   └── workouts-main/
    ├── gyms/
    │   └── gyms-main/
    ├── coaching/
    │   └── coaching-main/
    ├── bookings/
    │   └── bookings-main/
    ├── nutrition/
    │   └── nutrition-main/
    └── community/
        └── community-main/
```

## Routing
| Path               | Component          | Description                              |
|--------------------|--------------------|------------------------------------------|
| `/`                | —                  | Redirects to `/sign-in`                  |
| `/sign-in`         | SignInComponent    | Full page login (no header/footer)       |
| `/main`            | MainComponent      | Layout shell with header & footer        |
| `/main`            | HomeComponent      | Home page (default child)                |
| `/main/events`     | EventsComponent    | Events page                              |
| `/main/workouts`   | WorkoutsComponent  | Workouts page                            |
| `/main/gyms`       | GymsComponent      | Gyms page                                |
| `/main/coaching`   | CoachingComponent  | Coaching page                            |
| `/main/bookings`   | BookingsComponent  | Bookings page                            |
| `/main/nutrition`  | NutritionComponent | Nutrition page                           |
| `/main/community`  | CommunityComponent | Community page                           |

## What's Done So Far
- [x] Bootstrap 5 + Bootstrap Icons installed via npm and configured in `angular.json`
- [x] Sign-in page designed (dark theme, email/password inputs)
- [x] Routing set up with default redirect to `/sign-in`
- [x] `MainComponent` — layout shell with header, router-outlet, footer
- [x] `HeaderComponent` — navbar with `routerLink`, `routerLinkActive`, logout button
- [x] `FooterComponent` — full dark footer with links, social icons, contact
- [x] `HttpClientModule` + `FormsModule` + `CommonModule` added to `app.module.ts`
- [x] `environment.ts` configured with `apiUrl = http://localhost:8000/api`
- [x] `UserService` — calls `/api/auth/sign-in`, `/api/auth/sign-up`, `/api/users`
- [x] `AuthService` — stores/retrieves/removes JWT token from `localStorage`
- [x] JWT token received on sign-in → stored in `localStorage` automatically via `tap()`
- [x] Sign-in form wired with `[(ngModel)]` → on success navigates to `/main`
- [x] Logout clears token from `localStorage` and redirects to `/sign-in`
- [x] `AuthGuard` created (commented out — TODO: enable when ready)
- [x] All feature components created and wired to their routes
- [x] Home page sections: Hero, Features cards, Why GRINTA stats