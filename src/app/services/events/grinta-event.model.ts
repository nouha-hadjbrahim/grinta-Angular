export interface GrintaEvent {
  id?: number;
  title: string;
  name: string;
  date: string;
  time: string;
  location: string;
  description: string;
  status?: string;
  maxParticipants: number;
  tags?: GrintaEventTag[];
  registrations?: any[];
  createdByUserId?: number;
  createdByAdmin?: boolean;
}

export interface GrintaEventTag {
  id?: number;
  label: string;
  color: string;
}

export interface GrintaEventRegistration {
  id?: number;
  registrationDate?: string;
  status?: string;
  userId?: number;
  userEmail?: string;
}