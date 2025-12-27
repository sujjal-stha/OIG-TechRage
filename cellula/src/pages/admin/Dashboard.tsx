import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  X
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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.removeItem('adminSession');
    navigate("/admin/login");
  };

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

  // Mock hospital requests
  const hospitalRequests = [
    { 
      id: "REQ-2024-0892", 
      hospital: "Tribhuvan University Teaching Hospital",
      urgency: "critical",
      location: "Kathmandu",
      matches: 5,
      status: "pending",
      date: "2024-12-26",
      patientBloodType: "O+",
      patientHLA: "A*02:01, B*07:02, DRB1*15:01",
      patientAge: 45,
      patientGender: "M",
      matchedDonors: [
        { id: "CL-2024-00123", bloodType: "O+", hla: "A*02:01, B*07:02, DRB1*15:01", location: "Kathmandu", distance: 5, matchScore: 100, age: 28, gender: "M" },
        { id: "CL-2024-00456", bloodType: "O+", hla: "A*02:01, B*07:02, DRB1*03:01", location: "Lalitpur", distance: 8, matchScore: 67, age: 32, gender: "F" },
        { id: "CL-2024-01345", bloodType: "O+", hla: "A*02:01, B*07:02, DRB1*15:01", location: "Kathmandu", distance: 4, matchScore: 100, age: 29, gender: "M" },
        { id: "CL-2024-01901", bloodType: "O+", hla: "A*02:01, B*15:01, DRB1*15:01", location: "Kathmandu", distance: 10, matchScore: 67, age: 27, gender: "M" },
        { id: "CL-2024-00789", bloodType: "O+", hla: "A*02:01, B*44:02, DRB1*15:01", location: "Bhaktapur", distance: 12, matchScore: 67, age: 25, gender: "M" },
      ]
    },
    { 
      id: "REQ-2024-0891", 
      hospital: "Grande International Hospital",
      urgency: "urgent",
      location: "Kathmandu",
      matches: 18,
      status: "pending",
      date: "2024-12-25",
      patientBloodType: "O+",
      patientHLA: "A*24:02, B*07:02, DRB1*15:01",
      patientAge: 32,
      patientGender: "F",
      matchedDonors: []
    },
    { 
      id: "REQ-2024-0890", 
      hospital: "Bir Hospital",
      urgency: "standard",
      location: "Kathmandu",
      matches: 34,
      status: "approved",
      date: "2024-12-24",
      patientBloodType: "O+",
      patientHLA: "A*02:01, B*07:02, DRB1*15:01",
      patientAge: 28,
      patientGender: "M",
      matchedDonors: []
    },
    { 
      id: "REQ-2024-0889", 
      hospital: "Nepal Cancer Hospital",
      urgency: "urgent",
      location: "Lalitpur",
      matches: 12,
      status: "approved",
      date: "2024-12-23",
      patientBloodType: "A+",
      patientHLA: "A*11:01, B*35:01, DRB1*04:01",
      patientAge: 38,
      patientGender: "F",
      matchedDonors: []
    },
    { 
      id: "REQ-2024-0888", 
      hospital: "Chitwan Medical College",
      urgency: "standard",
      location: "Chitwan",
      matches: 28,
      status: "completed",
      date: "2024-12-22"
    },
  ];

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
      
      <main className="flex-1 py-8">
        <div className="container max-w-7xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Cellula Platform Management</p>
              </div>
            </div>
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

          {/* Hospital Requests Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Hospital Requests
              </CardTitle>
              <CardDescription>Manage and review donor matching requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Hospital</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>HLA Type</TableHead>
                    <TableHead>Blood</TableHead>
                    <TableHead>Matches</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
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
                      <TableCell>
                        <Badge variant="outline">{request.patientBloodType}</Badge>
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
                          {request.status === "pending" && (
                            <Button variant="default" size="sm" className="h-8 gap-1">
                              <Check className="h-3.5 w-3.5" />
                              Approve
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Review Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full my-8 relative max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Request Details</h2>
                <p className="text-sm text-muted-foreground">{selectedRequest.id}</p>
              </div>
              <Button
                onClick={() => setSelectedRequest(null)}
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* Hospital & Patient Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Hospital Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">Hospital Name:</span>
                      <p className="font-semibold">{selectedRequest.hospital}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Location:</span>
                      <p className="font-semibold flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {selectedRequest.location}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Request Date:</span>
                      <p className="font-semibold">{selectedRequest.date}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Urgency Level:</span>
                      <div className="mt-1">
                        <Badge variant="outline" className={
                          selectedRequest.urgency === "critical" ? "border-destructive/50 text-destructive bg-destructive/10" :
                          selectedRequest.urgency === "urgent" ? "border-warning/50 text-warning bg-warning/10" :
                          "border-success/50 text-success bg-success/10"
                        }>
                          {selectedRequest.urgency.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Patient Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">Blood Type:</span>
                      <div className="mt-1">
                        <Badge variant="outline" className="text-base">{selectedRequest.patientBloodType}</Badge>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Age:</span>
                      <p className="font-semibold">{selectedRequest.patientAge} years</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Gender:</span>
                      <p className="font-semibold">{selectedRequest.patientGender === 'M' ? 'Male' : 'Female'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">HLA Typing:</span>
                      <p className="font-mono text-sm bg-muted p-2 rounded mt-1">{selectedRequest.patientHLA}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Matched Donors */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Matched Donors ({selectedRequest.matchedDonors?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedRequest.matchedDonors && selectedRequest.matchedDonors.length > 0 ? (
                    <div className="space-y-3">
                      {selectedRequest.matchedDonors.map((donor: any, index: number) => (
                        <div 
                          key={donor.id}
                          className={`p-4 rounded-lg border-2 ${
                            donor.matchScore >= 90 ? 'border-success/50 bg-success/5' :
                            donor.matchScore >= 70 ? 'border-warning/50 bg-warning/5' :
                            'border-muted bg-muted/20'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                                #{index + 1}
                              </div>
                              <div>
                                <h4 className="font-semibold text-lg">{donor.id}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {donor.age}yrs • {donor.gender === 'M' ? 'Male' : 'Female'} • {donor.location}
                                </p>
                              </div>
                            </div>
                            <Badge className={`${
                              donor.matchScore >= 90 ? 'bg-success' :
                              donor.matchScore >= 70 ? 'bg-warning' :
                              'bg-muted-foreground'
                            } text-white font-bold text-base px-3 py-1`}>
                              {donor.matchScore}% Match
                            </Badge>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <span className="text-xs text-muted-foreground font-semibold">BLOOD TYPE:</span>
                              <div className="mt-1">
                                <Badge variant="outline">{donor.bloodType}</Badge>
                              </div>
                            </div>
                            <div>
                              <span className="text-xs text-muted-foreground font-semibold">DISTANCE:</span>
                              <p className="text-sm font-medium">{donor.distance} km from hospital</p>
                            </div>
                          </div>

                          <div className="mt-3 p-3 bg-background rounded-lg">
                            <span className="text-xs text-muted-foreground font-semibold">HLA TYPING:</span>
                            <p className="font-mono text-sm mt-1">{donor.hla}</p>
                          </div>

                          <div className="flex gap-2 mt-3">
                            <Button size="sm" className="flex-1">
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Approve Match
                            </Button>
                            <Button size="sm" variant="outline">
                              Contact Donor
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No donor details available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                  Close
                </Button>
                {selectedRequest.status === "pending" && (
                  <>
                    <Button variant="destructive">
                      Reject Request
                    </Button>
                    <Button>
                      <Check className="h-4 w-4 mr-1" />
                      Approve Request
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminDashboard;