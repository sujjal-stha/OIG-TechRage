import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { QRCodeCanvas } from "qrcode.react";
import { 
  User, 

  CheckCircle2,
  Clock,
  Truck,
  Calendar,
  AlertCircle,
  HelpCircle,
  Settings,
  LogOut,
  Download,
  QrCode,
  FileText,
  Activity,
  UserCheck,
  XCircle
} from "lucide-react";

const DonorDashboard = () => {
  const navigate = useNavigate();
  const qrRef = useRef<HTMLDivElement>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [donorData, setDonorData] = useState({
    id: "CL-2024-12587",
    firstName: "Ram",
    lastName: "Sharma",
    bloodType: "O+",
    registrationDate: "December 15, 2024",
    status: "Sample Pending",
    sampleStatus: "pending",
    medicalReport: null as any,
    sampleMethod: "Courier Pickup",
    scheduledDate: "December 28, 2024",
    scheduledTime: "Morning (9 AM - 12 PM)",
    email: "",
    phone: "",
    password: "",
    province: "",
    district: "",
    municipality: "",
    street: "",
    rejectionReason: ""
  });

  useEffect(() => {
    // Check if this is a new registration
    const newRegistration = localStorage.getItem('isNewRegistration');
    if (newRegistration === 'true') {
      setIsNewUser(true);
      // Clear the flag after showing welcome message
      setTimeout(() => {
        localStorage.removeItem('isNewRegistration');
        setIsNewUser(false);
      }, 5000); // Clear after 5 seconds
    }

    // Load donor data from allDonors array
    const donorDataKey = localStorage.getItem('donorData');
    if (donorDataKey) {
      const donorId = JSON.parse(donorDataKey).id;
      const allDonors = JSON.parse(localStorage.getItem('allDonors') || '[]');
      const donor = allDonors.find((d: any) => d.id === donorId);
      if (donor) {
        setDonorData({
          id: donor.id,
          firstName: donor.firstName,
          lastName: donor.lastName,
          bloodType: donor.bloodType,
          registrationDate: donor.registrationDate,
          status: donor.status,
          sampleStatus: donor.sampleStatus,
          medicalReport: donor.medicalReport,
          sampleMethod: donor.sampleMethod,
          scheduledDate: donor.scheduledDate,
          scheduledTime: donor.scheduledTime,
          email: donor.email,
          phone: donor.phone,
          password: donor.password || "",
          province: donor.province,
          district: donor.district,
          municipality: donor.municipality,
          street: donor.street,
          rejectionReason: donor.rejectionReason || ""
        });
      }
    } else {
      // Fallback to old storage method
      const storedData = localStorage.getItem('donorData');
      const storedPassword = localStorage.getItem('donorPassword');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setDonorData({
          id: parsedData.id,
          firstName: parsedData.firstName,
          lastName: parsedData.lastName,
          bloodType: parsedData.bloodType,
          registrationDate: parsedData.registrationDate,
          status: parsedData.status,
          sampleStatus: parsedData.sampleStatus || "pending",
          medicalReport: parsedData.medicalReport || null,
          sampleMethod: parsedData.sampleMethod,
          scheduledDate: parsedData.scheduledDate,
          scheduledTime: parsedData.scheduledTime,
          email: parsedData.email,
          phone: parsedData.phone,
          password: storedPassword || parsedData.password || "",
          province: parsedData.province,
          district: parsedData.district,
          municipality: parsedData.municipality,
          street: parsedData.street,
          rejectionReason: parsedData.rejectionReason || ""
        });
      }
    }
  }, []);

  // Poll for updates every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const donorDataKey = localStorage.getItem('donorData');
      if (donorDataKey) {
        const donorId = JSON.parse(donorDataKey).id;
        const allDonors = JSON.parse(localStorage.getItem('allDonors') || '[]');
        const donor = allDonors.find((d: any) => d.id === donorId);
        if (donor) {
          setDonorData({
            id: donor.id,
            firstName: donor.firstName,
            lastName: donor.lastName,
            bloodType: donor.bloodType,
            registrationDate: donor.registrationDate,
            status: donor.status,
            sampleStatus: donor.sampleStatus,
            medicalReport: donor.medicalReport,
            sampleMethod: donor.sampleMethod,
            scheduledDate: donor.scheduledDate,
            scheduledTime: donor.scheduledTime,
            email: donor.email,
            phone: donor.phone,
            password: donor.password || "",
            province: donor.province,
            district: donor.district,
            municipality: donor.municipality,
            street: donor.street,
            rejectionReason: donor.rejectionReason || ""
          });
        }
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Handle header visibility on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.removeItem('donorSession');
    navigate("/donor/login");
  };

  const downloadQRCode = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `${donorData.id}-qrcode.png`;
      link.click();
    }
  };

  // Prepare QR code data
  const qrData = JSON.stringify({
    id: donorData.id,
    name: `${donorData.firstName} ${donorData.lastName}`,
    email: donorData.email,
    password: donorData.password,
    bloodType: donorData.bloodType,
    phone: donorData.phone,
    registrationDate: donorData.registrationDate
  });

  // Dynamic journey steps based on actual donor data
  const statusSteps = [
    { 
      id: 1, 
      label: "Registered", 
      completed: true, 
      current: false 
    },
    { 
      id: 2, 
      label: "Sample Collection", 
      completed: donorData.sampleStatus === "completed",
      current: donorData.sampleStatus === "collected" || donorData.sampleStatus === "processing" || donorData.sampleStatus === "pending"
    },
    { 
      id: 3, 
      label: "Medical Report", 
      completed: donorData.status === "report_submitted" || donorData.status === "approved",
      current: donorData.sampleStatus === "completed" && donorData.status !== "report_submitted" && donorData.status !== "approved"
    },
    { 
      id: 4, 
      label: "Admin Approval", 
      completed: donorData.status === "approved",
      current: donorData.status === "report_submitted"
    },
    { 
      id: 5, 
      label: "Matching", 
      completed: false,
      current: donorData.status === "approved"
    },
  ];

  const isRejected = donorData.status === "rejected";

  const faqs = [
    {
      question: "What happens after I submit my sample?",
      answer: "Once we receive your sample, it will be processed and typed in our laboratory. This typically takes 2-4 weeks. You'll be notified when you become an active donor in our registry.",
    },
    {
      question: "How long will my sample remain in the registry?",
      answer: "Your sample will remain in our registry until you turn 60 or choose to be removed. You can update your status or remove yourself at any time through your dashboard.",
    },
    {
      question: "What if I'm matched with a patient?",
      answer: "If you're a potential match, we'll contact you immediately. You'll undergo further testing, and if confirmed as a match, our team will guide you through the donation process.",
    },
    {
      question: "Is stem cell donation painful?",
      answer: "Most donors report the process as relatively comfortable. The most common method (PBSC) involves blood collection similar to donating blood platelets. Some donors experience mild flu-like symptoms for a few days.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      {/* Conditional Header - Hides on scroll */}
      {showHeader && (
        <div className="transition-all duration-300 ease-in-out border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center gap-2">
            <img src="/logo.png" alt="Cellula" className="h-12 w-12" />
            <span className="text-2xl font-bold text-foreground tracking-tight" style={{ fontFamily: '"Lucida Calligraphy", cursive' }}>Cellula</span>
            <div className="hidden lg:flex items-center text-xs text-muted-foreground border-l border-r border-border px-4 whitespace-nowrap">
              In collaboration with NSCRC and NRS
            </div>
          </div>
        </div>
      )}
      
      <main className="flex-1 py-8">
        <div className="container max-w-5xl px-4">
          <div className="mb-8">
            <Card className="border border-border shadow-lg bg-background overflow-hidden relative max-w-3xl mx-auto">
              {/* Decorative background pattern */}
              <div className="absolute top-0 right-0 w-64 h-64 opacity-5">
                <User className="w-full h-full text-red-600" />
              </div>
              
              <CardContent className="py-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="relative">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 via-red-600 to-rose-600 shadow-2xl transform hover:scale-105 transition-transform">
                        <User className="h-8 w-8 text-white" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 border-4 border-white rounded-full" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'Georgia, serif' }}>
                          Welcome!!
                        </h1>
                      </div>
                      <p className="text-xl font-semibold text-red-700 mb-2">
                        {donorData.firstName} {donorData.lastName}
                      </p>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="font-semibold px-3 py-1">
                          <span className="text-xs mr-1">ID:</span> {donorData.id}
                        </Badge>
                        <Badge variant="outline" className="font-semibold px-3 py-1">
                          <span className="text-xs mr-1">Blood Type:</span> {donorData.bloodType}
                        </Badge>
                        <div className="flex items-center gap-1.5 text-sm text-gray-700 bg-white/60 px-3 py-1.5 rounded-full border border-gray-200">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-11 w-11 rounded-xl hover:bg-muted"
                    >
                      <Settings className="h-5 w-5" />
                    </Button>
                    <Button 
                      type="button"
                      onClick={handleLogout}
                      className="gap-2 bg-primary text-primary-foreground shadow hover:opacity-90 transition-all px-6 h-11 rounded-xl font-semibold"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column */}
            <div className="space-y-6 lg:col-span-2">
              {/* Status Tracker Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <img src="/logo.png" alt="Cellula" className="h-12 w-12" />
                    Your Donor Journey
                  </CardTitle>
                  <CardDescription>Track your progress to becoming an active donor</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Rejection Notification */}
                  {donorData.status === "rejected" && (
                    <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-red-900">Application Rejected</h4>
                          <p className="mt-1 text-sm text-red-800">
                            {donorData.rejectionReason || "Your application has been rejected based on medical assessment."}
                          </p>
                          <p className="mt-2 text-xs text-red-700">
                            If you have questions, please contact our support team.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      {statusSteps.map((step, index) => (
                        <div key={step.id} className="flex items-center flex-grow min-w-0">
                          <div className="flex flex-col items-center flex-shrink-0">
                            {(() => {
                              const isRejectedStep = isRejected && step.label === "Medical Report";
                              const circleClass = isRejectedStep
                                ? "border-red-500 bg-red-100 text-red-600"
                                : step.completed
                                ? "border-green-500 bg-green-500 text-white"
                                : step.current
                                ? "border-blue-500 bg-blue-100 text-blue-600 animate-pulse"
                                : "border-gray-300 bg-gray-100 text-gray-400";
                              const connectorClass = step.completed
                                ? "bg-green-500"
                                : isRejectedStep
                                ? "bg-red-300"
                                : "bg-gray-300";
                              return (
                                <>
                                  <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 flex-shrink-0 ${circleClass}`}
                                  >
                                    {isRejectedStep ? (
                                      <XCircle className="h-5 w-5" />
                                    ) : step.completed ? (
                                      <CheckCircle2 className="h-5 w-5" />
                                    ) : step.current ? (
                                      <Clock className="h-5 w-5" />
                                    ) : (
                                      <span className="text-sm font-medium">{step.id}</span>
                                    )}
                                  </div>
                                  <span
                                    className={`mt-2 text-xs font-medium text-center leading-tight ${
                                      isRejectedStep
                                        ? "text-red-600"
                                        : step.completed
                                        ? "text-green-600"
                                        : step.current
                                        ? "text-blue-600"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {step.label}
                                  </span>
                                  {index < statusSteps.length - 1 && (
                                    <div className={`h-0.5 flex-grow mx-1 min-w-2 ${connectorClass}`} />
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {donorData.status === "rejected" && "Application Rejected"}
                          {donorData.sampleStatus === "completed" && donorData.status !== "report_submitted" && donorData.status !== "rejected" && "Awaiting Medical Report"}
                          {donorData.status === "report_submitted" && "Awaiting Admin Approval"}
                          {donorData.status === "approved" && "Waiting for Patient Matching"}
                          {donorData.sampleStatus !== "completed" && donorData.status !== "report_submitted" && donorData.status !== "rejected" && "Next Step: Submit Your Sample"}
                        </h4>
                        <p className="mt-1 text-sm text-gray-700">
                          {donorData.status === "rejected" && (donorData.rejectionReason || "You were marked not eligible based on the medical review.")}
                          {donorData.sampleStatus === "completed" && donorData.status !== "report_submitted" && donorData.status !== "rejected" && "Your sample has been collected. The hospital will submit a medical report soon."}
                          {donorData.status === "report_submitted" && "Your medical report has been submitted. The admin team is reviewing your profile."}
                          {donorData.status === "approved" && "You have been approved! Now waiting to be matched with a patient in need."}
                          {donorData.sampleStatus !== "completed" && donorData.status !== "report_submitted" && donorData.status !== "rejected" && (
                            donorData.sampleMethod === "Courier Pickup" 
                              ? "A courier has been scheduled to collect your sample. Please ensure you're available at the scheduled time."
                              : "Please visit one of our partner hospitals to submit your sample. Your appointment is scheduled at the time shown below."
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Donation Timeline Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Your Donation Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Registration */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <div className="mt-2 w-0.5 h-12 bg-green-300"></div>
                      </div>
                      <div className="pb-4">
                        <p className="font-semibold text-green-700">Registration Complete</p>
                        <p className="text-sm text-muted-foreground">{new Date(donorData.registrationDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Sample Collection */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          donorData.sampleStatus === "completed" 
                            ? "bg-green-500 text-white" 
                            : donorData.sampleStatus === "collected" || donorData.sampleStatus === "processing"
                            ? "bg-blue-500 text-white animate-pulse"
                            : "bg-gray-300 text-gray-600"
                        }`}>
                          {donorData.sampleStatus === "completed" ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : donorData.sampleStatus === "collected" || donorData.sampleStatus === "processing" ? (
                            <Clock className="h-5 w-5 animate-spin" />
                          ) : donorData.sampleMethod === "Courier Pickup" ? (
                            <Truck className="h-5 w-5" />
                          ) : (
                            <UserCheck className="h-5 w-5" />
                          )}
                        </div>
                        <div className={`mt-2 w-0.5 h-12 ${
                          donorData.sampleStatus === "completed" ? "bg-green-300" : "bg-gray-300"
                        }`}></div>
                      </div>
                      <div className="pb-4">
                        <p className="font-semibold">Sample Collection</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {donorData.sampleStatus === "completed" 
                            ? "✓ Sample collected and processing" 
                            : donorData.sampleStatus === "collected"
                            ? "Sample collected, awaiting processing"
                            : donorData.sampleStatus === "processing"
                            ? "Sample being processed"
                            : "Scheduled: " + donorData.scheduledDate + " at " + donorData.scheduledTime}
                        </p>
                      </div>
                    </div>

                    {/* Medical Report */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          donorData.status === "rejected"
                            ? "bg-red-500 text-white"
                            : donorData.status === "report_submitted" || donorData.status === "approved"
                            ? "bg-green-500 text-white" 
                            : donorData.sampleStatus === "completed"
                            ? "bg-blue-500 text-white animate-pulse"
                            : "bg-gray-300 text-gray-600"
                        }`}>
                          {donorData.status === "rejected" ? (
                            <XCircle className="h-5 w-5" />
                          ) : donorData.status === "report_submitted" || donorData.status === "approved" ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : donorData.sampleStatus === "completed" ? (
                            <Clock className="h-5 w-5 animate-spin" />
                          ) : (
                            <FileText className="h-5 w-5" />
                          )}
                        </div>
                        <div className={`mt-2 w-0.5 h-12 ${
                          donorData.status === "rejected"
                            ? "bg-red-300"
                            : donorData.status === "report_submitted" || donorData.status === "approved" ? "bg-green-300" : "bg-gray-300"
                        }`}></div>
                      </div>
                      <div className="pb-4">
                        <p className="font-semibold">Medical Report</p>
                        <p className="text-sm text-muted-foreground">
                          {donorData.status === "rejected" 
                            ? "Not eligible based on medical report"
                            : donorData.status === "report_submitted" 
                            ? "✓ Medical report submitted by hospital" 
                            : donorData.status === "approved"
                            ? "✓ Medical report reviewed"
                            : donorData.sampleStatus === "completed"
                            ? "Awaiting hospital to submit report"
                            : "Pending sample collection"}
                        </p>
                      </div>
                    </div>

                    {/* Admin Approval */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          donorData.status === "rejected"
                            ? "bg-red-500 text-white"
                            : donorData.status === "approved"
                            ? "bg-green-500 text-white" 
                            : donorData.status === "report_submitted"
                            ? "bg-blue-500 text-white animate-pulse"
                            : "bg-gray-300 text-gray-600"
                        }`}>
                          {donorData.status === "rejected" ? (
                            <XCircle className="h-5 w-5" />
                          ) : donorData.status === "approved" ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : donorData.status === "report_submitted" ? (
                            <Clock className="h-5 w-5 animate-spin" />
                          ) : (
                            <UserCheck className="h-5 w-5" />
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold">Admin Approval</p>
                        <p className="text-sm text-muted-foreground">
                          {donorData.status === "rejected" 
                            ? "Marked not eligible"
                            : donorData.status === "approved" 
                            ? "✓ Your profile has been approved!" 
                            : donorData.status === "report_submitted"
                            ? "Admin is reviewing your profile"
                            : "Pending medical report submission"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Instructions Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    Preparation Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                      <span>Stay hydrated - drink plenty of water before the sample collection</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                      <span>Have a light meal before the courier arrives</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                      <span>Keep your government-issued ID ready for verification</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                      <span>Wear comfortable, short-sleeved clothing</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* FAQ Accordion */}
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Profile Sidebar */}
            <div className="space-y-6">
              {/* Profile Card */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">{donorData.firstName} {donorData.lastName}</h3>
                    <p className="text-sm text-muted-foreground">Donor ID: {donorData.id}</p>
                    
                    <div className="mt-4 flex items-center gap-2">
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        Blood Type: {donorData.bloodType}
                      </Badge>
                    </div>
                    
                    <Badge className="mt-3 bg-warning/10 text-warning border-warning/20">
                      {donorData.status}
                    </Badge>
                  </div>

                  <hr className="my-6 border-border" />

                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Registered</dt>
                      <dd className="font-medium">{donorData.registrationDate}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Sample Method</dt>
                      <dd className="font-medium">{donorData.sampleMethod}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              {/* Availability Toggle */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Donation Availability</h4>
                      <p className="text-sm text-muted-foreground">
                        {isAvailable ? "You're available for matching" : "You're currently unavailable"}
                      </p>
                    </div>
                    <Switch
                      checked={isAvailable}
                      onCheckedChange={setIsAvailable}
                    />
                  </div>
                  
                  {isAvailable && (
                    <div className="mt-4 rounded-lg bg-success/10 p-3">
                      <p className="text-xs text-success flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        You'll be notified if you're matched with a patient
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* QR Code Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <QrCode className="h-5 w-5" />
                    Your Donor QR Code
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Contains your registration information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <div ref={qrRef} className="bg-white p-4 rounded-lg border-2 border-gray-200">
                      <QRCodeCanvas
                        value={qrData}
                        size={180}
                        level="H"
                        includeMargin={true}
                      />
                    </div>
                    <Button
                      onClick={downloadQRCode}
                      variant="outline"
                      className="mt-4 w-full gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download QR Code
                    </Button>
                    <p className="text-xs text-muted-foreground text-center mt-3">
                      Scan this code for quick access to your donor information
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="mr-2 h-4 w-4" />
                    View Schedule
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-destructive hover:text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DonorDashboard;