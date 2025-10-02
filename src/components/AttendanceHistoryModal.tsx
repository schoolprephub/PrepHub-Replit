// Attendance History Modal Component - Displays all attendance records
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, Loader2 } from "lucide-react";
import { getUserAttendance } from "@/services/attendanceService";
import { DailyAttendanceRecord } from "@/types/attendance";
import { format, parseISO, isToday, isYesterday } from "date-fns";

interface AttendanceHistoryModalProps {
  userId: string;
}

/**
 * AttendanceHistoryModal Component
 * Displays a scrollable list of all attendance records for a user
 */
const AttendanceHistoryModal = ({ userId }: AttendanceHistoryModalProps) => {
  const [records, setRecords] = useState<DailyAttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Load attendance records on component mount
   */
  useEffect(() => {
    const loadRecords = async () => {
      setIsLoading(true);
      const data = await getUserAttendance(userId);
      setRecords(data);
      setIsLoading(false);
    };

    loadRecords();
  }, [userId]);

  /**
   * Format date with relative labels (Today, Yesterday)
   */
  const formatDateLabel = (dateString: string) => {
    const date = parseISO(dateString);
    
    if (isToday(date)) {
      return "Today";
    }
    if (isYesterday(date)) {
      return "Yesterday";
    }
    
    return format(date, "MMMM d, yyyy");
  };

  /**
   * Get day of week for a date
   */
  const getDayOfWeek = (dateString: string) => {
    return format(parseISO(dateString), "EEEE");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12" data-testid="loading-attendance-history">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading attendance history...</span>
      </div>
    );
  }

  // Empty state
  if (records.length === 0) {
    return (
      <div className="text-center py-12" data-testid="empty-attendance-history">
        <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No Attendance Records Yet
        </h3>
        <p className="text-sm text-muted-foreground">
          Start marking your daily attendance to build your streak!
        </p>
      </div>
    );
  }

  // Group records by month
  const groupedRecords = records.reduce((acc, record) => {
    const month = format(parseISO(record.date), "MMMM yyyy");
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(record);
    return acc;
  }, {} as Record<string, DailyAttendanceRecord[]>);

  return (
    <ScrollArea className="h-[400px] pr-4" data-testid="scroll-attendance-history">
      <div className="space-y-6">
        
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-border">
          <div className="text-center" data-testid="stat-total-records">
            <div className="text-2xl font-bold text-foreground">{records.length}</div>
            <div className="text-xs text-muted-foreground">Total Days</div>
          </div>
          <div className="text-center" data-testid="stat-first-record">
            <div className="text-2xl font-bold text-foreground">
              {format(parseISO(records[records.length - 1].date), "MMM d")}
            </div>
            <div className="text-xs text-muted-foreground">Started</div>
          </div>
        </div>

        {/* Attendance Records Grouped by Month */}
        {Object.entries(groupedRecords).map(([month, monthRecords]) => (
          <div key={month} className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              {month}
            </h4>
            <div className="space-y-2">
              {monthRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  data-testid={`record-${record.date}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">
                        {formatDateLabel(record.date)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {getDayOfWeek(record.date)}
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                    Present
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default AttendanceHistoryModal;
