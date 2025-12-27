import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Footer from "@/components/layout/Footer";
import { 
  User, 
  Droplet,
  CheckCircle2,
  Clock,
  Truck,
  Calendar,
  AlertCircle,
  HelpCircle,
  Settings,
  LogOut
} from "lucide-react";

const DonorDashboard = () => {
  const [isAvailable, setIsAvailable] = useState(true);

  const donorData = {
    id: "CL-2024-12587",
    name: "Ram Sharma",
    bloodType: "O+",
    registrationDate: "December 15, 2024",
    status: "Sample Pending",
    sampleMethod: "Courier Pickup",
    scheduledDate: "December 28, 2024",
    scheduledTime: "Morning (9 AM - 12 PM)",
  };

  const statusSteps = [
    { id: 1, label: "Registered", completed: true, current: false },
    { id: 2, label: "Sample Pending", completed: false, current: true },
    { id: 3, label: "Sample Received", completed: false, current: false },
    { id: 4, label: "Active Donor", completed: false, current: false },
  ];

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
      
      <main className="flex-1 py-8">
        <div className="container max-w-6xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Welcome back, {donorData.name}</h1>
              <p className="text-muted-foreground">Manage your donor profile and track your journey</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column */}
            <div className="space-y-6 lg:col-span-2">
              {/* Status Tracker Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplet className="h-5 w-5 text-red-600 fill-red-600" />
                    Your Donor Journey
                  </CardTitle>
                  <CardDescription>Track your progress to becoming an active donor</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      {statusSteps.map((step, index) => (
                        <div key={step.id} className="flex items-center">
                          <div className="flex flex-col items-center">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                                step.completed
                                  ? "border-success bg-success text-success-foreground"
                                  : step.current
                                  ? "border-primary bg-primary/10 text-primary animate-pulse-soft"
                                  : "border-muted-foreground/30 bg-muted text-muted-foreground"
                              }`}
                            >
                              {step.completed ? (
                                <CheckCircle2 className="h-5 w-5" />
                              ) : step.current ? (
                                <Clock className="h-5 w-5" />
                              ) : (
                                <span className="text-sm font-medium">{step.id}</span>
                              )}
                            </div>
                            <span className={`mt-2 text-xs font-medium ${
                              step.completed || step.current ? "text-foreground" : "text-muted-foreground"
                            }`}>
                              {step.label}
                            </span>
                          </div>
                          {index < statusSteps.length - 1 && (
                            <div
                              className={`mx-2 h-0.5 w-8 sm:w-16 lg:w-24 ${
                                step.completed ? "bg-success" : "bg-muted-foreground/30"
                              }`}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium text-foreground">Next Step: Submit Your Sample</h4>
                        <p className="mt-1 text-sm text-muted-foreground">
                          A courier has been scheduled to collect your sample. Please ensure you're 
                          available at the scheduled time.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sample Submission Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    Sample Submission Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-border bg-muted/30 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Scheduled Date</span>
                      </div>
                      <p className="font-medium">{donorData.scheduledDate}</p>
                    </div>
                    <div className="rounded-lg border border-border bg-muted/30 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Time Slot</span>
                      </div>
                      <p className="font-medium">{donorData.scheduledTime}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-3">
                    <Button variant="outline" className="flex-1">Reschedule</Button>
                    <Button variant="outline" className="flex-1">Contact Support</Button>
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
                    <h3 className="text-lg font-semibold">{donorData.name}</h3>
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
                  <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
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