import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, ArrowRight, Lock, Users, Search, Heart } from "lucide-react";

const HospitalLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      navigate("/hospital/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-cyan-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 py-6 relative z-10">
        <div className="w-full max-w-6xl flex gap-8 items-center">
          {/* Left Side - Information */}
          <div className="hidden lg:flex flex-1 flex-col space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Building2 className="h-12 w-12 text-teal-600" />
                <h1 className="text-4xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>Hospital Portal</h1>
              </div>
              <p className="text-2xl font-semibold text-gray-800" style={{ fontFamily: 'Georgia, serif' }}>
                Connect Patients with Donors
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Access Nepal's comprehensive stem cell donor database to find the perfect match for your patients in need.
              </p>
            </div>

            <div className="space-y-3 pt-3">
              <div className="flex items-start gap-3 p-3 bg-white/60 backdrop-blur rounded-lg">
                <Search className="h-6 w-6 text-teal-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">Advanced Matching</h3>
                  <p className="text-sm text-gray-600">Find compatible donors quickly and efficiently</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white/60 backdrop-blur rounded-lg">
                <Users className="h-6 w-6 text-teal-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">12,500+ Donors</h3>
                  <p className="text-sm text-gray-600">Access to Nepal's largest donor registry</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white/60 backdrop-blur rounded-lg">
                <Heart className="h-6 w-6 text-teal-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">Save Lives</h3>
                  <p className="text-sm text-gray-600">Help patients find their second chance</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full lg:w-auto lg:max-w-[380px]">
            <Card className="border-2 border-teal-100 shadow-2xl backdrop-blur-sm bg-white/95">
              <CardHeader className="space-y-2 text-center pb-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-teal-600 shadow-lg">
                  <Building2 className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>Hospital Access</CardTitle>
                <CardDescription className="text-base">
                  Sign in to search for matching donors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <form onSubmit={handleLogin} className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="hospitalId" className="text-sm font-semibold text-gray-700">Hospital ID</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input 
                        id="hospitalId" 
                        placeholder="Enter your hospital ID"
                        defaultValue="HOSP-KTM-001"
                        className="pl-10 h-10 border-gray-200 focus:border-teal-500 rounded-lg"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="Enter your password"
                        defaultValue="password123"
                        className="pl-10 h-10 border-gray-200 focus:border-teal-500 rounded-lg"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-10 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white gap-2 group shadow-lg rounded-lg font-semibold" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                    {!isLoading && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                  </Button>
                </form>

                <div className="text-center">
                  <Link to="/forgot-password" className="text-sm text-teal-600 hover:underline font-medium">
                    Forgot password?
                  </Link>
                </div>

                <div className="rounded-lg bg-teal-50 border border-teal-100 p-4 text-center">
                  <p className="text-sm text-gray-700">
                    Need hospital access?{" "}
                    <Link to="/contact" className="font-semibold text-teal-600 hover:underline">
                      Contact admin
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalLogin;