import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Footer from "@/components/layout/Footer";
import { 
  User, 
  Phone, 
  MapPin, 
  Package, 
  FileCheck,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Truck,
  Building2
} from "lucide-react";

const steps = [
  { id: 1, title: "Personal Details", icon: User },
  { id: 2, title: "Contact Info", icon: Phone },
  { id: 3, title: "Address", icon: MapPin },
  { id: 4, title: "Sample Method", icon: Package },
  { id: 5, title: "Consent", icon: FileCheck },
];

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const provinces = [
  "Province 1",
  "Madhesh Province",
  "Bagmati Province",
  "Gandaki Province",
  "Lumbini Province",
  "Karnali Province",
  "Sudurpashchim Province",
];

const Register = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [sampleMethod, setSampleMethod] = useState<"courier" | "hospital" | null>(null);
  const [consentChecked, setConsentChecked] = useState(false);

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    navigate("/donor/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      
      <main className="flex-1 py-8 lg:py-12">
        <div className="container max-w-4xl">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                        currentStep > step.id
                          ? "border-primary bg-primary text-primary-foreground"
                          : currentStep === step.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-muted-foreground/30 bg-muted text-muted-foreground"
                      }`}
                    >
                      {currentStep > step.id ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <step.icon className="h-5 w-5" />
                      )}
                    </div>
                    <span className={`mt-2 hidden text-xs font-medium sm:block ${
                      currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`mx-2 h-0.5 w-12 sm:w-20 lg:w-28 ${
                        currentStep > step.id ? "bg-primary" : "bg-muted-foreground/30"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">
                {steps[currentStep - 1].title}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && "Tell us about yourself"}
                {currentStep === 2 && "How can we reach you?"}
                {currentStep === 3 && "Where are you located?"}
                {currentStep === 4 && "Choose how you'll submit your sample"}
                {currentStep === 5 && "Review and confirm your registration"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Step 1: Personal Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="Enter your first name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Enter your last name" />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input id="dob" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Blood Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood type" />
                      </SelectTrigger>
                      <SelectContent>
                        {bloodTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 2: Contact Information */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+977 98XXXXXXXX" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="your@email.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                    <Input id="emergencyContact" placeholder="Emergency contact name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                    <Input id="emergencyPhone" type="tel" placeholder="+977 98XXXXXXXX" />
                  </div>
                </div>
              )}

              {/* Step 3: Address */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Province</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                      <SelectContent>
                        {provinces.map((province) => (
                          <SelectItem key={province} value={province}>
                            {province}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="district">District</Label>
                      <Input id="district" placeholder="Enter district" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="municipality">Municipality</Label>
                      <Input id="municipality" placeholder="Enter municipality" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Input id="street" placeholder="Enter street address" />
                  </div>
                </div>
              )}

              {/* Step 4: Sample Submission Method */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <RadioGroup
                    value={sampleMethod || ""}
                    onValueChange={(value) => setSampleMethod(value as "courier" | "hospital")}
                    className="grid gap-4 sm:grid-cols-2"
                  >
                    <Label
                      htmlFor="courier"
                      className={`cursor-pointer rounded-lg border-2 p-6 transition-all ${
                        sampleMethod === "courier"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <RadioGroupItem value="courier" id="courier" className="sr-only" />
                      <div className="flex flex-col items-center text-center">
                        <div className={`mb-4 rounded-full p-3 ${
                          sampleMethod === "courier" ? "bg-primary/10" : "bg-muted"
                        }`}>
                          <Truck className={`h-8 w-8 ${
                            sampleMethod === "courier" ? "text-primary" : "text-muted-foreground"
                          }`} />
                        </div>
                        <h3 className="mb-2 font-semibold">Courier Pickup</h3>
                        <p className="text-sm text-muted-foreground">
                          We'll send a courier to collect your sample from your home at a convenient time.
                        </p>
                      </div>
                    </Label>
                    
                    <Label
                      htmlFor="hospital"
                      className={`cursor-pointer rounded-lg border-2 p-6 transition-all ${
                        sampleMethod === "hospital"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <RadioGroupItem value="hospital" id="hospital" className="sr-only" />
                      <div className="flex flex-col items-center text-center">
                        <div className={`mb-4 rounded-full p-3 ${
                          sampleMethod === "hospital" ? "bg-primary/10" : "bg-muted"
                        }`}>
                          <Building2 className={`h-8 w-8 ${
                            sampleMethod === "hospital" ? "text-primary" : "text-muted-foreground"
                          }`} />
                        </div>
                        <h3 className="mb-2 font-semibold">Hospital Visit</h3>
                        <p className="text-sm text-muted-foreground">
                          Visit one of our partner hospitals to submit your sample in person.
                        </p>
                      </div>
                    </Label>
                  </RadioGroup>

                  {sampleMethod === "courier" && (
                    <div className="rounded-lg border border-border bg-muted/30 p-4">
                      <h4 className="mb-3 font-medium">Schedule Pickup</h4>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="pickupDate">Preferred Date</Label>
                          <Input id="pickupDate" type="date" />
                        </div>
                        <div className="space-y-2">
                          <Label>Preferred Time</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time slot" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="morning">Morning (9 AM - 12 PM)</SelectItem>
                              <SelectItem value="afternoon">Afternoon (12 PM - 3 PM)</SelectItem>
                              <SelectItem value="evening">Evening (3 PM - 6 PM)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}

                  {sampleMethod === "hospital" && (
                    <div className="rounded-lg border border-border bg-muted/30 p-4">
                      <h4 className="mb-3 font-medium">Select Hospital</h4>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a partner hospital" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bir">Bir Hospital, Kathmandu</SelectItem>
                          <SelectItem value="tribhuvan">Tribhuvan University Teaching Hospital</SelectItem>
                          <SelectItem value="grande">Grande International Hospital</SelectItem>
                          <SelectItem value="nepal">Nepal Cancer Hospital</SelectItem>
                          <SelectItem value="chitwan">Chitwan Medical College</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}

              {/* Step 5: Consent & Review */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="rounded-lg border border-border bg-muted/30 p-6">
                    <h4 className="mb-4 font-medium">Registration Summary</h4>
                    <dl className="grid gap-3 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Name:</dt>
                        <dd className="font-medium">Ram Sharma</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Blood Type:</dt>
                        <dd className="font-medium">O+</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Location:</dt>
                        <dd className="font-medium">Kathmandu, Bagmati Province</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Sample Method:</dt>
                        <dd className="font-medium">
                          {sampleMethod === "courier" ? "Courier Pickup" : "Hospital Visit"}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="rounded-lg border border-border p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="consent"
                        checked={consentChecked}
                        onCheckedChange={(checked) => setConsentChecked(checked as boolean)}
                        className="mt-1"
                      />
                      <Label htmlFor="consent" className="text-sm leading-relaxed">
                        I consent to the collection and processing of my personal and health 
                        information for the purpose of stem cell donation matching. I understand 
                        that my data will be stored securely and used only for matching purposes. 
                        I agree to the Terms of Service and Privacy Policy.
                      </Label>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-8 flex justify-between">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                
                {currentStep < 5 ? (
                  <Button onClick={handleNext} className="gap-2">
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmit} 
                    disabled={!consentChecked}
                    className="gap-2"
                  >
                    Complete Registration
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;