import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Loader2, Eye, EyeOff } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { adminUser, login } = useAdmin();
  const { toast } = useToast();

  // Redirect if already logged in as admin
  if (adminUser) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    
    if (result.success) {
      toast({
        title: "Admin Login Successful",
        description: "Welcome to the admin dashboard",
      });
    } else {
      toast({
        title: "Login Failed",
        description: result.error || "Invalid credentials",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div className="font-display font-bold text-2xl">
              Admin Portal
            </div>
          </div>
        </div>

        <Card className="border-2 border-red-200 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-red-800">Admin Login</CardTitle>
            <CardDescription>
              Access the administrative dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-2 focus:border-red-500"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-2 focus:border-red-500 pr-10"
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
                className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Admin Login"
                )}
              </Button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-red-50 rounded-xl border border-red-200">
              <p className="text-sm text-red-800 text-center mb-2">
                <strong>Demo Credentials:</strong>
              </p>
              <p className="text-xs text-red-600 text-center">
                Email: admin@example.com | Password: admin123
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-muted-foreground hover:text-primary transition-colors text-sm"
          >
            ← Back to Main Site
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;