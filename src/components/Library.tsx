import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  FileText, 
  GamepadIcon, 
  PlayCircle, 
  Search, 
  Star,
  Clock,
  Download,
  Users
} from "lucide-react";

const Library = () => {
  const videos = [
    {
      title: "Newton's Laws of Motion",
      subject: "Physics",
      duration: "45 min",
      rating: 4.8,
      views: 12500,
      difficulty: "Intermediate",
      thumbnail: "🎯"
    },
    {
      title: "Organic Chemistry Basics",
      subject: "Chemistry", 
      duration: "60 min",
      rating: 4.9,
      views: 8900,
      difficulty: "Beginner",
      thumbnail: "🧪"
    },
    {
      title: "Calculus Integration",
      subject: "Mathematics",
      duration: "35 min", 
      rating: 4.7,
      views: 15600,
      difficulty: "Advanced",
      thumbnail: "📐"
    }
  ];

  const materials = [
    {
      title: "Complete Physics Formula Sheet",
      type: "PDF",
      size: "2.5 MB",
      downloads: 25600,
      subject: "Physics",
      pages: 45
    },
    {
      title: "JEE Main Previous Year Papers",
      type: "PDF Bundle", 
      size: "15.2 MB",
      downloads: 18900,
      subject: "All Subjects",
      pages: 240
    },
    {
      title: "Organic Reactions Cheat Sheet",
      type: "PDF",
      size: "1.8 MB", 
      downloads: 12300,
      subject: "Chemistry",
      pages: 12
    }
  ];

  const games = [
    {
      title: "Physics Lab Simulator",
      description: "Interactive experiments with virtual lab equipment",
      players: 1250,
      difficulty: "Medium",
      category: "Physics",
      icon: "⚗️"
    },
    {
      title: "Math Battle Arena", 
      description: "Compete with other students in fast-paced math challenges",
      players: 3400,
      difficulty: "Hard",
      category: "Mathematics", 
      icon: "⚔️"
    },
    {
      title: "Chemistry Quest",
      description: "Adventure game where you solve chemistry puzzles",
      players: 2100,
      difficulty: "Easy",
      category: "Chemistry",
      icon: "🗡️"
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Learning <span className="gradient-text">Library</span> 📚
          </h1>
          <p className="text-muted-foreground text-lg mb-6">
            Access thousands of videos, study materials, quizzes, and interactive games to master every IIT topic.
          </p>
          
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search videos, PDFs, games..." 
              className="pl-10 rounded-xl border-2 focus:border-primary"
            />
          </div>
        </div>

        <Tabs defaultValue="videos" className="space-y-8">
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
              {videos.map((video, index) => (
                <Card key={index} className="card-fun hover-lift group overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-4xl group-hover:scale-105 transition-transform duration-300">
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
                      <Button className="btn-hero">
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Watch
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
              {materials.map((material, index) => (
                <Card key={index} className="card-fun hover-lift">
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
                    <Button className="w-full btn-secondary">
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
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Interactive Quizzes Coming Soon!</h3>
              <p className="text-muted-foreground mb-6">
                We're building amazing interactive quizzes with instant feedback and detailed explanations.
              </p>
              <Button className="btn-accent">
                Get Notified When Ready
              </Button>
            </div>
          </TabsContent>

          {/* Games Tab */}
          <TabsContent value="games" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game, index) => (
                <Card key={index} className="card-fun hover-lift">
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
                    <Button className="w-full btn-accent">
                      <GamepadIcon className="w-4 h-4 mr-2" />
                      Play Now
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