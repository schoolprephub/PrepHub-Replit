import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <Hero />
        <Features />
      </main>
      
      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="font-display font-bold text-xl gradient-text">
                IIT Prep Hub
              </div>
              <p className="text-muted-foreground text-sm">
                Making IIT preparation fun, interactive, and effective for students across India.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Video Library</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Study Materials</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Practice Tests</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Learning Games</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Study Groups</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Connect</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">YouTube</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Telegram</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-12 pt-8">
            <div className="flex justify-between items-center">
              <p className="text-center text-sm text-muted-foreground">
                &copy; 2024 IIT Prep Hub. Made with ❤️ for future engineers.
              </p>
              <Link 
                to="/admin/login" 
                className="text-xs text-muted-foreground hover:text-red-600 transition-colors"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;