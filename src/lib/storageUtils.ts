// Enhanced storage utilities with automatic refresh callbacks
import { addStudyTime as baseAddStudyTime, completeLesson as baseCompleteLesson, markAttendance as baseMarkAttendance, UserData } from './storage';

// Global refresh callback that can be set by AuthContext
let globalRefreshCallback: (() => void) | null = null;

export const setGlobalRefreshCallback = (callback: (() => void) | null) => {
  globalRefreshCallback = callback;
};

// Wrapper functions that automatically trigger refresh
export const addStudyTimeWithRefresh = (userId: string, minutes: number): UserData | null => {
  const result = baseAddStudyTime(userId, minutes);
  if (result && globalRefreshCallback) {
    // Small delay to ensure storage is written
    setTimeout(globalRefreshCallback, 100);
  }
  return result;
};

export const completeLessonWithRefresh = (userId: string, subject: string, xpEarned = 25): UserData | null => {
  const result = baseCompleteLesson(userId, subject, xpEarned);
  if (result && globalRefreshCallback) {
    setTimeout(globalRefreshCallback, 100);
  }
  return result;
};

export const markAttendanceWithRefresh = (userId: string): UserData | null => {
  const result = baseMarkAttendance(userId);
  if (result && globalRefreshCallback) {
    setTimeout(globalRefreshCallback, 100);
  }
  return result;
};

// Simulate real-time progress tracking
export const simulateProgressUpdates = (userId: string, callback: (userData: UserData) => void) => {
  const interval = setInterval(() => {
    // Randomly add small amounts of study time to simulate ongoing learning
    if (Math.random() < 0.1) { // 10% chance every interval
      const result = addStudyTimeWithRefresh(userId, Math.floor(Math.random() * 5) + 1);
      if (result) {
        callback(result);
      }
    }
  }, 10000); // Check every 10 seconds

  return interval;
};