import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Activity, AlertTriangle, ArrowRight, BarChart3, Building2, Calendar, CheckCircle2,
  ChevronRight, Database, ExternalLink, Flame, FileSpreadsheet, FileText, Filter,
  Globe2, HeartPulse, HelpCircle, Info, Layers, MapPin, MessageSquare, Navigation,
  Phone, Pill, RefreshCw, Search, Send, Share2, ShieldCheck, Sparkles, Thermometer,
  Truck, Upload, UserCheck, Users, Wifi, WifiOff, X, Zap, Menu, Clock, Leaf,
  PhoneCall, Route, ArrowUpRight, Stethoscope, Siren, BrainCircuit, FileDown, Copy, Lock
} from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import 'leaflet/dist/leaflet.css';

// ══════════════════════════════════════════════════════════════
// MOCK DATA
// ══════════════════════════════════════════════════════════════

const DISTRICT = "Kweneng East";

const INITIAL_CLINICS = [
  { id: "mogoditshane-01", name: "Mogoditshane Primary Hospital", type: "Primary Hospital", coords: [-24.6269, 25.9231], district: "Kweneng East", phone: "+267 392 4211", distanceKm: 4.2,
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
  { id: "gabane-01", name: "Gabane Clinic", type: "Clinic with Maternity", coords: [-24.6644, 25.7828], district: "Kweneng East", phone: "+267 394 7220", distanceKm: 12.8,
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
  { id: "kopong-01", name: "Kopong Clinic", type: "Clinic", coords: [-24.4789, 25.8906], district: "Kweneng East", phone: "+267 392 9015", distanceKm: 21.5,
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
  { id: "thamaga-01", name: "Thamaga Primary Hospital", type: "Primary Hospital", coords: [-24.6711, 25.5411], district: "Kweneng East", phone: "+267 599 9201", distanceKm: 38.0,
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
  { id: "lentsweletau-01", name: "Lentsweletau Clinic", type: "Clinic with Maternity", coords: [-24.3822, 25.8500], district: "Kweneng East", phone: "+267 592 0211", distanceKm: 34.5,
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
  { id: "moshupa-01", name: "Moshupa Primary Hospital", type: "Primary Hospital", coords: [-24.7811, 25.4219], district: "Kweneng East / Border", phone: "+267 544 9222", distanceKm: 52.0,
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

const MEDICINES = [
  { id: "salbutamol-100mcg", name: "Salbutamol 100mcg", category: "Respiratory", unit: "inhalers", essentialCode: "EDL-RESP-01" },
  { id: "metformin-500mg", name: "Metformin 500mg", category: "Diabetes", unit: "tablets", essentialCode: "EDL-ENDO-04" },
  { id: "amlodipine-5mg", name: "Amlodipine 5mg", category: "Cardiovascular", unit: "tablets", essentialCode: "EDL-CARD-02" },
  { id: "ors", name: "Oral Rehydration Salts (ORS)", category: "Emergency", unit: "sachets", essentialCode: "EDL-EMER-09" },
  { id: "paracetamol-500mg", name: "Paracetamol 500mg", category: "Pain Relief", unit: "tablets", essentialCode: "EDL-ANAL-01" },
  { id: "amoxicillin-250mg", name: "Amoxicillin 250mg", category: "Antibiotic", unit: "capsules", essentialCode: "EDL-ANTI-03" },
  { id: "insulin-regular", name: "Insulin (Regular)", category: "Diabetes", unit: "vials", essentialCode: "EDL-ENDO-01" },
  { id: "atenolol-50mg", name: "Atenolol 50mg", category: "Cardiovascular", unit: "tablets", essentialCode: "EDL-CARD-08" }
];

const EMERGING_SHORTAGES = [
  { medicineId: "insulin-regular", clinicId: "mogoditshane-01", daysRemaining: 0, risk: "CRITICAL" },
  { medicineId: "metformin-500mg", clinicId: "mogoditshane-01", daysRemaining: 0, risk: "CRITICAL" },
  { medicineId: "amoxicillin-250mg", clinicId: "mogoditshane-01", daysRemaining: 2, risk: "HIGH" },
  { medicineId: "atenolol-50mg", clinicId: "mogoditshane-01", daysRemaining: 1, risk: "HIGH" },
  { medicineId: "insulin-regular", clinicId: "kopong-01", daysRemaining: 0, risk: "CRITICAL" },
  { medicineId: "metformin-500mg", clinicId: "kopong-01", daysRemaining: 0, risk: "CRITICAL" },
  { medicineId: "atenolol-50mg", clinicId: "kopong-01", daysRemaining: 0, risk: "CRITICAL" },
  { medicineId: "amoxicillin-250mg", clinicId: "kopong-01", daysRemaining: 3, risk: "HIGH" },
  { medicineId: "amlodipine-5mg", clinicId: "kopong-01", daysRemaining: 3, risk: "HIGH" },
  { medicineId: "salbutamol-100mcg", clinicId: "gabane-01", daysRemaining: 3, risk: "HIGH" },
  { medicineId: "insulin-regular", clinicId: "lentsweletau-01", daysRemaining: 4, risk: "MEDIUM" },
  { medicineId: "ors", clinicId: "moshupa-01", daysRemaining: 5, risk: "MEDIUM" },
  { medicineId: "atenolol-50mg", clinicId: "moshupa-01", daysRemaining: 3, risk: "HIGH" },
  { medicineId: "metformin-500mg", clinicId: "moshupa-01", daysRemaining: 4, risk: "MEDIUM" },
  { medicineId: "insulin-regular", clinicId: "moshupa-01", daysRemaining: 2, risk: "HIGH" },
];

const INITIAL_AUDIT_TRAIL = [
  { id: "aud-1", date: "Today, 09:42", medicine: "Paracetamol 500mg", qty: "16 units", method: "Web OCR", staff: "A. Batswana", facility: "Mogoditshane Primary Hospital" },
  { id: "aud-2", date: "Yesterday, 16:10", medicine: "Salbutamol 100mcg", qty: "40 inhalers", method: "Telegram", staff: "K. Tsie", facility: "Kopong Clinic" },
  { id: "aud-3", date: "Jun 11, 14:28", medicine: "Metformin 500mg", qty: "120 tablets", method: "Manual form", staff: "M. Kgosi", facility: "Gabane Clinic" },
  { id: "aud-4", date: "Jun 11, 11:05", medicine: "Amoxicillin 250mg", qty: "50 capsules", method: "SMS Sync", staff: "B. Setshogo", facility: "Thamaga Primary Hospital" }
];

const SAMPLE_OCR = [
  { id: "ocr-1", title: "Mogoditshane Tally", badge: "Pharmacy Log", dateStr: "Captured 10 mins ago via WhatsApp",
    preview: "MOGODITSHANE PRIMARY HOSPITAL\nDISPENSARY TALLY SHEET\n------------------------------\n1. Metformin 500mg   [ 150 tab ]  Exp: 03/27\n2. Paracetamol 500mg [ 200 tab ]  Exp: 11/26",
    extracted: [
      { medicine: "Metformin 500mg", medicineId: "metformin-500mg", qty: 150, expiry: "2027-03-15", confidence: 94, isLow: false },
      { medicine: "Paracetamol 500mg", medicineId: "paracetamol-500mg", qty: 200, expiry: "2026-11-20", confidence: 67, isLow: true, reason: "Smudged handwritten numeral on row 2" }
    ]},
  { id: "ocr-2", title: "Gabane Tally", badge: "Bin Card OCR", dateStr: "Captured 25 mins ago via Camera Upload",
    preview: "GABANE CLINIC - STOCK TALLY\n------------------------------\n1. Amoxicillin 250mg  [  80 cap ]  Exp: 05/27\n2. ORS Sachets        [ 500 sach ] Exp: 01/28",
    extracted: [
      { medicine: "Amoxicillin 250mg", medicineId: "amoxicillin-250mg", qty: 80, expiry: "2027-05-18", confidence: 89, isLow: false },
      { medicine: "ORS", medicineId: "ors", qty: 500, expiry: "2028-01-10", confidence: 92, isLow: false }
    ]},
  { id: "ocr-3", title: "Kopong Tally", badge: "CMS Dispatch", dateStr: "Captured 1h ago via Web Portal",
    preview: "KOPONG CLINIC - DELIVERY RECEIPT\n------------------------------\n1. Insulin Regular   [  30 vial ]  Exp: 12/25\n2. Atenolol 50mg     [  45 tab  ]  Exp: 08/26",
    extracted: [
      { medicine: "Insulin (Regular)", medicineId: "insulin-regular", qty: 30, expiry: "2025-12-31", confidence: 71, isLow: true, reason: "Low confidence — handwritten quantity may be 36" },
      { medicine: "Atenolol 50mg", medicineId: "atenolol-50mg", qty: 45, expiry: "2026-08-30", confidence: 55, isLow: true, reason: "Batch stamp partially illegible" }
    ]}
];

const DATASETS = [
  { id: 1, name: "WHO Botswana Health Indicators", org: "WHO / HDX", category: "Epidemiological Baselines", howWeUse: "Calibrates baseline epidemiological consumption curves for respiratory and infectious diseases across districts.", insight: "Establishes non-communicable disease burden baselines to normalize expected monthly consumption per capita.", tag: "Global Standard" },
  { id: 2, name: "Statistics Botswana Data Portal", org: "Statistics Botswana", category: "Demographics & Census", howWeUse: "Provides official 2022 population census figures by sub-district (Kweneng East: 310,000+ residents).", insight: "Links population growth rates directly to baseline buffer inventory requirements for each hospital catchment.", tag: "National Census" },
  { id: 3, name: "Botswana Open Data for Africa", org: "African Development Bank (AfDB)", category: "Socioeconomic Indicators", howWeUse: "Integrates rural poverty indices, road infrastructure access, and public transport density metrics.", insight: "Identifies remote settlements where supply stock-outs impose the highest travel hardship cost on citizens.", tag: "Socioeconomic" },
  { id: 4, name: "World Bank Open Data", org: "World Bank", category: "Health Financing", howWeUse: "Tracks public health expenditure per capita and out-of-pocket health costs to evaluate systemic risk.", insight: "Highlights economic vulnerability during secondary market purchases when central procurement lags.", tag: "Macro Health" },
  { id: 5, name: "OpenStreetMap (OSM)", org: "OSM Contributors", category: "Geospatial & Road Routing", howWeUse: "Powers real-time route calculation, inter-clinic distance matrices, and transit-time estimations for transfers.", insight: "Calculates precise transfer transit minutes between Thamaga and Mogoditshane via the A10 corridor.", tag: "Open Geospatial" },
  { id: 6, name: "NASA POWER / CHIRPS", org: "NASA / USGS", category: "Climate & Meteorological", howWeUse: "Monitors real-time solar irradiance, daily maximum heat indices, and precipitation anomalies across Botswana.", insight: "A +4.2°C 5-day heatwave anomaly automatically triggers a 3.2× spike coefficient for ORS rehydration stock.", tag: "Real-time Climate" },
  { id: 7, name: "Botswana Healthsites Layer", org: "HDX / Healthsites.io", category: "Facility Geolocation", howWeUse: "Maps 2,847 verified health facilities nationwide for redistribution network planning.", insight: "Enables automated nearest-facility fallbacks when primary local clinics report zero inventory.", tag: "2,847 Facilities" },
  { id: 8, name: "WorldPop Gridded Population", org: "WorldPop / Univ. of Southampton", category: "High-Resolution Catchment", howWeUse: "100m grid cells mapping the exact pediatric population within 5km of each clinic.", insight: "Mogoditshane catchment: 12,400 residents, 18% under age 5 → pediatric buffer stock calibrated.", tag: "100m Precision" },
  { id: 9, name: "BAIS V HIV & NCD Statistics", org: "Statistics Botswana / MOH", category: "Disease Prevalence", howWeUse: "Kweneng East adult HIV prevalence (19.3%) calibrates ARV & antibiotic safety stock.", insight: "ARV safety stock +23% to maintain 90-day medication continuity for chronic cohorts.", tag: "BAIS V Survey" },
  { id: 10, name: "Botswana Causes of Mortality", org: "Statistics Botswana", category: "Vital Statistics", howWeUse: "Cardiovascular deaths rising 8% YoY → hypertension medication priority escalation.", insight: "Elevates Amlodipine and Atenolol to high-priority redistribution status across all district nodes.", tag: "Vital Registry" },
  { id: 11, name: "DHIS2 Metadata & ADX Schemas", org: "HISP Centre / WHO", category: "Interoperability", howWeUse: "Direct schema mapping to DHIS2 Data Value Sets — no parallel system needed.", insight: "District pharmacists can export compliant ADX XML/JSON with one click. Two-way sync designed.", tag: "DHIS2 ADX Native" },
  { id: 12, name: "WHO SARA Framework", org: "WHO", category: "Facility Readiness", howWeUse: "Benchmarks cold-chain storage and pharmacy staffing into our Redistribution Suitability Index.", insight: "Prevents routing temperature-sensitive insulin to facilities with unstable cold chain logs.", tag: "Readiness Index" }
];

const CLIMATE_DATA = {
  normal: { orsMult: 1.0, paraMult: 1.0, salbMult: 1.0, alert: null, alertColor: "emerald", actions: ["Standard monitoring protocols active.", "No proactive redistribution required."] },
  heatwave: { orsMult: 3.2, paraMult: 1.8, salbMult: 1.4, alert: "Heatwave Alert: Kweneng East | Temperature anomaly +4.2°C | NASA POWER data | Next 5 days", alertColor: "red", actions: [
    "Pre-position 500 ORS sachets at Mogoditshane, Gabane, and Kopong clinics before the heatwave peaks.",
    "Alert chronic patients via SMS: Prepare guidance on hydration and medicine continuity."
  ]}
};

// ══════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ══════════════════════════════════════════════════════════════

function StatusBadge({ status }) {
  const s = { available: "bg-emerald-100 text-emerald-800 border-emerald-200", low: "bg-amber-100 text-amber-800 border-amber-200", out: "bg-red-100 text-red-800 border-red-200" };
  const icons = { available: <CheckCircle2 className="w-3 h-3 mr-1" />, low: <AlertTriangle className="w-3 h-3 mr-1" />, out: <X className="w-3 h-3 mr-1" /> };
  return <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${s[status] || s.available}`}>{icons[status]}{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
}

function ConfidenceMeter({ value }) {
  const c = value >= 80 ? "text-emerald-600" : value >= 60 ? "text-amber-600" : "text-red-600";
  const b = value >= 80 ? "bg-emerald-500" : value >= 60 ? "bg-amber-500" : "bg-red-500";
  return <div className="flex items-center gap-1.5"><div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden"><div className={`h-full rounded-full ${b}`} style={{ width: `${value}%` }} /></div><span className={`text-xs font-medium ${c}`}>{value}%</span></div>;
}

function TrendIcon({ trend }) {
  if (trend === "up") return <ArrowRight className="w-3 h-3 text-emerald-500 -rotate-45" />;
  if (trend === "down") return <ArrowRight className="w-3 h-3 text-red-500 rotate-45" />;
  return <ArrowRight className="w-3 h-3 text-gray-400" />;
}

function Toast({ message, onClose }) {
  if (!message) return null;
  return <div className="fixed bottom-4 right-4 z-50 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl flex items-start gap-3 max-w-sm animate-slide-up"><CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" /><div><p className="font-semibold text-sm">{message.title}</p><p className="text-xs text-gray-300 mt-0.5">{message.desc}</p></div><button onClick={onClose} className="text-gray-400 hover:text-white ml-2 shrink-0"><X className="w-4 h-4" /></button></div>;
}

function RiskBadge({ risk }) {
  const c = { CRITICAL: "bg-red-100 text-red-700 border-red-200", HIGH: "bg-orange-100 text-orange-700 border-orange-200", MEDIUM: "bg-amber-100 text-amber-700 border-amber-200", LOW: "bg-blue-100 text-blue-700 border-blue-200" };
  return <span className={`px-2 py-0.5 text-xs font-bold rounded-full border ${c[risk] || c.MEDIUM}`}>{risk}</span>;
}

// ══════════════════════════════════════════════════════════════
// TRANSFER MODAL
// ══════════════════════════════════════════════════════════════

function TransferModal({ transfer, clinics, onClose, onApprove, showToast }) {
  if (!transfer) return null;
  const source = clinics.find(c => c.id === transfer.sourceClinicId);
  const target = clinics.find(c => c.id === transfer.targetClinicId);
  const med = MEDICINES.find(m => m.id === transfer.medicineId);
  const sourceMed = source?.medicines[transfer.medicineId];
  const excess = sourceMed ? sourceMed.stock - 20 : 0;
  const rsi = Math.min(100, Math.round(60 + (excess / 5) - (transfer.distanceKm || source?.distanceKm || 10) * 0.5 + (transfer.urgency === "high" ? 15 : transfer.urgency === "medium" ? 5 : 0)));
  const travelMin = Math.round((transfer.distanceKm || source?.distanceKm || 10) * 1.2);
  const costPula = Math.round((transfer.distanceKm || source?.distanceKm || 10) * 3.5 + transfer.transferQty * 0.5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Transfer Recommendation</h2>
            <p className="text-sm text-gray-500">Redistribution Suitability Index</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">{med?.name}</span>
            <RiskBadge risk={transfer.urgency?.toUpperCase() || "HIGH"} />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg">
              <Building2 className="w-3 h-3 text-emerald-600" />
              <span>{source?.name}</span>
              <span className="text-emerald-700 font-medium">(excess: {excess} {med?.unit})</span>
            </div>
          </div>
          <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-gray-400" /></div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-1 bg-red-50 px-2 py-1 rounded-lg">
              <Building2 className="w-3 h-3 text-red-600" />
              <span>{target?.name}</span>
              <span className="text-red-700 font-medium">(stock: {target?.medicines[transfer.medicineId]?.stock || 0} {med?.unit})</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-lg font-bold text-blue-700">{rsi}<span className="text-xs">/100</span></p>
            <p className="text-xs text-blue-600">RSI Score</p>
            <p className="text-[10px] text-blue-400">Redistribution Suitability Index</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-lg font-bold text-gray-700">{travelMin}<span className="text-xs"> min</span></p>
            <p className="text-xs text-gray-500">Travel time</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-lg font-bold text-gray-700">P{costPula}</p>
            <p className="text-xs text-gray-500">Est. cost</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-xs text-amber-800"><span className="font-semibold">Why this route?</span> {transfer.reason}</p>
        </div>

        <div className="flex gap-3">
          <button onClick={() => { onApprove(transfer); onClose(); showToast("Transfer logged", `${target?.name} ${med?.name} stock updated to ${(target?.medicines[transfer.medicineId]?.stock || 0) + transfer.transferQty} ${med?.unit}.`); }} className="flex-1 bg-emerald-600 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-700 flex items-center justify-center gap-2 transition-colors">
            <CheckCircle2 className="w-4 h-4" /> Approve Transfer
          </button>
          <button onClick={onClose} className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">Dismiss</button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// LEAFLET MAP COMPONENT
// ══════════════════════════════════════════════════════════════

function getMarkerColor(clinic) {
  const statuses = Object.values(clinic.medicines).map(m => m.status);
  const outCount = statuses.filter(s => s === "out").length;
  const lowCount = statuses.filter(s => s === "low").length;
  if (outCount >= 2) return "#e53e3e";
  if (lowCount >= 2 || outCount >= 1) return "#d69e2e";
  return "#38a169";
}

// ══════════════════════════════════════════════════════════════
// LANDING PAGE
// ══════════════════════════════════════════════════════════════

function LandingPage({ navigate }) {
  const roleCards = [
    { icon: Users, title: "Citizen / Patient", desc: "Search for essential medicines near you before you travel", route: "/patient", color: "from-blue-500 to-indigo-600", emoji: "👤" },
    { icon: Stethoscope, title: "Clinic Staff", desc: "Update stock levels via WhatsApp, SMS, email, or web upload", route: "/clinic", color: "from-emerald-500 to-teal-600", emoji: "🏥" },
    { icon: ShieldCheck, title: "DHMT / District Admin", desc: "View district-wide stock levels and predict shortages before they happen", route: "/admin", color: "from-rose-500 to-pink-600", emoji: "🗺️" },
  ];

  const howItWorks = [
    { num: 1, icon: Upload, title: "Clinic staff update stock", desc: "Via WhatsApp, SMS, email, or photo upload. OCR extracts with confidence scoring. Human confirmation required." },
    { num: 2, icon: Globe2, title: "DHMT sees district-wide stock", desc: "On a live map. Emerging shortages flagged. Redistribution Suitability Index generates transfer recommendations." },
    { num: 3, icon: Search, title: "Patients search before they travel", desc: "Availability confidence %, last verified time, nearest facility. No wasted trips." },
    { num: 4, icon: Thermometer, title: "Climate data triggers proactive alerts", desc: "Heatwave predicted? ORS pre-positioned before demand spikes. NASA POWER satellite data." },
    { num: 5, icon: Database, title: "Anonymized data feeds the ecosystem", desc: "DHIS2-compatible export. Strengthens national health information systems. Open data in, open data out." },
  ];

  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-8 md:p-12 text-white">
        <h1 className="text-3xl md:text-4xl font-bold">Botshelo Link — <span className="text-blue-200">Know Before You Go.</span></h1>
        <p className="text-blue-100 mt-3 text-lg max-w-2xl">Don't waste the trip. Check medicine availability before you travel.</p>
        <div className="mt-4 bg-white/10 border border-white/20 rounded-xl p-4 max-w-2xl">
          <p className="text-sm text-blue-100"><span className="font-semibold text-white">Why now:</span> Botswana declared a public health emergency over medicine shortages in 2025. When Central Medical Stores runs out, clinics save each other — if they can see each other's stock. Botshelo Link is that visibility.</p>
        </div>
      </div>

      {/* Live Signal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Kweneng East", value: "+35% risk", detail: "ORS — Pre-position 500 sachets", icon: AlertTriangle, color: "border-red-200 bg-red-50" },
          { label: "Salbutamol", value: "Transfer ready", detail: "3 clinics with surplus", icon: Truck, color: "border-amber-200 bg-amber-50" },
          { label: "Metformin", value: "Network stable", detail: "6 clinics reporting", icon: Activity, color: "border-emerald-200 bg-emerald-50" },
        ].map((card, i) => (
          <div key={i} className={`rounded-xl border p-4 ${card.color}`}>
            <div className="flex items-center gap-2 mb-2"><card.icon className="w-4 h-4" /><span className="text-xs font-medium text-gray-600">{card.label}</span></div>
            <p className="text-lg font-bold text-gray-900">{card.value}</p>
            <p className="text-xs text-gray-500 mt-1">{card.detail}</p>
          </div>
        ))}
      </div>

      {/* Projected Impact KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { value: "−35%", label: "fewer wasted patient trips", desc: "Search before you travel" },
          { value: "<48h", label: "stockout response time", desc: "Down from 7+ days" },
          { value: "10+", label: "inter-clinic transfers", desc: "per month at pilot scale" },
        ].map((kpi, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-700">{kpi.value}</p>
            <p className="text-sm font-medium text-gray-900 mt-1">{kpi.label}</p>
            <p className="text-xs text-gray-500 mt-0.5">{kpi.desc}</p>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-gray-500">Confirmed updates only enter the ledger · Patient queries are anonymous — no personal data stored</p>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roleCards.map(card => (
          <button key={card.route} onClick={() => navigate(card.route)} className={`bg-gradient-to-br ${card.color} rounded-2xl p-6 text-white text-left hover:shadow-xl transition-all group`}>
            <span className="text-3xl">{card.emoji}</span>
            <h3 className="text-lg font-bold mt-3">{card.title}</h3>
            <p className="text-sm text-white/80 mt-1">{card.desc}</p>
            <div className="mt-4 flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all">Get started <ArrowRight className="w-4 h-4" /></div>
          </button>
        ))}
      </div>

      {/* How It Works */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
        <div className="space-y-4">
          {howItWorks.map(step => (
            <div key={step.num} className="flex items-start gap-4 bg-white rounded-xl border border-gray-200 p-5">
              <div className="bg-blue-100 text-blue-700 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shrink-0">{step.num}</div>
              <div>
                <h3 className="font-semibold text-gray-900 flex items-center gap-2"><step.icon className="w-4 h-4 text-blue-600" /> {step.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data → Action Flow */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 text-center">From data to action</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-0 overflow-x-auto">
          {[
            { icon: "📊", label: "Open Data", desc: "Facility, climate, population" },
            { icon: "⚠️", label: "Risk Detected", desc: "Shortage predicted" },
            { icon: "🔄", label: "Recommendation", desc: "Transfer suggested" },
            { icon: "✅", label: "Action Taken", desc: "Stock redistributed" },
          ].map((step, i) => (
            <React.Fragment key={i}>
              <div className="text-center px-4 py-2 min-w-[120px]">
                <span className="text-2xl">{step.icon}</span>
                <p className="text-sm font-semibold text-gray-900 mt-1">{step.label}</p>
                <p className="text-xs text-gray-500">{step.desc}</p>
              </div>
              {i < 3 && <ArrowRight className="w-5 h-5 text-gray-300 shrink-0 hidden sm:block" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Maternal Mortality Stat */}
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="bg-rose-100 p-3 rounded-xl shrink-0"><Siren className="w-6 h-6 text-rose-600" /></div>
          <div>
            <h3 className="font-bold text-rose-900 text-lg">Maternal Mortality Spike</h3>
            <p className="text-sm text-rose-800 mt-1">In 2021, Botswana's maternal mortality ratio spiked to <span className="font-bold">240 per 100,000</span> — nearly double the baseline. Stock-outs of oxytocin and obstetric kits contributed. District-level risk calibration prevents this.</p>
            <p className="text-xs text-rose-600 mt-2">Source: Statistics Botswana</p>
          </div>
        </div>
      </div>

      {/* Feature Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Database, title: "Open by design", desc: "WHO, Statistics Botswana, World Bank, climate, and map data are named and attributed." },
          { icon: ShieldCheck, title: "Human in the loop", desc: "OCR confidence scores and review gates prevent unverified stock from entering the ledger." },
          { icon: Sparkles, title: "Built for the challenge", desc: "National Open Data Innovation Challenge 2 · Botswana Innovation Hub · Sept 2026" },
        ].map((badge, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
            <badge.icon className="w-5 h-5 text-blue-600 mb-2" />
            <h4 className="font-semibold text-sm text-gray-900">{badge.title}</h4>
            <p className="text-xs text-gray-500 mt-1">{badge.desc}</p>
          </div>
        ))}
      </div>

      {/* Pilot CTA */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold">Ready to pilot in your district?</h2>
        <p className="text-emerald-100 mt-2 max-w-xl mx-auto text-sm">Botshelo Link is piloting in Kweneng East. Designed to expand nationally — DHIS2-native means zero integration friction with existing district health teams.</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <button className="bg-white text-emerald-700 px-6 py-2.5 rounded-lg font-semibold hover:bg-emerald-50 transition-colors flex items-center gap-2">
            <Send className="w-4 h-4" /> Request a pilot
          </button>
          <button onClick={() => navigate("/clinic")} className="bg-emerald-500/20 border border-white/40 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-emerald-500/30 transition-colors flex items-center gap-2">
            Join as a clinic <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <button onClick={() => navigate("/data-sources")} className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1 mx-auto">See the open-data foundation <ArrowRight className="w-4 h-4" /></button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// PATIENT PAGE
// ══════════════════════════════════════════════════════════════

function PatientPage({ clinics }) {
  const [selectedMedicine, setSelectedMedicine] = useState("salbutamol-100mcg");
  const [searchQuery, setSearchQuery] = useState("");

  const medInfo = MEDICINES.find(m => m.id === selectedMedicine);

  const sorted = useMemo(() => {
    return clinics.map(c => ({ ...c, medData: c.medicines[selectedMedicine] })).sort((a, b) => {
      const o = { out: 0, low: 1, available: 2 };
      return (o[b.medData?.status] || 0) - (o[a.medData?.status] || 0);
    });
  }, [clinics, selectedMedicine]);

  const filtered = sorted.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.district.toLowerCase().includes(searchQuery.toLowerCase()));
  const bestClinic = sorted.find(c => c.medData?.status === "available" && c.medData?.confidence >= 80);
  const outCount = sorted.filter(c => c.medData?.status === "out").length;
  const lowCount = sorted.filter(c => c.medData?.status === "low").length;
  const availCount = sorted.filter(c => c.medData?.status === "available").length;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Pill className="w-6 h-6" /> Find essential medicines</h1>
        <p className="text-blue-100 mt-1">Know before you go. <span className="italic">Itse pele o tsamaya.</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Medicine</label>
          <select value={selectedMedicine} onChange={e => setSelectedMedicine(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            {MEDICINES.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Search Clinics</label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by name or district..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 flex items-center gap-2">
        <MapPin className="w-4 h-4 text-blue-600" />
        <span className="text-sm text-blue-800 font-medium">District: Kweneng East</span>
        <span className="text-xs text-blue-600">(Pilot district. More coming.)</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-emerald-700">{availCount}</p><p className="text-xs text-emerald-600">In Stock</p></div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-amber-700">{lowCount}</p><p className="text-xs text-amber-600">Low Stock</p></div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-red-700">{outCount}</p><p className="text-xs text-red-600">Out of Stock</p></div>
      </div>

      {bestClinic && (
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-4">
          <div className="bg-emerald-100 p-3 rounded-xl"><Sparkles className="w-5 h-5 text-emerald-600" /></div>
          <div className="flex-1">
            <p className="text-xs text-emerald-600 font-medium uppercase tracking-wide">Recommended facility</p>
            <p className="font-bold text-emerald-900">{bestClinic.name}</p>
            <p className="text-xs text-emerald-700">{bestClinic.distanceKm} km · {bestClinic.medData?.confidence}% confidence · {bestClinic.medData?.stock} {bestClinic.medData?.unit} in stock</p>
          </div>
          <a href={`https://www.google.com/maps/dir/?api=1&destination=${bestClinic.coords[0]},${bestClinic.coords[1]}`} target="_blank" rel="noopener noreferrer" className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-1 shrink-0">
            <Route className="w-4 h-4" /> Directions
          </a>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map(clinic => (
          <div key={clinic.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${clinic.medData?.status === "available" ? "bg-emerald-100" : clinic.medData?.status === "low" ? "bg-amber-100" : "bg-red-100"}`}>
                  <Building2 className={`w-5 h-5 ${clinic.medData?.status === "available" ? "text-emerald-600" : clinic.medData?.status === "low" ? "text-amber-600" : "text-red-600"}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{clinic.name}</h3>
                    {clinic.distanceKm <= 5 && <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full font-medium">Gaufi le Nna · Nearby</span>}
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" /> {clinic.district} · {clinic.distanceKm} km</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3" /> {clinic.phone}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3" /> Last updated {clinic.medData?.lastUpdated}</p>
                </div>
              </div>
              <StatusBadge status={clinic.medData?.status || "out"} />
            </div>
            {clinic.medData && (
              <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div><p className="text-gray-500 text-xs">Stock</p><p className="font-semibold text-gray-900">{clinic.medData.stock} {clinic.medData.unit}</p><p className="text-[10px] text-gray-400 mt-0.5">Updated {clinic.medData.lastUpdated}</p></div>
                <div><p className="text-gray-500 text-xs flex items-center gap-1">Match Score <span className="text-[10px] text-gray-400" title="Based on: stock availability (40%), data freshness (25%), distance (20%), facility suitability (15%)">ⓘ</span></p><ConfidenceMeter value={clinic.medData.confidence} /><p className="text-[10px] text-gray-400 mt-0.5">Stock · Freshness · Distance · Facility</p></div>
                <div><p className="text-gray-500 text-xs">Trend</p><div className="flex items-center gap-1"><TrendIcon trend={clinic.medData.trend} /><span className="text-xs capitalize">{clinic.medData.trend}</span></div></div>
                <div className="flex gap-2 items-end">
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${clinic.coords[0]},${clinic.coords[1]}`} target="_blank" rel="noopener noreferrer" className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-lg flex items-center gap-1 text-gray-700"><Route className="w-3 h-3" /> Directions</a>
                  <a href={`tel:${clinic.phone}`} className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-lg flex items-center gap-1 text-gray-700"><PhoneCall className="w-3 h-3" /> Call</a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1"><AlertTriangle className="w-3 h-3" /> Verify with clinic before travelling. Availability is a facility-level view and may change between updates.</p>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// ADMIN PAGE
// ══════════════════════════════════════════════════════════════

function AdminPage({ clinics, setClinics, showToast }) {
  const [activeTab, setActiveTab] = useState("transfer");
  const [filterRisk, setFilterRisk] = useState("all");
  const [transferModal, setTransferModal] = useState(null);
  const [approvedIds, setApprovedIds] = useState([]);
  const [originalClinics] = useState(clinics);
  const [transfersLog, setTransfersLog] = useState([]);

  // Generate transfer recommendations dynamically from current clinic state
  const transferRecommendations = useMemo(() => {
    const recs = [];
    clinics.forEach(targetClinic => {
      Object.entries(targetClinic.medicines).forEach(([medId, med]) => {
        if (med.status === "out" || med.status === "low") {
          // Find a source clinic with surplus
          const source = clinics.find(c => c.id !== targetClinic.id && c.medicines[medId]?.stock > 30 && c.medicines[medId]?.status === "available");
          if (source) {
            const medMeta = MEDICINES.find(m => m.id === medId);
            const sourceStock = source.medicines[medId].stock;
            const transferQty = Math.min(50, Math.floor(sourceStock * 0.3));
            const distance = Math.sqrt(Math.pow(source.coords[0] - targetClinic.coords[0], 2) + Math.pow(source.coords[1] - targetClinic.coords[1], 2)) * 111;
            const rsi = Math.min(100, Math.round(60 + (sourceStock / 10) - distance * 0.5 + (med.status === "out" ? 20 : 5)));
            const travelMin = Math.round(distance * 1.2);
            const costPula = Math.round(distance * 3.5 + transferQty * 0.5);
            const id = `${source.id}-${targetClinic.id}-${medId}`;
            recs.push({
              id, sourceClinicId: source.id, targetClinicId: targetClinic.id,
              medicineId: medId, transferQty, rsi, distance: Math.round(distance * 10) / 10,
              travelMin, costPula, risk: med.status === "out" ? "CRITICAL" : "HIGH",
              sourceName: source.name, targetName: targetClinic.name,
              medicineName: medMeta?.name || medId, unit: medMeta?.unit || "units",
              reason: `${targetClinic.name} ${med.status === "out" ? "out of" : "low on"} ${medMeta?.name}; ${source.name} has ${sourceStock} ${medMeta?.unit}`
            });
          }
        }
      });
    });
    return recs.sort((a, b) => (a.risk === "CRITICAL" ? 0 : 1) - (b.risk === "CRITICAL" ? 0 : 1) || b.rsi - a.rsi);
  }, [clinics]);

  // District medicine risk from current clinic state
  const medicineRisk = useMemo(() => {
    const risk = {};
    clinics.forEach(c => {
      Object.entries(c.medicines).forEach(([medId, med]) => {
        if (!risk[medId]) risk[medId] = { medicineId: medId, worst: "available", clinics: 0, outClinics: 0, lowClinics: 0, totalStock: 0 };
        risk[medId].clinics++;
        risk[medId].totalStock += med.stock;
        if (med.status === "out") { risk[medId].outClinics++; risk[medId].worst = "out"; }
        else if (med.status === "low" && risk[medId].worst !== "out") { risk[medId].lowClinics++; risk[medId].worst = "low"; }
      });
    });
    return Object.values(risk).map(r => {
      const medMeta = MEDICINES.find(m => m.id === r.medicineId);
      const avgStock = Math.round(r.totalStock / r.clinics);
      const riskLabel = r.outClinics > 0 ? "CRITICAL" : r.lowClinics > 0 ? "HIGH" : "OK";
      const daysEst = r.outClinics > 0 ? Math.max(0, Math.round(avgStock / 25)) : r.lowClinics > 0 ? Math.round(avgStock / 15) : Math.round(avgStock / 8);
      return { ...r, name: medMeta?.name || r.medicineId, unit: medMeta?.unit || "units", riskLabel, daysEst, avgStock };
    }).sort((a, b) => (a.riskLabel === "CRITICAL" ? 0 : a.riskLabel === "HIGH" ? 1 : 2) - (b.riskLabel === "CRITICAL" ? 0 : b.riskLabel === "HIGH" ? 1 : 2));
  }, [clinics]);

  const activeRecommendations = transferRecommendations.filter(r => !approvedIds.includes(r.id));
  const filteredRecs = activeRecommendations.filter(r => filterRisk === "all" || r.risk === filterRisk);

  const stats = useMemo(() => {
    let out = 0, low = 0, avail = 0;
    clinics.forEach(c => Object.values(c.medicines).forEach(m => { if (m.status === "out") out++; else if (m.status === "low") low++; else avail++; }));
    return { out, low, avail, total: out + low + avail, reporting: clinics.length };
  }, [clinics]);

  const handleApprove = (rec) => {
    setApprovedIds(prev => [...prev, rec.id]);
    setTransfersLog(prev => [...prev, { ...rec, timestamp: new Date().toLocaleTimeString() }]);
    setClinics(prev => prev.map(c => {
      if (c.id === rec.sourceClinicId) {
        const med = c.medicines[rec.medicineId];
        const ns = Math.max(0, med.stock - rec.transferQty);
        return { ...c, medicines: { ...c.medicines, [rec.medicineId]: { ...med, stock: ns, status: ns === 0 ? "out" : ns < 20 ? "low" : "available", lastUpdated: "Just now", trend: "down" } } };
      }
      if (c.id === rec.targetClinicId) {
        const med = c.medicines[rec.medicineId];
        const ns = med.stock + rec.transferQty;
        return { ...c, medicines: { ...c.medicines, [rec.medicineId]: { ...med, stock: ns, status: "available", lastUpdated: "Just now", trend: "up" } } };
      }
      return c;
    }));
    showToast("Transfer logged", `${rec.targetName} ${rec.medicineName} stock updated to ${rec.transferQty} ${rec.unit}.`);
  };

  const handleReset = () => {
    setClinics(JSON.parse(JSON.stringify(originalClinics)));
    setApprovedIds([]);
    setTransfersLog([]);
    showToast("Simulation reset", "All clinic stock levels restored to initial state.");
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-rose-600 to-pink-700 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2"><ShieldCheck className="w-6 h-6" /> Transfer Command Center</h1>
            <p className="text-rose-100 mt-1 italic">Boitekanelo Jwa Sechaba — See the district before the shortage spreads.</p>
          </div>
          <button onClick={handleReset} className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Reset Simulation
          </button>
        </div>
      </div>

      {/* District Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-3xl font-bold text-gray-900">{Math.round((stats.avail / stats.total) * 100)}%</p>
          <p className="text-xs text-gray-500 mt-1">Availability</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-3xl font-bold text-emerald-600">{stats.avail}</p>
          <p className="text-xs text-gray-500 mt-1">Available</p>
        </div>
        <div className="bg-white rounded-xl border border-amber-200 p-4 text-center">
          <p className="text-3xl font-bold text-amber-600">{stats.low}</p>
          <p className="text-xs text-gray-500 mt-1">Low Stock</p>
        </div>
        <div className="bg-white rounded-xl border border-red-200 p-4 text-center">
          <p className="text-3xl font-bold text-red-600">{stats.out}</p>
          <p className="text-xs text-gray-500 mt-1">Stock-outs</p>
        </div>
        <div className="bg-white rounded-xl border border-blue-200 p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">{activeRecommendations.length}</p>
          <p className="text-xs text-gray-500 mt-1">Pending Transfers</p>
        </div>
      </div>

      {/* District Medicine Risk */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> District Medicine Risk</h3>
          <span className="text-xs text-gray-500">{medicineRisk.filter(r => r.riskLabel !== "OK").length} medicines need attention</span>
        </div>
        <div className="divide-y divide-gray-100">
          {medicineRisk.map(r => (
            <div key={r.medicineId} className={`px-5 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ${r.riskLabel === "CRITICAL" ? "bg-red-50/50" : r.riskLabel === "HIGH" ? "bg-amber-50/50" : ""}`}>
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full shrink-0 ${r.riskLabel === "CRITICAL" ? "bg-red-500" : r.riskLabel === "HIGH" ? "bg-amber-500" : "bg-emerald-500"}`}></span>
                <div>
                  <p className="text-sm font-medium text-gray-900">{r.name}</p>
                  <p className="text-xs text-gray-500">{r.totalStock} {r.unit} across {r.clinics} facilities</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs shrink-0 sm:text-right">
                <div className="flex items-center gap-2 sm:gap-4">
                  {r.outClinics > 0 && <span className="text-red-600 font-medium">{r.outClinics} stock-out{r.outClinics > 1 ? "s" : ""}</span>}
                  {r.lowClinics > 0 && <span className="text-amber-600 font-medium">{r.lowClinics} low</span>}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full font-bold ${r.riskLabel === "CRITICAL" ? "bg-red-100 text-red-700" : r.riskLabel === "HIGH" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>{r.riskLabel}</span>
                  <span className="text-gray-600 font-medium">~{r.daysEst}d</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="px-5 py-2 bg-gray-50 text-center">
          <p className="text-[10px] text-gray-400">Estimated days to stock-out based on current trends · Avg. {Math.round(medicineRisk.reduce((s, r) => s + r.avgStock, 0) / medicineRisk.length)} units/facility</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-1">
        {[{id:"transfer", label:`Transfers (${activeRecommendations.length})`, icon: Truck}, {id:"map", label:"District Map", icon: Globe2}, {id:"log", label:`Log (${transfersLog.length})`, icon: Activity}].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors flex items-center gap-1.5 ${activeTab === tab.id ? "bg-white border border-gray-200 border-b-white text-gray-900 -mb-px" : "text-gray-500 hover:text-gray-700"}`}><tab.icon className="w-4 h-4" /> {tab.label}</button>
        ))}
      </div>

      {/* Transfer Recommendations Tab */}
      {activeTab === "transfer" && (
        <div className="space-y-4">
          {activeRecommendations.length === 0 ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-emerald-800">All transfers complete</h3>
              <p className="text-sm text-emerald-600 mt-1">All recommended transfers have been approved. District stock levels are optimized.</p>
              <button onClick={handleReset} className="mt-4 bg-emerald-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-emerald-700 flex items-center gap-2 mx-auto">
                <RefreshCw className="w-4 h-4" /> Reset Simulation
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <Filter className="w-4 h-4 text-gray-500" />
                <select value={filterRisk} onChange={e => setFilterRisk(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm">
                  <option value="all">All Priorities ({activeRecommendations.length})</option>
                  <option value="CRITICAL">Critical</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                </select>
              </div>
              {filteredRecs.map(rec => (
                <div key={rec.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${rec.risk === "CRITICAL" ? "bg-red-100 text-red-700" : rec.risk === "HIGH" ? "bg-orange-100 text-orange-700" : "bg-amber-100 text-amber-700"}`}>{rec.risk}</span>
                        <span className="text-sm font-semibold text-gray-900">{rec.medicineName}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                          <Building2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="font-medium truncate">{rec.sourceName}</span>
                          <span className="text-emerald-700 text-xs shrink-0">({clinics.find(c => c.id === rec.sourceClinicId)?.medicines[rec.medicineId]?.stock || 0} {rec.unit})</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 shrink-0 hidden sm:block" />
                        <div className="flex items-center gap-1 bg-red-50 px-2 py-1 rounded-lg border border-red-200">
                          <Building2 className="w-3 h-3 text-red-600 shrink-0" />
                          <span className="font-medium truncate">{rec.targetName}</span>
                          <span className="text-red-700 text-xs shrink-0">({clinics.find(c => c.id === rec.targetClinicId)?.medicines[rec.medicineId]?.stock || 0} {rec.unit})</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">{rec.reason}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                        <span>RSI: <span className="font-bold text-blue-700">{rec.rsi}/100</span></span>
                        <span>{rec.transferQty} {rec.unit}</span>
                        <span>{rec.distance} km · ~{rec.travelMin} min</span>
                        <span>P{rec.costPula}</span>
                      </div>
                    </div>
                    <button onClick={() => handleApprove(rec)} className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 shrink-0 sm:ml-4 mt-3 sm:mt-0 w-full sm:w-auto justify-center">
                      <CheckCircle2 className="w-4 h-4" /> Approve
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* Map Tab */}
      {activeTab === "map" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div style={{ height: 450 }}>
            <MapContainer center={[-24.58, 25.75]} zoom={9} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
              <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {clinics.map(clinic => (
                <CircleMarker key={clinic.id} center={clinic.coords} radius={10} fillColor={getMarkerColor(clinic)} color="#fff" weight={2} fillOpacity={0.9}>
                  <Popup>
                    <div className="text-sm min-w-[200px]">
                      <p className="font-bold">{clinic.name}</p>
                      <p className="text-gray-500 text-xs">{clinic.type} · {clinic.district}</p>
                      <div className="mt-2 space-y-1">
                        {Object.entries(clinic.medicines).slice(0, 5).map(([medId, med]) => {
                          const meta = MEDICINES.find(m => m.id === medId);
                          return <div key={medId} className="flex items-center justify-between text-xs"><span>{meta?.name}</span><StatusBadge status={med.status} /></div>;
                        })}
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
          <div className="p-3 border-t border-gray-200 flex items-center gap-4 text-xs text-gray-600">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-500" /> Available</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-500" /> Low / emerging risk</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500" /> 2+ stock-outs</span>
          </div>
        </div>
      )}

      {/* Transfer Log Tab */}
      {activeTab === "log" && (
        <div className="space-y-4">
          {transfersLog.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
              <Activity className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No transfers approved yet. Go to the Transfers tab to approve recommendations.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>{["Time","Medicine","From","To","Qty","Status"].map(h => <th key={h} className="text-left px-4 py-3 font-medium text-gray-600">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transfersLog.map((log, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-500">{log.timestamp}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{log.medicineName}</td>
                      <td className="px-4 py-3 text-gray-600">{log.sourceName}</td>
                      <td className="px-4 py-3 text-gray-600">{log.targetName}</td>
                      <td className="px-4 py-3 text-gray-700">{log.transferQty} {log.unit}</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded-full font-medium">Approved</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <TransferModal transfer={transferModal} clinics={clinics} onClose={() => setTransferModal(null)} onApprove={handleApprove} showToast={showToast} />
    </div>
  );
}


// ══════════════════════════════════════════════════════════════
// SMS GATEWAY HELPERS (httpSMS integration)
// ══════════════════════════════════════════════════════════════

const SMS_MEDICINE_CODES = {
  "MET-500": "metformin-500mg",
  "SAL-100": "salbutamol-100mcg",
  "AMOX-250": "amoxicillin-250mg",
  "ORS": "ors",
  "PARA-500": "paracetamol-500mg",
  "INSULIN": "insulin-regular",
  "ATEN-50": "atenolol-50mg",
  "AML-5": "amlodipine-5mg",
};

const SAMPLE_SMS = [
  "Mogoditshane-01 MET-500 150 2027-03-15",
  "Kopong-01 SAL-100 40 2026-11-30",
  "Gabane-01 AMOX-250 80 2027-05-18",
  "Thamaga-01 ORS 500 2028-01-10",
];

function parseSmsMessage(text, clinics) {
  const parts = text.trim().split(/\s+/);
  if (parts.length < 3) return { error: "Format: FACILITY MEDICINE QTY [EXPIRY]" };
  if (parts.length > 4) return { error: "Too many fields — format: FACILITY MEDICINE QTY [EXPIRY]" };
  const [facCode, medCode, qtyStr, expiry] = parts;
  const qty = parseInt(qtyStr, 10);
  if (isNaN(qty) || qty < 0) return { error: "Invalid quantity: " + qtyStr };
  const facilityId = facCode.toLowerCase().replace(/ /g, "-");
  const facility = clinics.find(c => c.id === facilityId);
  if (!facility) return { error: "Unknown facility: " + facCode + ". Try: Mogoditshane-01, Gabane-01, Kopong-01, Thamaga-01, Lentsweletau-01, Moshupa-01" };
  const medicineId = SMS_MEDICINE_CODES[medCode.toUpperCase()];
  if (!medicineId) return { error: "Unknown medicine: " + medCode + ". Valid codes: " + Object.keys(SMS_MEDICINE_CODES).join(", ") };
  const medicine = MEDICINES.find(m => m.id === medicineId);
  return { facility, medicine, qty, expiry: expiry || "—" };
}

function ClinicStaffPage({ clinics, setClinics, showToast }) {
  const [activeTab, setActiveTab] = useState("ocr");
  const [selectedSample, setSelectedSample] = useState(SAMPLE_OCR[0]);
  const [ocrConfirmed, setOcrConfirmed] = useState(false);
  const [manualForm, setManualForm] = useState({ clinicId: "mogoditshane-01", medicineId: "paracetamol-500mg", qty: 50, expiry: "2027-06-30", staff: "K. Sebele", notes: "" });
  const [smsInput, setSmsInput] = useState("");
  const [smsInbox, setSmsInbox] = useState([]);
  const [auditLog, setAuditLog] = useState(INITIAL_AUDIT_TRAIL);

  const handleSendSms = () => {
    if (!smsInput.trim()) return;
    const parsed = parseSmsMessage(smsInput, clinics);
    if (parsed.error) { showToast("SMS rejected", parsed.error); return; }
    const msg = { id: "sms-" + Date.now(), raw: smsInput.trim(), parsed, status: "parsed", confidence: 95 };
    setSmsInbox(prev => [msg, ...prev]);
    setSmsInput("");
    showToast("SMS received via httpSMS gateway", parsed.facility.name + " · " + parsed.medicine.name);
  };

  const handleConfirmSms = (id) => {
    const msg = smsInbox.find(m => m.id === id);
    if (!msg || !msg.parsed) return;
    const { facility, medicine, qty } = msg.parsed;
    setClinics(prev => prev.map(c => {
      if (c.id !== facility.id) return c;
      return { ...c, medicines: { ...c.medicines, [medicine.id]: { ...c.medicines[medicine.id], stock: qty, status: qty === 0 ? "out" : qty <= 15 ? "low" : "available", lastUpdated: "Just now", confidence: 95, trend: "up" } } };
    }));
    setAuditLog(prev => [{ id: "aud-" + Date.now(), date: "Just now", medicine: medicine.name, qty: qty + " " + medicine.unit, method: "SMS Sync", staff: "B. Setshogo", facility: facility.name }, ...prev]);
    setSmsInbox(prev => prev.map(m => m.id === id ? { ...m, status: "confirmed" } : m));
    showToast("Stock updated via SMS", medicine.name + " at " + facility.name + " — now " + qty + " " + medicine.unit);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold flex items-center gap-2"><UserCheck className="w-6 h-6" /> Clinic staff</h1>
        <p className="text-emerald-100 mt-1 italic">Any channel, any phone. <span className="italic">Ka mokgwa ofe le ofe, ka fono epe.</span></p>
      </div>

      {/* Primary Channels */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-emerald-600" /> Primary Channels — WhatsApp / SMS / Email</h3>
        <div className="mt-3 bg-gray-50 rounded-lg p-4 font-mono text-sm">
          <p className="text-gray-700">Format: <span className="font-bold">FACILITY-CODE MEDICINE-CODE QTY EXPIRY</span></p>
          <p className="text-gray-500 mt-1">Example: <span className="text-emerald-700">Mogoditshane-01 MET-500 150 2027-03-15</span></p>
        </div>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-500" /><span className="text-gray-700">+267 390 1204</span></div>
          <div className="flex items-center gap-2"><MessageSquare className="w-4 h-4 text-gray-500" /><span className="text-gray-700">updates@botshelolink.org</span></div>
          <div className="flex items-center gap-2"><Copy className="w-4 h-4 text-gray-500" /><span className="text-gray-700">USSD *XXX#</span></div>
        </div>
        <p className="text-xs text-gray-500 mt-3">WhatsApp Business API and SMS/USSD integration coming in pilot phase. Current demo uses web upload.</p>
      </div>

      {/* Offline Capability */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <WifiOff className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-amber-800">Works offline too</p>
          <p className="text-xs text-amber-700 mt-1">SMS and USSD function without internet. 57% internet penetration in Botswana means many rural clinics lack data — but they have cellular signal. Messages queue and sync when connectivity returns.</p>
        </div>
      </div>

      {/* DHIS2 */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Database className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-blue-800">DHIS2-Native Architecture</p>
          <p className="text-xs text-blue-700 mt-1">All stock data maps to DHIS2 Data Value Set definitions and ADX schemas. Two-way synchronization designed for national HMIS integration. No parallel systems.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-1">
        {[{id:"ocr", label:"OCR Scanner", icon: FileSpreadsheet}, {id:"manual", label:"Manual Entry", icon: FileText}, {id:"sms", label:"SMS Gateway", icon: MessageSquare}, {id:"fb", label:"Messenger", icon: MessageSquare}, {id:"audit", label:"Audit Trail", icon: Activity}].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors flex items-center gap-1.5 ${activeTab === tab.id ? "bg-white border border-gray-200 border-b-white text-gray-900 -mb-px" : "text-gray-500 hover:text-gray-700"}`}><tab.icon className="w-4 h-4" /> {tab.label}</button>
        ))}
      </div>

      {/* OCR Tab */}
      {activeTab === "ocr" && (
        <div className="space-y-4">
          {/* Drop Zone */}
          <div onClick={() => { setSelectedSample(SAMPLE_OCR[0]); setOcrConfirmed(false); }} className="border-2 border-dashed border-blue-300 bg-blue-50/50 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
            <Upload className="w-10 h-10 text-blue-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-blue-700">Drop a tally sheet here</p>
            <p className="text-xs text-blue-500 mt-1">or click to scan a sample document</p>
          </div>

          {/* 3 Clickable Sample Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {SAMPLE_OCR.map(s => (
              <button key={s.id} onClick={() => { setSelectedSample(s); setOcrConfirmed(false); }} className={`text-left p-4 rounded-xl border-2 transition-all ${selectedSample.id === s.id ? "border-blue-500 bg-blue-50 shadow-md" : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                  <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">{s.badge}</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">{s.title}</p>
                <p className="text-xs text-gray-500 mt-1">{s.dateStr}</p>
                <p className="text-xs text-blue-600 mt-2 font-medium">Click to scan →</p>
              </button>
            ))}
          </div>

          {/* Extraction Results */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 p-2 rounded-lg"><Sparkles className="w-5 h-5 text-purple-600" /></div>
              <div><h3 className="font-semibold text-gray-900">{selectedSample.title}</h3><p className="text-xs text-gray-500">{selectedSample.dateStr}</p></div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm text-gray-700 whitespace-pre-line border border-gray-200">{selectedSample.preview}</div>
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1"><Zap className="w-4 h-4 text-yellow-500" /> AI-Extracted Data</h4>
              {selectedSample.extracted.map((item, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${item.isLow ? "bg-amber-50 border-amber-200" : "bg-white border-gray-200"}`}>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.medicine}</p>
                    <p className="text-xs text-gray-500">Qty: {item.qty} · Exp: {item.expiry}</p>
                    {item.reason && <p className="text-xs text-amber-700 mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {item.reason}</p>}
                  </div>
                  <ConfidenceMeter value={item.confidence} />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1"><HelpCircle className="w-3 h-3" /> Human confirmation required before ledger entry</p>
            {!ocrConfirmed ? (
              <button onClick={() => { setOcrConfirmed(true); showToast("Added to review queue", `${selectedSample.title} — data submitted for verification.`); }} className="mt-4 w-full bg-emerald-600 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Confirm & Add to Ledger
              </button>
            ) : (
              <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-600" /><span className="text-sm text-emerald-700 font-medium">Added to review queue</span></div>
            )}
          </div>
        </div>
      )}

      {/* Manual Tab */}
      {activeTab === "manual" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2"><FileText className="w-5 h-5 text-blue-600" /> Manual Stock Entry</h3>
            <span className="px-3 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-full font-medium">Ready for pilot — DHIS2 sync enabled</span>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Facility</label><select value={manualForm.clinicId} onChange={e => setManualForm({...manualForm, clinicId: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">{clinics.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Medicine</label><select value={manualForm.medicineId} onChange={e => setManualForm({...manualForm, medicineId: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">{MEDICINES.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label><input type="number" value={manualForm.qty} onChange={e => setManualForm({...manualForm, qty: parseInt(e.target.value) || 0})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label><input type="date" value={manualForm.expiry} onChange={e => setManualForm({...manualForm, expiry: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Staff Name</label><input type="text" value={manualForm.staff} onChange={e => setManualForm({...manualForm, staff: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Notes</label><textarea value={manualForm.notes} onChange={e => setManualForm({...manualForm, notes: e.target.value})} rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
            <button onClick={() => showToast("Stock Updated", `Manual entry for ${manualForm.qty} ${MEDICINES.find(m => m.id === manualForm.medicineId)?.unit || "units"} submitted.`)} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"><Send className="w-4 h-4" /> Submit Entry</button>
          </div>
        </div>
      )}


      {/* SMS Gateway Tab */}
      {activeTab === "sms" && (
        <div className="space-y-5">
          {/* httpSMS Info Banner */}
          <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl p-6 text-white">
            <h3 className="font-bold flex items-center gap-2"><MessageSquare className="w-5 h-5" /> SMS Gateway — live demo</h3>
            <p className="text-indigo-100 text-sm mt-1">Powered by <a href="https://httpsms.com" target="_blank" rel="noopener noreferrer" className="underline">httpSMS</a> — an open-source gateway that turns an Android phone into an SMS API. Clinic staff send a text → gateway webhook → validation → ledger. No internet needed at the clinic.</p>
          </div>

          {/* Compose Area */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Phone className="w-4 h-4 text-gray-500" />
              <h4 className="font-semibold text-gray-900">Send a test SMS</h4>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 font-mono text-xs text-gray-600 mb-3">
              Format: <span className="font-bold text-gray-800">FACILITY MEDICINE QTY EXPIRY</span>
            </div>
            <div className="flex gap-2">
              <input
                value={smsInput}
                onChange={e => setSmsInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && smsInput.trim()) handleSendSms(); }}
                placeholder="e.g. Mogoditshane-01 MET-500 150 2027-03-15"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <button
                onClick={handleSendSms}
                disabled={!smsInput.trim()}
                className="bg-emerald-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" /> Send SMS
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 items-center">
              <span className="text-xs text-gray-500">Try one:</span>
              {SAMPLE_SMS.map(ex => (
                <button key={ex} onClick={() => setSmsInput(ex)} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full px-3 py-1 transition-colors font-mono">{ex}</button>
              ))}
            </div>
          </div>

          {/* Message Inbox */}
          {smsInbox.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2"><Phone className="w-4 h-4 text-emerald-600" /> Received messages</h4>
                <span className="text-xs text-gray-500">{smsInbox.filter(m => m.status === "parsed").length} pending · {smsInbox.filter(m => m.status === "confirmed").length} confirmed</span>
              </div>
              <div className="divide-y divide-gray-100">
                {smsInbox.map(msg => (
                  <div key={msg.id} className={`px-5 py-4 ${msg.status === "confirmed" ? "bg-emerald-50/50" : msg.error ? "bg-red-50/50" : ""}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="font-mono text-sm text-gray-700">{msg.raw}</div>
                      {msg.status === "confirmed" && <span className="flex items-center gap-1 text-emerald-600 text-xs font-medium shrink-0"><CheckCircle2 className="w-4 h-4" /> Synced</span>}
                    </div>
                    {msg.error ? (
                      <p className="text-red-600 text-xs mt-2">{msg.error}</p>
                    ) : msg.parsed && (
                      <div className="mt-2 space-y-2">
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                          <span>Facility: <strong className="text-gray-900">{msg.parsed.facility.name}</strong></span>
                          <span>Medicine: <strong className="text-gray-900">{msg.parsed.medicine.name}</strong></span>
                          <span>Qty: <strong className="text-gray-900">{msg.parsed.qty} {msg.parsed.medicine.unit}</strong></span>
                          {msg.parsed.expiry && msg.parsed.expiry !== "—" && <span>Expiry: <strong className="text-gray-900">{msg.parsed.expiry}</strong></span>}
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-gray-500">Match Score:</span>
                          <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{ width: msg.confidence + "%" }}></div></div>
                          <span className="font-medium text-emerald-600">{msg.confidence}%</span>
                          <span className="text-gray-400">— structured format</span>
                        </div>
                        {msg.status === "parsed" && (
                          <button onClick={() => handleConfirmSms(msg.id)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" /> Confirm and Add to Ledger
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="px-5 py-3 bg-gray-50 text-center">
                <p className="text-xs text-gray-500">In production, messages arrive automatically via the <a href="https://httpsms.com" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">httpSMS</a> Android gateway — no manual entry needed.</p>
              </div>
            </div>
          )}
        </div>
      )}


      {/* Facebook Messenger Tab */}
      {activeTab === "fb" && (
        <div className="space-y-5">
          {/* Channel Info */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
            <h3 className="font-bold flex items-center gap-2"><MessageSquare className="w-5 h-5" /> Facebook Messenger — channel preview</h3>
            <p className="text-blue-100 text-sm mt-1">Patients search medicine via Facebook Messenger using a P5 social bundle — no data plan required. Clinic staff submit stock updates in the same structured format. Same ledger, one more channel.</p>
          </div>

          {/* Zero-rating callout */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <Zap className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-800">The P5 social bundle advantage</p>
              <p className="text-xs text-blue-700 mt-1">Facebook and WhatsApp bundles are the primary way most Batswana get online. The web app needs open data. The Messenger bot works on a P5 social bundle. Text-only responses keep it fast on the cheapest connections.</p>
            </div>
          </div>

          {/* Chat Mockup — Patient Search */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 bg-blue-50 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white text-xs font-bold">BL</div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Botshelo Link</p>
                <p className="text-[10px] text-gray-500">Health bot · Typically replies instantly</p>
              </div>
            </div>
            <div className="p-5 space-y-4 max-h-[500px] overflow-y-auto">
              {/* Message 1: User */}
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white rounded-2xl rounded-br-md px-4 py-2.5 max-w-[80%]">
                  <p className="text-sm">Is Metformin available near Gabane?</p>
                </div>
              </div>
              {/* Message 2: Bot */}
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-2.5 max-w-[85%]">
                  <p className="text-sm text-gray-800">✅ <strong>Gabane Clinic</strong> — 120 tablets in stock</p>
                  <p className="text-xs text-gray-500 mt-1">📍 12.8 km · Updated 1h ago · 94% match score</p>
                  <p className="text-xs text-gray-400 mt-2 italic">Verify with clinic before travelling.</p>
                </div>
              </div>
              {/* Message 3: User */}
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white rounded-2xl rounded-br-md px-4 py-2.5 max-w-[80%]">
                  <p className="text-sm">What about insulin?</p>
                </div>
              </div>
              {/* Message 4: Bot */}
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-2.5 max-w-[85%]">
                  <p className="text-sm text-gray-800">⚠️ <strong>Insulin (Regular)</strong> out of stock at Gabane</p>
                  <p className="text-xs text-gray-500 mt-1">Nearest: <strong>Thamaga Hospital</strong> — 65 vials · 38 km</p>
                  <p className="text-xs text-gray-500">Updated 45m ago · 96% match score</p>
                  <div className="mt-2 flex gap-2">
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">📍 Directions</span>
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">📞 Call clinic</span>
                  </div>
                </div>
              </div>
              {/* Message 5: User */}
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white rounded-2xl rounded-br-md px-4 py-2.5 max-w-[80%]">
                  <p className="text-sm">Met-500 Gabane 120 2027-03-15</p>
                </div>
              </div>
              {/* Message 6: Bot — clinic staff */}
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-2.5 max-w-[85%]">
                  <p className="text-sm text-gray-800">📋 <strong>Stock update received</strong></p>
                  <p className="text-xs text-gray-500 mt-1">Facility: Gabane Clinic</p>
                  <p className="text-xs text-gray-500">Medicine: Metformin 500mg · 120 tablets</p>
                  <p className="text-xs text-gray-500">Expiry: 2027-03-15</p>
                  <p className="text-xs text-gray-400 mt-2 italic">Added to review queue. Human confirmation required before ledger entry.</p>
                </div>
              </div>
              {/* Quick replies */}
              <div className="flex justify-center gap-2 flex-wrap">
                {["💊 Check Medicine", "🏥 Nearest Clinic", "📊 Stock Update", "❓ Help"].map(btn => (
                  <span key={btn} className="text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1.5 cursor-pointer hover:bg-blue-100 transition-colors">{btn}</span>
                ))}
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h4 className="font-semibold text-gray-900 mb-3">How it works in production</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-lg">1️⃣</span>
                <div>
                  <p className="font-medium text-gray-900">Patient searches</p>
                  <p className="text-xs text-gray-500 mt-0.5">Messages the Facebook Page. Bot replies with nearest available stock.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-lg">2️⃣</span>
                <div>
                  <p className="font-medium text-gray-900">Clinic staff updates</p>
                  <p className="text-xs text-gray-500 mt-0.5">Sends structured message or photo. Bot parses and queues for confirmation.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-lg">3️⃣</span>
                <div>
                  <p className="font-medium text-gray-900">DHMT gets alerts</p>
                  <p className="text-xs text-gray-500 mt-0.5">Critical stock-outs push-message district admins with a link to the Command Center.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-5 py-3 bg-gray-50 rounded-xl text-center">
            <p className="text-xs text-gray-500">Messenger channel requires Meta App Review for public access. For the hackathon demo, judges can be added as testers. Built on the same stock data and parsing logic as the web app and SMS Gateway.</p>
          </div>
        </div>
      )}

      {/* Audit Tab */}
      {activeTab === "audit" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>{["Date","Medicine","Quantity","Method","Staff","Facility"].map(h => <th key={h} className="text-left px-4 py-3 font-medium text-gray-600">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {auditLog.map(e => (
                <tr key={e.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700">{e.date}</td>
                  <td className="px-4 py-3 text-gray-900 font-medium">{e.medicine}</td>
                  <td className="px-4 py-3 text-gray-700">{e.qty}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded-full">{e.method}</span></td>
                  <td className="px-4 py-3 text-gray-700">{e.staff}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{e.facility}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// DATA SOURCES PAGE
// ══════════════════════════════════════════════════════════════

function DataSourcesPage() {
  const [expandedId, setExpandedId] = useState(null);
  const catColors = {
    "Epidemiological Baselines": "bg-purple-100 text-purple-700", "Demographics & Census": "bg-blue-100 text-blue-700",
    "Socioeconomic Indicators": "bg-orange-100 text-orange-700", "Health Financing": "bg-green-100 text-green-700",
    "Geospatial & Road Routing": "bg-cyan-100 text-cyan-700", "Climate & Meteorological": "bg-red-100 text-red-700",
    "Facility Geolocation": "bg-pink-100 text-pink-700", "High-Resolution Catchment": "bg-indigo-100 text-indigo-700",
    "Disease Prevalence": "bg-rose-100 text-rose-700", "Vital Statistics": "bg-amber-100 text-amber-700",
    "Interoperability": "bg-teal-100 text-teal-700", "Facility Readiness": "bg-lime-100 text-lime-700"
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-violet-600 to-purple-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Database className="w-6 h-6" /> Open data</h1>
        <p className="text-violet-100 mt-1 italic">Powered by named sources. <span className="italic">E theilwe ke mantswe a a itsiweng.</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DATASETS.map(ds => (
          <div key={ds.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setExpandedId(expandedId === ds.id ? null : ds.id)}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${catColors[ds.category] || "bg-gray-100 text-gray-700"}`}>{ds.category}</span>
                  <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">{ds.tag}</span>
                </div>
                <h3 className="font-semibold text-gray-900">{ds.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{ds.org}</p>
              </div>
              <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform shrink-0 ${expandedId === ds.id ? "rotate-90" : ""}`} />
            </div>
            {expandedId === ds.id && (
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                <div><p className="text-xs font-medium text-gray-500 uppercase tracking-wide">How We Use It</p><p className="text-sm text-gray-700 mt-1">{ds.howWeUse}</p></div>
                <div><p className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1"><Sparkles className="w-3 h-3" /> Sample Insight</p><p className="text-sm text-gray-700 mt-1 font-medium">{ds.insight}</p></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Data Pipeline Diagram */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Layers className="w-5 h-5 text-violet-600" /> Data Pipeline</h3>
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
          {["Open Data Sources", "Ingestion Layer", "Analytics Engine", "Botshelo Link", "Aggregated Open Data Output", "BDIH"].map((step, i) => (
            <React.Fragment key={i}>
              <div className="bg-violet-50 border border-violet-200 rounded-lg px-4 py-2 font-medium text-violet-800">{step}</div>
              {i < 5 && <ArrowRight className="w-4 h-4 text-gray-400" />}
            </React.Fragment>
          ))}
        </div>
        <p className="text-xs text-gray-500 text-center mt-4 italic">Botshelo Link both consumes open data and produces open data.</p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// FORECASTING PAGE
// ══════════════════════════════════════════════════════════════

function ForecastingPage() {
  const [mode, setMode] = useState("normal");
  const climate = CLIMATE_DATA[mode];

  const forecastData = useMemo(() => {
    return [
      { name: "ORS", baseline: 180, predicted: Math.round(180 * climate.orsMult), unit: "sachets/week", color: "#e53e3e" },
      { name: "Paracetamol", baseline: 210, predicted: Math.round(210 * climate.paraMult), unit: "tablets/week", color: "#d69e2e" },
      { name: "Salbutamol", baseline: 140, predicted: Math.round(140 * climate.salbMult), unit: "inhalers/week", color: "#38a169" },
      { name: "Metformin", baseline: 95, predicted: Math.round(95 * 1.1), unit: "tablets/week", color: "#805ad5" },
      { name: "Amoxicillin", baseline: 110, predicted: Math.round(110 * 1.05), unit: "capsules/week", color: "#3182ce" },
    ];
  }, [mode]);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Thermometer className="w-6 h-6" /> Climate intelligence</h1>
        <p className="text-orange-100 mt-1 italic">Boitekanelo jwa maemo a bosa — Predict demand before it spikes.</p>
      </div>

      {/* Toggle */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Thermometer className="w-5 h-5 text-orange-500" />
            <div>
              <h3 className="font-semibold text-gray-900">Climate Scenario</h3>
              <p className="text-xs text-gray-500">Toggle between normal and extreme heat conditions</p>
            </div>
          </div>
          {mode === "normal" ? (
            <button onClick={() => setMode("heatwave")} className="bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2 shadow-md">
              <Flame className="w-4 h-4" /> Trigger Heatwave Simulation
            </button>
          ) : (
            <button onClick={() => setMode("normal")} className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-md">
              <RefreshCw className="w-4 h-4" /> Return to Normal
            </button>
          )}
        </div>
        {mode === "heatwave" && <div className="mt-3"><span className="text-xs text-red-600 bg-red-50 px-3 py-1 rounded-full font-medium">🔥 Simulation Active</span></div>}
      </div>

      {/* Alert Banner */}
      {climate.alert && (
        <div className={`bg-${climate.alertColor}-50 border border-${climate.alertColor}-200 rounded-xl p-4 flex items-start gap-3`}>
          <Flame className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-800">{climate.alert}</p>
            <div className="mt-2 space-y-1">
              {climate.actions.map((a, i) => <p key={i} className="text-xs text-red-700 flex items-start gap-1"><ArrowRight className="w-3 h-3 mt-0.5 shrink-0" /> {a}</p>)}
            </div>
          </div>
        </div>
      )}

      {!climate.alert && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-sm text-emerald-700 font-medium">Normal conditions. Kweneng East. NASA POWER data.</p>
        </div>
      )}

      {/* Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-blue-600" /> Weekly Demand Forecast</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={forecastData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value, name) => [value, name === "baseline" ? "Baseline" : "Predicted"]} />
            <Legend />
            <Bar dataKey="baseline" fill="#cbd5e1" name="Baseline" radius={[4, 4, 0, 0]} />
            <Bar dataKey="predicted" name="Predicted" radius={[4, 4, 0, 0]}>
              {forecastData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Demand Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {forecastData.slice(0, 3).map(f => (
          <div key={f.name} className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm font-medium text-gray-600">{f.name}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-3xl font-bold text-gray-900">{f.predicted}</p>
              <p className="text-sm text-gray-500">{f.unit}</p>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="text-gray-400">Baseline: {f.baseline}</span>
              {climate.orsMult > 1 && <span className="text-red-600 font-medium">×{f.predicted / f.baseline}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Formula */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3"><BrainCircuit className="w-5 h-5 text-purple-600" /> Transparent Formula</h3>
        <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm text-gray-700">
          <p>Demand multiplier = Baseline consumption × (1 + temperature anomaly coefficient) × seasonal factor</p>
        </div>
        <p className="text-xs text-gray-500 mt-3 italic">Why this is transparent: The formula is open. Any clinician, judge, or partner can verify the calculation. No black box.</p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════

export default function App() {
  const [currentRoute, setCurrentRoute] = useState(() => {
    const h = window.location.hash.replace('#', '');
    return ['/', '/patient', '/admin', '/clinic', '/data-sources', '/forecasting'].includes(h) ? h : '/';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [clinics, setClinics] = useState(INITIAL_CLINICS);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const h = () => { const hash = window.location.hash.replace('#', '') || '/'; if (['/', '/patient', '/admin', '/clinic', '/data-sources', '/forecasting'].includes(hash)) setCurrentRoute(hash); };
    window.addEventListener('hashchange', h);
    return () => window.removeEventListener('hashchange', h);
  }, []);

  const navigate = (route) => { window.location.hash = route; setCurrentRoute(route); setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const showToast = (title, desc) => { const id = Date.now(); setToastMessage({ title, desc, id }); setTimeout(() => setToastMessage(p => p?.id === id ? null : p), 4500); };

  const navItems = [
    { route: "/patient", label: "Patient", icon: Pill },
    { route: "/admin", label: "DHMT Admin", icon: ShieldCheck },
    { route: "/clinic", label: "Clinic Staff", icon: UserCheck },
    { route: "/data-sources", label: "Data Sources", icon: Database },
    { route: "/forecasting", label: "Forecasting", icon: Thermometer },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <button onClick={() => navigate("/")} className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-1.5 rounded-lg"><HeartPulse className="w-5 h-5 text-white" /></div>
              <div><h1 className="text-sm font-bold text-gray-900 leading-tight">Botshelo Link</h1><p className="text-[10px] text-gray-500 leading-tight">{DISTRICT} District</p></div>
            </button>
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
              <button key={item.route} onClick={() => navigate(item.route)} className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg ${currentRoute === item.route ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-100"}`}>
                <item.icon className="w-4 h-4" /> {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 py-6 flex-1 w-full">
        {currentRoute === "/" && <LandingPage navigate={navigate} />}
        {currentRoute === "/patient" && <PatientPage clinics={clinics} />}
        {currentRoute === "/admin" && <AdminPage clinics={clinics} setClinics={setClinics} showToast={showToast} />}
        {currentRoute === "/clinic" && <ClinicStaffPage clinics={clinics} setClinics={setClinics} showToast={showToast} />}
        {currentRoute === "/data-sources" && <DataSourcesPage />}
        {currentRoute === "/forecasting" && <ForecastingPage />}
      </main>

      {/* Trust Footer */}
      <footer className="border-t border-gray-200 bg-white mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Zero patient data — facility aggregates only</span>
            <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Privacy by design · No patient-level data</span>
            <span className="flex items-center gap-1"><Database className="w-3 h-3" /> DHIS2 ADX schema compatible</span>
            <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> Every update audited</span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Botshelo Link · Kweneng East District Health Management</span>
            <span className="flex items-center gap-1"><Wifi className="w-3 h-3 text-emerald-500" /> All systems operational</span>
          </div>
        </div>
      </footer>

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
