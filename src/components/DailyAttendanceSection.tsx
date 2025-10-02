// Daily Attendance Section Component with Date Picker and Mark Attendance functionality
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar as CalendarIcon, CheckCircle, Flame, Eye, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { markAttendance, getAttendanceStats } from "@/services/attendanceService";
import { AttendanceStats } from "@/types/attendance";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import AttendanceHistoryModal from "@/components/AttendanceHistoryModal";

/**
 * DailyAttendanceSection Component
 * Displays daily attendance tracking with date picker, mark attendance button, and streak information
 */
const DailyAttendanceSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Check for mobile user session (doesn't have Supabase auth)
  const [mobileUser, setMobileUser] = useState<any>(null);
  
  useEffect(() => {
    const folderUserSession = localStorage.getItem('folder_user_session');
    if (folderUserSession) {
      setMobileUser(JSON.parse(folderUserSession));
    }
  }, []);
  
  // State management
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isMarking, setIsMarking] = useState(false);
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  /**
   * Load attendance stats on component mount and when user changes
   */
  useEffect(() => {
    const loadStats = async () => {
      // Don't load if no Supabase user (mobile users use localStorage)
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      const stats = await getAttendanceStats(user.id);
      setAttendanceStats(stats);
      setIsLoading(false);
    };

    loadStats();
  }, [user, refreshTrigger]);

  /**
   * Handle marking attendance for the selected date
   */
  const handleMarkAttendance = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to mark attendance.",
        variant: "destructive",
      });
      return;
    }

    setIsMarking(true);

    // Format date as YYYY-MM-DD
    const dateString = format(selectedDate, "yyyy-MM-dd");

    // Mark attendance via service
    const result = await markAttendance(user.id, dateString);

    if (result.success) {
      toast({
        title: "Attendance Marked! 🎉",
        description: `Successfully marked attendance for ${format(selectedDate, "MMM d, yyyy")}`,
      });
      
      // Refresh stats to update streak
      setRefreshTrigger(prev => prev + 1);
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to mark attendance. Please try again.",
        variant: "destructive",
      });
    }

    setIsMarking(false);
  };

  /**
   * Get emoji based on streak count
   */
  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return "🔥";
    if (streak >= 14) return "⚡";
    if (streak >= 7) return "🌟";
    return "💪";
  };

  /**
   * Get motivational message based on streak
   */
  const getStreakMessage = (streak: number) => {
    if (streak >= 30) return "Incredible dedication!";
    if (streak >= 14) return "You're on fire!";
    if (streak >= 7) return "Building great habits!";
    if (streak >= 3) return "Keep it up!";
    return "Every day counts!";
  };

  // Don't render for mobile users (they use localStorage-based attendance)
  // This component requires Supabase authentication
  if (mobileUser && !user) {
    return null;
  }

  // Show loading state
  if (isLoading) {
    return (
      <Card className="card-fun" data-testid="card-attendance-loading">
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading attendance...</span>
        </CardContent>
      </Card>
    );
  }

  // Don't render if no Supabase user is logged in
  if (!user || !attendanceStats) {
    return null;
  }

  const today = new Date().toISOString().split("T")[0];
  const isSelectedDateToday = format(selectedDate, "yyyy-MM-dd") === today;

  return (
    <Card className="card-fun hover-lift" data-testid="card-daily-attendance">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-primary" />
          Daily Attendance
        </CardTitle>
        <CardDescription>
          Mark your daily attendance and build your streak!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Streak Display */}
        <div className="text-center" data-testid="streak-display">
          <div className="text-5xl mb-2">
            {getStreakEmoji(attendanceStats.streak.currentStreak)}
          </div>
          <div className="text-3xl font-bold text-foreground mb-1" data-testid="text-current-streak">
            {attendanceStats.streak.currentStreak} Day{attendanceStats.streak.currentStreak !== 1 ? 's' : ''}
          </div>
          <div className="text-sm text-muted-foreground">
            {getStreakMessage(attendanceStats.streak.currentStreak)}
          </div>
        </div>

        {/* Today's Status Badge */}
        {attendanceStats.hasMarkedToday && isSelectedDateToday && (
          <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-success/10 border border-success/20" data-testid="badge-today-marked">
            <CheckCircle className="w-5 h-5 text-success" />
            <span className="text-sm font-medium text-success">
              Attendance marked today!
            </span>
          </div>
        )}

        {/* Date Picker */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Select Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
                data-testid="button-date-picker"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                disabled={(date) => date > new Date() || date < new Date("2024-01-01")}
                initialFocus
                data-testid="calendar-date-picker"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Mark Attendance Button */}
        <Button
          className="w-full"
          onClick={handleMarkAttendance}
          disabled={isMarking}
          data-testid="button-mark-attendance"
        >
          {isMarking ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Marking Attendance...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark Attendance for {format(selectedDate, "MMM d")}
            </>
          )}
        </Button>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
          <div className="text-center" data-testid="stat-current-streak">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Flame className="w-4 h-4 text-primary" />
            </div>
            <div className="text-xl font-bold text-foreground">
              {attendanceStats.streak.currentStreak}
            </div>
            <div className="text-xs text-muted-foreground">Current</div>
          </div>
          <div className="text-center" data-testid="stat-longest-streak">
            <div className="text-xl font-bold text-foreground">
              {attendanceStats.streak.longestStreak}
            </div>
            <div className="text-xs text-muted-foreground">Longest</div>
          </div>
          <div className="text-center" data-testid="stat-total-days">
            <div className="text-xl font-bold text-foreground">
              {attendanceStats.streak.totalDays}
            </div>
            <div className="text-xs text-muted-foreground">Total Days</div>
          </div>
        </div>

        {/* View Full Attendance Button */}
        <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full"
              data-testid="button-view-full-attendance"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Full Attendance
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Attendance History</DialogTitle>
              <DialogDescription>
                View all your attendance records and track your progress
              </DialogDescription>
            </DialogHeader>
            <AttendanceHistoryModal userId={user.id} />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default DailyAttendanceSection;
