# Backoffice Admin Dashboard Module

## Overview

Complete admin dashboard module for GRINTA application built with Angular 18. Provides a comprehensive management interface for users, events, workouts, gyms, training, nutrition, and community settings.

## Features

✅ **Responsive Layout** - Sidebar navigation + Navbar with profile dropdown
✅ **Dashboard** - Statistical cards and chart visualizations  
✅ **Feature Modules** - Dedicated pages for each management area
✅ **Reusable Table Component** - Dynamic columns, sorting, searching, CRUD actions
✅ **Mock Data Services** - Pre-populated with sample data for development
✅ **Clean Architecture** - Modular, scalable, and maintainable code structure
✅ **TypeScript Interfaces** - Full type safety for all models
✅ **Lazy Loading** - Loaded on-demand via routing module

## Project Structure

```
src/app/backoffice/
├── layout/
│   ├── main-layout/           # Main layout wrapper
│   ├── sidebar/               # Navigation sidebar
│   └── navbar/                # Top navigation bar
├── dashboard/                 # Dashboard page
├── users/                     # Users management
├── events/                    # Events management
├── workouts/                  # Workouts management
├── gyms/                      # Gyms management
├── training/                  # Training management
├── nutrition/                 # Nutrition management
├── community/                 # Community management
├── shared/
│   ├── components/
│   │   ├── table/            # Reusable table component
│   │   └── modal/            # Reusable modal (for future use)
│   ├── services/             # Mock data services
│   └── models/               # TypeScript interfaces
├── backoffice.module.ts       # Module definition
└── backoffice-routing.module.ts # Routing configuration
```

## Color Scheme

- **Sidebar & Navbar**: `#1e1e1e` (Dark Gray)
- **Primary (Active)**: `#e63946` (Red)
- **Background**: `#f7f7f7` (Light Gray)
- **Success**: `#2fbf71` (Green)
- **Warning**: `#ffc857` (Yellow)

## Routing

Access the backoffice at `/admin`:

```
/admin                 → Dashboard
/admin/users          → Users Management
/admin/events         → Events Management
/admin/workouts       → Workouts Management
/admin/gyms           → Gyms Management
/admin/training       → Training Management
/admin/nutrition      → Nutrition Management
/admin/community      → Community & Challenges
```

## Layout Components

### Main Layout (`MainLayoutComponent`)
- Wrapper for sidebar, navbar, and router outlet
- Manages the overall admin interface structure

### Sidebar (`SidebarComponent`)
- Fixed left navigation panel
- 8 menu items with icons and labels
- Active route highlighting
- Responsive and scrollable

### Navbar (`NavbarComponent`)
- Fixed top navigation bar
- Shows app name "GRINTA"
- Notification icon with badge
- Profile dropdown menu

## Dashboard (`DashboardComponent`)

Displays key metrics and visualizations:
- **4 Stat Cards**: Total Users, Workouts, Revenue, Active Members
- **Weekly Activity Chart**: Bar chart showing workout activity
- **Monthly Revenue Chart**: Bar chart showing revenue trends

## Feature Modules

Each feature module (Users, Events, Workouts, etc.) includes:

### Component
- Loads data from service
- Defines table columns and actions
- Handles CRUD operations (View, Edit, Delete)
- Implements add new functionality

### Service
- Mock data provider
- CRUD operations (Create, Read, Update, Delete)
- Returns Observables for reactive approach

### Table Integration
Uses the reusable `TableComponent` with:
- Dynamic columns configuration
- Sorting and searching
- Action buttons (View, Edit, Delete)
- Add New button
- Record count display

## Reusable Components

### Table Component (`TableComponent`)

**Features:**
- Dynamic columns configuration
- Sortable columns
- Search/filter functionality
- CRUD action buttons (View, Edit, Delete)
- Responsive design
- Record count footer

**Usage:**
```html
<app-table 
  [columns]="columns"
  [data]="items"
  [actions]="actions"
  title="Module Name"
  (actionTriggered)="onAction($event)"
  (addNew)="onAddNew()"
  (search)="onSearch($event)">
</app-table>
```

**Configuration:**
```typescript
columns: TableColumn[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'status', label: 'Status', sortable: false }
];

actions: TableAction[] = [
  { label: 'View', icon: 'bi-eye', action: 'view', color: '#0ea5e9' },
  { label: 'Edit', icon: 'bi-pencil', action: 'edit', color: '#f59e0b' },
  { label: 'Delete', icon: 'bi-trash', action: 'delete', color: '#ef4444' }
];
```

## Data Models

All models are defined in `src/app/backoffice/shared/models/index.ts`:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Premium' | 'Basic';
  joinedDate: string;
  status: 'Active' | 'Inactive';
  avatar?: string;
}

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  capacity: number;
  registered: number;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
}

// ... and more models for each feature
```

## Services

Mock services located in `src/app/backoffice/shared/services/`:

- **UserService** - User management
- **EventService** - Event management
- **WorkoutService** - Workout management
- **GymService** - Gym management
- **TrainingService** - Training management
- **NutritionService** - Nutrition management
- **CommunityService** - Community management

Each service provides:
```typescript
getAll(): Observable<T[]>
getById(id: string): Observable<T>
update(id: string, item: T): Observable<T>
delete(id: string): Observable<boolean>
add(item: T): Observable<T>
```

## How to Extend

### Add a New Feature Module

1. Create feature folder: `src/app/backoffice/[feature]/`
2. Generate component files:
   - `[feature].component.ts`
   - `[feature].component.html`
   - `[feature].component.css`
   - `[feature].component.spec.ts`

3. Create service in `shared/services/[feature].service.ts`

4. Add to backoffice routing:
```typescript
{ path: '[feature]', component: FeatureComponent }
```

5. Add to sidebar menu in `sidebar.component.ts`:
```typescript
{ label: 'Feature Name', icon: 'bi-icon', route: '/admin/[feature]' }
```

### Create a Modal Component

1. Create in `src/app/backoffice/shared/components/modal/`
2. Implement modal logic and styling
3. Use in feature components for edit/view dialogs

### Add Chart Integration

To use Chart.js:

1. Install: `npm install chart.js`
2. Create chart component in `shared/components/chart/`
3. Use in dashboard or feature modules

## Testing

Each component has unit tests with:
- Component creation verification
- Data loading tests
- User interaction tests
- Service integration tests

Run tests:
```bash
npm test
```

## Authentication

Currently, authentication is commented out. To enable:

1. Uncomment `canActivate: [AuthGuard]` in:
   - `app-routing.module.ts`
   - `backoffice-routing.module.ts`

2. Update `auth.guard.ts` to check admin role

## Styling

### CSS Architecture
- Component-scoped CSS for encapsulation
- Consistent color scheme using CSS variables
- Responsive design (mobile-first approach)
- Bootstrap Icons (bi-\*) for all icons

### Z-index Hierarchy
- Sidebar: 1000
- Navbar: 999
- Dropdowns: 1001

## Performance Considerations

- Lazy loading of backoffice module
- Virtual scrolling for large tables (future enhancement)
- Pagination for data (future enhancement)
- Caching strategies (future enhancement)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Dependencies

- Angular 18
- Bootstrap 5 (Icons)
- RxJS 7.8
- TypeScript 5.2

## Future Enhancements

- [ ] Real API integration
- [ ] Advanced charting with Chart.js
- [ ] User role-based access control
- [ ] Export to CSV/PDF
- [ ] Real-time notifications
- [ ] Bulk actions
- [ ] Advanced filtering
- [ ] Pagination
- [ ] Profile management page
- [ ] Settings page

## License

GRINTA © 2024

## Support

For questions or issues, please refer to the main project documentation.
