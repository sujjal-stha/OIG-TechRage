import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Droplet, Mail, Lock, ArrowRight, Heart, Users, CheckCircle } from "lucide-react";

const Login = () => {
  return (
    <div className="min-h-screen flex relative overflow-hidden bg-gradient-to-br from-red-50 via-white to-rose-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-rose-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 py-6 relative z-10">
        <div className="w-full max-w-6xl flex gap-8 items-center">
          {/* Left Side - Information */}
          <div className="hidden lg:flex flex-1 flex-col space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Droplet className="h-12 w-12 text-red-600 fill-red-600" />
                <h1 className="text-4xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>Cellula</h1>
              </div>
              <p className="text-2xl font-semibold text-gray-800" style={{ fontFamily: 'Georgia, serif' }}>
                Save Lives, One Donation at a Time
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Join thousands of heroes in Nepal who are making a difference. Your stem cells could be someone's second chance at life.
              </p>
            </div>

            <div className="space-y-3 pt-3">
              <div className="flex items-start gap-3 p-3 bg-white/60 backdrop-blur rounded-lg">
                <Heart className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">Make an Impact</h3>
                  <p className="text-sm text-gray-600">Your donation can save multiple lives</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white/60 backdrop-blur rounded-lg">
                <Users className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">Join Community</h3>
                  <p className="text-sm text-gray-600">Be part of 12,500+ registered donors</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white/60 backdrop-blur rounded-lg">
                <CheckCircle className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">Safe & Secure</h3>
                  <p className="text-sm text-gray-600">Complete privacy and confidentiality</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full lg:w-auto lg:max-w-[380px]">
            <Card className="border-2 border-red-100 shadow-2xl backdrop-blur-sm bg-white/95">
              <CardHeader className="space-y-2 text-center pb-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-lg">
                  <Droplet className="h-8 w-8 text-white fill-white" />
                </div>
                <CardTitle className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>Welcome Back</CardTitle>
                <CardDescription className="text-base">
                  Sign in to continue your journey as a donor
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="donor@example.com"
                        className="pl-10 h-12 border-gray-200 focus:border-red-500 rounded-lg"
                        required
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
                        placeholder="••••••••"
                        className="pl-10 h-12 border-gray-200 focus:border-red-500 rounded-lg"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
                      <span className="text-gray-600">Remember me</span>
                    </label>
                    <Link to="/forgot-password" className="text-red-600 hover:text-red-700 font-medium hover:underline">
                      Forgot password?
                    </Link>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-10 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white gap-2 group shadow-lg rounded-lg font-semibold"
                    asChild
                  >
                    <Link to="/donor/dashboard">
                      Sign In
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-3 text-gray-500 font-medium">New to Cellula?</span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full h-10 border-2 border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-semibold"
                  asChild
                >
                  <Link to="/register">
                    Create Donor Account
                  </Link>
                </Button>

                <div className="text-center space-y-1">
                  <p className="text-sm text-gray-500 font-medium">
                    Looking for something else?
                  </p>
                  <div className="flex gap-4 justify-center text-sm">
                    <Link to="/hospital/login" className="text-red-600 hover:underline font-medium">
                      Hospital Login
                    </Link>
                    <span className="text-gray-300">•</span>
                    <Link to="/admin/login" className="text-red-600 hover:underline font-medium">
                      Admin Login
                    </Link>
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

export default Login;
