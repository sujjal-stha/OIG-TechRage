import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ArrowRight, Heart, Users, CheckCircle, QrCode, X, Upload } from "lucide-react";
import QrScanner from 'react-qr-scanner';
import jsQR from 'jsqr';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showScanner, setShowScanner] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get stored credentials
    const storedEmail = localStorage.getItem('donorEmail');
    const storedPassword = localStorage.getItem('donorPassword');

    // Validate credentials
    if (email === storedEmail && password === storedPassword) {
      // Set session
      sessionStorage.setItem('donorLoggedIn', 'true');
      localStorage.removeItem('isNewRegistration'); // Clear new registration flag on login
      navigate("/donor/dashboard");
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };

  const handleScan = (data: any) => {
    if (data) {
      try {
        const qrData = JSON.parse(data.text);
        if (qrData.email && qrData.password) {
          // Get stored credentials
          const storedEmail = localStorage.getItem('donorEmail');
          const storedPassword = localStorage.getItem('donorPassword');

          // Validate credentials from QR code
          if (qrData.email === storedEmail && qrData.password === storedPassword) {
            // Set session and navigate
            sessionStorage.setItem('donorLoggedIn', 'true');
            localStorage.removeItem('isNewRegistration');
            setShowScanner(false);
            navigate("/donor/dashboard");
          } else {
            setError("Invalid credentials in QR code. Please try again.");
          }
        } else {
          setError("Invalid QR code format. Please scan a valid donor QR code.");
        }
      } catch (err) {
        setError("Failed to read QR code. Please try again.");
      }
    }
  };

  const handleScanError = (err: any) => {
    console.error(err);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          try {
            const qrData = JSON.parse(code.data);
            if (qrData.email && qrData.password) {
              // Get stored credentials
              const storedEmail = localStorage.getItem('donorEmail');
              const storedPassword = localStorage.getItem('donorPassword');

              // Validate credentials from QR code
              if (qrData.email === storedEmail && qrData.password === storedPassword) {
                // Set session and navigate
                sessionStorage.setItem('donorLoggedIn', 'true');
                localStorage.removeItem('isNewRegistration');
                setShowScanner(false);
                navigate("/donor/dashboard");
              } else {
                setError("Invalid credentials in QR code. Please try again.");
              }
            } else {
              setError("Invalid QR code format. Please use a valid donor QR code.");
            }
          } catch (err) {
            setError("Failed to read QR code. Please try again.");
          }
        } else {
          setError("No QR code found in the image. Please try another image.");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

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
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Cellula" className="h-24 w-24" />
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
              <CardHeader className="space-y-1 text-center pb-4">
                <div className="mx-auto flex items-center justify-center">
                  <img src="/logo.png" alt="Cellula" className="h-28 w-28 object-contain" />
                </div>
                <CardTitle className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>Welcome Back</CardTitle>
                <CardDescription className="text-base">
                  Sign in to continue your journey as a donor
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="donor@example.com"
                        className="pl-10 h-12 border-gray-200 focus:border-red-500 rounded-lg"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                  >
                    Sign In
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-3 text-gray-500 font-medium">Or</span>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={() => setShowScanner(true)}
                  variant="outline"
                  className="w-full h-10 border-2 border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg font-semibold gap-2"
                >
                  <QrCode className="h-5 w-5" />
                  Sign In with QR Code
                </Button>

                {/* QR Scanner Modal */}
                {showScanner && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
                      <Button
                        onClick={() => setShowScanner(false)}
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 hover:bg-gray-100"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                      
                      <div className="text-center mb-4">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <QrCode className="h-6 w-6 text-blue-600" />
                          <h3 className="text-xl font-bold">Scan QR Code</h3>
                        </div>
                        <p className="text-sm text-gray-600">
                          Position your QR code in front of the camera or upload an image
                        </p>
                      </div>

                      <div className="relative rounded-lg overflow-hidden border-4 border-blue-200">
                        <QrScanner
                          delay={300}
                          onError={handleScanError}
                          onScan={handleScan}
                          style={{ width: '100%' }}
                          constraints={{
                            video: { facingMode: 'environment' }
                          }}
                        />
                      </div>

                      <div className="mt-4">
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-200" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-500">Or</span>
                          </div>
                        </div>

                        <label className="mt-3 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                          <Upload className="h-5 w-5 text-blue-600" />
                          <span className="text-sm font-medium text-blue-600">Upload QR Code Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <p className="text-xs text-center text-gray-500 mt-4">
                        Your donor QR code contains your login credentials
                      </p>
                    </div>
                  </div>
                )}

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
