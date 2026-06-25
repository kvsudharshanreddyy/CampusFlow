export interface User {
  id: string;
  email: string;
  role: "student" | "admin";
  created_at: string;
}

export interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  subject_id?: string;
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  credits: number;
  created_at: string;
}

export interface AttendanceRecord {
  id: string;
  user_id: string;
  subject_id: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  created_at: string;
}

export interface CalendarEvent {
  id: string;
  user_id: string;
  provider_event_id?: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  event_type: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export interface PlacementEntry {
  id: string;
  user_id: string;
  company_id: string;
  role_title: string;
  status: "applied" | "interviewing" | "offered" | "rejected" | "accepted";
  date_applied: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  industry?: string;
  website?: string;
  logo_url?: string;
}

export interface Flashcard {
  id: string;
  user_id: string;
  subject_id?: string;
  question: string;
  answer: string;
  next_review?: string;
  created_at: string;
}

export interface AiHistory {
  id: string;
  user_id: string;
  prompt: string;
  response: string;
  created_at: string;
}

export interface ApiResponse<T> {
  status: "success" | "error";
  message?: string;
  data: T;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

export interface StatCard {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: string;
}
