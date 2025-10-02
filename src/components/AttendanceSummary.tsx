import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, Flame, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const AttendanceSummary = () => {
  const { userData } = useAuth();
  const [mobileUser, setMobileUser] = useState(null);

  useEffect(() => {
    const folderUserSession = localStorage.getItem('folder_user_session');
    if (folderUserSession) {
      setMobileUser(JSON.parse(folderUserSession));
    }
  }, []);

  // If no userData and no mobile user, don't render
  if (!userData && !mobileUser) return null;

  // Use mobile user data structure or regular userData
  const displayData = userData || {
    studyStreak: 0,
    attendance: [],
    totalStudyDays: 0,
    joinDate: new Date().toISOString()
  };

  const today = new Date().toISOString().split('T')[0];
  const hasAttendanceToday = displayData.attendance?.some(a => a.date === today) || false;

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return "🔥";
    if (streak >= 14) return "⚡";
    if (streak >= 7) return "🌟";
    return "💪";
  };

  return (
    <Card className="card-fun hover-lift">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Daily Attendance
        </CardTitle>
        <CardDescription>
          {mobileUser ? 
            `Track your study progress - ${mobileUser.full_name}` :
            "Track your study streak and daily progress"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Streak Display */}
        <div className="text-center">
          <div className="text-4xl mb-2">{getStreakEmoji(displayData.studyStreak)}</div>
          <div className="text-2xl font-bold text-foreground mb-1">
            {displayData.studyStreak} Day{displayData.studyStreak !== 1 ? 's' : ''}
          </div>
          <div className="text-sm text-muted-foreground">
            Current Streak
          </div>
        </div>

        {/* Today's Status */}
        <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-muted/50">
          {hasAttendanceToday ? (
            <>
              <CheckCircle className="w-5 h-5 text-success" />
              <span className="text-sm font-medium text-success">
                Attendance marked today!
              </span>
            </>
          ) : (
            <>
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Mark today's attendance
              </span>
            </>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-foreground">{displayData.totalStudyDays || 0}</div>
            <div className="text-xs text-muted-foreground">Total Days</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-foreground">
              {Math.round((displayData.totalStudyDays / Math.max(1, Math.ceil((Date.now() - new Date(displayData.joinDate).getTime()) / (1000 * 60 * 60 * 24)))) * 100) || 0}%
            </div>
            <div className="text-xs text-muted-foreground">Consistency</div>
          </div>
        </div>

        {/* Action Button */}
        <Link to="/attendance" className="block">
          <Button className="w-full" variant="outline">
            View Full Attendance
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default AttendanceSummary;