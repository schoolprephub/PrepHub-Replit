import { supabase } from '@/integrations/supabase/client';

export interface UserData {
  currentStreak: number;
  longestStreak: number;
  totalStudyTime: number;
  totalXp: number;
  subjectsCompleted: number;
  lastStudyDate: string | null;
  dailyGoal: number;
  weeklyGoal: number;
}

export interface AttendanceRecord {
  date: string;
  studyTime: number;
  subjectsStudied: string[];
  notes?: string;
}

export const getUserData = async (userId: string): Promise<UserData | null> => {
  try {
    const { data, error } = await supabase
      .from('user_data')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user data:', error);
      return null;
    }

    if (!data) return null;

    return {
      currentStreak: data.current_streak,
      longestStreak: data.longest_streak,
      totalStudyTime: data.total_study_time,
      totalXp: data.total_xp,
      subjectsCompleted: data.subjects_completed,
      lastStudyDate: data.last_study_date,
      dailyGoal: data.daily_goal,
      weeklyGoal: data.daily_goal * 7, // Calculate weekly goal from daily
    };
  } catch (error) {
    console.error('Error in getUserData:', error);
    return null;
  }
};

export const initializeUserData = async (userId: string, name: string, email: string): Promise<UserData> => {
  const defaultData: UserData = {
    currentStreak: 0,
    longestStreak: 0,
    totalStudyTime: 0,
    totalXp: 0,
    subjectsCompleted: 0,
    lastStudyDate: null,
    dailyGoal: 60,
    weeklyGoal: 420,
  };

  try {
    // Check if user_data already exists
    const { data: existingData } = await supabase
      .from('user_data')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (existingData) {
      return {
        currentStreak: existingData.current_streak,
        longestStreak: existingData.longest_streak,
        totalStudyTime: existingData.total_study_time,
        totalXp: existingData.total_xp,
        subjectsCompleted: existingData.subjects_completed,
        lastStudyDate: existingData.last_study_date,
        dailyGoal: existingData.daily_goal,
        weeklyGoal: existingData.daily_goal * 7,
      };
    }

    // Insert new user_data if it doesn't exist
    const { error } = await supabase
      .from('user_data')
      .insert({
        user_id: userId,
        current_streak: defaultData.currentStreak,
        longest_streak: defaultData.longestStreak,
        total_study_time: defaultData.totalStudyTime,
        total_xp: defaultData.totalXp,
        subjects_completed: defaultData.subjectsCompleted,
        daily_goal: defaultData.dailyGoal,
      });

    if (error) {
      console.error('Error initializing user data:', error);
    }

    return defaultData;
  } catch (error) {
    console.error('Error in initializeUserData:', error);
    return defaultData;
  }
};

export const updateUserData = async (userId: string, updates: Partial<UserData>): Promise<void> => {
  try {
    const dbUpdates: any = {};
    
    if (updates.currentStreak !== undefined) dbUpdates.current_streak = updates.currentStreak;
    if (updates.longestStreak !== undefined) dbUpdates.longest_streak = updates.longestStreak;
    if (updates.totalStudyTime !== undefined) dbUpdates.total_study_time = updates.totalStudyTime;
    if (updates.totalXp !== undefined) dbUpdates.total_xp = updates.totalXp;
    if (updates.subjectsCompleted !== undefined) dbUpdates.subjects_completed = updates.subjectsCompleted;
    if (updates.lastStudyDate !== undefined) dbUpdates.last_study_date = updates.lastStudyDate;
    if (updates.dailyGoal !== undefined) dbUpdates.daily_goal = updates.dailyGoal;

    const { error } = await supabase
      .from('user_data')
      .update(dbUpdates)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating user data:', error);
    }
  } catch (error) {
    console.error('Error in updateUserData:', error);
  }
};

export const getAttendanceData = async (userId: string): Promise<AttendanceRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching attendance data:', error);
      return [];
    }

    return data?.map(record => ({
      date: record.date,
      studyTime: record.study_time,
      subjectsStudied: record.subjects_studied || [],
      notes: record.notes || undefined,
    })) || [];
  } catch (error) {
    console.error('Error in getAttendanceData:', error);
    return [];
  }
};

export const updateAttendance = async (userId: string, date: string, studyTime: number, subjects: string[], notes?: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('attendance')
      .upsert({
        user_id: userId,
        date: date,
        study_time: studyTime,
        subjects_studied: subjects,
        notes: notes || null,
      });

    if (error) {
      console.error('Error updating attendance:', error);
    }
  } catch (error) {
    console.error('Error in updateAttendance:', error);
  }
};

export const addStudyTime = async (userId: string, minutes: number, subject: string): Promise<void> => {
  try {
    const userData = await getUserData(userId);
    if (!userData) return;

    const today = new Date().toISOString().split('T')[0];
    const lastStudyDate = userData.lastStudyDate;
    
    // Calculate streak
    let newStreak = userData.currentStreak;
    if (lastStudyDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (lastStudyDate === yesterdayStr) {
        newStreak += 1;
      } else if (lastStudyDate !== today) {
        newStreak = 1;
      }
    }

    const updatedData: Partial<UserData> = {
      totalStudyTime: userData.totalStudyTime + minutes,
      totalXp: userData.totalXp + Math.floor(minutes / 10) * 5,
      currentStreak: newStreak,
      longestStreak: Math.max(userData.longestStreak, newStreak),
      lastStudyDate: today,
    };

    if (subject && !userData.subjectsCompleted) {
      updatedData.subjectsCompleted = userData.subjectsCompleted + 1;
    }

    await updateUserData(userId, updatedData);

    // Update today's attendance
    const attendanceData = await getAttendanceData(userId);
    const todayAttendance = attendanceData.find(record => record.date === today);
    
    const currentStudyTime = todayAttendance?.studyTime || 0;
    const currentSubjects = todayAttendance?.subjectsStudied || [];
    const updatedSubjects = currentSubjects.includes(subject) 
      ? currentSubjects 
      : [...currentSubjects, subject];

    await updateAttendance(userId, today, currentStudyTime + minutes, updatedSubjects);
  } catch (error) {
    console.error('Error in addStudyTime:', error);
  }
};