import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom";
import { 
  Shield, 
  Users, 
  Building2, 
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  Bell,
  Settings,
  LogOut,
  Eye,
  Check,
  MapPin,
  X,
  FileText,
  UserCheck,
  Activity,
  Dna
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useRef } from "react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [showHeader, setShowHeader] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [selectedDonor, setSelectedDonor] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [registeredDonors, setRegisteredDonors] = useState<any[]>([]);
  const [hospitalRequests, setHospitalRequests] = useState<any[]>([]);
  const detailsRef = useRef<HTMLDivElement | null>(null);

  // Load registered donors from localStorage
  useEffect(() => {
    let donors = JSON.parse(localStorage.getItem('allDonors') || '[]');
    
    // Demo donors definition
    const demoDonors = [
        {
          id: "CL-2024-01001",
          firstName: "Rajesh",
          lastName: "Poudel",
          email: "rajesh.poudel@email.com",
          phone: "+977 9841234567",
          bloodType: "O+",
          province: "Kathmandu",
          age: 32,
          gender: "M",
          registrationDate: "2024-12-20",
          sampleStatus: "completed",
          status: "approved",
          approvedDate: "2024-12-25",
          medicalReport: {
            height: 175,
            weight: 72,
            bloodPressure: "120/80",
            heartRate: 72,
            medicalHistory: "No major illnesses",
            labResults: "All normal",
            hlaA: "A*02:01",
            hlaB: "B*07:02",
            hlaC: "C*07:02",
            hlaDR: "DRB1*03:01",
            hlaType: "A*02:01, B*07:02, C*07:02, DRB1*03:01",
            doctorNotes: "Healthy donor, no contraindications",
            eligibility: "eligible",
            submittedAt: "2024-12-21"
          }
        },
        {
          id: "CL-2024-01002",
          firstName: "Priya",
          lastName: "Sharma",
          email: "priya.sharma@email.com",
          phone: "+977 9856789012",
          bloodType: "A+",
          province: "Pokhara",
          age: 28,
          gender: "F",
          registrationDate: "2024-12-19",
          sampleStatus: "completed",
          status: "approved",
          approvedDate: "2024-12-24",
          medicalReport: {
            height: 162,
            weight: 58,
            bloodPressure: "118/78",
            heartRate: 68,
            medicalHistory: "Mild anemia history, recovered",
            labResults: "Hemoglobin within normal range",
            hlaA: "A*01:01",
            hlaB: "B*08:01",
            hlaC: "C*07:01",
            hlaDR: "DRB1*03:01",
            hlaType: "A*01:01, B*08:01, C*07:01, DRB1*03:01",
            doctorNotes: "Good overall health, suitable for donation",
            eligibility: "conditional",
            submittedAt: "2024-12-20"
          }
        },
        {
          id: "CL-2024-01003",
          firstName: "Anil",
          lastName: "Karki",
          email: "anil.karki@email.com",
          phone: "+977 9823456789",
          bloodType: "B+",
          province: "Bhaktapur",
          age: 35,
          gender: "M",
          registrationDate: "2024-12-18",
          sampleStatus: "completed",
          status: "approved",
          approvedDate: "2024-12-23",
          medicalReport: {
            height: 178,
            weight: 75,
            bloodPressure: "122/82",
            heartRate: 74,
            medicalHistory: "Healthy, regular exercise",
            labResults: "All parameters normal",
            hlaA: "A*24:02",
            hlaB: "B*51:01",
            hlaC: "C*04:01",
            hlaDR: "DRB1*07:01",
            hlaType: "A*24:02, B*51:01, C*04:01, DRB1*07:01",
            doctorNotes: "Excellent health status, strong candidate",
            eligibility: "eligible",
            submittedAt: "2024-12-19"
          }
        }
      ];
    
    // Add demo donors if they don't already exist (check by ID)
    demoDonors.forEach(demoDonor => {
      const exists = donors.some((d: any) => d.id === demoDonor.id);
      if (!exists) {
        donors.push(demoDonor);
      }
    });
    
    // Auto-reject donors with "not-eligible" status
    donors = donors.map((donor: any) => {
      if (
        donor.status === 'report_submitted' &&
        donor.sampleStatus === 'completed' &&
        donor.medicalReport?.eligibility === 'not-eligible'
      ) {
        return {
          ...donor,
          status: 'rejected',
          rejectedDate: new Date().toISOString(),
          rejectionReason: donor.medicalReport?.rejectionReason || 'Not eligible based on medical assessment'
        };
      }
      return donor;
    });
    
    // Save updated donors list
    localStorage.setItem('allDonors', JSON.stringify(donors));
    
    setRegisteredDonors(donors);
  }, [activeTab]);

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

  // Poll for updates every 2 seconds to get fresh data
  useEffect(() => {
    const interval = setInterval(() => {
      const donors = JSON.parse(localStorage.getItem('allDonors') || '[]');
      setRegisteredDonors(donors);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const findDonorContact = (id: string) => {
    const donor = registeredDonors.find((d: any) => d.id === id);
    const name = donor ? `${donor.firstName || ''} ${donor.lastName || ''}`.trim() || id : id;
    const phone = donor?.phone || '';
    return { name, phone };
  };

  const handleApproveDonor = () => {
    if (!selectedDonor) {
      alert('No donor selected');
      return;
    }

    console.log('Approving donor:', selectedDonor.id);
    const donors = JSON.parse(localStorage.getItem('allDonors') || '[]');
    const updatedDonors = donors.map((donor: any) => {
      if (donor.id === selectedDonor.id) {
        console.log('Found donor to approve:', donor.id);
        return {
          ...donor,
          status: 'approved'
        };
      }
      return donor;
    });

    localStorage.setItem('allDonors', JSON.stringify(updatedDonors));
    setRegisteredDonors(updatedDonors);
    
    // Update selectedDonor to show the approved state
    const approvedDonor = updatedDonors.find((d: any) => d.id === selectedDonor.id);
    setSelectedDonor(approvedDonor);
    
    console.log('Donor approved successfully');
    alert('Donor approved successfully!');
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.removeItem('adminSession');
    navigate("/admin/login");
  };

  // Mock data for new donor registrations
  const newRegistrations = [
    { 
      id: "CL-2024-02345", 
      name: "Amit Sharma",
      email: "amit.sharma@email.com",
      phone: "+977 9841234567",
      bloodType: "O+",
      location: "Kathmandu",
      registrationDate: "2024-12-26",
      sampleStatus: "pending",
      age: 28,
      gender: "M"
    },
    { 
      id: "CL-2024-02346", 
      name: "Sita Thapa",
      email: "sita.thapa@email.com",
      phone: "+977 9856789012",
      bloodType: "A+",
      location: "Pokhara",
      registrationDate: "2024-12-26",
      sampleStatus: "collected",
      age: 32,
      gender: "F"
    },
    { 
      id: "CL-2024-02347", 
      name: "Rajesh Karki",
      email: "rajesh.karki@email.com",
      phone: "+977 9823456789",
      bloodType: "B+",
      location: "Lalitpur",
      registrationDate: "2024-12-25",
      sampleStatus: "processing",
      age: 25,
      gender: "M"
    },
    { 
      id: "CL-2024-02348", 
      name: "Maya Gurung",
      email: "maya.gurung@email.com",
      phone: "+977 9867890123",
      bloodType: "AB+",
      location: "Chitwan",
      registrationDate: "2024-12-25",
      sampleStatus: "completed",
      age: 30,
      gender: "F"
    },
    { 
      id: "CL-2024-02349", 
      name: "Suresh Rai",
      email: "suresh.rai@email.com",
      phone: "+977 9812345678",
      bloodType: "O-",
      location: "Bhaktapur",
      registrationDate: "2024-12-24",
      sampleStatus: "completed",
      age: 35,
      gender: "M"
    },
  ];

  // Mock data for stats
  const stats = [
    { 
      label: "Total Donors", 
      value: "12,587", 
      change: "+12%", 
      trend: "up",
      icon: Users,
      color: "text-primary"
    },
    { 
      label: "Active Requests", 
      value: "34", 
      change: "+5", 
      trend: "up",
      icon: Clock,
      color: "text-warning"
    },
    { 
      label: "Pending Reviews", 
      value: "8", 
      change: "-3", 
      trend: "down",
      icon: AlertCircle,
      color: "text-info"
    },
    { 
      label: "Completed Matches", 
      value: "856", 
      change: "+23", 
      trend: "up",
      icon: () => <img src="/logo.png" alt="Completed Matches" className="h-full w-full" />,
      color: "text-success"
    },
  ];

  // Line chart data - Donor registrations
  const registrationData = [
    { month: "Jul", donors: 420 },
    { month: "Aug", donors: 550 },
    { month: "Sep", donors: 680 },
    { month: "Oct", donors: 890 },
    { month: "Nov", donors: 1050 },
    { month: "Dec", donors: 1240 },
  ];

  // Bar chart data - Requests by urgency
  const urgencyData = [
    { name: "Critical", count: 5, fill: "hsl(var(--destructive))" },
    { name: "Urgent", count: 18, fill: "hsl(var(--warning))" },
    { name: "Standard", count: 11, fill: "hsl(var(--success))" },
  ];

  // Pie chart data - Regional distribution
  const regionalData = [
    { name: "Bagmati", value: 4200, fill: "hsl(var(--primary))" },
    { name: "Province 1", value: 2100, fill: "hsl(var(--info))" },
    { name: "Gandaki", value: 1800, fill: "hsl(var(--success))" },
    { name: "Lumbini", value: 1500, fill: "hsl(var(--warning))" },
    { name: "Others", value: 2987, fill: "hsl(var(--muted-foreground))" },
  ];

  // Load hospital requests from localStorage
  useEffect(() => {
    const loadRequests = () => {
      const stored = JSON.parse(localStorage.getItem('hospitalRequests') || '[]');
      setHospitalRequests(stored);
    };
    loadRequests();
    const interval = setInterval(loadRequests, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleApproveRequest = (reqId: string) => {
    const updated = hospitalRequests.map((r) => r.id === reqId ? { ...r, status: 'approved', approvedAt: new Date().toISOString() } : r);
    setHospitalRequests(updated);
    localStorage.setItem('hospitalRequests', JSON.stringify(updated));
    if (selectedRequest && selectedRequest.id === reqId) {
      setSelectedRequest(updated.find(r => r.id === reqId) || null);
    }
    const approvedReq = updated.find(r => r.id === reqId);
    if (approvedReq?.matchedDonors?.length) {
      approvedReq.matchedDonors.forEach((d: any) => {
        const info = findDonorContact(d.id);
        console.log(`[CALL] Calling ${info.phone || 'unknown'} for ${info.name} [${d.id}]`);
        console.log(`[MESSAGE] SMS sent to ${info.phone || 'unknown'} for ${info.name} [${d.id}]`);
      });
    }
  };

  useEffect(() => {
    if (selectedRequest && detailsRef.current) {
      // Slight delay to ensure DOM paint
      setTimeout(() => {
        detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }, [selectedRequest]);

  // Notifications
  const notifications = [
    { 
      type: "critical", 
      message: "Critical request from TUTH needs immediate review",
      time: "5 min ago"
    },
    { 
      type: "info", 
      message: "New hospital registration: Pokhara Eye Hospital",
      time: "1 hour ago"
    },
    { 
      type: "success", 
      message: "Successful match completed for REQ-2024-0885",
      time: "3 hours ago"
    },
    { 
      type: "warning", 
      message: "3 donor samples pending verification",
      time: "5 hours ago"
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
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-7xl flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Cellula Admin</h1>
              <p className="text-xs text-muted-foreground">Platform Management</p>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            <Button 
              variant={activeTab === "overview" ? "secondary" : "ghost"}
              onClick={() => setActiveTab("overview")}
              className="gap-2"
            >
              <Activity className="h-4 w-4" />
              Overview
            </Button>
            <Button 
              variant={activeTab === "cell-requests" ? "secondary" : "ghost"}
              onClick={() => setActiveTab("cell-requests")}
              className="gap-2"
            >
              <Building2 className="h-4 w-4" />
              Cell Requests
            </Button>
            <Button 
              variant={activeTab === "new-registers" ? "secondary" : "ghost"}
              onClick={() => setActiveTab("new-registers")}
              className="gap-2"
            >
              <UserCheck className="h-4 w-4" />
              New Registers
            </Button>
            <Button 
              variant={activeTab === "cell-donors" ? "secondary" : "ghost"}
              onClick={() => setActiveTab("cell-donors")}
              className="gap-2"
            >
              <Dna className="h-4 w-4" />
              Cell Donors
            </Button>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] text-destructive-foreground flex items-center justify-center">
                4
              </span>
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 py-8">
        <div className="container max-w-7xl">{activeTab === "overview" && (
            <>
              {/* Stats Row */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className={`rounded-full p-2 bg-muted ${stat.color}`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-sm">
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-success" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-destructive" />
                    )}
                    <span className={stat.trend === "up" ? "text-success" : "text-destructive"}>
                      {stat.change}
                    </span>
                    <span className="text-muted-foreground">vs last month</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid gap-6 lg:grid-cols-3 mb-8">
            {/* Line Chart - Registrations */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Donor Registrations</CardTitle>
                <CardDescription>Monthly registration trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={registrationData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)"
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="donors" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--primary))" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Pie Chart - Regional */}
            <Card>
              <CardHeader>
                <CardTitle>Regional Distribution</CardTitle>
                <CardDescription>Donors by province</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={regionalData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {regionalData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)"
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bar Chart & Requests Row */}
          <div className="grid gap-6 lg:grid-cols-4 mb-8">
            {/* Bar Chart - Urgency */}
            <Card>
              <CardHeader>
                <CardTitle>Requests by Urgency</CardTitle>
                <CardDescription>Current active requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={urgencyData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                      <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" width={70} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)"
                        }}
                      />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {urgencyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Notifications Panel */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.map((notif, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-3 rounded-lg border border-border p-3"
                    >
                      <div className={`rounded-full p-1.5 ${
                        notif.type === "critical" ? "bg-destructive/10 text-destructive" :
                        notif.type === "warning" ? "bg-warning/10 text-warning" :
                        notif.type === "success" ? "bg-success/10 text-success" :
                        "bg-info/10 text-info"
                      }`}>
                        {notif.type === "critical" && <AlertCircle className="h-4 w-4" />}
                        {notif.type === "warning" && <Clock className="h-4 w-4" />}
                        {notif.type === "success" && <CheckCircle2 className="h-4 w-4" />}
                        {notif.type === "info" && <Building2 className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{notif.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
            </>
          )}

          {/* Cell Requests Tab */}
          {activeTab === "cell-requests" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Cell Requests from Hospitals
                  </CardTitle>
                  <CardDescription>Manage and review all donor matching requests from hospitals</CardDescription>
                </CardHeader>
                <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Hospital</TableHead>
                      <TableHead>Urgency</TableHead>
                      <TableHead>HLA Type</TableHead>
                      <TableHead>Matches</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hospitalRequests.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No hospital requests yet
                        </TableCell>
                      </TableRow>
                    )}
                    {hospitalRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.id}</TableCell>
                        <TableCell>
                          <div>
                            <div>{request.hospital}</div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {request.location}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            request.urgency === "critical" ? "border-destructive/50 text-destructive bg-destructive/10" :
                            request.urgency === "urgent" ? "border-warning/50 text-warning bg-warning/10" :
                            "border-success/50 text-success bg-success/10"
                          }>
                            {request.urgency}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-mono text-xs text-muted-foreground max-w-[200px] truncate" title={request.patientHLA}>
                            {request.patientHLA}
                          </div>
                        </TableCell>
                        <TableCell><span className="font-semibold">{request.matches}</span></TableCell>
                        <TableCell>
                          <Badge variant={
                            request.status === "pending" ? "secondary" :
                            request.status === "approved" ? "default" :
                            "outline"
                          }>
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{request.date}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 gap-1"
                              onClick={() => setSelectedRequest(request)}
                            >
                              <Eye className="h-3.5 w-3.5" />
                              Review
                            </Button>
                            {/* Admin approval removed; outreach occurs on hospital submission */}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {selectedRequest && (
              <Card className="mt-6 border-primary/30" ref={detailsRef}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Request Details</CardTitle>
                      <CardDescription>{selectedRequest.hospital} • {selectedRequest.id}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Admin approval removed; keep review-only actions */}
                      <Button variant="ghost" size="sm" onClick={() => setSelectedRequest(null)}>
                        <X className="h-4 w-4" /> Close
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                    <div><span className="text-muted-foreground">Hospital:</span> {selectedRequest.hospital}</div>
                    <div><span className="text-muted-foreground">Location:</span> {selectedRequest.location}</div>
                    <div><span className="text-muted-foreground">Urgency:</span> {selectedRequest.urgency}</div>
                    <div><span className="text-muted-foreground">Scenario:</span> {selectedRequest.scenario || '-'}</div>
                    <div><span className="text-muted-foreground">Patient HLA:</span> <span className="font-mono text-xs">{selectedRequest.patientHLA}</span></div>
                    {selectedRequest.patientAbo && (
                      <div><span className="text-muted-foreground">Patient ABO:</span> {selectedRequest.patientAbo}</div>
                    )}
                    <div><span className="text-muted-foreground">Radius:</span> {selectedRequest.radiusKm} km</div>
                    <div><span className="text-muted-foreground">Matches:</span> {selectedRequest.matches}</div>
                    <div><span className="text-muted-foreground">Status:</span> {selectedRequest.status}</div>
                    <div><span className="text-muted-foreground">Date:</span> {new Date(selectedRequest.date).toLocaleString()}</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">Matched Donors ({selectedRequest.matchedDonors?.length || 0})</CardTitle>
                    </div>
                    <div className="rounded-lg border border-border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Donor ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Distance</TableHead>
                            <TableHead>HLA Match</TableHead>
                            <TableHead>Age</TableHead>
                            <TableHead>Gender</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedRequest.matchedDonors && selectedRequest.matchedDonors.length > 0 ? (
                            selectedRequest.matchedDonors.map((d: any) => (
                              <TableRow key={d.id}>
                                <TableCell className="font-medium">{d.id}</TableCell>
                                <TableCell>{findDonorContact(d.id).name}</TableCell>
                                <TableCell>{findDonorContact(d.id).phone || '—'}</TableCell>
                                <TableCell>{d.location}</TableCell>
                                <TableCell>{d.distance} km</TableCell>
                                <TableCell>{d.hlaMatch ?? d.matchScore ?? 0}%</TableCell>
                                <TableCell>{d.age ?? '-'}</TableCell>
                                <TableCell>{d.gender ?? '-'}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">No donor list provided</TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            </>
          )}

          {/* New Registers Tab */}
          {activeTab === "cell-donors" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dna className="h-5 w-5 text-primary" />
                  Verified Cell Donors
                </CardTitle>
                <CardDescription>Approved donors with HLA typing information</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Donor ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Age / Gender</TableHead>
                      <TableHead>Blood Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>HLA Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Approved Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registeredDonors.filter((donor: any) => donor.status === "approved").length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No verified donors yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      registeredDonors
                        .filter((donor: any) => donor.status === "approved")
                        .sort((a: any, b: any) => new Date(b.approvedDate || b.registrationDate).getTime() - new Date(a.approvedDate || a.registrationDate).getTime())
                        .map((donor) => (
                        <TableRow key={donor.id}>
                          <TableCell className="font-medium">{donor.id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{donor.firstName} {donor.lastName}</div>
                              <div className="text-xs text-muted-foreground">
                                {donor.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {donor.age} years • {donor.gender}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{donor.bloodType}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              {donor.province}
                            </div>
                          </TableCell>
                          <TableCell>
                            {donor.medicalReport?.hlaA && donor.medicalReport?.hlaB ? (
                              <div className="text-xs space-y-1">
                                <div className="font-mono">
                                  A: {donor.medicalReport.hlaA}
                                </div>
                                <div className="font-mono">
                                  B: {donor.medicalReport.hlaB}
                                </div>
                                <div className="font-mono">
                                  C: {donor.medicalReport.hlaC}
                                </div>
                                <div className="font-mono">
                                  DR: {donor.medicalReport.hlaDR}
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-xs">Not available</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-success hover:bg-success/80">Approved</Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {donor.approvedDate ? new Date(donor.approvedDate).toLocaleDateString() : new Date(donor.registrationDate).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {activeTab === "new-registers" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-primary" />
                  New Donor Registrations
                </CardTitle>
                <CardDescription>Recent registrations and sample report status</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Donor ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Blood Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Sample Status</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Registration Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registeredDonors.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No new registrations yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      registeredDonors
                        .sort((a: any, b: any) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime())
                        .map((donor) => (
                        <TableRow key={donor.id}>
                          <TableCell className="font-medium">{donor.id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{donor.firstName} {donor.lastName}</div>
                              <div className="text-xs text-muted-foreground">
                                {donor.age}yrs • {donor.gender}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="text-muted-foreground">{donor.email}</div>
                              <div className="text-xs text-muted-foreground">{donor.phone}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{donor.bloodType}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              {donor.province}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                donor.sampleStatus === "completed" ? "default" :
                                donor.sampleStatus === "processing" ? "secondary" :
                                donor.sampleStatus === "collected" ? "outline" :
                                "destructive"
                              }
                              className={
                                donor.sampleStatus === "completed" ? "bg-success hover:bg-success/80" :
                                donor.sampleStatus === "processing" ? "bg-warning hover:bg-warning/80" :
                                donor.sampleStatus === "collected" ? "border-info text-info" :
                                ""
                              }
                            >
                              {donor.sampleStatus === "pending" && <Clock className="h-3 w-3 mr-1" />}
                              {donor.sampleStatus === "collected" && <FileText className="h-3 w-3 mr-1" />}
                              {donor.sampleStatus === "processing" && <Activity className="h-3 w-3 mr-1" />}
                              {donor.sampleStatus === "completed" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                              {donor.sampleStatus.charAt(0).toUpperCase() + donor.sampleStatus.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {donor.status === "rejected" ? (
                              <div className="flex flex-col gap-1">
                                <Badge variant="destructive" className="w-fit">
                                  <X className="h-3 w-3 mr-1" />
                                  Rejected
                                </Badge>
                                {donor.rejectionReason && (
                                  <div className="text-xs text-muted-foreground" title={donor.rejectionReason}>
                                    {donor.rejectionReason.substring(0, 30)}...
                                  </div>
                                )}
                              </div>
                            ) : donor.status === "approved" ? (
                              <Badge variant="default" className="w-fit">
                                <Check className="h-3 w-3 mr-1" />
                                Approved
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="w-fit">
                                <Clock className="h-3 w-3 mr-1" />
                                Pending
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(donor.registrationDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button 
                                variant={donor.medicalReport ? "default" : "ghost"}
                                size="sm" 
                                className="h-8 gap-1"
                                onClick={() => {
                                  // Get latest donor data from localStorage
                                  console.log('Clicked View Report for donor:', donor.id);
                                  console.log('Current donor state:', donor);
                                  const allDonors = JSON.parse(localStorage.getItem('allDonors') || '[]');
                                  console.log('All donors in storage:', allDonors.length);
                                  const latestDonor = allDonors.find((d: any) => d.id === donor.id);
                                  console.log('Latest donor found:', latestDonor);
                                  if (latestDonor) {
                                    console.log('Setting selectedDonor to latestDonor');
                                    setSelectedDonor(latestDonor);
                                  } else {
                                    console.log('Setting selectedDonor to current donor');
                                    setSelectedDonor(donor);
                                  }
                                }}
                                disabled={!donor.medicalReport}
                              >
                                <Eye className="h-3.5 w-3.5" />
                                {donor.medicalReport ? "View Report" : "No Report"}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Donor Report Viewer Modal */}
      {selectedDonor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Donor Report - {selectedDonor.firstName} {selectedDonor.lastName}</CardTitle>
                  <CardDescription>{selectedDonor.id} • {new Date(selectedDonor.registrationDate).toLocaleDateString()}</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedDonor(null)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {selectedDonor.medicalReport ? (
                <div className="space-y-6">
                  {/* Donor Info */}
                  <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div>
                      <Label className="text-xs text-muted-foreground">Full Name</Label>
                      <p className="font-medium">{selectedDonor.firstName} {selectedDonor.lastName}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Age / Gender</Label>
                      <p className="font-medium">{selectedDonor.age} years • {selectedDonor.gender}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Blood Type</Label>
                      <Badge variant="outline">{selectedDonor.bloodType}</Badge>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Location</Label>
                      <p className="font-medium">{selectedDonor.province}</p>
                    </div>
                  </div>

                  {/* Physical Assessment */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Physical Assessment</h3>
                    <div className="grid md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Label className="text-xs text-muted-foreground">Height</Label>
                        <p className="font-medium">{selectedDonor.medicalReport.height} cm</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Weight</Label>
                        <p className="font-medium">{selectedDonor.medicalReport.weight} kg</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Blood Pressure</Label>
                        <p className="font-medium">{selectedDonor.medicalReport.bloodPressure}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Heart Rate</Label>
                        <p className="font-medium">{selectedDonor.medicalReport.heartRate} bpm</p>
                      </div>
                    </div>
                  </div>

                  {/* HLA Typing */}
                  <div className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
                    <h3 className="font-semibold text-lg mb-3 text-blue-900">HLA Typing</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <Label className="text-xs text-blue-700 font-semibold">HLA-A</Label>
                        <p className="font-medium text-lg">{selectedDonor.medicalReport.hlaA}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-blue-700 font-semibold">HLA-B</Label>
                        <p className="font-medium text-lg">{selectedDonor.medicalReport.hlaB}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-blue-700 font-semibold">HLA-C</Label>
                        <p className="font-medium text-lg">{selectedDonor.medicalReport.hlaC}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-blue-700 font-semibold">HLA-DR</Label>
                        <p className="font-medium text-lg">{selectedDonor.medicalReport.hlaDR}</p>
                      </div>
                    </div>
                  </div>

                  {/* Medical History */}
                  {selectedDonor.medicalReport.medicalHistory && (
                    <div className="space-y-2">
                      <h4 className="font-semibold">Medical History</h4>
                      <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-lg">
                        {selectedDonor.medicalReport.medicalHistory}
                      </p>
                    </div>
                  )}

                  {/* Lab Results */}
                  {selectedDonor.medicalReport.labResults && (
                    <div className="space-y-2">
                      <h4 className="font-semibold">Laboratory Test Results</h4>
                      <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                        {selectedDonor.medicalReport.labResults}
                      </p>
                    </div>
                  )}

                  {/* Doctor Notes */}
                  {selectedDonor.medicalReport.doctorNotes && (
                    <div className="space-y-2">
                      <h4 className="font-semibold">Doctor's Notes</h4>
                      <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                        {selectedDonor.medicalReport.doctorNotes}
                      </p>
                    </div>
                  )}

                  {/* Eligibility */}
                  {selectedDonor.medicalReport.eligibility && (
                    <div className="p-4 bg-gray-50 rounded-lg border-l-4" style={{
                      borderLeftColor: selectedDonor.medicalReport.eligibility === 'eligible' ? '#10b981' :
                                      selectedDonor.medicalReport.eligibility === 'conditional' ? '#f59e0b' :
                                      '#ef4444'
                    }}>
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Eligibility Status</h4>
                        <Badge className={
                          selectedDonor.medicalReport.eligibility === 'eligible' ? 'bg-green-500' :
                          selectedDonor.medicalReport.eligibility === 'conditional' ? 'bg-yellow-500' :
                          selectedDonor.medicalReport.eligibility === 'not-eligible' ? 'bg-red-500' :
                          'bg-gray-500'
                        }>
                          {selectedDonor.medicalReport.eligibility.charAt(0).toUpperCase() + selectedDonor.medicalReport.eligibility.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  )}

                  {/* Report Document */}
                  {selectedDonor.medicalReport.reportFileName && (
                    <div className="border-2 border-amber-300 rounded-lg p-4 bg-amber-50">
                      <h4 className="font-semibold mb-3 text-amber-900">Uploaded Report Document</h4>
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-amber-600" />
                        <div className="flex-1">
                          <p className="font-medium">{selectedDonor.medicalReport.reportFileName}</p>
                          <p className="text-xs text-muted-foreground">
                            Uploaded on {new Date(selectedDonor.medicalReport.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = selectedDonor.medicalReport.reportFileData;
                            link.download = selectedDonor.medicalReport.reportFileName;
                            link.click();
                          }}
                        >
                          Download
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // No report yet
                <div className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="h-12 w-12 text-amber-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Medical Report Yet</h3>
                  <p className="text-muted-foreground text-center max-w-sm mb-4">
                    This donor has not yet submitted their medical report.
                  </p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Current Status:</p>
                    <p className="font-semibold">Sample Status: <Badge>{selectedDonor.sampleStatus}</Badge></p>
                    <p className="font-semibold">Status: <Badge>{selectedDonor.status}</Badge></p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedDonor(null)}
                >
                  Close
                </Button>
                {selectedDonor.medicalReport && (
                  <>
                    {selectedDonor.status === 'approved' && (
                      <Button 
                        className="gap-2"
                        variant="default"
                        disabled
                      >
                        <Check className="h-4 w-4" />
                        ✓ Already Approved
                      </Button>
                    )}
                    {selectedDonor.status === 'report_submitted' && (
                      <Button 
                        className="gap-2"
                        variant="default"
                        onClick={() => {
                          console.log('Approve button clicked');
                          console.log('Current selectedDonor:', selectedDonor);
                          handleApproveDonor();
                        }}
                      >
                        <Check className="h-4 w-4" />
                        Approve Donor
                      </Button>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminDashboard;