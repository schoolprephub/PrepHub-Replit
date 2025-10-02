// Service layer for Daily Attendance operations with Supabase
import { supabase } from "@/integrations/supabase/client";
import { DailyAttendanceRecord, AttendanceStreak, AttendanceStats } from "@/types/attendance";

// Type assertion helper for daily_attendance table
// Note: Run the SQL migration in supabase/migrations/20251002_create_daily_attendance_table.sql first
const getAttendanceTable = () => supabase.from("daily_attendance" as any);

/**
 * Mark attendance for a specific date
 * @param userId - The user's ID
 * @param date - The date to mark attendance (YYYY-MM-DD format)
 * @returns Success status and optional error message
 */
export const markAttendance = async (
  userId: string,
  date: string
): Promise<{ success: boolean; error?: string; data?: DailyAttendanceRecord }> => {
  try {
    // Check if attendance already exists for this date
    const { data: existing, error: checkError } = await getAttendanceTable()
      .select("*")
      .eq("user_id", userId)
      .eq("date", date)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 means no rows found, which is expected
      throw checkError;
    }

    if (existing) {
      return {
        success: false,
        error: "Attendance already marked for this date",
      };
    }

    // Insert new attendance record
    const { data, error } = await getAttendanceTable()
      .insert({
        user_id: userId,
        date: date,
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data: data as DailyAttendanceRecord };
  } catch (error) {
    console.error("Error marking attendance:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to mark attendance",
    };
  }
};

/**
 * Get all attendance records for a user
 * @param userId - The user's ID
 * @returns Array of attendance records
 */
export const getUserAttendance = async (
  userId: string
): Promise<DailyAttendanceRecord[]> => {
  try {
    const { data, error } = await getAttendanceTable()
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (error) throw error;

    return (data as DailyAttendanceRecord[]) || [];
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return [];
  }
};

/**
 * Calculate attendance streak for a user
 * @param userId - The user's ID
 * @returns Streak information including current streak, longest streak, and total days
 */
export const calculateStreak = async (
  userId: string
): Promise<AttendanceStreak> => {
  try {
    const { data, error } = await getAttendanceTable()
      .select("date")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      return { currentStreak: 0, longestStreak: 0, totalDays: 0 };
    }

    const dates = data.map((record) => record.date);
    const totalDays = dates.length;

    // Calculate current streak (consecutive days from today backwards)
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < dates.length; i++) {
      const recordDate = new Date(dates[i]);
      recordDate.setHours(0, 0, 0, 0);

      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      expectedDate.setHours(0, 0, 0, 0);

      if (recordDate.getTime() === expectedDate.getTime()) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 1;

    for (let i = 0; i < dates.length - 1; i++) {
      const currentDate = new Date(dates[i]);
      const nextDate = new Date(dates[i + 1]);
      
      // Calculate difference in days
      const diffTime = currentDate.getTime() - nextDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return { currentStreak, longestStreak, totalDays };
  } catch (error) {
    console.error("Error calculating streak:", error);
    return { currentStreak: 0, longestStreak: 0, totalDays: 0 };
  }
};

/**
 * Get attendance stats including streak and today's status
 * @param userId - The user's ID
 * @returns Complete attendance statistics
 */
export const getAttendanceStats = async (
  userId: string
): Promise<AttendanceStats> => {
  try {
    const streak = await calculateStreak(userId);
    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await getAttendanceTable()
      .select("date")
      .eq("user_id", userId)
      .eq("date", today)
      .single();

    const hasMarkedToday = !!data && !error;

    // Get last marked date
    const { data: lastRecord } = await getAttendanceTable()
      .select("date")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .limit(1)
      .single();

    return {
      streak,
      hasMarkedToday,
      lastMarkedDate: lastRecord?.date || null,
    };
  } catch (error) {
    console.error("Error getting attendance stats:", error);
    return {
      streak: { currentStreak: 0, longestStreak: 0, totalDays: 0 },
      hasMarkedToday: false,
      lastMarkedDate: null,
    };
  }
};

/**
 * Check if attendance is marked for a specific date
 * @param userId - The user's ID
 * @param date - The date to check (YYYY-MM-DD format)
 * @returns Boolean indicating if attendance is marked
 */
export const checkAttendanceForDate = async (
  userId: string,
  date: string
): Promise<boolean> => {
  try {
    const { data, error } = await getAttendanceTable()
      .select("id")
      .eq("user_id", userId)
      .eq("date", date)
      .single();

    return !!data && !error;
  } catch (error) {
    return false;
  }
};
