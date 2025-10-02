// Types for Daily Attendance feature

export interface DailyAttendanceRecord {
  id: string;
  user_id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  created_at: string;
}

export interface AttendanceStreak {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
}

export interface AttendanceStats {
  streak: AttendanceStreak;
  hasMarkedToday: boolean;
  lastMarkedDate: string | null;
}
