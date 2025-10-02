import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  FileText, 
  GamepadIcon, 
  PlayCircle, 
  Search, 
  Star,
  Clock,
  Download,
  Users,
  CheckCircle,
  Lock,
  Filter,
  ArrowLeft
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { completeLessonWithRefresh, addStudyTimeWithRefresh } from "@/lib/storageUtils";

const Library = () => {
  const { user, userData, refreshUserData } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [activeTab, setActiveTab] = useState("videos");

  // Handle URL parameters for direct tab navigation
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tab = urlParams.get("tab");
    if (tab && ["videos", "materials", "quizzes", "games"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location]);

  const videos = [
    {
      id: 1,
      title: "Newton's Laws of Motion",
      subject: "Physics",
      duration: "45 min",
      rating: 4.8,
      views: 12500,
      difficulty: "Intermediate",
      thumbnail: "🎯",
      completed: userData?.subjects.physics.progress > 30,
      locked: false
    },
    {
      id: 2,
      title: "Organic Chemistry Basics",
      subject: "Chemistry", 
      duration: "60 min",
      rating: 4.9,
      views: 8900,
      difficulty: "Beginner",
      thumbnail: "🧪",
      completed: userData?.subjects.chemistry.progress > 25,
      locked: false
    },
    {
      id: 3,
      title: "Calculus Integration",
      subject: "Mathematics",
      duration: "35 min", 
      rating: 4.7,
      views: 15600,
      difficulty: "Advanced",
      thumbnail: "📐",
      completed: userData?.subjects.mathematics.progress > 40,
      locked: userData ? userData.completedLessons < 5 : false
    },
    {
      id: 4,
      title: "Electromagnetic Induction",
      subject: "Physics",
      duration: "50 min",
      rating: 4.6,
      views: 9200,
      difficulty: "Advanced",
      thumbnail: "⚡",
      completed: false,
      locked: userData ? userData.completedLessons < 10 : false
    }
  ];

  const materials = [
    {
      id: 1,
      title: "Complete Physics Formula Sheet",
      type: "PDF",
      size: "2.5 MB",
      downloads: 25600,
      subject: "Physics",
      pages: 45,
      downloaded: false
    },
    {
      id: 2,
      title: "JEE Main Previous Year Papers",
      type: "PDF Bundle", 
      size: "15.2 MB",
      downloads: 18900,
      subject: "All Subjects",
      pages: 240,
      downloaded: false
    },
    {
      id: 3,
      title: "Organic Reactions Cheat Sheet",
      type: "PDF",
      size: "1.8 MB", 
      downloads: 12300,
      subject: "Chemistry",
      pages: 12,
      downloaded: false
    }
  ];

  const games = [
    {
      id: 1,
      title: "Physics Lab Simulator",
      description: "Interactive experiments with virtual lab equipment",
      players: 1250,
      difficulty: "Medium",
      category: "Physics",
      icon: "⚗️",
      played: false
    },
    {
      id: 2,
      title: "Math Battle Arena", 
      description: "Compete with other students in fast-paced math challenges",
      players: 3400,
      difficulty: "Hard",
      category: "Mathematics", 
      icon: "⚔️",
      played: false
    },
    {
      id: 3,
      title: "Chemistry Quest",
      description: "Adventure game where you solve chemistry puzzles",
      players: 2100,
      difficulty: "Easy",
      category: "Chemistry",
      icon: "🗡️",
      played: false
    }
  ];

  const quizzes = [
    {
      id: 1,
      title: "Physics Fundamentals Quiz",
      subject: "Physics",
      questions: 20,
      duration: 30,
      difficulty: "Beginner",
      bestScore: 0,
      attempts: 0
    },
    {
      id: 2,
      title: "Organic Chemistry Reactions",
      subject: "Chemistry",
      questions: 15,
      duration: 25,
      difficulty: "Intermediate",
      bestScore: 0,
      attempts: 0
    },
    {
      id: 3,
      title: "Calculus Problem Solving",
      subject: "Mathematics",
      questions: 25,
      duration: 45,
      difficulty: "Advanced",
      bestScore: 0,
      attempts: 0
    }
  ];

  const handleWatchVideo = async (video: any) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to watch videos",
        variant: "destructive",
      });
      return;
    }

    if (video.locked) {
      toast({
        title: "Video Locked 🔒",
        description: `Complete ${video.id === 3 ? '5' : '10'} more lessons to unlock this video`,
        variant: "destructive",
      });
      return;
    }

    // Simulate watching video
    toast({
      title: "Starting Video! 🎬",
      description: `Now playing: ${video.title}`,
    });

    // Add study time and complete lesson after "watching"
    setTimeout(() => {
      if (userData) {
        addStudyTimeWithRefresh(userData.id, 45); // Add 45 minutes
        completeLessonWithRefresh(userData.id, video.subject.toLowerCase(), 30);
        
        toast({
          title: "Great Job! 🎉",
          description: "You completed the video and earned 30 XP!",
        });
      }
    }, 3000);
  };

  const handleDownloadPDF = (material: any) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to download materials",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Download Started! 📥",
      description: `Downloading ${material.title}...`,
    });

    // Simulate download
    setTimeout(() => {
      toast({
        title: "Download Complete! ✅",
        description: "Material saved to your downloads",
      });
    }, 2000);
  };

  const handlePlayGame = (game: any) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to play games",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Loading Game! 🎮",
      description: `Starting ${game.title}...`,
    });
  };

  const handleTakeQuiz = (quiz: any) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to take quizzes",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Quiz Starting! 📝",
      description: `Get ready for ${quiz.title}`,
    });
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === "all" || video.subject.toLowerCase() === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === "all" || 
                          material.subject.toLowerCase() === selectedSubject ||
                          material.subject.toLowerCase().includes("all");
    return matchesSearch && matchesSubject;
  });

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quiz.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === "all" || quiz.subject.toLowerCase() === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         game.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === "all" || game.category.toLowerCase() === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="min-h-screen bg-background pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Learning <span className="gradient-text">Library</span> 📚
          </h1>
          <p className="text-muted-foreground text-lg mb-6">
            Access thousands of videos, study materials, quizzes, and interactive games to master every IIT topic.
          </p>
          
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Search videos, PDFs, games..." 
                className="pl-10 rounded-xl border-2 focus:border-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <select 
                className="rounded-xl border-2 border-input bg-background px-3 py-2 text-sm focus:border-primary"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="all">All Subjects</option>
                <option value="physics">Physics</option>
                <option value="chemistry">Chemistry</option>
                <option value="mathematics">Mathematics</option>
              </select>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 max-w-md bg-muted rounded-xl p-1">
            <TabsTrigger value="videos" className="rounded-lg flex items-center gap-2">
              <PlayCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Videos</span>
            </TabsTrigger>
            <TabsTrigger value="materials" className="rounded-lg flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">PDFs</span>
            </TabsTrigger>
            <TabsTrigger value="quizzes" className="rounded-lg flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Quizzes</span>
            </TabsTrigger>
            <TabsTrigger value="games" className="rounded-lg flex items-center gap-2">
              <GamepadIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Games</span>
            </TabsTrigger>
          </TabsList>

          {/* Videos Tab */}
          <TabsContent value="videos" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <Card key={video.id} className="card-fun hover-lift group overflow-hidden relative">
                  {video.locked && (
                    <div className="absolute top-2 right-2 z-10">
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                  {video.completed && (
                    <div className="absolute top-2 left-2 z-10">
                      <CheckCircle className="w-5 h-5 text-success" />
                    </div>
                  )}
                  <div className={`aspect-video flex items-center justify-center text-4xl group-hover:scale-105 transition-transform duration-300 ${video.locked ? 'bg-muted/50' : 'bg-gradient-to-br from-primary/20 to-accent/20'}`}>
                    {video.thumbnail}
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg leading-tight">{video.title}</CardTitle>
                      <Badge variant="secondary" className="shrink-0">{video.subject}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {video.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-current text-yellow-500" />
                        {video.rating}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {video.views.toLocaleString()}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant={video.difficulty === 'Beginner' ? 'default' : video.difficulty === 'Intermediate' ? 'secondary' : 'destructive'}
                        className="text-xs"
                      >
                        {video.difficulty}
                      </Badge>
                      <Button 
                        className={video.locked ? "btn-accent opacity-50" : "btn-hero"}
                        onClick={() => handleWatchVideo(video)}
                        disabled={video.locked}
                      >
                        <PlayCircle className="w-4 h-4 mr-2" />
                        {video.completed ? "Rewatch" : "Watch"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Materials Tab */}
          <TabsContent value="materials" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMaterials.map((material) => (
                <Card key={material.id} className="card-fun hover-lift">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center mb-3">
                        <FileText className="w-6 h-6 text-secondary" />
                      </div>
                      <Badge variant="outline">{material.subject}</Badge>
                    </div>
                    <CardTitle className="text-lg">{material.title}</CardTitle>
                    <CardDescription className="space-y-1">
                      <div>{material.type} • {material.size}</div>
                      <div>{material.pages} pages • {material.downloads.toLocaleString()} downloads</div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full btn-secondary"
                      onClick={() => handleDownloadPDF(material)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Quizzes Tab */}
          <TabsContent value="quizzes" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuizzes.map((quiz) => (
                <Card key={quiz.id} className="card-fun hover-lift">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mb-3">
                        <BookOpen className="w-6 h-6 text-accent" />
                      </div>
                      <Badge variant="outline">{quiz.subject}</Badge>
                    </div>
                    <CardTitle className="text-lg">{quiz.title}</CardTitle>
                    <CardDescription className="space-y-2">
                      <div className="flex justify-between">
                        <span>{quiz.questions} questions</span>
                        <span>{quiz.duration} min</span>
                      </div>
                      {quiz.attempts > 0 && (
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Best Score:</span>
                            <span className="font-semibold">{quiz.bestScore}%</span>
                          </div>
                          <Progress value={quiz.bestScore} className="mt-1" />
                        </div>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Badge 
                      variant={quiz.difficulty === 'Beginner' ? 'default' : quiz.difficulty === 'Intermediate' ? 'secondary' : 'destructive'}
                      className="text-xs"
                    >
                      {quiz.difficulty}
                    </Badge>
                    <Button 
                      className="w-full btn-accent"
                      onClick={() => handleTakeQuiz(quiz)}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      {quiz.attempts > 0 ? "Retake Quiz" : "Start Quiz"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Games Tab */}
          <TabsContent value="games" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGames.map((game) => (
                <Card key={game.id} className="card-fun hover-lift">
                  <CardHeader>
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-3">{game.icon}</div>
                      <CardTitle className="text-lg">{game.title}</CardTitle>
                      <CardDescription>{game.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        {game.players} playing
                      </div>
                      <Badge variant="outline">{game.difficulty}</Badge>
                    </div>
                    <Button 
                      className="w-full btn-accent"
                      onClick={() => handlePlayGame(game)}
                    >
                      <GamepadIcon className="w-4 h-4 mr-2" />
                      {game.played ? "Play Again" : "Play Now"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Library;