import { Button } from "@/components/ui/button";
import { BookOpen, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, userData, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="font-display font-bold text-xl gradient-text">
              IIT Prep Hub
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors font-medium">
              Home
            </Link>
            {user && (
              <>
                <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors font-medium">
                  Dashboard
                </Link>
                <Link to="/library" className="text-foreground hover:text-primary transition-colors font-medium">
                  Library
                </Link>
              </>
            )}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">
                  Welcome, {userData?.name}!
                </span>
                <Button variant="ghost" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-foreground hover:text-primary">
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b border-border shadow-lg">
            <div className="px-4 py-6 space-y-4">
              <Link 
                to="/" 
                className="block text-foreground hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              {user && (
                <>
                  <Link 
                    to="/dashboard" 
                    className="block text-foreground hover:text-primary transition-colors font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/library" 
                    className="block text-foreground hover:text-primary transition-colors font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Library
                  </Link>
                </>
              )}
              <div className="pt-4 space-y-2">
                {user ? (
                  <>
                    <div className="text-sm text-muted-foreground py-2">
                      Logged in as {userData?.name}
                    </div>
                    <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        Login
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;