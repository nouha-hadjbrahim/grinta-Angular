export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Premium' | 'Basic';
  joinedDate: string;
  status: 'Active' | 'Inactive';
  avatar?: string;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  capacity: number;
  registered: number;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
}

export interface Workout {
  id: string;
  name: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: number;
  rating: number;
  createdBy: string;
}

export interface Gym {
  id: string;
  name: string;
  city: string;
  address: string;
  members: number;
  rating: number;
  phone: string;
}

export interface Training {
  id: string;
  title: string;
  coach: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number;
  price: number;
  enrolled: number;
}

export interface Nutrition {
  id: string;
  name: string;
  nutritionist: string;
  type: 'Plan' | 'Recipe' | 'Meal';
  calories: number;
  createdDate: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  members: number;
  createdDate: string;
  status: 'Active' | 'Inactive';
}

export interface DashboardStat {
  label: string;
  value: number;
  change: number;
  icon: string;
  color: string;
}

export interface MenuItem {
  label: string;
  icon: string;
  route: string;
}
