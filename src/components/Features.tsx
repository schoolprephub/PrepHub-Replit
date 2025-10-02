import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileText, GamepadIcon, PlayCircle, TrendingUp, Users } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Calendar,
      title: "Smart Attendance",
      description: "Track your study sessions with gamified attendance. Build streaks and earn rewards!",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: PlayCircle,
      title: "Video Library",
      description: "Access thousands of engaging video lessons from top educators across all IIT subjects.",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      icon: FileText,
      title: "Study Materials",
      description: "Download PDFs, notes, and practice papers organized by topic and difficulty level.",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: GamepadIcon,
      title: "Learning Games",
      description: "Master concepts through interactive games, puzzles, and brain-training challenges.",
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      icon: TrendingUp,
      title: "Progress Analytics",
      description: "Visualize your learning journey with detailed progress reports and performance insights.",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Users,
      title: "Study Groups",
      description: "Connect with fellow IIT aspirants, share notes, and study together online.",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Everything You Need to <span className="gradient-text">Crack IIT</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Our comprehensive platform combines the best of traditional studying with modern gamification 
            to make your IIT preparation journey engaging and effective.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className={`card-fun hover-lift group ${index % 2 === 0 ? 'animate-slide-up' : 'animate-slide-up'}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto rounded-2xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground text-center leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="card-gradient p-8 md:p-12 rounded-3xl">
            <h3 className="text-2xl md:text-3xl font-display font-bold mb-4 text-foreground">
              Ready to Transform Your IIT Prep?
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of successful students who've made their IIT dreams come true with our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-hero px-8 py-4 rounded-2xl font-semibold text-lg">
                Start Free Trial
              </button>
              <button className="btn-accent px-8 py-4 rounded-2xl font-semibold text-lg">
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;