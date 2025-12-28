// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { MapContainer, TileLayer, Circle, CircleMarker, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Header from "@/components/layout/Header";
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
  Eye,
  FileText,
  UserCheck,
  Send,
  Calendar,
  Activity
} from "lucide-react";

const HospitalDashboard = () => {
  const navigate = useNavigate();
  const [showHeader, setShowHeader] = useState(true);
  const [activeTab, setActiveTab] = useState("requests");
  const [searchRadius, setSearchRadius] = useState([50]);
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [isMapReady, setIsMapReady] = useState(true);
  const [showRadar, setShowRadar] = useState(false);
  const [hlaA, setHlaA] = useState("");
  const [hlaB, setHlaB] = useState("");
  const [hlaC, setHlaC] = useState("");
  const [hlaDRB1, setHlaDRB1] = useState("");
  const [hlaDQB1, setHlaDQB1] = useState("");
  const [patientABO, setPatientABO] = useState("");
  const [transplantScenario, setTransplantScenario] = useState("hsct-unrelated");
  const [urgencyLevel, setUrgencyLevel] = useState("urgent");
  const [donorResults, setDonorResults] = useState<any[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [checkReports, setCheckReports] = useState<{[key: string]: any}>({});
  const [rejectionReasons, setRejectionReasons] = useState<{[key: string]: string}>({});
  const [registeredDonors, setRegisteredDonors] = useState<any[]>([]);
  const radarTimeoutRef = useRef<number | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  // Helpers to persist hospital requests
  const saveHospitalRequest = (request: any) => {
    try {
      const existing = JSON.parse(localStorage.getItem('hospitalRequests') || '[]');
      const updated = [request, ...existing];
      localStorage.setItem('hospitalRequests', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save hospital request', err);
    }
  };

  // Seed demo donors (only if missing) matching the provided patient HLA markers
  useEffect(() => {
    const seedDonors = () => {
      const existing = JSON.parse(localStorage.getItem('allDonors') || '[]');
      const demoIds = ['DEMO-HLA-001', 'DEMO-HLA-002', 'DEMO-HLA-003'];
      const alreadyPresent = new Set(existing.map((d: any) => d.id));
      const demoDonors = [
        {
          id: 'DEMO-HLA-001',
          firstName: 'Arjun',
          lastName: 'Khadka',
          age: 29,
          gender: 'Male',
          phone: '+977-9811110001',
          email: 'arjun.k@example.com',
          municipality: 'Maharajgunj',
          district: 'Kathmandu',
          bloodType: 'O+',
          sampleMethod: 'Home pickup',
          sampleStatus: 'completed',
          status: 'report_submitted',
          location: 'Maharajgunj, Kathmandu',
          medicalReport: {
            height: '175',
            weight: '70',
            bloodPressure: '118/76',
            heartRate: '72',
            medicalHistory: 'No significant history',
            labResults: 'CBC within normal limits',
            hlaA: 'A*01:01',
            hlaB: 'B*07:02',
            hlaC: 'C*01:02',
            hlaDRB1: 'DRB1*01:01',
            hlaDQB1: 'DQB1*02:01',
            hlaType: 'A*01:01, B*07:02, C*01:02, DRB1*01:01, DQB1*02:01',
            doctorNotes: 'Fit for donation',
            eligibility: 'eligible',
            rejectionReason: null,
            reportFileName: 'report-arjun.pdf',
            reportFileData: null,
            submittedAt: new Date().toISOString(),
          },
        },
        {
          id: 'DEMO-HLA-002',
          firstName: 'Sita',
          lastName: 'Maharjan',
          age: 34,
          gender: 'Female',
          phone: '+977-9811110002',
          email: 'sita.m@example.com',
          municipality: 'Patan',
          district: 'Lalitpur',
          bloodType: 'A+',
          sampleMethod: 'Clinic',
          sampleStatus: 'completed',
          status: 'report_submitted',
          location: 'Patan, Lalitpur',
          medicalReport: {
            height: '162',
            weight: '60',
            bloodPressure: '116/74',
            heartRate: '70',
            medicalHistory: 'Mild seasonal allergies',
            labResults: 'CBC and LFT normal',
            hlaA: 'A*01:01',
            hlaB: 'B*07:02',
            hlaC: 'C*01:02',
            hlaDRB1: 'DRB1*01:01',
            hlaDQB1: 'DQB1*02:01',
            hlaType: 'A*01:01, B*07:02, C*01:02, DRB1*01:01, DQB1*02:01',
            doctorNotes: 'Eligible, no contraindications',
            eligibility: 'eligible',
            rejectionReason: null,
            reportFileName: 'report-sita.pdf',
            reportFileData: null,
            submittedAt: new Date().toISOString(),
          },
        },
        {
          id: 'DEMO-HLA-003',
          firstName: 'Prakash',
          lastName: 'Rai',
          age: 27,
          gender: 'Male',
          phone: '+977-9811110003',
          email: 'prakash.r@example.com',
          municipality: 'Bhaktapur',
          district: 'Bhaktapur',
          bloodType: 'B+',
          sampleMethod: 'Clinic',
          sampleStatus: 'completed',
          status: 'report_submitted',
          location: 'Bhaktapur',
          medicalReport: {
            height: '168',
            weight: '65',
            bloodPressure: '120/78',
            heartRate: '74',
            medicalHistory: 'Active, non-smoker',
            labResults: 'CBC, LFT, KFT normal',
            hlaA: 'A*01:01',
            hlaB: 'B*07:02',
            hlaC: 'C*01:02',
            hlaDRB1: 'DRB1*01:01',
            hlaDQB1: 'DQB1*02:01',
            hlaType: 'A*01:01, B*07:02, C*01:02, DRB1*01:01, DQB1*02:01',
            doctorNotes: 'Good candidate, low risk',
            eligibility: 'eligible',
            rejectionReason: null,
            reportFileName: 'report-prakash.pdf',
            reportFileData: null,
            submittedAt: new Date().toISOString(),
          },
        },
      ];

      const merged = [...existing, ...demoDonors.filter(d => !alreadyPresent.has(d.id))];
      if (merged.length !== existing.length) {
        localStorage.setItem('allDonors', JSON.stringify(merged));
      }
    };

    seedDonors();
  }, []);

  // Load registered donors from localStorage
  useEffect(() => {
    const donors = JSON.parse(localStorage.getItem('allDonors') || '[]');
    setRegisteredDonors(donors);
  }, [activeTab]);

  useEffect(() => {
    return () => {
      if (radarTimeoutRef.current) {
        clearTimeout(radarTimeoutRef.current);
      }
    };
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

  const handleStatusChange = (donorId: string, newStatus: string) => {
    const donors = JSON.parse(localStorage.getItem('allDonors') || '[]');
    const donor = donors.find((d: any) => d.id === donorId);
    
    if (!donor) return;

    // Define status progression order
    const statusOrder = ['pending', 'collected', 'processing', 'completed'];
    const currentIndex = statusOrder.indexOf(donor.sampleStatus);
    const newIndex = statusOrder.indexOf(newStatus);

    // Only allow progression to next status or staying at current status
    if (newIndex !== currentIndex + 1 && newIndex !== currentIndex) {
      alert('You can only proceed to the next status. Current progression: Pending → Collected → Processing → Completed');
      return;
    }

    // Don't allow changes once completed and report is submitted
    if (donor.sampleStatus === 'completed' && donor.medicalReport) {
      alert('Cannot change status - report has already been submitted');
      return;
    }

    const updatedDonors = donors.map((d: any) => 
      d.id === donorId ? { ...d, sampleStatus: newStatus } : d
    );
    localStorage.setItem('allDonors', JSON.stringify(updatedDonors));
    setRegisteredDonors(updatedDonors);
  };

  // Combine HLA fields into single string
  const patientHLA = [hlaA, hlaB, hlaC, hlaDRB1, hlaDQB1]
    .filter(Boolean)
    .join(', ');

  const patientProfile = {
    hlaA,
    hlaB,
    hlaC,
    hlaDRB1,
    hlaDQB1,
    abo: patientABO,
    scenario: transplantScenario,
  };

  // Persist search criteria to localStorage for future visits
  useEffect(() => {
    try {
      localStorage.setItem('patientSearchCriteria', JSON.stringify(patientProfile));
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hlaA, hlaB, hlaC, hlaDRB1, hlaDQB1, patientABO, transplantScenario]);

  const hospitalData = {
    name: "Tribhuvan University Teaching Hospital",
    id: "HOSP-KTM-001",
    location: "Maharajgunj, Kathmandu",
    coordinates: {
      lat: 27.7347,
      lng: 85.3277,
    },
  };

  const hospitalCenter: L.LatLngExpression = [hospitalData.coordinates.lat, hospitalData.coordinates.lng];

  const mockResults = {
    totalMatches: 23,
    highQuality: 8,
    mediumQuality: 12,
    lowQuality: 3,
  };

  const defaultMarkerIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const hospitalMarkerIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [30, 46],
    iconAnchor: [15, 46],
    popupAnchor: [1, -38],
    shadowSize: [46, 46],
  });

  const MapCenterer = ({ center }: { center: L.LatLngExpression }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(center, 13, { animate: true });
    }, [center, map]);
    return null;
  };

  const FitCircle = ({ center, radiusMeters }: { center: L.LatLngExpression; radiusMeters: number }) => {
    const map = useMap();
    useEffect(() => {
      if (!map) return;
      const ll = Array.isArray(center) ? L.latLng(center[0] as number, center[1] as number) : center;
      map.whenReady(() => {
        // Add circle to map to ensure projection is available
        const tempCircle = L.circle(ll, { radius: radiusMeters }).addTo(map);
        const bounds = tempCircle.getBounds();
        // Ensure layout is settled before fitting
        requestAnimationFrame(() => {
          map.invalidateSize();
          map.fitBounds(bounds, { padding: [24, 24], animate: true });
          tempCircle.remove();
        });
      });
    }, [center, radiusMeters, map]);
    return null;
  };

  const generateOffsetCoords = (center: { lat: number; lng: number }, distanceKm: number) => {
    const earthRadiusKm = 6371;
    const randomBearing = Math.random() * 2 * Math.PI;
    const angularDistance = distanceKm / earthRadiusKm;

    const latRad = (center.lat * Math.PI) / 180;
    const lngRad = (center.lng * Math.PI) / 180;

    const newLatRad = Math.asin(
      Math.sin(latRad) * Math.cos(angularDistance) +
        Math.cos(latRad) * Math.sin(angularDistance) * Math.cos(randomBearing)
    );

    const newLngRad =
      lngRad +
      Math.atan2(
        Math.sin(randomBearing) * Math.sin(angularDistance) * Math.cos(latRad),
        Math.cos(angularDistance) - Math.sin(latRad) * Math.sin(newLatRad)
      );

    return {
      lat: (newLatRad * 180) / Math.PI,
      lng: (newLngRad * 180) / Math.PI,
    };
  };

  const handleSubmitReport = (appointmentId: string) => {
    const report = checkReports[appointmentId];
    
    // Validate required fields
    if (!report?.hlaA || !report?.hlaB || !report?.hlaC || !report?.hlaDRB1 || !report?.hlaDQB1) {
      alert('Please fill in all HLA types');
      return;
    }
    
    if (!report?.reportFile) {
      alert('Please upload a medical report document');
      return;
    }

    if (!report?.eligibility) {
      alert('Please select donor eligibility status');
      return;
    }

    if (report?.eligibility === 'not-eligible' && !rejectionReasons[appointmentId]) {
      alert('Please provide a reason for rejection');
      return;
    }

    // Get file as base64 for localStorage
    const reader = new FileReader();
    reader.onloadend = () => {
      const donors = JSON.parse(localStorage.getItem('allDonors') || '[]');
      const updatedDonors = donors.map((donor: any) => {
        if (donor.id === selectedAppointment.id) {
          return {
            ...donor,
            sampleStatus: 'completed',
            status: 'report_submitted',
            medicalReport: {
              height: report.height,
              weight: report.weight,
              bloodPressure: report.bloodPressure,
              heartRate: report.heartRate,
              medicalHistory: report.medicalHistory,
              labResults: report.labResults,
              hlaA: report.hlaA,
              hlaB: report.hlaB,
              hlaC: report.hlaC,
              hlaDRB1: report.hlaDRB1,
              hlaDQB1: report.hlaDQB1,
              hlaType: `${report.hlaA}, ${report.hlaB}, ${report.hlaC}, ${report.hlaDRB1}, ${report.hlaDQB1}`,
              doctorNotes: report.doctorNotes,
              eligibility: report.eligibility,
              rejectionReason: report.eligibility === 'not-eligible' ? rejectionReasons[appointmentId] : null,
              reportFileName: report.reportFileName,
              reportFileData: reader.result,
              submittedAt: new Date().toISOString()
            }
          };
        }
        return donor;
      });
      
      localStorage.setItem('allDonors', JSON.stringify(updatedDonors));
      
      alert('Report submitted successfully to admin!');
      setSelectedAppointment(null);
      setCheckReports({});
      
      // Reload donors
      setRegisteredDonors(updatedDonors);
    };
    
    reader.readAsDataURL(report.reportFile);
  };

  // Mock donor database with HLA types (anonymized for privacy)
  // Estimate distance from hospital by municipality/district (simple heuristic)
  const estimateDistanceKm = (donor: any) => {
    const name = (donor.municipality || donor.district || "").toLowerCase();
    if (name.includes("maharajgunj") || name.includes("kathmandu")) return 5;
    if (name.includes("lalitpur") || name.includes("patan")) return 8;
    if (name.includes("bhaktapur")) return 12;
    if (name.includes("kirtipur")) return 10;
    if (name.includes("thimi")) return 14;
    return 25; // default fallback
  };

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

  // Clinical compatibility rules (simplified but aligned with standards)
  const isCompatible = (donor: any, patient: typeof patientProfile) => {
    const d = donor.medicalReport || {};
    const da = d.hlaA?.toUpperCase();
    const db = d.hlaB?.toUpperCase();
    const dc = d.hlaC?.toUpperCase();
    const ddr = (d.hlaDRB1 || d.hlaDR)?.toUpperCase();
    const ddqb1 = (d.hlaDQB1 || '').toUpperCase();

    const pa = patient.hlaA?.toUpperCase();
    const pb = patient.hlaB?.toUpperCase();
    const pc = patient.hlaC?.toUpperCase();
    const pdr = patient.hlaDRB1?.toUpperCase();
    const pdqb1 = patient.hlaDQB1?.toUpperCase();

    const allPresent = pa && pb && pc && pdr;
    const matchA = !!(da && pa && da === pa);
    const matchB = !!(db && pb && db === pb);
    const matchC = !!(dc && pc && dc === pc);
    const matchDR = !!(ddr && pdr && ddr === pdr);
    const matchDQB1 = !!(ddqb1 && pdqb1 && ddqb1 === pdqb1);

    const aboOk = !patient.abo || (donor.bloodType && donor.bloodType === patient.abo);

    switch (patient.scenario) {
      case 'hsct-unrelated':
        // 8/8: A, B, C, DRB1 allele-level equality
        return !!(allPresent && matchA && matchB && matchC && matchDR);
      case 'hsct-sibling':
        // 6/6: A, B antigen-level and DRB1; here we treat equality of entered values
        return !!(matchA && matchB && matchDR);
      case 'haploidentical':
        // Approximation: at least one of A/B/DRB1 matches
        return !!(matchA || matchB || matchDR);
      case 'solid-organ':
        // Basic heuristic without DSA: require ABO compatible and ≤2 mismatches across A,B,DR
        if (!aboOk) return false;
        const loci = [matchA, matchB, matchDR];
        const matches = loci.filter(Boolean).length;
        const mismatches = 3 - matches;
        return mismatches <= 2; // allow up to 2 antigen mismatches
      default:
        return false;
    }
  };

  const compatibilityReason = (donor: any, patient: typeof patientProfile) => {
    const d = donor.medicalReport || {};
    const dd = {
      A: d.hlaA,
      B: d.hlaB,
      C: d.hlaC,
      DRB1: d.hlaDRB1 || d.hlaDR,
      DQB1: d.hlaDQB1,
    };
    const pp = {
      A: patient.hlaA,
      B: patient.hlaB,
      C: patient.hlaC,
      DRB1: patient.hlaDRB1,
      DQB1: patient.hlaDQB1,
    };
    const matched: string[] = [];
    Object.keys(dd).forEach((locus: any) => {
      if (dd[locus] && pp[locus] && String(dd[locus]).toUpperCase() === String(pp[locus]).toUpperCase()) {
        matched.push(locus);
      }
    });
    switch (patient.scenario) {
      case 'hsct-unrelated':
        return matched.length === 4 ? '8/8 match at A,B,C,DRB1' : `Matches: ${matched.join(', ') || 'None'}`;
      case 'hsct-sibling':
        return matched.includes('A') && matched.includes('B') && matched.includes('DRB1')
          ? '6/6 sibling match (A,B,DRB1)'
          : `Matches: ${matched.join(', ') || 'None'}`;
      case 'haploidentical':
        return matched.length > 0 ? `Shared at ${matched.join(', ')}` : 'No shared major loci';
      case 'solid-organ':
        return donor.bloodType && patient.abo && donor.bloodType !== patient.abo
          ? 'ABO incompatible'
          : `ABO ${donor.bloodType || '-'}; HLA matches: ${matched.join(', ') || 'None'}`;
      default:
        return '—';
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that all HLA types are filled
    if (!hlaA || !hlaB || !hlaC || !hlaDRB1 || !hlaDQB1) {
      alert('Please fill in all HLA types (HLA-A, HLA-B, HLA-C, HLA-DRB1, HLA-DQB1) before searching');
      return;
    }

    const buildResults = (radiusKm: number) => {
      const allDonors = JSON.parse(localStorage.getItem('allDonors') || '[]');
      const eligibleDonors = allDonors.filter((d: any) => d.medicalReport && d.medicalReport.eligibility === 'eligible');

      const enriched = eligibleDonors.map((d: any) => {
        const hla =
          d.medicalReport?.hlaType ||
          [
            d.medicalReport?.hlaA,
            d.medicalReport?.hlaB,
            d.medicalReport?.hlaC,
            d.medicalReport?.hlaDRB1 || d.medicalReport?.hlaDR,
            d.medicalReport?.hlaDQB1,
          ]
            .filter(Boolean)
            .join(', ');
        const distance = estimateDistanceKm(d);
        return {
          id: d.id,
          location: `${d.municipality || d.district || 'Unknown'}`,
          age: d.age,
          gender: d.gender,
          distance,
          hla,
          raw: d,
        };
      });

      const filtered = enriched.filter(donor => donor.distance <= radiusKm);
      const withScores = filtered.map(donor => ({
        ...donor,
        hlaMatch: calculateHLAMatch(donor.hla, patientHLA),
        compatible: isCompatible(donor.raw, patientProfile),
        reason: compatibilityReason(donor.raw, patientProfile),
      }));
      // Keep only compatible donors per selected scenario
      const onlyCompatible = withScores.filter(d => d.compatible);
      onlyCompatible.sort((a, b) => {
        if (b.hlaMatch.score !== a.hlaMatch.score) return b.hlaMatch.score - a.hlaMatch.score;
        return a.distance - b.distance;
      });
      return onlyCompatible.map((donor) => ({
        ...donor,
        coords: generateOffsetCoords(hospitalData.coordinates, donor.distance)
      }));
    };

    let currentRadius = searchRadius[0];
    let results = buildResults(currentRadius);

    while (results.length === 0 && currentRadius < 200) {
      currentRadius = Math.min(currentRadius + 20, 200);
      results = buildResults(currentRadius);
    }

    setSearchRadius([currentRadius]);
    setDonorResults(results);
    setSearchSubmitted(true);

    // Persist request for admin review ONLY if donors are found
    if (results.length > 0) {
      const requestId = `REQ-${Date.now()}`;
      const requestPayload = {
        id: requestId,
        hospital: hospitalData.name,
        hospitalId: hospitalData.id,
        location: hospitalData.location,
        urgency: urgencyLevel,
        scenario: transplantScenario,
        patientHLA,
        patientAbo: patientABO || null,
        radiusKm: currentRadius,
        matches: results.length,
        status: 'pending',
        date: new Date().toISOString(),
        matchedDonors: results.slice(0, 10).map((d) => ({
          id: d.id,
          location: d.location,
          distance: d.distance,
          hla: d.hla,
          hlaMatch: d.hlaMatch?.score ?? 0,
          age: d.age,
          gender: d.gender,
        })),
      };
      saveHospitalRequest(requestPayload);

      // Log outreach calls and SMS sent to nearest 3 compatible donors only
      console.log(`\n=== OUTREACH INITIATED ===`);
      console.log(`Hospital: ${hospitalData.name}`);
      console.log(`Request ID: ${requestId}`);
      console.log(`Compatible Donors Found: ${results.length}`);
      console.log(`Contacting Nearest 3 Donors`);
      console.log(`---\n`);
      
      results.slice(0, 3).forEach((donor, index) => {
        const donorInfo = donor.raw;
        const donorName = `${donorInfo.firstName} ${donorInfo.lastName}`;
        const donorPhone = donorInfo.phone || 'unknown';
        console.log(`[${index + 1}] CALL Calling ${donorPhone} for ${donorName} [${donor.id}] - Distance: ${donor.distance} km`);
        console.log(`[${index + 1}] SMS Message sent to ${donorPhone} for ${donorName} [${donor.id}]`);
      });
      
      if (results.length > 3) {
        console.log(`\n... and ${results.length - 3} more compatible donors available`);
      }
      console.log(`\n=== END OUTREACH LOG ===\n`);
    }

    if (radarTimeoutRef.current) {
      clearTimeout(radarTimeoutRef.current);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.removeItem('hospitalSession');
    navigate("/hospital/login");
  };

  // Smoothly scroll to donor results after a successful search
  useEffect(() => {
    if (searchSubmitted && donorResults.length > 0 && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [searchSubmitted, donorResults]);

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
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100">
              <Building2 className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Hospital Portal</h1>
              <p className="text-xs text-muted-foreground">{hospitalData.name}</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-1">
            <Button 
              variant={activeTab === "requests" ? "secondary" : "ghost"}
              onClick={() => setActiveTab("requests")}
              className="gap-2"
            >
              <Search className="h-4 w-4" />
              Requests
            </Button>
            <Button 
              variant={activeTab === "registry" ? "secondary" : "ghost"}
              onClick={() => setActiveTab("registry")}
              className="gap-2"
            >
              <UserCheck className="h-4 w-4" />
              Registry
            </Button>
          </nav>

          <div className="flex items-center gap-2">
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
        <div className="container max-w-none px-4">
          {activeTab === "requests" && (
            <>
          <div className="mb-8">
            <Card className="border-2 border-teal-200 shadow-xl bg-gradient-to-br from-teal-50 via-white to-cyan-50 overflow-hidden relative">
              <CardContent className="py-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-600 shadow-lg">
                        <Search className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
                        Donor Search Requests
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Submit new donor matching requests and view search history
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Left Panel - Search Form */}
            <div className="space-y-6">
              <Card className="max-w-2xl mx-auto border-2 border-primary/40">
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

                    <div className="space-y-3">
                      <Label htmlFor="patient-hla-group">HLA Markers (Patient)</Label>
                      <div id="patient-hla-group" className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground" htmlFor="patient-hla-a">HLA-A</Label>
                          <Select value={hlaA} onValueChange={setHlaA}>
                            <SelectTrigger id="patient-hla-a" name="patientHlaA" className="h-9">
                              <SelectValue placeholder="Select HLA-A" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A*01:01">A*01:01</SelectItem>
                              <SelectItem value="A*02:01">A*02:01</SelectItem>
                              <SelectItem value="A*03:01">A*03:01</SelectItem>
                              <SelectItem value="A*11:01">A*11:01</SelectItem>
                              <SelectItem value="A*24:02">A*24:02</SelectItem>
                            </SelectContent>
                          </Select>
                          <input type="hidden" name="patientHlaA" value={hlaA} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground" htmlFor="patient-hla-b">HLA-B</Label>
                          <Select value={hlaB} onValueChange={setHlaB}>
                            <SelectTrigger id="patient-hla-b" name="patientHlaB" className="h-9">
                              <SelectValue placeholder="Select HLA-B" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="B*07:02">B*07:02</SelectItem>
                              <SelectItem value="B*08:01">B*08:01</SelectItem>
                              <SelectItem value="B*35:01">B*35:01</SelectItem>
                              <SelectItem value="B*44:02">B*44:02</SelectItem>
                              <SelectItem value="B*51:01">B*51:01</SelectItem>
                            </SelectContent>
                          </Select>
                          <input type="hidden" name="patientHlaB" value={hlaB} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground" htmlFor="patient-hla-c">HLA-C</Label>
                          <Select value={hlaC} onValueChange={setHlaC}>
                            <SelectTrigger id="patient-hla-c" name="patientHlaC" className="h-9">
                              <SelectValue placeholder="Select HLA-C" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="C*01:02">C*01:02</SelectItem>
                              <SelectItem value="C*03:04">C*03:04</SelectItem>
                              <SelectItem value="C*04:01">C*04:01</SelectItem>
                              <SelectItem value="C*07:01">C*07:01</SelectItem>
                              <SelectItem value="C*07:02">C*07:02</SelectItem>
                            </SelectContent>
                          </Select>
                          <input type="hidden" name="patientHlaC" value={hlaC} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground" htmlFor="patient-hla-drb1">HLA-DRB1</Label>
                          <Select value={hlaDRB1} onValueChange={setHlaDRB1}>
                            <SelectTrigger id="patient-hla-drb1" name="patientHlaDRB1" className="h-9">
                              <SelectValue placeholder="Select HLA-DRB1" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="DRB1*01:01">DRB1*01:01</SelectItem>
                              <SelectItem value="DRB1*03:01">DRB1*03:01</SelectItem>
                              <SelectItem value="DRB1*04:01">DRB1*04:01</SelectItem>
                              <SelectItem value="DRB1*07:01">DRB1*07:01</SelectItem>
                              <SelectItem value="DRB1*15:01">DRB1*15:01</SelectItem>
                            </SelectContent>
                          </Select>
                          <input type="hidden" name="patientHlaDRB1" value={hlaDRB1} />
                        </div>
                        <div className="space-y-1 col-span-2">
                          <Label className="text-xs text-muted-foreground" htmlFor="patient-hla-dqb1">HLA-DQB1</Label>
                          <Select value={hlaDQB1} onValueChange={setHlaDQB1}>
                            <SelectTrigger id="patient-hla-dqb1" name="patientHlaDQB1" className="h-9">
                              <SelectValue placeholder="Select HLA-DQB1" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="DQB1*02:01">DQB1*02:01</SelectItem>
                              <SelectItem value="DQB1*03:01">DQB1*03:01</SelectItem>
                              <SelectItem value="DQB1*03:02">DQB1*03:02</SelectItem>
                              <SelectItem value="DQB1*05:01">DQB1*05:01</SelectItem>
                              <SelectItem value="DQB1*06:02">DQB1*06:02</SelectItem>
                            </SelectContent>
                          </Select>
                          <input type="hidden" name="patientHlaDQB1" value={hlaDQB1} />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">Enter the patient's HLA typing results</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="transplant-scenario">Transplant Scenario</Label>
                      <Select value={transplantScenario} onValueChange={setTransplantScenario}>
                        <SelectTrigger id="transplant-scenario" name="transplantScenario">
                          <SelectValue placeholder="Select scenario" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hsct-unrelated">HSCT — Unrelated donor (8/8)</SelectItem>
                          <SelectItem value="hsct-sibling">HSCT — Sibling donor (6/6)</SelectItem>
                          <SelectItem value="haploidentical">HSCT — Haploidentical</SelectItem>
                          <SelectItem value="solid-organ">Solid organ (ABO + HLA)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">Determines compatibility thresholds used for matching</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="patient-abo">Patient ABO (for solid organ)</Label>
                      <Select value={patientABO} onValueChange={setPatientABO}>
                        <SelectTrigger id="patient-abo" name="patientAbo">
                          <SelectValue placeholder="Select ABO" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="AB">AB</SelectItem>
                          <SelectItem value="O">O</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="urgency-level">Urgency Level</Label>
                      <Select value={urgencyLevel} onValueChange={setUrgencyLevel}>
                        <SelectTrigger id="urgency-level" name="urgencyLevel">
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
                        <Label htmlFor="search-radius">Search Radius</Label>
                        <span className="text-sm font-medium text-primary">{searchRadius[0]} km</span>
                      </div>
                      <Slider
                        id="search-radius"
                        name="searchRadius"
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
                      Call sent to nearest donor; message/SMS dispatched
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
                      <div className="grid grid-cols-1 gap-3 mb-8 max-w-md mx-auto">
                        <div className="rounded-lg bg-background p-4 text-center border-2 border-success/30">
                          <div className="text-2xl font-bold text-success">
                            {donorResults.length}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">Compatible per selected scenario</div>
                        </div>
                      </div>

                      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-4 max-w-2xl mx-auto">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                          <div className="text-left">
                            <h4 className="font-semibold text-blue-900 mb-2">Outreach Sent to Nearest Donors</h4>
                            <p className="text-sm text-blue-800 leading-relaxed">
                              Calls and SMS/messages have been sent to the nearest compatible donors based on your search. 
                              Admin approval is no longer required to initiate contact. We will surface responses as they arrive.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div><strong>Search Criteria:</strong></div>
                        {patientHLA && (
                          <div>HLA Markers: <span className="font-mono text-xs">{patientHLA}</span></div>
                        )}
                        <div className="flex items-center gap-2">
                          <span>Scenario:</span>
                          <Badge variant="outline">{transplantScenario}</Badge>
                        </div>
                        {transplantScenario === 'solid-organ' && (
                          <div className="flex items-center gap-2">
                            <span>Patient ABO:</span>
                            <Badge variant="outline">{patientABO || '-'}</Badge>
                          </div>
                        )}
                        <div>Search Radius: {searchRadius[0]} km</div>
                        <div className="flex items-center gap-2">
                          <span>Urgency:</span>
                          <Badge variant="outline" className={
                            urgencyLevel === "critical" ? "border-destructive/50 text-destructive" :
                            urgencyLevel === "urgent" ? "border-warning/50 text-warning" :
                            "border-success/50 text-success"
                          }>{urgencyLevel}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Full-size Search Results Table */}
              {searchSubmitted && donorResults.length > 0 && (
                <div ref={resultsRef}>
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Compatible Donors
                    </CardTitle>
                    <CardDescription>
                      Donors compatible under the selected scenario and within radius
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Donor ID</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Distance</TableHead>
                          <TableHead>HLA Match</TableHead>
                          <TableHead>Compatibility</TableHead>
                          <TableHead>Age</TableHead>
                          <TableHead>Gender</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {donorResults.map((d) => (
                          <TableRow key={d.id}>
                            <TableCell className="font-medium">{d.id}</TableCell>
                            <TableCell>{d.location}</TableCell>
                            <TableCell>{d.distance} km</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-24 rounded bg-muted">
                                  <div
                                    className="h-2 rounded bg-primary"
                                    style={{ width: `${d.hlaMatch?.score || 0}%` }}
                                  />
                                </div>
                                <span className="text-xs text-muted-foreground">{d.hlaMatch?.score || 0}%</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={d.compatible ? 'border-green-400 text-green-600' : 'border-red-400 text-red-600'}>
                                {d.compatible ? 'Compatible' : 'Not Compatible'}
                              </Badge>
                              <div className="text-xs text-muted-foreground mt-1">
                                {d.reason}
                              </div>
                            </TableCell>
                            <TableCell>{d.age ?? '-'}</TableCell>
                            <TableCell>{d.gender ?? '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                </div>
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

            {/* Map Visualization removed for now */}
          </div>
            </>
          )}

          {/* Registry Tab */}
          {activeTab === "registry" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-primary" />
                  Donor Registry - Registered Donors
                </CardTitle>
                <CardDescription>
                  View registered donors, update sample status, and submit medical reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Donor ID</TableHead>
                      <TableHead>Donor Details</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Blood Type</TableHead>
                      <TableHead>Sample Method</TableHead>
                      <TableHead>Sample Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registeredDonors.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No registered donors yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      registeredDonors.map((donor) => (
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
                            <div className="text-sm text-muted-foreground">
                              {donor.sampleMethod}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select 
                              value={donor.sampleStatus}
                              onValueChange={(value) => handleStatusChange(donor.id, value)}
                              disabled={donor.medicalReport !== undefined}
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending" disabled={donor.sampleStatus !== 'pending'}>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-3 w-3" />
                                    Pending
                                  </div>
                                </SelectItem>
                                <SelectItem value="collected" disabled={['pending'].indexOf(donor.sampleStatus) === -1}>
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-3 w-3" />
                                    Collected
                                  </div>
                                </SelectItem>
                                <SelectItem value="processing" disabled={['pending', 'collected'].indexOf(donor.sampleStatus) === -1}>
                                  <div className="flex items-center gap-2">
                                    <Activity className="h-3 w-3" />
                                    Processing
                                  </div>
                                </SelectItem>
                                <SelectItem value="completed" disabled={['pending', 'collected', 'processing'].indexOf(donor.sampleStatus) === -1}>
                                  <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Completed
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="default" 
                              size="sm" 
                              className="h-8 gap-1"
                              onClick={() => setSelectedAppointment(donor)}
                              disabled={donor.sampleStatus !== 'completed'}
                            >
                              <FileText className="h-3.5 w-3.5" />
                              {donor.medicalReport ? "View Report" : "Add Report"}
                            </Button>
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

      {/* Check Report Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Medical Check Report</CardTitle>
                  <CardDescription>
                    {selectedAppointment.firstName} {selectedAppointment.lastName} - {selectedAppointment.id}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedAppointment(null)}
                >
                  <Eye className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {selectedAppointment.medicalReport ? (
                // Show submitted report
                <div className="space-y-6">
                  <div className="p-4 bg-green-50 border border-green-300 rounded-lg">
                    <p className="text-green-800 font-semibold">✓ Report Already Submitted</p>
                    <p className="text-sm text-green-700">Submitted on {new Date(selectedAppointment.medicalReport.submittedAt).toLocaleDateString()}</p>
                  </div>

                  {/* Donor Information */}
                  <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div>
                      <Label className="text-xs text-muted-foreground">Full Name</Label>
                      <p className="font-medium">{selectedAppointment.firstName} {selectedAppointment.lastName}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Donor ID</Label>
                      <p className="font-medium">{selectedAppointment.id}</p>
                    </div>
                  </div>

                  {/* Physical Assessment */}
                  <div>
                    <h4 className="font-semibold mb-3">Physical Assessment</h4>
                    <div className="grid md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Label className="text-xs text-muted-foreground">Height</Label>
                        <p className="font-medium">{selectedAppointment.medicalReport.height} cm</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Weight</Label>
                        <p className="font-medium">{selectedAppointment.medicalReport.weight} kg</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Blood Pressure</Label>
                        <p className="font-medium">{selectedAppointment.medicalReport.bloodPressure}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Heart Rate</Label>
                        <p className="font-medium">{selectedAppointment.medicalReport.heartRate} bpm</p>
                      </div>
                    </div>
                  </div>

                  {/* HLA Typing */}
                  <div className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
                    <h4 className="font-semibold text-blue-900 mb-3">HLA Typing</h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      <div>
                        <Label className="text-xs text-blue-700 font-semibold">HLA-A</Label>
                        <p className="font-medium text-lg">{selectedAppointment.medicalReport.hlaA}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-blue-700 font-semibold">HLA-B</Label>
                        <p className="font-medium text-lg">{selectedAppointment.medicalReport.hlaB}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-blue-700 font-semibold">HLA-C</Label>
                        <p className="font-medium text-lg">{selectedAppointment.medicalReport.hlaC}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-blue-700 font-semibold">HLA-DRB1</Label>
                        <p className="font-medium text-lg">{selectedAppointment.medicalReport.hlaDRB1 || selectedAppointment.medicalReport.hlaDR}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-blue-700 font-semibold">HLA-DQB1</Label>
                        <p className="font-medium text-lg">{selectedAppointment.medicalReport.hlaDQB1}</p>
                      </div>
                    </div>
                  </div>

                  {/* Medical History */}
                  {selectedAppointment.medicalReport.medicalHistory && (
                    <div>
                      <h4 className="font-semibold mb-2">Medical History</h4>
                      <p className="text-sm bg-gray-50 p-3 rounded-lg">{selectedAppointment.medicalReport.medicalHistory}</p>
                    </div>
                  )}

                  {/* Lab Results */}
                  {selectedAppointment.medicalReport.labResults && (
                    <div>
                      <h4 className="font-semibold mb-2">Laboratory Test Results</h4>
                      <p className="text-sm bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">{selectedAppointment.medicalReport.labResults}</p>
                    </div>
                  )}

                  {/* Doctor Notes */}
                  {selectedAppointment.medicalReport.doctorNotes && (
                    <div>
                      <h4 className="font-semibold mb-2">Doctor's Notes</h4>
                      <p className="text-sm bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">{selectedAppointment.medicalReport.doctorNotes}</p>
                    </div>
                  )}

                  {/* Eligibility Status */}
                  {selectedAppointment.medicalReport.eligibility && (
                    <div className="p-4 bg-gray-50 rounded-lg border-l-4" style={{
                      borderLeftColor: selectedAppointment.medicalReport.eligibility === 'eligible' ? '#10b981' :
                                      selectedAppointment.medicalReport.eligibility === 'conditional' ? '#f59e0b' :
                                      '#ef4444'
                    }}>
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Eligibility Status</h4>
                        <Badge className={
                          selectedAppointment.medicalReport.eligibility === 'eligible' ? 'bg-green-500' :
                          selectedAppointment.medicalReport.eligibility === 'conditional' ? 'bg-yellow-500' :
                          selectedAppointment.medicalReport.eligibility === 'not-eligible' ? 'bg-red-500' :
                          'bg-gray-500'
                        }>
                          {selectedAppointment.medicalReport.eligibility.charAt(0).toUpperCase() + selectedAppointment.medicalReport.eligibility.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  )}

                  {/* Report Document */}
                  {selectedAppointment.medicalReport.reportFileData && (
                    <div className="border-2 border-amber-300 rounded-lg p-4 bg-amber-50">
                      <h4 className="font-semibold text-amber-900 mb-2">Medical Report Document</h4>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{selectedAppointment.medicalReport.reportFileName}</p>
                          <p className="text-xs text-muted-foreground">Uploaded on {new Date(selectedAppointment.medicalReport.submittedAt).toLocaleDateString()}</p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = selectedAppointment.medicalReport.reportFileData;
                            link.download = selectedAppointment.medicalReport.reportFileName;
                            link.click();
                          }}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Show form to add report
                <div className="space-y-6">
              {/* Donor Information */}
              <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <Label className="text-xs text-muted-foreground" htmlFor="modal-full-name">Full Name</Label>
                  <p className="font-medium">{selectedAppointment.firstName} {selectedAppointment.lastName}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground" htmlFor="modal-donor-id">Donor ID</Label>
                  <p className="font-medium">{selectedAppointment.id}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground" htmlFor="modal-age-gender">Age / Gender</Label>
                  <p className="font-medium">{selectedAppointment.age} years • {selectedAppointment.gender}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground" htmlFor="modal-blood-type">Blood Type</Label>
                  <Badge variant="outline" className="mt-1">{selectedAppointment.bloodType}</Badge>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground" htmlFor="modal-location">Location</Label>
                  <p className="font-medium">{selectedAppointment.location}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground" htmlFor="modal-appointment">Appointment Date</Label>
                  <p className="font-medium">{selectedAppointment.appointmentDate} at {selectedAppointment.appointmentTime}</p>
                </div>
              </div>

              {/* Medical Check Form */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Health Assessment</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input 
                      id="height" 
                      type="number"
                      placeholder="e.g., 170"
                      onChange={(e) => setCheckReports({
                        ...checkReports,
                        [selectedAppointment.id]: {
                          ...checkReports[selectedAppointment.id],
                          donorName: selectedAppointment.donorName,
                          donorId: selectedAppointment.donorId,
                          height: e.target.value
                        }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input 
                      id="weight" 
                      type="number"
                      placeholder="e.g., 65"
                      onChange={(e) => setCheckReports({
                        ...checkReports,
                        [selectedAppointment.id]: {
                          ...checkReports[selectedAppointment.id],
                          donorName: selectedAppointment.donorName,
                          donorId: selectedAppointment.donorId,
                          weight: e.target.value
                        }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bloodPressure">Blood Pressure</Label>
                    <Input 
                      id="bloodPressure"
                      placeholder="e.g., 120/80"
                      onChange={(e) => setCheckReports({
                        ...checkReports,
                        [selectedAppointment.id]: {
                          ...checkReports[selectedAppointment.id],
                          donorName: selectedAppointment.donorName,
                          donorId: selectedAppointment.donorId,
                          bloodPressure: e.target.value
                        }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                    <Input 
                      id="heartRate"
                      type="number"
                      placeholder="e.g., 72"
                      onChange={(e) => setCheckReports({
                        ...checkReports,
                        [selectedAppointment.id]: {
                          ...checkReports[selectedAppointment.id],
                          donorName: selectedAppointment.donorName,
                          donorId: selectedAppointment.donorId,
                          heartRate: e.target.value
                        }
                      })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medicalHistory">Medical History</Label>
                  <Textarea 
                    id="medicalHistory"
                    placeholder="Any relevant medical history, allergies, or current medications..."
                    rows={3}
                    onChange={(e) => setCheckReports({
                      ...checkReports,
                      [selectedAppointment.id]: {
                        ...checkReports[selectedAppointment.id],
                        donorName: selectedAppointment.donorName,
                        donorId: selectedAppointment.donorId,
                        medicalHistory: e.target.value
                      }
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="labResults">Laboratory Test Results</Label>
                  <Textarea 
                    id="labResults"
                    placeholder="Blood count, hemoglobin, WBC count, platelet count, etc..."
                    rows={4}
                    onChange={(e) => setCheckReports({
                      ...checkReports,
                      [selectedAppointment.id]: {
                        ...checkReports[selectedAppointment.id],
                        donorName: selectedAppointment.firstName,
                        donorId: selectedAppointment.id,
                        labResults: e.target.value
                      }
                    })}
                  />
                </div>

                {/* HLA Type - Compulsory Section */}
                <div className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
                  <h4 className="font-semibold text-lg mb-4 text-blue-900">HLA Typing (Compulsory)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="report-hla-a" className="font-semibold text-sm">HLA-A *</Label>
                      <Select 
                        onValueChange={(value) => setCheckReports({
                          ...checkReports,
                          [selectedAppointment.id]: {
                            ...checkReports[selectedAppointment.id],
                            donorName: selectedAppointment.firstName,
                            donorId: selectedAppointment.id,
                            hlaA: value
                          }
                        })}
                      >
                        <SelectTrigger id="report-hla-a" name="reportHlaA" className="border-blue-400">
                          <SelectValue placeholder="Select HLA-A" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A*01:01">A*01:01</SelectItem>
                          <SelectItem value="A*02:01">A*02:01</SelectItem>
                          <SelectItem value="A*03:01">A*03:01</SelectItem>
                          <SelectItem value="A*11:01">A*11:01</SelectItem>
                          <SelectItem value="A*24:02">A*24:02</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="report-hla-b" className="font-semibold text-sm">HLA-B *</Label>
                      <Select 
                        onValueChange={(value) => setCheckReports({
                          ...checkReports,
                          [selectedAppointment.id]: {
                            ...checkReports[selectedAppointment.id],
                            donorName: selectedAppointment.firstName,
                            donorId: selectedAppointment.id,
                            hlaB: value
                          }
                        })}
                      >
                        <SelectTrigger id="report-hla-b" name="reportHlaB" className="border-blue-400">
                          <SelectValue placeholder="Select HLA-B" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="B*07:02">B*07:02</SelectItem>
                          <SelectItem value="B*08:01">B*08:01</SelectItem>
                          <SelectItem value="B*35:01">B*35:01</SelectItem>
                          <SelectItem value="B*44:02">B*44:02</SelectItem>
                          <SelectItem value="B*51:01">B*51:01</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="report-hla-c" className="font-semibold text-sm">HLA-C *</Label>
                      <Select 
                        onValueChange={(value) => setCheckReports({
                          ...checkReports,
                          [selectedAppointment.id]: {
                            ...checkReports[selectedAppointment.id],
                            donorName: selectedAppointment.firstName,
                            donorId: selectedAppointment.id,
                            hlaC: value
                          }
                        })}
                      >
                        <SelectTrigger id="report-hla-c" name="reportHlaC" className="border-blue-400">
                          <SelectValue placeholder="Select HLA-C" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="C*01:02">C*01:02</SelectItem>
                          <SelectItem value="C*03:04">C*03:04</SelectItem>
                          <SelectItem value="C*04:01">C*04:01</SelectItem>
                          <SelectItem value="C*07:01">C*07:01</SelectItem>
                          <SelectItem value="C*07:02">C*07:02</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="report-hla-drb1" className="font-semibold text-sm">HLA-DRB1 *</Label>
                      <Select 
                        onValueChange={(value) => setCheckReports({
                          ...checkReports,
                          [selectedAppointment.id]: {
                            ...checkReports[selectedAppointment.id],
                            donorName: selectedAppointment.firstName,
                            donorId: selectedAppointment.id,
                            hlaDRB1: value
                          }
                        })}
                      >
                        <SelectTrigger id="report-hla-drb1" name="reportHlaDRB1" className="border-blue-400">
                          <SelectValue placeholder="Select HLA-DRB1" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DRB1*01:01">DRB1*01:01</SelectItem>
                          <SelectItem value="DRB1*03:01">DRB1*03:01</SelectItem>
                          <SelectItem value="DRB1*04:01">DRB1*04:01</SelectItem>
                          <SelectItem value="DRB1*07:01">DRB1*07:01</SelectItem>
                          <SelectItem value="DRB1*15:01">DRB1*15:01</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="report-hla-dqb1" className="font-semibold text-sm">HLA-DQB1 *</Label>
                      <Select 
                        onValueChange={(value) => setCheckReports({
                          ...checkReports,
                          [selectedAppointment.id]: {
                            ...checkReports[selectedAppointment.id],
                            donorName: selectedAppointment.firstName,
                            donorId: selectedAppointment.id,
                            hlaDQB1: value
                          }
                        })}
                      >
                        <SelectTrigger id="report-hla-dqb1" name="reportHlaDQB1" className="border-blue-400">
                          <SelectValue placeholder="Select HLA-DQB1" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DQB1*02:01">DQB1*02:01</SelectItem>
                          <SelectItem value="DQB1*03:01">DQB1*03:01</SelectItem>
                          <SelectItem value="DQB1*03:02">DQB1*03:02</SelectItem>
                          <SelectItem value="DQB1*05:01">DQB1*05:01</SelectItem>
                          <SelectItem value="DQB1*06:02">DQB1*06:02</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <p className="text-xs text-blue-700 mt-3">* All HLA types are required for accurate donor matching</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doctorNotes">Doctor's Notes & Recommendations</Label>
                  <Textarea 
                    id="doctorNotes"
                    placeholder="Overall health assessment, fitness for donation, any concerns or recommendations..."
                    rows={4}
                    onChange={(e) => setCheckReports({
                      ...checkReports,
                      [selectedAppointment.id]: {
                        ...checkReports[selectedAppointment.id],
                        donorName: selectedAppointment.firstName,
                        donorId: selectedAppointment.id,
                        doctorNotes: e.target.value
                      }
                    })}
                  />
                </div>

                {/* Report Document Upload */}
                <div className="border-2 border-amber-300 rounded-lg p-4 bg-amber-50">
                  <h4 className="font-semibold text-lg mb-3 text-amber-900">Medical Report Document *</h4>
                  <div className="border-2 border-dashed border-amber-400 rounded-lg p-6">
                    <Input 
                      id="reportFile"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          setCheckReports({
                            ...checkReports,
                            [selectedAppointment.id]: {
                              ...checkReports[selectedAppointment.id],
                              donorName: selectedAppointment.firstName,
                              donorId: selectedAppointment.id,
                              reportFile: file,
                              reportFileName: file.name
                            }
                          });
                        }
                      }}
                      className="hidden"
                    />
                    <label htmlFor="reportFile" className="cursor-pointer text-center block">
                      <FileText className="h-12 w-12 mx-auto mb-3 text-amber-600 opacity-70" />
                      <p className="font-semibold text-amber-900">Click to upload or drag & drop</p>
                      <p className="text-xs text-amber-700 mt-1">PDF, JPG, PNG, DOC (Max 10MB)</p>
                    </label>
                    {checkReports[selectedAppointment.id]?.reportFileName && (
                      <p className="text-sm text-green-600 mt-3 text-center">
                        ✓ {checkReports[selectedAppointment.id].reportFileName}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-amber-700 mt-3">* Medical report document is required for submission</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="donorEligibility">Donor Eligibility Status</Label>
                  <Select 
                    onValueChange={(value) => setCheckReports({
                      ...checkReports,
                      [selectedAppointment.id]: {
                        ...checkReports[selectedAppointment.id],
                        donorName: selectedAppointment.firstName,
                        donorId: selectedAppointment.id,
                        eligibility: value
                      }
                    })}
                  >
                    <SelectTrigger id="donorEligibility" name="donorEligibility">
                      <SelectValue placeholder="Select eligibility status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eligible">Eligible for Donation</SelectItem>
                      <SelectItem value="conditional">Conditionally Eligible</SelectItem>
                      <SelectItem value="not-eligible">Not Eligible</SelectItem>
                      <SelectItem value="pending">Pending Further Tests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Rejection Reason - Show only when Not Eligible is selected */}
                {checkReports[selectedAppointment?.id]?.eligibility === 'not-eligible' && (
                  <div className="space-y-2 p-4 rounded-lg border border-red-200 bg-red-50">
                    <Label htmlFor="rejectionReason" className="text-red-900 font-semibold">
                      Reason for Rejection *
                    </Label>
                    <Textarea
                      id="rejectionReason"
                      placeholder="Please provide detailed reason for rejection (e.g., failed health screening, medical condition, test results, etc.)"
                      className="min-h-24 border-red-300 bg-white"
                      value={rejectionReasons[selectedAppointment?.id] || ''}
                      onChange={(e) => setRejectionReasons({
                        ...rejectionReasons,
                        [selectedAppointment.id]: e.target.value
                      })}
                      required
                    />
                    <p className="text-xs text-red-700">
                      This reason will be visible to the donor and admin
                    </p>
                  </div>
                )}
              </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedAppointment(null)}
                >
                  Cancel
                </Button>
                {!selectedAppointment.medicalReport && (
                  <Button 
                    onClick={() => handleSubmitReport(selectedAppointment.id)}
                    className="gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Submit Report to Admin
                  </Button>
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

export default HospitalDashboard;