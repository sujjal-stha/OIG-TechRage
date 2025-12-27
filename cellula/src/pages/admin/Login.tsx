import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, ArrowRight, Lock, Database, BarChart3 } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      navigate("/admin/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 py-6 relative z-10">
        <div className="w-full max-w-6xl flex gap-8 items-center">
          {/* Left Side - Information */}
          <div className="hidden lg:flex flex-1 flex-col space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Shield className="h-12 w-12 text-primary" />
                <h1 className="text-4xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>Admin Portal</h1>
              </div>
              <p className="text-2xl font-semibold text-gray-800" style={{ fontFamily: 'Georgia, serif' }}>
                Manage Cellula Platform
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Secure administrative access to manage donors, hospitals, and oversee the entire stem cell donation ecosystem.
              </p>
            </div>

            <div className="space-y-3 pt-3">
              <div className="flex items-start gap-3 p-3 bg-white/60 backdrop-blur rounded-lg">
                <Database className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">Full Control</h3>
                  <p className="text-sm text-gray-600">Manage all donors and hospital partnerships</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white/60 backdrop-blur rounded-lg">
                <BarChart3 className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">Real-time Analytics</h3>
                  <p className="text-sm text-gray-600">Monitor platform metrics and performance</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white/60 backdrop-blur rounded-lg">
                <Shield className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">Secure Access</h3>
                  <p className="text-sm text-gray-600">All actions logged for accountability</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full lg:w-auto lg:max-w-[380px]">
            <Card className="border-2 border-primary/20 shadow-2xl backdrop-blur-sm bg-white/95">
              <CardHeader className="space-y-2 text-center pb-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/90 shadow-lg">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>Admin Portal</CardTitle>
                <CardDescription className="text-base">
                  Secure access for system administrators
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminId" className="text-sm font-semibold text-gray-700">Admin ID</Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input 
                        id="adminId" 
                        placeholder="Enter your admin ID"
                        defaultValue="ADMIN-001"
                        className="pl-10 h-12 border-gray-200 focus:border-blue-500 rounded-lg"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="Enter your password"
                        defaultValue="admin123"
                        className="pl-10 h-12 border-gray-200 focus:border-blue-500 rounded-lg"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-10 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white gap-2 group shadow-lg rounded-lg font-semibold" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                    {!isLoading && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                  </Button>
                </form>

                <div className="text-center">
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline font-medium">
                    Forgot password?
                  </Link>
                </div>

                <div className="rounded-lg bg-primary/5 border border-primary/10 p-4">
                  <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Admin access is restricted to authorized personnel only. All actions are logged for security purposes.
                    </p>
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;