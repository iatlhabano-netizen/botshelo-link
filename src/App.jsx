import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Database,
  ExternalLink,
  Flame,
  FileSpreadsheet,
  FileText,
  Filter,
  Globe2,
  HeartPulse,
  HelpCircle,
  Info,
  Layers,
  MapPin,
  MessageSquare,
  Navigation,
  Phone,
  Pill,
  RefreshCw,
  Search,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Thermometer,
  Truck,
  Upload,
  UserCheck,
  Users,
  Wifi,
  WifiOff,
  X,
  Zap,
  Menu
} from 'lucide-react';

// --- MOCK DATA ---
const INITIAL_CLINICS = [
  {
    id: "mogoditshane-01", name: "Mogoditshane Primary Hospital", type: "Primary Hospital",
    lat: -24.6269, lng: 25.8631, district: "Kweneng East", phone: "+267 392 4211", distanceKm: 4.2,
    medicines: {
      "salbutamol-100mcg": { stock: 150, status: "available", lastUpdated: "1h ago", confidence: 98, trend: "up", unit: "inhalers" },
      "metformin-500mg": { stock: 0, status: "out", lastUpdated: "2h ago", confidence: 42, trend: "down", unit: "tablets" },
      "amoxicillin-250mg": { stock: 12, status: "low", lastUpdated: "3h ago", confidence: 51, trend: "down", unit: "capsules" },
      "insulin-regular": { stock: 0, status: "out", lastUpdated: "1h ago", confidence: 38, trend: "down", unit: "vials" },
      "amlodipine-5mg": { stock: 45, status: "available", lastUpdated: "4h ago", confidence: 72, trend: "stable", unit: "tablets" },
      "paracetamol-500mg": { stock: 200, status: "available", lastUpdated: "30m ago", confidence: 95, trend: "up", unit: "tablets" },
      "ors": { stock: 80, status: "low", lastUpdated: "5h ago", confidence: 61, trend: "down", unit: "sachets" },
      "atenolol-50mg": { stock: 8, status: "low", lastUpdated: "6h ago", confidence: 47, trend: "down", unit: "tablets" }
    }
  },
  {
    id: "gabane-01", name: "Gabane Clinic", type: "Clinic with Maternity",
    lat: -24.6644, lng: 25.7828, district: "Kweneng East", phone: "+267 394 7220", distanceKm: 12.8,
    medicines: {
      "salbutamol-100mcg": { stock: 14, status: "low", lastUpdated: "45m ago", confidence: 65, trend: "down", unit: "inhalers" },
      "metformin-500mg": { stock: 120, status: "available", lastUpdated: "1h ago", confidence: 94, trend: "up", unit: "tablets" },
      "amoxicillin-250mg": { stock: 85, status: "available", lastUpdated: "2h ago", confidence: 89, trend: "stable", unit: "capsules" },
      "insulin-regular": { stock: 25, status: "available", lastUpdated: "3h ago", confidence: 88, trend: "stable", unit: "vials" },
      "amlodipine-5mg": { stock: 90, status: "available", lastUpdated: "2h ago", confidence: 91, trend: "up", unit: "tablets" },
      "paracetamol-500mg": { stock: 350, status: "available", lastUpdated: "1h ago", confidence: 96, trend: "up", unit: "tablets" },
      "ors": { stock: 110, status: "available", lastUpdated: "4h ago", confidence: 82, trend: "stable", unit: "sachets" },
      "atenolol-50mg": { stock: 40, status: "available", lastUpdated: "3h ago", confidence: 79, trend: "stable", unit: "tablets" }
    }
  },
  {
    id: "kopong-01", name: "Kopong Clinic", type: "Clinic",
    lat: -24.4789, lng: 25.8906, district: "Kweneng East", phone: "+267 392 9015", distanceKm: 21.5,
    medicines: {
      "salbutamol-100mcg": { stock: 40, status: "available", lastUpdated: "2h ago", confidence: 85, trend: "stable", unit: "inhalers" },
      "metformin-500mg": { stock: 0, status: "out", lastUpdated: "4h ago", confidence: 35, trend: "down", unit: "tablets" },
      "amoxicillin-250mg": { stock: 15, status: "low", lastUpdated: "5h ago", confidence: 58, trend: "down", unit: "capsules" },
      "insulin-regular": { stock: 0, status: "out", lastUpdated: "3h ago", confidence: 40, trend: "down", unit: "vials" },
      "amlodipine-5mg": { stock: 18, status: "low", lastUpdated: "3h ago", confidence: 64, trend: "down", unit: "tablets" },
      "paracetamol-500mg": { stock: 140, status: "available", lastUpdated: "1h ago", confidence: 92, trend: "stable", unit: "tablets" },
      "ors": { stock: 200, status: "available", lastUpdated: "2h ago", confidence: 97, trend: "up", unit: "sachets" },
      "atenolol-50mg": { stock: 0, status: "out", lastUpdated: "6h ago", confidence: 30, trend: "down", unit: "tablets" }
    }
  },
  {
    id: "thamaga-01", name: "Thamaga Primary Hospital", type: "Primary Hospital",
    lat: -24.6711, lng: 25.5411, district: "Kweneng East", phone: "+267 599 9201", distanceKm: 38.0,
    medicines: {
      "salbutamol-100mcg": { stock: 220, status: "available", lastUpdated: "15m ago", confidence: 99, trend: "up", unit: "inhalers" },
      "metformin-500mg": { stock: 310, status: "available", lastUpdated: "30m ago", confidence: 98, trend: "up", unit: "tablets" },
      "amoxicillin-250mg": { stock: 190, status: "available", lastUpdated: "1h ago", confidence: 95, trend: "stable", unit: "capsules" },
      "insulin-regular": { stock: 65, status: "available", lastUpdated: "45m ago", confidence: 96, trend: "stable", unit: "vials" },
      "amlodipine-5mg": { stock: 180, status: "available", lastUpdated: "2h ago", confidence: 94, trend: "up", unit: "tablets" },
      "paracetamol-500mg": { stock: 500, status: "available", lastUpdated: "20m ago", confidence: 99, trend: "up", unit: "tablets" },
      "ors": { stock: 320, status: "available", lastUpdated: "1h ago", confidence: 97, trend: "up", unit: "sachets" },
      "atenolol-50mg": { stock: 95, status: "available", lastUpdated: "2h ago", confidence: 92, trend: "stable", unit: "tablets" }
    }
  },
  {
    id: "lentsweletau-01", name: "Lentsweletau Clinic", type: "Clinic with Maternity",
    lat: -24.3822, lng: 25.8500, district: "Kweneng East", phone: "+267 592 0211", distanceKm: 34.5,
    medicines: {
      "salbutamol-100mcg": { stock: 60, status: "available", lastUpdated: "2h ago", confidence: 88, trend: "stable", unit: "inhalers" },
      "metformin-500mg": { stock: 75, status: "available", lastUpdated: "3h ago", confidence: 84, trend: "stable", unit: "tablets" },
      "amoxicillin-250mg": { stock: 45, status: "available", lastUpdated: "4h ago", confidence: 81, trend: "down", unit: "capsules" },
      "insulin-regular": { stock: 12, status: "low", lastUpdated: "2h ago", confidence: 68, trend: "down", unit: "vials" },
      "amlodipine-5mg": { stock: 50, status: "available", lastUpdated: "5h ago", confidence: 86, trend: "stable", unit: "tablets" },
      "paracetamol-500mg": { stock: 180, status: "available", lastUpdated: "1h ago", confidence: 90, trend: "stable", unit: "tablets" },
      "ors": { stock: 95, status: "available", lastUpdated: "3h ago", confidence: 85, trend: "stable", unit: "sachets" },
      "atenolol-50mg": { stock: 22, status: "available", lastUpdated: "4h ago", confidence: 77, trend: "stable", unit: "tablets" }
    }
  },
  {
    id: "moshupa-01", name: "Moshupa Primary Hospital", type: "Primary Hospital",
    lat: -24.7811, lng: 25.4219, district: "Kweneng East / Border", phone: "+267 544 9222", distanceKm: 52.0,
    medicines: {
      "salbutamol-100mcg": { stock: 90, status: "available", lastUpdated: "1h ago", confidence: 91, trend: "stable", unit: "inhalers" },
      "metformin-500mg": { stock: 40, status: "low", lastUpdated: "2h ago", confidence: 63, trend: "down", unit: "tablets" },
      "amoxicillin-250mg": { stock: 110, status: "available", lastUpdated: "2h ago", confidence: 92, trend: "stable", unit: "capsules" },
      "insulin-regular": { stock: 8, status: "low", lastUpdated: "3h ago", confidence: 54, trend: "down", unit: "vials" },
      "amlodipine-5mg": { stock: 35, status: "available", lastUpdated: "4h ago", confidence: 78, trend: "down", unit: "tablets" },
      "paracetamol-500mg": { stock: 260, status: "available", lastUpdated: "1h ago", confidence: 94, trend: "up", unit: "tablets" },
      "ors": { stock: 65, status: "low", lastUpdated: "3h ago", confidence: 59, trend: "down", unit: "sachets" },
      "atenolol-50mg": { stock: 14, status: "low", lastUpdated: "5h ago", confidence: 55, trend: "down", unit: "tablets" }
    }
  }
];

const MEDICINES_METADATA = [
  { id: "salbutamol-100mcg", name: "Salbutamol 100mcg", category: "Respiratory", unit: "inhalers", essentialCode: "EDL-RESP-01" },
  { id: "metformin-500mg", name: "Metformin 500mg", category: "Diabetes", unit: "tablets", essentialCode: "EDL-ENDO-04" },
  { id: "amlodipine-5mg", name: "Amlodipine 5mg", category: "Cardiovascular", unit: "tablets", essentialCode: "EDL-CARD-02" },
  { id: "ors", name: "Oral Rehydration Salts (ORS)", category: "Emergency", unit: "sachets", essentialCode: "EDL-EMER-09" },
  { id: "paracetamol-500mg", name: "Paracetamol 500mg", category: "Pain Relief", unit: "tablets", essentialCode: "EDL-ANAL-01" },
  { id: "amoxicillin-250mg", name: "Amoxicillin 250mg", category: "Antibiotic", unit: "capsules", essentialCode: "EDL-ANTI-03" },
  { id: "insulin-regular", name: "Insulin (Regular)", category: "Diabetes", unit: "vials", essentialCode: "EDL-ENDO-01" },
  { id: "atenolol-50mg", name: "Atenolol 50mg", category: "Cardiovascular", unit: "tablets", essentialCode: "EDL-CARD-08" }
];

const INITIAL_AUDIT_TRAIL = [
  { id: "aud-1", date: "Today, 09:42", medicine: "Paracetamol 500mg", qty: "16 units", method: "Web OCR", staff: "A. Batswana", facility: "Mogoditshane Primary Hospital" },
  { id: "aud-2", date: "Yesterday, 16:10", medicine: "Salbutamol 100mcg", qty: "40 inhalers", method: "Telegram", staff: "K. Tsie", facility: "Kopong Clinic" },
  { id: "aud-3", date: "Jun 11, 14:28", medicine: "Metformin 500mg", qty: "120 tablets", method: "Manual form", staff: "M. Kgosi", facility: "Gabane Clinic" },
  { id: "aud-4", date: "Jun 11, 11:05", medicine: "Amoxicillin 250mg", qty: "50 capsules", method: "SMS Sync", staff: "B. Setshogo", facility: "Thamaga Primary Hospital" }
];

const DATASETS_INFO = [
  { id: 1, name: "WHO Botswana Health Indicators", org: "WHO / HDX", category: "Epidemiological Baselines", howWeUse: "Calibrates baseline epidemiological consumption curves for respiratory and infectious diseases across districts.", insight: "Establishes non-communicable disease burden baselines to normalize expected monthly consumption per capita.", tag: "Global Standard" },
  { id: 2, name: "Statistics Botswana Data Portal", org: "Statistics Botswana", category: "Demographics & Census", howWeUse: "Provides official 2022 population census figures by sub-district (Kweneng East: 310,000+ residents).", insight: "Links population growth rates directly to baseline buffer inventory requirements for each hospital catchment.", tag: "National Census" },
  { id: 3, name: "Botswana Open Data for Africa", org: "African Development Bank (AfDB)", category: "Socioeconomic Indicators", howWeUse: "Integrates rural poverty indices, road infrastructure access, and public transport density metrics.", insight: "Identifies remote settlements where supply stock-outs impose the highest travel hardship cost on citizens.", tag: "Socioeconomic" },
  { id: 4, name: "World Bank Open Data", org: "World Bank", category: "Health Financing", howWeUse: "Tracks public health expenditure per capita and out-of-pocket health costs to evaluate systemic risk.", insight: "Highlights economic vulnerability during secondary market purchases when central procurement lags.", tag: "Macro Health" },
  { id: 5, name: "OpenStreetMap (OSM)", org: "OSM Contributors / Humanitarian OSM", category: "Geospatial & Road Routing", howWeUse: "Powers real-time route calculation, inter-clinic distance matrices, and transit-time estimations for transfers.", insight: "Calculates precise transfer transit minutes between Thamaga and Mogoditshane via the A10 corridor.", tag: "Open Geospatial" },
  { id: 6, name: "NASA POWER / CHIRPS", org: "NASA / USGS", category: "Climate & Meteorological Signals", howWeUse: "Monitors real-time solar irradiance, daily maximum heat indices, and precipitation anomalies across Botswana.", insight: "A +4.2°C 5-day heatwave anomaly automatically triggers a 3.2× spike coefficient for ORS rehydration stock.", tag: "Real-time Climate" },
  { id: 7, name: "Botswana Healthsites Layer", org: "HDX / Healthsites.io", category: "Facility Geolocation", howWeUse: "Maps 2,847 verified primary, secondary, and tertiary health points across all 27 health districts.", insight: "Enables automated nearest-facility fallbacks when primary local clinics report zero inventory.", tag: "2,847 Facilities" },
  { id: 8, name: "WorldPop Gridded Population", org: "WorldPop / Univ. of Southampton", category: "High-Resolution Catchment", howWeUse: "100m grid cell demographic distribution mapping the exact pediatric population within 5km of each clinic.", insight: "Mogoditshane catchment: 12,400 residents, 18% under age 5 → automatically scales Amoxicillin pediatric buffer.", tag: "100m Precision" },
  { id: 9, name: "BAIS V HIV & NCD Statistics", org: "Statistics Botswana / MOH", category: "Disease Prevalence", howWeUse: "Kweneng East adult HIV prevalence (19.3%) and co-morbidity rates calibrate ARV & antibiotic safety stock.", insight: "Flags high-dependency chronic cohorts needing guaranteed 90-day medication continuity.", tag: "BAIS V Survey" },
  { id: 10, name: "Botswana Causes of Mortality", org: "Statistics Botswana", category: "Vital Statistics", howWeUse: "Analyzes mortality shifts: Cardiovascular deaths rising 8% YoY prioritize hypertension medication stocks.", insight: "Elevates Amlodipine and Atenolol to high-priority redistribution status across all district nodes.", tag: "Vital Registry" },
  { id: 11, name: "DHIS2 Metadata & ADX Schemas", org: "HISP Centre / WHO", category: "Standard Interoperability", howWeUse: "Direct two-way mapping between Botshelo Link ledger data and national DHIS2 Data Value Set schemas.", insight: "Eliminates parallel data entry; district pharmacists can export compliant ADX XML/JSON with one click.", tag: "DHIS2 ADX Native" },
  { id: 12, name: "WHO SARA Framework", org: "WHO", category: "Service Availability & Readiness", howWeUse: "Benchmarks cold-chain storage capability and pharmacy staffing levels into our Redistribution Suitability Index.", insight: "Prevents routing temperature-sensitive regular insulin to facilities with unstable cold chain logs.", tag: "Readiness Index" }
];

const SAMPLE_OCR_IMAGES = [
  {
    id: "sample-1", title: "Mogoditshane Pharmacy Tally - Sheet A", dateStr: "Captured 10 mins ago via WhatsApp", badge: "Pharmacy Log",
    extracted: [
      { medicine: "Metformin 500mg", medicineId: "metformin-500mg", qty: 150, expiry: "2027-03-15", confidence: 94, isLow: false },
      { medicine: "Paracetamol 500mg", medicineId: "paracetamol-500mg", qty: 200, expiry: "2026-11-20", confidence: 67, isLow: true, reason: "Smudged handwritten numeral on row 2" }
    ],
    previewSvgText: "MOGODITSHANE DISPENSARY TALLY\n------------------------------\n1. Metformin 500mg  [ 150 tab ]  Exp: 03/27\n2. Paracetamol 500mg [ 200 tab ] Exp: 11/26"
  },
  {
    id: "sample-2", title: "Gabane Health Centre Stock Card - Sheet B", dateStr: "Captured 25 mins ago via Camera Upload", badge: "Bin Card OCR",
    extracted: [
      { medicine: "Salbutamol 100mcg", medicineId: "salbutamol-100mcg", qty: 65, expiry: "2026-08-30", confidence: 96, isLow: false },
      { medicine: "Oral Rehydration Salts (ORS)", medicineId: "ors", qty: 140, expiry: "2027-01-10", confidence: 91, isLow: false }
    ],
    previewSvgText: "GABANE CLINIC - BIN LEDGER #04\n------------------------------\nSalbutamol Inhalers : 65 units (OK)\nO.R.S. Sachets      : 140 units (OK)"
  },
  {
    id: "sample-3", title: "Thamaga District Delivery Voucher", dateStr: "Captured 1h ago via Web Portal", badge: "CMS Dispatch",
    extracted: [
      { medicine: "Insulin (Regular)", medicineId: "insulin-regular", qty: 45, expiry: "2025-12-31", confidence: 88, isLow: false },
      { medicine: "Amoxicillin 250mg", medicineId: "amoxicillin-250mg", qty: 120, expiry: "2027-05-18", confidence: 54, isLow: true, reason: "Folded corner obscured batch verification stamp" }
    ],
    previewSvgText: "CENTRAL MEDICAL STORES VOUCHER\n------------------------------\nInsulin Regular 100IU : 45 vials\nAmoxicillin 250mg     : 120 caps (??)"
  }
];

const TRANSFER_SUGGESTIONS = [
  { id: "tr-1", sourceClinicId: "thamaga-01", targetClinicId: "mogoditshane-01", medicineId: "metformin-500mg", transferQty: 50, reason: "Mogoditshane has 0 stock; Thamaga has surplus of 310", urgency: "high", estimatedTransitMin: 45 },
  { id: "tr-2", sourceClinicId: "thamaga-01", targetClinicId: "kopong-01", medicineId: "insulin-regular", transferQty: 20, reason: "Kopong out of insulin; Thamaga has 65 vials", urgency: "high", estimatedTransitMin: 62 },
  { id: "tr-3", sourceClinicId: "gabane-01", targetClinicId: "mogoditshane-01", medicineId: "amoxicillin-250mg", transferQty: 30, reason: "Mogoditshane at 12 capsules (low); Gabane has 85", urgency: "medium", estimatedTransitMin: 22 },
  { id: "tr-4", sourceClinicId: "thamaga-01", targetClinicId: "moshupa-01", medicineId: "atenolol-50mg", transferQty: 25, reason: "Moshupa low at 14; Thamaga has 95", urgency: "medium", estimatedTransitMin: 38 },
  { id: "tr-5", sourceClinicId: "lentsweletau-01", targetClinicId: "mogoditshane-01", medicineId: "ors", transferQty: 40, reason: "Mogoditshane ORS trending down; Lentsweletau has 95", urgency: "low", estimatedTransitMin: 52 }
];

// --- HELPER COMPONENTS ---

function StatusBadge({ status }) {
  const colors = {
    available: "bg-emerald-100 text-emerald-800 border-emerald-200",
    low: "bg-amber-100 text-amber-800 border-amber-200",
    out: "bg-red-100 text-red-800 border-red-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${colors[status] || colors.available}`}>
      {status === "available" && <CheckCircle2 className="w-3 h-3 mr-1" />}
      {status === "low" && <AlertTriangle className="w-3 h-3 mr-1" />}
      {status === "out" && <X className="w-3 h-3 mr-1" />}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function ConfidenceMeter({ value }) {
  const color = value >= 80 ? "text-emerald-600" : value >= 60 ? "text-amber-600" : "text-red-600";
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${value >= 80 ? "bg-emerald-500" : value >= 60 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${value}%` }} />
      </div>
      <span className={`text-xs font-medium ${color}`}>{value}%</span>
    </div>
  );
}

function TrendIcon({ trend }) {
  if (trend === "up") return <ArrowRight className="w-3 h-3 text-emerald-500 rotate-[-45deg]" />;
  if (trend === "down") return <ArrowRight className="w-3 h-3 text-red-500 rotate-[45deg]" />;
  return <ArrowRight className="w-3 h-3 text-gray-400 rotate-0" />;
}

function Toast({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl flex items-start gap-3 max-w-sm animate-slide-up">
      <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
      <div>
        <p className="font-semibold text-sm">{message.title}</p>
        <p className="text-xs text-gray-300 mt-0.5">{message.description}</p>
      </div>
      <button onClick={onClose} className="text-gray-400 hover:text-white ml-2 shrink-0"><X className="w-4 h-4" /></button>
    </div>
  );
}

// --- PAGE COMPONENTS ---

function PatientPage({ clinics, selectedMedicine, setSelectedMedicine }) {
  const [searchQuery, setSearchQuery] = useState("");

  const medicineInfo = MEDICINES_METADATA.find(m => m.id === selectedMedicine);

  const clinicAvailability = useMemo(() => {
    return clinics.map(clinic => {
      const med = clinic.medicines[selectedMedicine];
      return { ...clinic, medData: med };
    }).sort((a, b) => {
      const statusOrder = { out: 0, low: 1, available: 2 };
      return (statusOrder[b.medData?.status] || 0) - (statusOrder[a.medData?.status] || 0);
    });
  }, [clinics, selectedMedicine]);

  const filteredClinics = clinicAvailability.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const outCount = clinicAvailability.filter(c => c.medData?.status === "out").length;
  const lowCount = clinicAvailability.filter(c => c.medData?.status === "low").length;
  const availCount = clinicAvailability.filter(c => c.medData?.status === "available").length;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Pill className="w-6 h-6" /> Medicine Availability</h1>
        <p className="text-blue-100 mt-1 text-sm">Find essential medicines at nearby clinics in Kweneng East District</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Medicine</label>
          <select value={selectedMedicine} onChange={e => setSelectedMedicine(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            {MEDICINES_METADATA.map(m => (
              <option key={m.id} value={m.id}>{m.name} ({m.category})</option>
            ))}
          </select>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Search Clinics</label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by clinic name or district..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-emerald-700">{availCount}</p>
          <p className="text-xs text-emerald-600">In Stock</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-amber-700">{lowCount}</p>
          <p className="text-xs text-amber-600">Low Stock</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-red-700">{outCount}</p>
          <p className="text-xs text-red-600">Out of Stock</p>
        </div>
      </div>

      {medicineInfo && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-xl"><Pill className="w-6 h-6 text-blue-600" /></div>
          <div>
            <h3 className="font-semibold text-gray-900">{medicineInfo.name}</h3>
            <p className="text-xs text-gray-500">{medicineInfo.category} &middot; {medicineInfo.unit} &middot; {medicineInfo.essentialCode}</p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {filteredClinics.map(clinic => (
          <div key={clinic.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${clinic.medData?.status === "available" ? "bg-emerald-100" : clinic.medData?.status === "low" ? "bg-amber-100" : "bg-red-100"}`}>
                  <Building2 className={`w-5 h-5 ${clinic.medData?.status === "available" ? "text-emerald-600" : clinic.medData?.status === "low" ? "text-amber-600" : "text-red-600"}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{clinic.name}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" /> {clinic.district} &middot; {clinic.distanceKm} km away</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3" /> {clinic.phone}</p>
                </div>
              </div>
              <StatusBadge status={clinic.medData?.status || "out"} />
            </div>
            {clinic.medData && (
              <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 text-xs">Stock Level</p>
                  <p className="font-semibold text-gray-900">{clinic.medData.stock} {clinic.medData.unit}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Confidence</p>
                  <ConfidenceMeter value={clinic.medData.confidence} />
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Trend</p>
                  <div className="flex items-center gap-1"><TrendIcon trend={clinic.medData.trend} /><span className="text-xs capitalize">{clinic.medData.trend}</span></div>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Last Updated</p>
                  <p className="text-gray-700 text-xs">{clinic.medData.lastUpdated}</p>
                </div>
              </div>
            )}
            {clinic.medData?.status === "out" && (
              <div className="mt-3 bg-red-50 border border-red-100 rounded-lg p-3 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <p className="text-xs text-red-700">This medicine is currently unavailable at this facility. Check nearby clinics or contact the district pharmacist for inter-clinic transfer options.</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminPage({ clinics, selectedTransfer, setSelectedTransfer, mapHoverClinic, setMapHoverClinic, filterRisk, setFilterRisk, onApproveTransfer, showToast }) {
  const [activeTab, setActiveTab] = useState("overview");

  const totalStock = useMemo(() => {
    let out = 0, low = 0, avail = 0;
    clinics.forEach(c => {
      Object.values(c.medicines).forEach(m => {
        if (m.status === "out") out++;
        else if (m.status === "low") low++;
        else avail++;
      });
    });
    return { out, low, avail, total: out + low + avail };
  }, [clinics]);

  const filteredTransfers = TRANSFER_SUGGESTIONS.filter(t => {
    if (filterRisk === "all") return true;
    return t.urgency === filterRisk;
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-rose-600 to-pink-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold flex items-center gap-2"><ShieldCheck className="w-6 h-6" /> DHMT Admin Dashboard</h1>
        <p className="text-rose-100 mt-1 text-sm">District Health Management Team — Kweneng East</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-3xl font-bold text-gray-900">{totalStock.avail}</p>
          <p className="text-xs text-gray-500 mt-1">In Stock</p>
        </div>
        <div className="bg-white rounded-xl border border-amber-200 p-4 text-center">
          <p className="text-3xl font-bold text-amber-600">{totalStock.low}</p>
          <p className="text-xs text-gray-500 mt-1">Low Stock</p>
        </div>
        <div className="bg-white rounded-xl border border-red-200 p-4 text-center">
          <p className="text-3xl font-bold text-red-600">{totalStock.out}</p>
          <p className="text-xs text-gray-500 mt-1">Out of Stock</p>
        </div>
        <div className="bg-white rounded-xl border border-blue-200 p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">{TRANSFER_SUGGESTIONS.length}</p>
          <p className="text-xs text-gray-500 mt-1">Pending Transfers</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-200 pb-1">
        {["overview", "transfers", "map"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === tab ? "bg-white border border-gray-200 border-b-white text-gray-900 -mb-px" : "text-gray-500 hover:text-gray-700"}`}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="space-y-4">
          {clinics.map(clinic => (
            <div key={clinic.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-500" />
                  <h3 className="font-semibold text-sm">{clinic.name}</h3>
                  <span className="text-xs text-gray-400">{clinic.type}</span>
                </div>
                <span className="text-xs text-gray-500">{clinic.distanceKm} km</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(clinic.medicines).map(([medId, med]) => {
                  const meta = MEDICINES_METADATA.find(m => m.id === medId);
                  return (
                    <div key={medId} className="bg-gray-50 rounded-lg p-2">
                      <p className="text-xs font-medium text-gray-700 truncate">{meta?.name || medId}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500">{med.stock} {med.unit}</span>
                        <StatusBadge status={med.status} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "transfers" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-gray-500" />
            <select value={filterRisk} onChange={e => setFilterRisk(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm">
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
          {filteredTransfers.map(transfer => {
            const source = clinics.find(c => c.id === transfer.sourceClinicId);
            const target = clinics.find(c => c.id === transfer.targetClinicId);
            const med = MEDICINES_METADATA.find(m => m.id === transfer.medicineId);
            return (
              <div key={transfer.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${transfer.urgency === "high" ? "bg-red-100 text-red-700" : transfer.urgency === "medium" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>
                        {transfer.urgency.toUpperCase()}
                      </span>
                      <span className="text-sm font-medium text-gray-900">{med?.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {source?.name}</span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {target?.name}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{transfer.reason}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Truck className="w-3 h-3" /> {transfer.transferQty} {med?.unit}</span>
                      <span className="flex items-center gap-1"><Navigation className="w-3 h-3" /> ~{transfer.estimatedTransitMin} min</span>
                    </div>
                  </div>
                  <button onClick={() => {
                    onApproveTransfer(transfer);
                    showToast("Transfer Approved", `${transfer.transferQty} ${med?.unit} of ${med?.name} from ${source?.name} to ${target?.name}`);
                  }} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-1 shrink-0 ml-4">
                    <CheckCircle2 className="w-4 h-4" /> Approve
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "map" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Globe2 className="w-5 h-5 text-blue-600" /> District Map View</h3>
          <div className="relative bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-gray-200 overflow-hidden" style={{ height: 400 }}>
            <svg viewBox="24.3 25.3 0.6 0.6" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
              {clinics.map(clinic => {
                const x = ((clinic.lng - 25.3) / 0.6) * 100;
                const y = ((clinic.lat - (-24.9)) / 0.6) * 100;
                const worstStatus = Object.values(clinic.medicines).reduce((worst, m) => {
                  if (m.status === "out") return "out";
                  if (m.status === "low" && worst !== "out") return "low";
                  return worst;
                }, "available");
                const colors = { available: "#10b981", low: "#f59e0b", out: "#ef4444" };
                return (
                  <g key={clinic.id} onMouseEnter={() => setMapHoverClinic(clinic)} onMouseLeave={() => setMapHoverClinic(null)} style={{ cursor: "pointer" }}>
                    <circle cx={`${x}%`} cy={`${y}%`} r="8" fill={colors[worstStatus]} opacity="0.3" />
                    <circle cx={`${x}%`} cy={`${y}%`} r="4" fill={colors[worstStatus]} stroke="white" strokeWidth="1.5" />
                    <text x={`${x}%`} y={`${y - 3}%`} textAnchor="middle" fontSize="3" fill="#374151" fontWeight="600">{clinic.name.split(" ")[0]}</text>
                  </g>
                );
              })}
            </svg>
            {mapHoverClinic && (
              <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-xl border border-gray-200 p-4 max-w-xs z-10">
                <h4 className="font-semibold text-sm">{mapHoverClinic.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{mapHoverClinic.district} &middot; {mapHoverClinic.type}</p>
                <div className="mt-2 space-y-1">
                  {Object.entries(mapHoverClinic.medicines).slice(0, 4).map(([medId, med]) => {
                    const meta = MEDICINES_METADATA.find(m => m.id === medId);
                    return (
                      <div key={medId} className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">{meta?.name || medId}</span>
                        <StatusBadge status={med.status} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-xs flex items-center gap-3">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Available</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Low</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Out</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ClinicStaffPage({ clinics, auditTrail, showToast }) {
  const [activeTab, setActiveTab] = useState("ocr");
  const [selectedSample, setSelectedSample] = useState(SAMPLE_OCR_IMAGES[0]);
  const [ocrConfirmed, setOcrConfirmed] = useState(false);
  const [manualForm, setManualForm] = useState({
    clinicId: "mogoditshane-01",
    medicineId: "paracetamol-500mg",
    qty: 50,
    expiry: "2027-06-30",
    staff: "K. Sebele (Pharmacist)",
    notes: "Direct dispensary adjustment after clinic stocktaking."
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold flex items-center gap-2"><UserCheck className="w-6 h-6" /> Clinic Staff Portal</h1>
        <p className="text-emerald-100 mt-1 text-sm">Submit stock updates via OCR capture, manual entry, or messaging</p>
      </div>

      <div className="flex gap-2 border-b border-gray-200 pb-1">
        {[{ id: "ocr", label: "OCR Scanner", icon: FileSpreadsheet }, { id: "manual", label: "Manual Entry", icon: FileText }, { id: "audit", label: "Audit Trail", icon: Activity }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors flex items-center gap-1.5 ${activeTab === tab.id ? "bg-white border border-gray-200 border-b-white text-gray-900 -mb-px" : "text-gray-500 hover:text-gray-700"}`}>
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "ocr" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 space-y-2">
            <h3 className="font-semibold text-sm text-gray-700 mb-2">Captured Documents</h3>
            {SAMPLE_OCR_IMAGES.map(sample => (
              <button key={sample.id} onClick={() => { setSelectedSample(sample); setOcrConfirmed(false); }} className={`w-full text-left p-3 rounded-xl border transition-all ${selectedSample.id === sample.id ? "border-blue-500 bg-blue-50 shadow-sm" : "border-gray-200 bg-white hover:bg-gray-50"}`}>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">{sample.badge}</span>
                </div>
                <p className="text-sm font-medium mt-1">{sample.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{sample.dateStr}</p>
              </button>
            ))}
          </div>
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 p-2 rounded-lg"><Sparkles className="w-5 h-5 text-purple-600" /></div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedSample.title}</h3>
                  <p className="text-xs text-gray-500">{selectedSample.dateStr}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm text-gray-700 whitespace-pre-line border border-gray-200">{selectedSample.previewSvgText}</div>
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1"><Zap className="w-4 h-4 text-yellow-500" /> AI-Extracted Data</h4>
                {selectedSample.extracted.map((item, i) => (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${item.isLow ? "bg-amber-50 border-amber-200" : "bg-white border-gray-200"}`}>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.medicine}</p>
                      <p className="text-xs text-gray-500">Qty: {item.qty} &middot; Exp: {item.expiry}</p>
                      {item.reason && <p className="text-xs text-amber-700 mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {item.reason}</p>}
                    </div>
                    <ConfidenceMeter value={item.confidence} />
                  </div>
                ))}
              </div>
              {!ocrConfirmed ? (
                <button onClick={() => { setOcrConfirmed(true); showToast("OCR Confirmed", "Stock data has been submitted to the shared ledger."); }} className="mt-4 w-full bg-emerald-600 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Confirm & Submit
                </button>
              ) : (
                <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm text-emerald-700 font-medium">Submitted successfully to shared ledger</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "manual" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-blue-600" /> Manual Stock Entry</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facility</label>
                <select value={manualForm.clinicId} onChange={e => setManualForm({ ...manualForm, clinicId: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  {clinics.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medicine</label>
                <select value={manualForm.medicineId} onChange={e => setManualForm({ ...manualForm, medicineId: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  {MEDICINES_METADATA.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input type="number" value={manualForm.qty} onChange={e => setManualForm({ ...manualForm, qty: parseInt(e.target.value) || 0 })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input type="date" value={manualForm.expiry} onChange={e => setManualForm({ ...manualForm, expiry: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Staff Name</label>
              <input type="text" value={manualForm.staff} onChange={e => setManualForm({ ...manualForm, staff: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea value={manualForm.notes} onChange={e => setManualForm({ ...manualForm, notes: e.target.value })} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <button onClick={() => showToast("Stock Updated", `Manual entry for ${manualForm.qty} units submitted.`)} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Send className="w-4 h-4" /> Submit Entry
            </button>
          </div>
        </div>
      )}

      {activeTab === "audit" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Medicine</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Quantity</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Method</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Staff</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Facility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {auditTrail.map(entry => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700">{entry.date}</td>
                  <td className="px-4 py-3 text-gray-900 font-medium">{entry.medicine}</td>
                  <td className="px-4 py-3 text-gray-700">{entry.qty}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded-full">{entry.method}</span></td>
                  <td className="px-4 py-3 text-gray-700">{entry.staff}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{entry.facility}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function DataSourcesPage() {
  const [expandedId, setExpandedId] = useState(null);
  const categoryColors = {
    "Epidemiological Baselines": "bg-purple-100 text-purple-700",
    "Demographics & Census": "bg-blue-100 text-blue-700",
    "Socioeconomic Indicators": "bg-orange-100 text-orange-700",
    "Health Financing": "bg-green-100 text-green-700",
    "Geospatial & Road Routing": "bg-cyan-100 text-cyan-700",
    "Climate & Meteorological Signals": "bg-red-100 text-red-700",
    "Facility Geolocation": "bg-pink-100 text-pink-700",
    "High-Resolution Catchment": "bg-indigo-100 text-indigo-700",
    "Disease Prevalence": "bg-rose-100 text-rose-700",
    "Vital Statistics": "bg-amber-100 text-amber-700",
    "Standard Interoperability": "bg-teal-100 text-teal-700",
    "Service Availability & Readiness": "bg-lime-100 text-lime-700"
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-violet-600 to-purple-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Database className="w-6 h-6" /> Data Sources</h1>
        <p className="text-violet-100 mt-1 text-sm">12 datasets powering Botshelo Link's intelligent forecasting engine</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DATASETS_INFO.map(dataset => (
          <div key={dataset.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setExpandedId(expandedId === dataset.id ? null : dataset.id)}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${categoryColors[dataset.category] || "bg-gray-100 text-gray-700"}`}>{dataset.category}</span>
                  <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">{dataset.tag}</span>
                </div>
                <h3 className="font-semibold text-gray-900">{dataset.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{dataset.org}</p>
              </div>
              <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expandedId === dataset.id ? "rotate-90" : ""}`} />
            </div>
            {expandedId === dataset.id && (
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">How We Use It</p>
                  <p className="text-sm text-gray-700 mt-1">{dataset.howWeUse}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Key Insight</p>
                  <p className="text-sm text-gray-700 mt-1">{dataset.insight}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ForecastingPage({ climateMode, setClimateMode }) {
  const forecastData = useMemo(() => {
    const multiplier = climateMode === "heatwave" ? 3.2 : 1;
    return MEDICINES_METADATA.map(med => {
      const baseDemand = med.category === "Emergency" ? 180 : med.category === "Respiratory" ? 120 : med.category === "Antibiotic" ? 95 : 80;
      return {
        ...med,
        currentStock: Math.round(baseDemand * 2.5),
        predictedDemand: Math.round(baseDemand * multiplier),
        daysUntilStockout: Math.round((baseDemand * 2.5) / (baseDemand * multiplier / 30)),
        riskLevel: (baseDemand * multiplier / 30) > (baseDemand * 2) ? "critical" : (baseDemand * multiplier / 30) > baseDemand ? "warning" : "stable"
      };
    });
  }, [climateMode]);

  const riskColors = { critical: "bg-red-500", warning: "bg-amber-500", stable: "bg-emerald-500" };
  const riskText = { critical: "text-red-700 bg-red-50 border-red-200", warning: "text-amber-700 bg-amber-50 border-amber-200", stable: "text-emerald-700 bg-emerald-50 border-emerald-200" };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Thermometer className="w-6 h-6" /> Climate-Driven Forecasting</h1>
        <p className="text-orange-100 mt-1 text-sm">AI-powered demand prediction using NASA POWER and CHIRPS meteorological signals</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Thermometer className="w-5 h-5 text-orange-500" />
            <div>
              <h3 className="font-semibold text-gray-900">Climate Scenario</h3>
              <p className="text-xs text-gray-500">Toggle between normal and extreme heat conditions</p>
            </div>
          </div>
          <button onClick={() => setClimateMode(climateMode === "normal" ? "heatwave" : "normal")} className={`relative w-16 h-8 rounded-full transition-colors ${climateMode === "heatwave" ? "bg-red-500" : "bg-gray-300"}`}>
            <span className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${climateMode === "heatwave" ? "translate-x-9" : "translate-x-1"}`} />
          </button>
        </div>
        {climateMode === "heatwave" && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <Flame className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-800">Active Heatwave Alert: +4.2°C anomaly detected</p>
              <p className="text-xs text-red-600 mt-1">NASA POWER satellite data indicates a 5-day heatwave event across Kweneng East. ORS rehydration demand coefficient increased 3.2×. Respiratory medication demand elevated due to dust/particulate conditions.</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{forecastData.filter(f => f.riskLevel === "stable").length}</p>
          <p className="text-xs text-emerald-600 mt-1">Stable</p>
        </div>
        <div className="bg-white rounded-xl border border-amber-200 p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{forecastData.filter(f => f.riskLevel === "warning").length}</p>
          <p className="text-xs text-amber-600 mt-1">Warning</p>
        </div>
        <div className="bg-white rounded-xl border border-red-200 p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{forecastData.filter(f => f.riskLevel === "critical").length}</p>
          <p className="text-xs text-red-600 mt-1">Critical</p>
        </div>
      </div>

      <div className="space-y-3">
        {forecastData.map(forecast => (
          <div key={forecast.id} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{forecast.name}</h3>
                <p className="text-xs text-gray-500">{forecast.category} &middot; {forecast.essentialCode}</p>
              </div>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${riskText[forecast.riskLevel]}`}>
                {forecast.riskLevel.toUpperCase()}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <p className="text-xs text-gray-500">Current Stock</p>
                <p className="text-lg font-bold text-gray-900">{forecast.currentStock}</p>
                <p className="text-xs text-gray-400">{forecast.unit}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Predicted Monthly Demand</p>
                <p className="text-lg font-bold text-orange-600">{forecast.predictedDemand}</p>
                <p className="text-xs text-gray-400">{forecast.unit}/month</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Days Until Stockout</p>
                <p className={`text-lg font-bold ${forecast.daysUntilStockout < 60 ? "text-red-600" : "text-emerald-600"}`}>{forecast.daysUntilStockout}</p>
                <p className="text-xs text-gray-400">days at current rate</p>
              </div>
            </div>
            <div className="mt-3 bg-gray-50 rounded-lg p-2">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Stock Level</span>
                <span>{Math.round((forecast.currentStock / (forecast.predictedDemand * 3)) * 100)}% of 3-month buffer</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${riskColors[forecast.riskLevel]}`} style={{ width: `${Math.min(100, (forecast.currentStock / (forecast.predictedDemand * 3)) * 100)}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- MAIN APP ---
export default function App() {
  const [currentRoute, setCurrentRoute] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return ['/', '/patient', '/admin', '/clinic', '/data-sources', '/forecasting'].includes(hash) ? hash : '/';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [clinics, setClinics] = useState(INITIAL_CLINICS);
  const [auditTrail] = useState(INITIAL_AUDIT_TRAIL);
  const [toastMessage, setToastMessage] = useState(null);
  const [selectedMedicine, setSelectedMedicine] = useState("salbutamol-100mcg");
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [mapHoverClinic, setMapHoverClinic] = useState(null);
  const [filterRisk, setFilterRisk] = useState("all");
  const [climateMode, setClimateMode] = useState("normal");

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || '/';
      if (['/', '/patient', '/admin', '/clinic', '/data-sources', '/forecasting'].includes(hash)) {
        setCurrentRoute(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (route) => {
    window.location.hash = route;
    setCurrentRoute(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (title, description) => {
    const id = Date.now();
    setToastMessage({ title, description, id });
    setTimeout(() => setToastMessage(prev => (prev?.id === id ? null : prev)), 4500);
  };

  const handleApproveTransfer = (transferData) => {
    const { sourceClinicId, targetClinicId, medicineId, transferQty } = transferData;
    setClinics(prev => prev.map(c => {
      if (c.id === sourceClinicId) {
        const med = c.medicines[medicineId];
        const newStock = Math.max(0, med.stock - transferQty);
        return { ...c, medicines: { ...c.medicines, [medicineId]: { ...med, stock: newStock, status: newStock === 0 ? "out" : newStock < 20 ? "low" : "available", lastUpdated: "Just now", trend: "down" } } };
      }
      if (c.id === targetClinicId) {
        const med = c.medicines[medicineId];
        const newStock = med.stock + transferQty;
        return { ...c, medicines: { ...c.medicines, [medicineId]: { ...med, stock: newStock, status: "available", lastUpdated: "Just now", trend: "up" } } };
      }
      return c;
    }));
  };

  const navItems = [
    { route: "/patient", label: "Patient View", icon: Pill },
    { route: "/admin", label: "DHMT Admin", icon: ShieldCheck },
    { route: "/clinic", label: "Clinic Staff", icon: UserCheck },
    { route: "/data-sources", label: "Data Sources", icon: Database },
    { route: "/forecasting", label: "Forecasting", icon: Thermometer },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-1.5 rounded-lg">
                <HeartPulse className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-gray-900 leading-tight">Botshelo Link</h1>
                <p className="text-[10px] text-gray-500 leading-tight">Kweneng East District</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-1">
              {navItems.map(item => (
                <button key={item.route} onClick={() => navigate(item.route)} className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors ${currentRoute === item.route ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-100"}`}>
                  <item.icon className="w-4 h-4" /> {item.label}
                </button>
              ))}
            </div>
            <button className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white px-4 py-2 space-y-1">
            {navItems.map(item => (
              <button key={item.route} onClick={() => navigate(item.route)} className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${currentRoute === item.route ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-100"}`}>
                <item.icon className="w-4 h-4" /> {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {currentRoute === "/patient" && <PatientPage clinics={clinics} selectedMedicine={selectedMedicine} setSelectedMedicine={setSelectedMedicine} />}
        {currentRoute === "/admin" && <AdminPage clinics={clinics} selectedTransfer={selectedTransfer} setSelectedTransfer={setSelectedTransfer} mapHoverClinic={mapHoverClinic} setMapHoverClinic={setMapHoverClinic} filterRisk={filterRisk} setFilterRisk={setFilterRisk} onApproveTransfer={handleApproveTransfer} showToast={showToast} />}
        {currentRoute === "/clinic" && <ClinicStaffPage clinics={clinics} auditTrail={auditTrail} showToast={showToast} />}
        {currentRoute === "/data-sources" && <DataSourcesPage />}
        {currentRoute === "/forecasting" && <ForecastingPage climateMode={climateMode} setClimateMode={setClimateMode} />}
        {currentRoute === "/" && (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-8 text-white">
              <h1 className="text-3xl font-bold flex items-center gap-3"><HeartPulse className="w-8 h-8" /> Botshelo Link</h1>
              <p className="text-blue-100 mt-2 max-w-xl">Intelligent medicine stock tracking and redistribution for Kweneng East District, Botswana. Connecting 6 health facilities with AI-powered forecasting.</p>
              <div className="flex flex-wrap gap-3 mt-6">
                <button onClick={() => navigate("/patient")} className="bg-white text-blue-700 px-5 py-2.5 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center gap-2"><Pill className="w-4 h-4" /> Find Medicine</button>
                <button onClick={() => navigate("/admin")} className="bg-white/10 text-white border border-white/20 px-5 py-2.5 rounded-lg font-medium hover:bg-white/20 transition-colors flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Admin Dashboard</button>
                <button onClick={() => navigate("/forecasting")} className="bg-white/10 text-white border border-white/20 px-5 py-2.5 rounded-lg font-medium hover:bg-white/20 transition-colors flex items-center gap-2"><Thermometer className="w-4 h-4" /> Climate Forecast</button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Facilities", value: "6", icon: Building2, color: "text-blue-600 bg-blue-50" },
                { label: "Medicines Tracked", value: "8", icon: Pill, color: "text-emerald-600 bg-emerald-50" },
                { label: "Data Sources", value: "12", icon: Database, color: "text-purple-600 bg-purple-50" },
                { label: "Active Transfers", value: "5", icon: Truck, color: "text-orange-600 bg-orange-50" },
              ].map(stat => (
                <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className={`inline-flex p-2 rounded-lg ${stat.color} mb-2`}><stat.icon className="w-5 h-5" /></div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 bg-white mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between text-xs text-gray-500">
          <span>Botshelo Link &middot; Kweneng East District Health Management</span>
          <span className="flex items-center gap-1"><Wifi className="w-3 h-3 text-emerald-500" /> All systems operational</span>
        </div>
      </footer>

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
