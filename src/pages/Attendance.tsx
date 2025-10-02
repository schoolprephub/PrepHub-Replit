import { ArrowLeft, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import AttendanceTracker from "@/components/AttendanceTracker";

const Attendance = () => {
  return (
    <div className="min-h-screen bg-background pt-20 pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-display font-bold">
              Daily Attendance
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Track your daily study progress and maintain your learning streak
          </p>
        </div>

        {/* Attendance Tracker */}
        <AttendanceTracker />
      </div>
    </div>
  );
};

export default Attendance;