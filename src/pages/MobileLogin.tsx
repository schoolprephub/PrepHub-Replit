import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Loader2, Eye, EyeOff, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const MobileLogin = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const { toast } = useToast();

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mobileNumber || !password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (!/^\d+$/.test(mobileNumber)) {
      toast({
        title: "Invalid Mobile Number",
        description: "Mobile number should contain only digits",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Check folder_users table for mobile login
      const { data, error } = await supabase
        .from('folder_users')
        .select('*')
        .eq('mobile_number', mobileNumber.trim())
        .single();

      if (error || !data) {
        toast({
          title: "Login Failed",
          description: "Invalid mobile number or password",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Simple password check with matching hash method  
      if (data.password_hash !== btoa(password)) {
        toast({
          title: "Login Failed", 
          description: "Invalid mobile number or password",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Store user session
      localStorage.setItem('folder_user_session', JSON.stringify({
        id: data.id,
        full_name: data.full_name,
        school_name: data.school_name,
        mobile_number: data.mobile_number,
        class: data.class,
        age: data.age,
        subfolder_id: data.subfolder_id,
      }));

      setUser(data);

      toast({
        title: "Welcome! 🎉",
        description: `Successfully logged in as ${data.full_name}`,
      });
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
              <Smartphone className="w-7 h-7 text-white" />
            </div>
            <div className="font-display font-bold text-2xl gradient-text">
              Student Portal
            </div>
          </Link>
        </div>

        <Card className="card-fun">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Student Login 📱</CardTitle>
            <CardDescription>
              Sign in with your mobile number and password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="rounded-xl border-2 focus:border-green-500"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-xl border-2 focus:border-green-500 pr-10"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 rounded-xl py-6 text-lg font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Need an account created?{" "}
                <span className="text-green-600 font-semibold">
                  Contact your administrator
                </span>
              </p>
            </div>

            <div className="mt-4 text-center">
              <p className="text-muted-foreground text-sm">
                Use email instead?{" "}
                <Link
                  to="/login"
                  className="text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  Email Login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-muted-foreground hover:text-primary transition-colors text-sm"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileLogin;