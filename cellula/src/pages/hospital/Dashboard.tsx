import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/layout/Footer";
import { 
  Building2, 
  Search, 
  MapPin,
  Users, 
  Clock,
  AlertCircle,
  CheckCircle2,
  LogOut,
  Settings,
  Eye
} from "lucide-react";

const HospitalDashboard = () => {
  const navigate = useNavigate();
  const [searchRadius, setSearchRadius] = useState([50]);
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [patientBloodType, setPatientBloodType] = useState("O+");
  const [hlaA, setHlaA] = useState("");
  const [hlaB, setHlaB] = useState("");
  const [hlaC, setHlaC] = useState("");
  const [hlaDRB1, setHlaDRB1] = useState("");
  const [hlaDQB1, setHlaDQB1] = useState("");
  const [urgencyLevel, setUrgencyLevel] = useState("urgent");
  const [donorResults, setDonorResults] = useState<any[]>([]);

  // Combine HLA fields into single string
  const patientHLA = [hlaA, hlaB, hlaC, hlaDRB1, hlaDQB1]
    .filter(val => val.trim() !== "")
    .join(", ");

  // Mock donor database with HLA types (anonymized for privacy)
  const mockDonors = [
    { id: "CL-2024-00123", bloodType: "O+", hla: "A*02:01, B*07:02, DRB1*15:01", location: "Kathmandu", distance: 5, status: "Active", age: 28, gender: "M" },
    { id: "CL-2024-00456", bloodType: "O+", hla: "A*02:01, B*07:02, DRB1*03:01", location: "Lalitpur", distance: 8, status: "Active", age: 32, gender: "F" },
    { id: "CL-2024-00789", bloodType: "O+", hla: "A*02:01, B*44:02, DRB1*15:01", location: "Bhaktapur", distance: 12, status: "Active", age: 25, gender: "M" },
    { id: "CL-2024-01012", bloodType: "O+", hla: "A*24:02, B*07:02, DRB1*15:01", location: "Kathmandu", distance: 7, status: "Active", age: 35, gender: "F" },
    { id: "CL-2024-01345", bloodType: "O+", hla: "A*02:01, B*07:02, DRB1*15:01", location: "Kathmandu", distance: 4, status: "Active", age: 29, gender: "M" },
    { id: "CL-2024-01678", bloodType: "O+", hla: "A*11:01, B*35:01, DRB1*04:01", location: "Lalitpur", distance: 15, status: "Active", age: 41, gender: "F" },
    { id: "CL-2024-01901", bloodType: "O+", hla: "A*02:01, B*15:01, DRB1*15:01", location: "Kathmandu", distance: 10, status: "Active", age: 27, gender: "M" },
    { id: "CL-2024-02234", bloodType: "O+", hla: "A*33:03, B*44:03, DRB1*07:01", location: "Bhaktapur", distance: 18, status: "Active", age: 38, gender: "F" },
  ];

  // Calculate HLA match score
  const calculateHLAMatch = (donorHLA: string, patientHLA: string) => {
    if (!patientHLA || patientHLA.trim() === "") return { score: 0, matches: 0, total: 0 };
    
    const patientMarkers = patientHLA.split(',').map(m => m.trim().toUpperCase());
    const donorMarkers = donorHLA.split(',').map(m => m.trim().toUpperCase());
    
    let matches = 0;
    patientMarkers.forEach(pm => {
      if (donorMarkers.some(dm => dm === pm)) {
        matches++;
      }
    });
    
    const total = patientMarkers.length;
    const score = total > 0 ? Math.round((matches / total) * 100) : 0;
    
    return { score, matches, total };
  };

  const hospitalData = {
    name: "Tribhuvan University Teaching Hospital",
    id: "HOSP-KTM-001",
    location: "Kathmandu",
  };

  const mockResults = {
    totalMatches: 23,
    highQuality: 8,
    mediumQuality: 12,
    lowQuality: 3,
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter donors by blood type and distance
    let filtered = mockDonors.filter(
      donor => donor.bloodType === patientBloodType && donor.distance <= searchRadius[0]
    );
    
    // Calculate HLA match scores and sort by priority
    const withScores = filtered.map(donor => ({
      ...donor,
      hlaMatch: calculateHLAMatch(donor.hla, patientHLA)
    }));
    
    // Sort by HLA match score (highest first), then by distance (closest first)
    withScores.sort((a, b) => {
      if (b.hlaMatch.score !== a.hlaMatch.score) {
        return b.hlaMatch.score - a.hlaMatch.score;
      }
      return a.distance - b.distance;
    });
    
    setDonorResults(withScores);
    setSearchSubmitted(true);
  };

  const handleLogout = () => {
    // Clear any stored session data if needed
    sessionStorage.clear();
    localStorage.removeItem('hospitalSession');
    // Navigate to login page
    navigate("/hospital/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <main className="flex-1 py-8">
        <div className="container max-w-7xl">
          <div className="mb-8">
            <Card className="border-2 border-teal-200 shadow-xl bg-gradient-to-br from-teal-50 via-white to-cyan-50 overflow-hidden relative">
              {/* Decorative background pattern */}
              <div className="absolute top-0 right-0 w-64 h-64 opacity-5">
                <Building2 className="w-full h-full text-teal-600" />
              </div>
              
              <CardContent className="py-8 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-600 shadow-2xl transform hover:scale-105 transition-transform">
                        <Building2 className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 border-4 border-white rounded-full" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
                          Welcome Back!
                        </h1>
                        <span className="text-2xl">👋</span>
                      </div>
                      <p className="text-xl font-semibold text-teal-700 mb-2">
                        {hospitalData.name}
                      </p>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="border-teal-300 text-teal-800 bg-teal-100 font-semibold px-3 py-1">
                          <span className="text-xs text-teal-600 mr-1">ID:</span> {hospitalData.id}
                        </Badge>
                        <div className="flex items-center gap-1.5 text-sm text-gray-700 bg-white/60 px-3 py-1.5 rounded-full border border-gray-200">
                          <MapPin className="h-4 w-4 text-teal-600" />
                          <span className="font-medium">{hospitalData.location}</span>
                        </div>
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
                      className="h-11 w-11 rounded-xl hover:bg-teal-100 hover:text-teal-700 transition-all"
                    >
                      <Settings className="h-5 w-5" />
                    </Button>
                    <Button 
                      type="button"
                      onClick={handleLogout}
                      className="gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all px-6 h-11 rounded-xl font-semibold"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left Panel - Search Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-primary" />
                    Donor Search Request
                  </CardTitle>
                  <CardDescription>
                    Submit a new donor matching request
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSearch} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="patientRef">Patient Reference ID</Label>
                      <Input 
                        id="patientRef" 
                        placeholder="e.g., PAT-2024-0001"
                        defaultValue="PAT-2024-0892"
                      />
                      <p className="text-xs text-muted-foreground">
                        Anonymous identifier for internal tracking
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Required Blood Type</Label>
                      <Select value={patientBloodType} onValueChange={setPatientBloodType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label>HLA Markers (Patient)</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">HLA-A</Label>
                          <Input 
                            placeholder="e.g., A*02:01" 
                            value={hlaA}
                            onChange={(e) => setHlaA(e.target.value)}
                            className="h-9"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">HLA-B</Label>
                          <Input 
                            placeholder="e.g., B*07:02" 
                            value={hlaB}
                            onChange={(e) => setHlaB(e.target.value)}
                            className="h-9"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">HLA-C</Label>
                          <Input 
                            placeholder="e.g., C*03:04" 
                            value={hlaC}
                            onChange={(e) => setHlaC(e.target.value)}
                            className="h-9"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">HLA-DRB1</Label>
                          <Input 
                            placeholder="e.g., DRB1*15:01" 
                            value={hlaDRB1}
                            onChange={(e) => setHlaDRB1(e.target.value)}
                            className="h-9"
                          />
                        </div>
                        <div className="space-y-1 col-span-2">
                          <Label className="text-xs text-muted-foreground">HLA-DQB1</Label>
                          <Input 
                            placeholder="e.g., DQB1*06:02" 
                            value={hlaDQB1}
                            onChange={(e) => setHlaDQB1(e.target.value)}
                            className="h-9"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">Enter the patient's HLA typing results</p>
                    </div>

                    <div className="space-y-2">
                      <Label>Urgency Level</Label>
                      <Select value={urgencyLevel} onValueChange={setUrgencyLevel}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select urgency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="critical">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-destructive" />
                              Critical (24-48 hours)
                            </div>
                          </SelectItem>
                          <SelectItem value="urgent">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-warning" />
                              Urgent (1-2 weeks)
                            </div>
                          </SelectItem>
                          <SelectItem value="standard">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-success" />
                              Standard (2-4 weeks)
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Search Radius</Label>
                        <span className="text-sm font-medium text-primary">{searchRadius[0]} km</span>
                      </div>
                      <Slider
                        value={searchRadius}
                        onValueChange={setSearchRadius}
                        max={200}
                        min={10}
                        step={10}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>10 km</span>
                        <span>200 km</span>
                      </div>
                    </div>

                    <Button type="submit" className="w-full gap-2">
                      <Search className="h-4 w-4" />
                      Search Donors
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Results Panel */}
              {searchSubmitted && donorResults.length > 0 && (
                <Card className="border-info/50 bg-info/5">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-info">
                      <CheckCircle2 className="h-5 w-5" />
                      Potential Matches Found
                    </CardTitle>
                    <CardDescription>
                      Request submitted for admin review
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-info/10 mb-4">
                        <Clock className="h-10 w-10 text-info" />
                      </div>
                      
                      <div className="text-5xl font-bold text-foreground mb-2">
                        {donorResults.length}
                      </div>
                      <p className="text-lg font-semibold mb-1">Potential Matches</p>
                      <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                        Your search has found matching donors in our registry
                      </p>
                      
                      {/* Match Quality Summary */}
                      <div className="grid grid-cols-3 gap-3 mb-8 max-w-md mx-auto">
                        <div className="rounded-lg bg-background p-4 text-center border-2 border-success/30">
                          <div className="text-2xl font-bold text-success">
                            {donorResults.filter(d => d.hlaMatch.score >= 75).length}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">High Match</div>
                        </div>
                        <div className="rounded-lg bg-background p-4 text-center border-2 border-warning/30">
                          <div className="text-2xl font-bold text-warning">
                            {donorResults.filter(d => d.hlaMatch.score >= 50 && d.hlaMatch.score < 75).length}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">Medium</div>
                        </div>
                        <div className="rounded-lg bg-background p-4 text-center border-2 border-muted">
                          <div className="text-2xl font-bold text-muted-foreground">
                            {donorResults.filter(d => d.hlaMatch.score < 50).length}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">Low</div>
                        </div>
                      </div>

                      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-4 max-w-2xl mx-auto">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                          <div className="text-left">
                            <h4 className="font-semibold text-blue-900 mb-2">Awaiting Admin Approval</h4>
                            <p className="text-sm text-blue-800 leading-relaxed">
                              For donor privacy and security, detailed donor information can only be accessed after admin approval. 
                              Your request has been submitted to our administrative team for review. You will be notified once approved.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p><strong>Search Criteria:</strong></p>
                        <p>Blood Type: <Badge variant="outline">{patientBloodType}</Badge></p>
                        {patientHLA && <p>HLA Markers: <span className="font-mono text-xs">{patientHLA}</span></p>}
                        <p>Search Radius: {searchRadius[0]} km</p>
                        <p>Urgency: <Badge variant="outline" className={
                          urgencyLevel === "critical" ? "border-destructive/50 text-destructive" :
                          urgencyLevel === "urgent" ? "border-warning/50 text-warning" :
                          "border-success/50 text-success"
                        }>{urgencyLevel}</Badge></p>
                      </div>

                      <div className="mt-6">
                        <Button className="gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          Submit Request to Admin
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {searchSubmitted && donorResults.length === 0 && (
                <Card className="border-warning/50 bg-warning/5">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <AlertCircle className="h-12 w-12 text-warning mx-auto mb-3" />
                      <h3 className="text-lg font-semibold mb-2">No Matches Found</h3>
                      <p className="text-sm text-muted-foreground">
                        Try adjusting your search criteria or increasing the search radius.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Panel - Map Visualization */}
            <div className="lg:col-span-3">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Donor Distribution Map
                  </CardTitle>
                  <CardDescription>
                    Visual representation of donor locations within search radius
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Static Map Visualization */}
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted/50 border border-border">
                    {/* Nepal Map Background (Simplified SVG) */}
                    <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full">
                      {/* Background */}
                      <rect width="400" height="400" fill="hsl(var(--muted))" />
                      
                      {/* Simplified Nepal outline */}
                      <path
                        d="M50,200 Q100,150 150,160 L200,140 Q250,130 300,150 L350,180 Q340,220 320,250 L280,280 Q220,290 160,280 L100,260 Q60,240 50,200 Z"
                        fill="hsl(var(--secondary))"
                        stroke="hsl(var(--border))"
                        strokeWidth="2"
                      />
                      
                      {/* Search Radius Circle */}
                      <circle
                        cx="200"
                        cy="200"
                        r={searchRadius[0] * 0.8}
                        fill="hsl(var(--primary) / 0.1)"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                        strokeDasharray="8 4"
                      />
                      
                      {/* Hospital Location (Center) */}
                      <g transform="translate(200, 200)">
                        <circle r="12" fill="hsl(var(--primary))" />
                        <circle r="6" fill="hsl(var(--primary-foreground))" />
                      </g>
                      
                      {/* Donor Points (Mock) */}
                      {searchSubmitted && (
                        <>
                          {/* High quality matches - closer */}
                          <circle cx="180" cy="170" r="6" fill="hsl(var(--success))" />
                          <circle cx="220" cy="180" r="6" fill="hsl(var(--success))" />
                          <circle cx="190" cy="220" r="6" fill="hsl(var(--success))" />
                          <circle cx="215" cy="195" r="6" fill="hsl(var(--success))" />
                          <circle cx="175" cy="205" r="6" fill="hsl(var(--success))" />
                          <circle cx="230" cy="215" r="6" fill="hsl(var(--success))" />
                          <circle cx="185" cy="235" r="6" fill="hsl(var(--success))" />
                          <circle cx="210" cy="165" r="6" fill="hsl(var(--success))" />
                          
                          {/* Medium quality - medium distance */}
                          <circle cx="150" cy="180" r="5" fill="hsl(var(--warning))" />
                          <circle cx="250" cy="170" r="5" fill="hsl(var(--warning))" />
                          <circle cx="160" cy="230" r="5" fill="hsl(var(--warning))" />
                          <circle cx="240" cy="240" r="5" fill="hsl(var(--warning))" />
                          <circle cx="145" cy="200" r="5" fill="hsl(var(--warning))" />
                          <circle cx="255" cy="195" r="5" fill="hsl(var(--warning))" />
                          <circle cx="170" cy="160" r="5" fill="hsl(var(--warning))" />
                          <circle cx="230" cy="250" r="5" fill="hsl(var(--warning))" />
                          <circle cx="165" cy="245" r="5" fill="hsl(var(--warning))" />
                          <circle cx="245" cy="160" r="5" fill="hsl(var(--warning))" />
                          <circle cx="155" cy="215" r="5" fill="hsl(var(--warning))" />
                          <circle cx="260" cy="220" r="5" fill="hsl(var(--warning))" />
                          
                          {/* Low quality - further */}
                          <circle cx="120" cy="200" r="4" fill="hsl(var(--muted-foreground))" />
                          <circle cx="280" cy="200" r="4" fill="hsl(var(--muted-foreground))" />
                          <circle cx="200" cy="130" r="4" fill="hsl(var(--muted-foreground))" />
                        </>
                      )}
                    </svg>
                    
                    {/* Map Legend */}
                    <div className="absolute bottom-4 left-4 rounded-lg bg-background/95 border border-border p-3 shadow-lg">
                      <h4 className="text-xs font-semibold mb-2">Legend</h4>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-primary" />
                          <span className="text-xs">Hospital Location</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-success" />
                          <span className="text-xs">High Match</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-warning" />
                          <span className="text-xs">Medium Match</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-muted-foreground" />
                          <span className="text-xs">Low Match</span>
                        </div>
                      </div>
                    </div>

                    {/* Radius indicator */}
                    <div className="absolute top-4 right-4 rounded-lg bg-background/95 border border-border px-3 py-2 shadow-lg">
                      <div className="text-xs text-muted-foreground">Search Radius</div>
                      <div className="text-lg font-bold text-primary">{searchRadius[0]} km</div>
                    </div>
                  </div>

                  {/* Request History */}
                  <div className="mt-6">
                    <h4 className="font-medium mb-3">Recent Requests</h4>
                    <div className="space-y-2">
                      {[
                        { id: "REQ-001", date: "Dec 25", urgency: "urgent", matches: 18, status: "pending" },
                        { id: "REQ-002", date: "Dec 22", urgency: "standard", matches: 34, status: "approved" },
                        { id: "REQ-003", date: "Dec 20", urgency: "critical", matches: 5, status: "completed" },
                      ].map((req) => (
                        <div key={req.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                          <div className="flex items-center gap-3">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="text-sm font-medium">{req.id}</div>
                              <div className="text-xs text-muted-foreground">{req.date}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={
                              req.urgency === "critical" ? "border-destructive/50 text-destructive" :
                              req.urgency === "urgent" ? "border-warning/50 text-warning" :
                              "border-success/50 text-success"
                            }>
                              {req.urgency}
                            </Badge>
                            <span className="text-sm">{req.matches} matches</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
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

export default HospitalDashboard;