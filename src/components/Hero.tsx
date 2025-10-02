import { Button } from "@/components/ui/button";
import { BookOpen, Target, Trophy, Users } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-illustration.jpg";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-secondary/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Content */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight">
              <span className="gradient-text">IIT Prep Hub</span>
              <br />
              <span className="text-foreground">Made Fun & Simple!</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              Join thousands of students preparing for IIT with our interactive platform. 
              Study with games, track progress, and achieve your engineering dreams! 🚀
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link to="/dashboard">
              <Button size="lg" className="btn-hero text-lg px-8 py-6 rounded-2xl font-semibold">
                Start Learning Now
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-2xl border-2 hover:border-primary hover:text-primary transition-colors">
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">10K+</div>
              <div className="text-sm text-muted-foreground">Students</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <BookOpen className="w-8 h-8 text-secondary" />
              </div>
              <div className="text-2xl font-bold text-foreground">500+</div>
              <div className="text-sm text-muted-foreground">Lessons</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Target className="w-8 h-8 text-accent" />
              </div>
              <div className="text-2xl font-bold text-foreground">95%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Trophy className="w-8 h-8 text-success" />
              </div>
              <div className="text-2xl font-bold text-foreground">1000+</div>
              <div className="text-sm text-muted-foreground">IIT Qualifiers</div>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative">
          <div className="relative card-fun p-4 bg-gradient-to-br from-primary/5 to-accent/5">
            <img 
              src={heroImage} 
              alt="Students preparing for IIT with fun learning methods"
              className="w-full h-auto rounded-xl shadow-lg"
            />
          </div>
          {/* Floating elements */}
          <div className="absolute -top-4 -right-4 bg-secondary text-white px-4 py-2 rounded-full font-semibold animate-bounce-in shadow-secondary">
            ✨ Fun Learning
          </div>
          <div className="absolute -bottom-4 -left-4 bg-success text-white px-4 py-2 rounded-full font-semibold animate-bounce-in delay-300 shadow-accent">
            🎯 Track Progress
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;