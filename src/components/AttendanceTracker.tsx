import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, Clock, Flame, Trophy } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { markAttendanceWithRefresh } from "@/lib/storageUtils";

const AttendanceTracker = () => {
  const { user, userData, refreshUserData } = useAuth();
  const { toast } = useToast();
  const [isMarking, setIsMarking] = useState(false);
  const [mobileUser, setMobileUser] = useState<any>(null);
  const [mobileAttendance, setMobileAttendance] = useState<string[]>([]);

  // Check for mobile user session
  useEffect(() => {
    const folderUserSession = localStorage.getItem('folder_user_session');
    if (folderUserSession) {
      setMobileUser(JSON.parse(folderUserSession));
    }
    
    // Load mobile attendance from localStorage
    const savedAttendance = localStorage.getItem('mobile_user_attendance');
    if (savedAttendance) {
      setMobileAttendance(JSON.parse(savedAttendance));
    }
  }, []);

  const today = new Date().toISOString().split('T')[0];
  
  // Check attendance based on user type
  const hasAttendanceToday = mobileUser 
    ? mobileAttendance.includes(today)
    : userData?.attendance.some(a => a.date === today) || false;

  const handleMarkAttendance = async () => {
    if (!user && !mobileUser) return;

    setIsMarking(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (mobileUser) {
      // Handle mobile user attendance
      const newAttendance = [...mobileAttendance, today];
      setMobileAttendance(newAttendance);
      localStorage.setItem('mobile_user_attendance', JSON.stringify(newAttendance));
      
      toast({
        title: "Attendance Marked! 🎉",
        description: `Great job, ${mobileUser.full_name}! Keep up the consistency!`,
      });
    } else {
      // Handle regular user attendance
      const updatedData = markAttendanceWithRefresh(userData.id);
      if (updatedData) {
        toast({
          title: "Attendance Marked! 🎉",
          description: `Great job! You've maintained a ${updatedData.studyStreak} day streak!`,
        });
      }
    }
    
    setIsMarking(false);
  };

  // Use mobile user data or regular user data
  const displayData = userData || {
    studyStreak: mobileAttendance.length,
    attendance: mobileAttendance.map(date => ({ date })),
    totalStudyDays: mobileAttendance.length,
    joinDate: new Date().toISOString()
  };

  if (!userData && !mobileUser) return null;

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return "🔥";
    if (streak >= 14) return "⚡";
    if (streak >= 7) return "🌟";
    return "💪";
  };

  const getStreakMessage = (streak: number) => {
    if (streak >= 30) return "Incredible dedication!";
    if (streak >= 14) return "You're on fire!";
    if (streak >= 7) return "Building great habits!";
    if (streak >= 3) return "Keep it up!";
    return "Every day counts!";
  };

  // Get last 7 days for visual representation
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateString = date.toISOString().split('T')[0];
    const hasAttendance = mobileUser 
      ? mobileAttendance.includes(dateString)
      : displayData.attendance.some((a: any) => a.date === dateString);
    const isToday = dateString === today;
    
    return {
      date: dateString,
      day: date.getDate(),
      hasAttendance,
      isToday,
    };
  });

  return (
    <div className="space-y-6">
      {/* Main Attendance Card */}
      <Card className="card-fun">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-secondary" />
            Daily Attendance
          </CardTitle>
          <CardDescription>
            Mark your daily study session and build a winning streak!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Streak Display */}
          <div className="text-center">
            <div className="text-6xl mb-2">{getStreakEmoji(displayData.studyStreak)}</div>
            <div className="text-3xl font-bold text-foreground mb-1">
              {displayData.studyStreak} Day{displayData.studyStreak !== 1 ? 's' : ''}
            </div>
            <div className="text-sm text-muted-foreground mb-4">
              {getStreakMessage(displayData.studyStreak)}
            </div>
            
            {/* Progress towards next milestone */}
            {displayData.studyStreak < 30 && (
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">
                  Next milestone: {displayData.studyStreak < 7 ? '7' : displayData.studyStreak < 14 ? '14' : '30'} days
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-secondary to-accent h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(displayData.studyStreak / (displayData.studyStreak < 7 ? 7 : displayData.studyStreak < 14 ? 14 : 30)) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Week View */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">This Week</h4>
            <div className="grid grid-cols-7 gap-2">
              {last7Days.map((day, index) => (
                <div key={index} className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">
                    {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                  </div>
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200 ${
                      day.hasAttendance 
                        ? 'bg-success text-white' 
                        : day.isToday 
                          ? 'bg-primary/20 text-primary border-2 border-primary' 
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {day.hasAttendance ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      day.day
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attendance Button */}
          <Button
            className={`w-full py-6 text-lg font-semibold rounded-xl ${
              hasAttendanceToday ? 'btn-accent opacity-75' : 'btn-secondary'
            }`}
            onClick={handleMarkAttendance}
            disabled={hasAttendanceToday || isMarking}
          >
            {isMarking ? (
              <>
                <Clock className="w-5 h-5 mr-2 animate-spin" />
                Marking Attendance...
              </>
            ) : hasAttendanceToday ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Attendance Marked Today!
              </>
            ) : (
              <>
                <Calendar className="w-5 h-5 mr-2" />
                Mark Today's Attendance
              </>
            )}
          </Button>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{displayData.totalStudyDays}</div>
              <div className="text-xs text-muted-foreground">Total Days</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {Math.round((displayData.totalStudyDays / Math.max(1, Math.ceil((Date.now() - new Date(displayData.joinDate).getTime()) / (1000 * 60 * 60 * 24)))) * 100)}%
              </div>
              <div className="text-xs text-muted-foreground">Consistency</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Badges */}
      {displayData.studyStreak >= 7 && (
        <Card className="card-fun bg-gradient-to-br from-success/10 to-primary/10">
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 text-success mx-auto mb-2" />
            <h3 className="font-semibold text-foreground mb-1">Streak Master!</h3>
            <p className="text-xs text-muted-foreground mb-2">
              {displayData.studyStreak >= 30 ? 'Legend Status Achieved!' : 
               displayData.studyStreak >= 14 ? 'You\'re unstoppable!' : 
               'You\'ve built a great habit!'}
            </p>
            <Badge variant="secondary" className="bg-success text-white">
              {displayData.studyStreak >= 30 ? '+100 XP' : 
               displayData.studyStreak >= 14 ? '+75 XP' : 
               '+50 XP'} Streak Bonus
            </Badge>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AttendanceTracker;