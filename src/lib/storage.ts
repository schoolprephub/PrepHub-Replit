// Local storage utilities for data persistence
export interface UserData {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  studyStreak: number;
  totalStudyDays: number;
  completedLessons: number;
  totalLessons: number;
  xpPoints: number;
  todayStudyTime: number;
  weeklyStudyTime: number;
  weeklyGoal: number;
  subjects: {
    physics: { progress: number; lastStudied: string };
    chemistry: { progress: number; lastStudied: string };
    mathematics: { progress: number; lastStudied: string };
  };
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    date: string;
    xp: number;
  }>;
  attendance: Array<{
    date: string;
    studyTime: number;
    lessonsCompleted: number;
  }>;
}

export const getStorageKey = (userId: string, key: string) => `iit_prep_${userId}_${key}`;

export const getUserData = (userId: string): UserData | null => {
  try {
    const data = localStorage.getItem(getStorageKey(userId, 'userData'));
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

export const saveUserData = (userId: string, userData: UserData): void => {
  try {
    localStorage.setItem(getStorageKey(userId, 'userData'), JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

export const initializeUserData = (userId: string, name: string, email: string): UserData => {
  const userData: UserData = {
    id: userId,
    name,
    email,
    joinDate: new Date().toISOString(),
    studyStreak: 0,
    totalStudyDays: 0,
    completedLessons: 0,
    totalLessons: 100,
    xpPoints: 0,
    todayStudyTime: 0,
    weeklyStudyTime: 0,
    weeklyGoal: 20,
    subjects: {
      physics: { progress: 0, lastStudied: '' },
      chemistry: { progress: 0, lastStudied: '' },
      mathematics: { progress: 0, lastStudied: '' },
    },
    achievements: [],
    attendance: [],
  };
  
  saveUserData(userId, userData);
  return userData;
};

export const updateUserData = (userId: string, updates: Partial<UserData>): UserData | null => {
  const currentData = getUserData(userId);
  if (!currentData) return null;
  
  const updatedData = { ...currentData, ...updates };
  saveUserData(userId, updatedData);
  return updatedData;
};

export const markAttendance = (userId: string): UserData | null => {
  const currentData = getUserData(userId);
  if (!currentData) return null;
  
  const today = new Date().toISOString().split('T')[0];
  const hasAttendanceToday = currentData.attendance.some(a => a.date === today);
  
  if (!hasAttendanceToday) {
    const newAttendance = {
      date: today,
      studyTime: currentData.todayStudyTime,
      lessonsCompleted: 0,
    };
    
    const updatedData = {
      ...currentData,
      attendance: [...currentData.attendance, newAttendance],
      totalStudyDays: currentData.totalStudyDays + 1,
      studyStreak: currentData.studyStreak + 1,
      xpPoints: currentData.xpPoints + 10, // Bonus XP for attendance
    };
    
    saveUserData(userId, updatedData);
    return updatedData;
  }
  
  return currentData;
};

export const addStudyTime = (userId: string, minutes: number): UserData | null => {
  const currentData = getUserData(userId);
  if (!currentData) return null;
  
  const updatedData = {
    ...currentData,
    todayStudyTime: currentData.todayStudyTime + (minutes / 60),
    weeklyStudyTime: currentData.weeklyStudyTime + (minutes / 60),
  };
  
  saveUserData(userId, updatedData);
  return updatedData;
};

export const completeLesson = (userId: string, subject: string, xpEarned = 25): UserData | null => {
  const currentData = getUserData(userId);
  if (!currentData) return null;
  
  const updatedData = {
    ...currentData,
    completedLessons: currentData.completedLessons + 1,
    xpPoints: currentData.xpPoints + xpEarned,
    subjects: {
      ...currentData.subjects,
      [subject]: {
        ...currentData.subjects[subject as keyof typeof currentData.subjects],
        progress: Math.min(100, currentData.subjects[subject as keyof typeof currentData.subjects].progress + 5),
        lastStudied: new Date().toISOString(),
      },
    },
  };
  
  saveUserData(userId, updatedData);
  return updatedData;
};