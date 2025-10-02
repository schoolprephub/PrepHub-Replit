import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Calendar as CalendarIcon, 
  FileText, 
  GamepadIcon, 
  PlayCircle, 
  Target, 
  TrendingUp,
  Trophy,
  Users,
  Zap,
  Clock,
  CheckCircle,
  Plus,
  ArrowLeft,
  HelpCircle,
  LogOut
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AttendanceSummary from "@/components/AttendanceSummary";
import { addStudyTimeWithRefresh } from "@/lib/storageUtils";
import { format, addDays } from "date-fns";

const Dashboard = () => {
  const { user, userData, refreshUserData } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isStudyModalOpen, setIsStudyModalOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [studyStartTime, setStudyStartTime] = useState("17:00");
  const [studyEndTime, setStudyEndTime] = useState("19:00");
  const [mobileUser, setMobileUser] = useState(null);

  // Check for mobile login session
  useEffect(() => {
    const folderUserSession = localStorage.getItem('folder_user_session');
    if (folderUserSession) {
      setMobileUser(JSON.parse(folderUserSession));
    }
  }, []);

  // Redirect to login if not authenticated (either way)
  if (!user && !mobileUser) {
    return <Navigate to="/login" replace />;
  }

  // Use mobile user data if available, otherwise use regular user data
  const currentUser = mobileUser || user;
  const currentUserData = mobileUser ? {
    name: mobileUser.full_name,
    studyStreak: 0,
    todayStudyTime: 0,
    completedLessons: 0,
    totalLessons: 100,
    xpPoints: 0
  } : userData;

  if (!currentUserData) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your data...</p>
        </div>
      </div>
    );
  }

  const quickActions = [
    { 
      icon: PlayCircle, 
      title: "Classes", 
      subtitle: "Watch video lessons", 
      color: "text-purple-600", 
      bgColor: "bg-purple-100",
      link: "/library?tab=videos"
    },
    { 
      icon: FileText, 
      title: "PDF", 
      subtitle: "Study materials & notes", 
      color: "text-orange-600", 
      bgColor: "bg-orange-100",
      link: "/library?tab=materials"
    },
    { 
      icon: HelpCircle, 
      title: "Quizzes", 
      subtitle: "Test your knowledge", 
      color: "text-pink-600", 
      bgColor: "bg-pink-100",
      link: "/library?tab=quizzes"
    },
    { 
      icon: GamepadIcon, 
      title: "Games", 
      subtitle: "Learn while having fun", 
      color: "text-green-600", 
      bgColor: "bg-green-100",
      link: "/library?tab=games"
    },
  ];

  const handleStudySessionSchedule = () => {
    if (!startDate || !endDate) {
      toast({
        title: "Missing Information",
        description: "Please select both start and end dates.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Study session scheduled! 📅",
      description: `We'll remind you every day from ${format(startDate, "MMM d")} to ${format(endDate, "MMM d")} at ${studyStartTime} - ${studyEndTime}.`,
    });

    setIsStudyModalOpen(false);
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const completionPercentage = Math.round((currentUserData.completedLessons / currentUserData.totalLessons) * 100);

  const handleLogout = () => {
    localStorage.removeItem('folder_user_session');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button and Logout */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
            Welcome back, <span className="gradient-text">{currentUserData.name}!</span> 🚀
          </h1>
          <p className="text-muted-foreground text-lg">
            {mobileUser ? 
              `${mobileUser.school_name} - ${mobileUser.class}` : 
              "You're doing great! Keep up the momentum and crush those IIT goals."
            }
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <Card className="card-fun hover-lift">
            <CardContent className="p-4 md:p-6 text-center">
              <Zap className="w-8 h-8 text-secondary mx-auto mb-2" />
              <div className="text-2xl md:text-3xl font-bold text-foreground">{currentUserData.studyStreak}</div>
              <div className="text-sm text-muted-foreground">Day Streak 🔥</div>
            </CardContent>
          </Card>
          <Card className="card-fun hover-lift">
            <CardContent className="p-4 md:p-6 text-center">
              <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl md:text-3xl font-bold text-foreground">{currentUserData.todayStudyTime.toFixed(1)}h</div>
              <div className="text-sm text-muted-foreground">Today's Time</div>
            </CardContent>
          </Card>
          <Card className="card-fun hover-lift">
            <CardContent className="p-4 md:p-6 text-center">
              <Target className="w-8 h-8 text-accent mx-auto mb-2" />
              <div className="text-2xl md:text-3xl font-bold text-foreground">{completionPercentage}%</div>
              <div className="text-sm text-muted-foreground">Progress</div>
            </CardContent>
          </Card>
          <Card className="card-fun hover-lift">
            <CardContent className="p-4 md:p-6 text-center">
              <Trophy className="w-8 h-8 text-success mx-auto mb-2" />
              <div className="text-2xl md:text-3xl font-bold text-foreground">{currentUserData.xpPoints}</div>
              <div className="text-sm text-muted-foreground">XP Points</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="card-fun">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Continue Learning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <Link to={action.link} key={index}>
                        <div className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/30 cursor-pointer hover-lift transition-all duration-200">
                          <div className={`w-12 h-12 rounded-xl ${action.bgColor} flex items-center justify-center`}>
                            <Icon className={`w-6 h-6 ${action.color}`} />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-foreground">{action.title}</div>
                            <div className="text-sm text-muted-foreground">{action.subtitle}</div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Study Session Button */}
                <div className="mt-6 pt-4 border-t border-border">
                  <Dialog open={isStudyModalOpen} onOpenChange={setIsStudyModalOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full" variant="outline">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        Schedule Study Session
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Schedule Your Study Session</DialogTitle>
                        <DialogDescription>
                          Set up daily study reminders to stay consistent with your learning goals.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-6">
                        <div className="space-y-6">
                          <div className="space-y-3">
                            <Label className="text-base font-semibold">Start Date</Label>
                            <div className="border rounded-lg p-3 bg-background">
                              <Calendar
                                mode="single"
                                selected={startDate}
                                onSelect={setStartDate}
                                disabled={(date) => date < new Date()}
                                className="w-full pointer-events-auto"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <Label className="text-base font-semibold">End Date</Label>
                            <div className="border rounded-lg p-3 bg-background">
                              <Calendar
                                mode="single"
                                selected={endDate}
                                onSelect={setEndDate}
                                disabled={(date) => !startDate || date < startDate}
                                className="w-full pointer-events-auto"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <Label>Daily Study Time</Label>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="start-time" className="text-sm text-muted-foreground">From</Label>
                              <Input
                                id="start-time"
                                type="time"
                                value={studyStartTime}
                                onChange={(e) => setStudyStartTime(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="end-time" className="text-sm text-muted-foreground">To</Label>
                              <Input
                                id="end-time"
                                type="time"
                                value={studyEndTime}
                                onChange={(e) => setStudyEndTime(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => setIsStudyModalOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            className="flex-1"
                            onClick={handleStudySessionSchedule}
                          >
                            Schedule Session
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <AttendanceSummary />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;