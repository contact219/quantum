import { useState } from "react";
import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Car,
  Phone,
  AlertTriangle,
  FileText,
  MapPin,
  Clock,
  Shield,
} from "lucide-react";

useSEO;

const TX_COUNTIES_TOP = [
  "Harris", "Dallas", "Bexar", "Tarrant", "Travis", "El Paso",
  "Collin", "Denton", "Fort Bend", "Nueces", "Montgomery", "Hidalgo",
  "Williamson", "Cameron", "Bell", "Galveston", "Smith", "Webb",
  "McLennan", "Lubbock",
];

const TX_COUNTIES_REST = [
  "Anderson", "Andrews", "Angelina", "Aransas", "Archer", "Armstrong",
  "Atascosa", "Austin", "Bailey", "Bandera", "Bastrop", "Baylor",
  "Bee", "Blanco", "Borden", "Bosque", "Bowie", "Brazoria", "Brazos",
  "Brewster", "Briscoe", "Brooks", "Brown", "Burleson", "Burnet",
  "Caldwell", "Calhoun", "Callahan", "Camp", "Carson", "Cass",
  "Castro", "Chambers", "Cherokee", "Childress", "Clay", "Cochran",
  "Coke", "Coleman", "Colorado", "Comal", "Comanche", "Concho",
  "Cooke", "Coryell", "Cottle", "Crane", "Crockett", "Crosby",
  "Culberson", "Dawson", "Deaf Smith", "Delta", "DeWitt", "Dickens",
  "Dimmit", "Donley", "Duval", "Eastland", "Ector", "Edwards",
  "Ellis", "Erath", "Falls", "Fannin", "Fayette", "Fisher",
  "Floyd", "Foard", "Franklin", "Freestone", "Frio", "Gaines",
  "Gillespie", "Glasscock", "Goliad", "Gonzales", "Gray", "Grayson",
  "Gregg", "Grimes", "Guadalupe", "Hale", "Hall", "Hamilton",
  "Hansford", "Hardeman", "Hardin", "Harrison", "Hartley", "Haskell",
  "Hays", "Hemphill", "Henderson", "Hill", "Hockley", "Hood",
  "Hopkins", "Houston", "Howard", "Hudspeth", "Hunt", "Hutchinson",
  "Irion", "Jack", "Jackson", "Jasper", "Jeff Davis", "Jefferson",
  "Jim Hogg", "Jim Wells", "Johnson", "Jones", "Karnes", "Kaufman",
  "Kendall", "Kenedy", "Kent", "Kerr", "Kimble", "King",
  "Kinney", "Kleberg", "Knox", "La Salle", "Lamar", "Lamb",
  "Lampasas", "Lavaca", "Lee", "Leon", "Liberty", "Limestone",
  "Lipscomb", "Live Oak", "Llano", "Loving", "Lynn", "McCulloch",
  "McMullen", "Madison", "Marion", "Martin", "Mason", "Matagorda",
  "Maverick", "Medina", "Menard", "Midland", "Milam", "Mills",
  "Mitchell", "Montague", "Moore", "Morris", "Motley", "Nacogdoches",
  "Navarro", "Newton", "Nolan", "Ochiltree", "Oldham", "Orange",
  "Palo Pinto", "Panola", "Parker", "Parmer", "Pecos", "Polk",
  "Potter", "Presidio", "Rains", "Randall", "Reagan", "Real",
  "Red River", "Reeves", "Refugio", "Roberts", "Robertson", "Rockwall",
  "Runnels", "Rusk", "Sabine", "San Augustine", "San Jacinto",
  "San Patricio", "San Saba", "Schleicher", "Scurry", "Shackelford",
  "Shelby", "Sherman", "Somervell", "Starr", "Stephens", "Sterling",
  "Stonewall", "Sutton", "Swisher", "Terrell", "Terry", "Throckmorton",
  "Titus", "Tom Green", "Trinity", "Tyler", "Upshur", "Upton",
  "Uvalde", "Val Verde", "Van Zandt", "Victoria", "Walker",
  "Waller", "Ward", "Washington", "Wharton", "Wheeler", "Wichita",
  "Wilbarger", "Willacy", "Wilson", "Winkler", "Wise", "Wood",
  "Yoakum", "Young", "Zapata", "Zavala",
];

const ALL_COUNTIES = [...TX_COUNTIES_TOP, ...TX_COUNTIES_REST];

function getPremium(bondAmt: number): string {
  if (bondAmt <= 7500) return "$50";
  if (bondAmt <= 15000) return "$75";
  if (bondAmt <= 22500) return "$100";
  if (bondAmt <= 37500) return "$150";
  if (bondAmt <= 75000) return "$250";
  if (bondAmt <= 150000) return "$400";
  return "Call for quote";
}

interface WizardData {
  vehicleYear: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleType: string;
  vin: string;
  scenario: string;
  documents: string[];
  county: string;
  vehicleValue: string;
  urgency: string;
}

const SCENARIOS = [
  { id: "private-sale", label: "Bought from private seller - never got title" },
  { id: "auction", label: "Won at auction (Copart, IAA, estate, etc.)" },
  { id: "inherited", label: "Inherited from family member" },
  { id: "abandoned", label: "Found/abandoned vehicle (legally obtained)" },
  { id: "dealer-closed", label: "Bought from dealer that went out of business" },
  { id: "rejected", label: "Have a title but it was rejected at the tax office" },
  { id: "other", label: "Other title problem" },
];

const DOCUMENT_OPTIONS = [
  { id: "bill-of-sale", label: "Bill of sale from seller" },
  { id: "prior-registration", label: "Prior registration in Texas" },
  { id: "rejection-notice", label: "Rejected title application / rejection notice" },
  { id: "out-of-state", label: "Out-of-state title or registration" },
  { id: "court-order", label: "Court order / probate / estate documents" },
  { id: "vtrsof", label: "Texas VTR-130-SOF (Statement of Fact) already started" },
  { id: "none", label: "None of these" },
];

const VEHICLE_TYPES = [
  "Car / Truck / SUV",
  "Motorcycle",
  "Trailer / RV",
  "Boat",
  "Classic / Antique (pre-1985)",
  "Commercial Vehicle",
];

const STEP_LABELS = ["Your Vehicle", "Your Situation", "Your Documents", "County + Value", "Your Results"];

export default function TexasTitleRescue() {
  useSEO({
    title: "Texas Title Rescue | Bonded Title Eligibility Wizard",
    description:
      "Find out if you qualify for a Texas bonded title bond in 2 minutes. Free eligibility check, personalized document checklist, and instant quote. TDI-licensed agency #3480229.",
    canonical: "/texas-title-rescue",
  });
  useSchema({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Texas Title Rescue Wizard",
    "description": "Free 5-step eligibility wizard that determines if you qualify for a Texas bonded title bond and generates a personalized TxDMV document checklist.",
    "url": "https://quantumsurety.bond/texas-title-rescue",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "provider": { "@type": "Organization", "name": "Quantum Surety", "url": "https://quantumsurety.bond" },
  }, "ld-json-WebApp");

  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>({
    vehicleYear: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleType: "",
    vin: "",
    scenario: "",
    documents: [],
    county: "",
    vehicleValue: "",
    urgency: "",
  });
  const [leadData, setLeadData] = useState({ name: "", email: "", phone: "" });
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadSubmitting, setLeadSubmitting] = useState(false);

  const vehicleNum = parseFloat(data.vehicleValue.replace(/[^0-9.]/g, "")) || 0;
  const bondAmount = vehicleNum > 0 ? Math.ceil(vehicleNum * 1.5) : 0;
  const premium = bondAmount > 0 ? getPremium(bondAmount) : "";

  function toggleDoc(id: string) {
    if (id === "none") {
      setData({ ...data, documents: data.documents.includes("none") ? [] : ["none"] });
      return;
    }
    const docs = data.documents.filter((d) => d !== "none");
    setData({
      ...data,
      documents: docs.includes(id) ? docs.filter((d) => d !== id) : [...docs, id],
    });
  }

  function getEligibility() {
    if (data.scenario === "rejected") return "approved-special";
    if (["private-sale", "auction", "inherited", "dealer-closed"].includes(data.scenario)) {
      return data.documents.includes("none") ? "possible" : "approved";
    }
    if (data.scenario === "abandoned") return "possible-abandoned";
    return "possible";
  }

  function getChecklist(): string[] {
    const base = [
      "Government-issued photo ID",
      "Completed TxDMV Form VTR-130-SOF (Statement of Fact)",
      "Vehicle appraisal from a TxDMV-approved appraiser",
      "Quantum Surety bond certificate (we provide this)",
      "Title application fee (paid at your county tax office)",
    ];
    const extras: string[] = [];
    if (data.documents.includes("bill-of-sale")) extras.push("Bill of sale (you have this)");
    if (data.documents.includes("prior-registration")) extras.push("Prior Texas registration (you have this)");
    if (data.documents.includes("rejection-notice")) extras.push("Rejection notice (bring this to counter)");
    if (data.documents.includes("out-of-state")) extras.push("Out-of-state title/registration documents (you have this)");
    if (data.scenario === "inherited" || data.documents.includes("court-order")) {
      extras.push("Probate documents or affidavit of heirship");
    }
    if (data.scenario === "auction") extras.push("Auction purchase receipt and assigned title or bill of sale");
    if (data.scenario === "abandoned") extras.push("Texas Abandoned Vehicle Affidavit (required for found/abandoned vehicles)");
    return [...base, ...extras];
  }

  async function submitLead(e: React.FormEvent) {
    e.preventDefault();
    setLeadSubmitting(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadData.name,
          email: leadData.email,
          phone: leadData.phone,
          bond_type: "bonded-title",
          source: "title-rescue-wizard",
          notes: [
            `Vehicle: ${data.vehicleYear} ${data.vehicleMake} ${data.vehicleModel} (${data.vehicleType})`,
            `VIN: ${data.vin || "not provided"}`,
            `Scenario: ${data.scenario}`,
            `Documents: ${data.documents.join(", ") || "none"}`,
            `County: ${data.county}`,
            `Value: $${data.vehicleValue}`,
            `Bond: $${bondAmount.toLocaleString()}`,
            `Premium: ${premium}`,
            `Urgency: ${data.urgency}`,
          ].join(" | "),
        }),
      });
      setLeadSubmitted(true);
    } catch {
      setLeadSubmitted(true);
    } finally {
      setLeadSubmitting(false);
    }
  }

  const eligibility = step === 5 ? getEligibility() : null;
  const checklist = step === 5 ? getChecklist() : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm mb-4">
            <Car className="w-4 h-4" />
            Texas Title Rescue Engine
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Find Out If You Qualify</h1>
          <p className="text-indigo-100 text-lg">
            Answer {STEP_LABELS.length - 1} quick questions to get your eligibility result, document checklist, and
            bond quote.
          </p>
        </div>
      </section>

      {/* Progress bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            {STEP_LABELS.map((label, i) => (
              <div
                key={label}
                className={`flex flex-col items-center ${i < STEP_LABELS.length - 1 ? "flex-1" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                    i + 1 < step
                      ? "bg-teal-500 text-white"
                      : i + 1 === step
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {i + 1 < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-xs hidden sm:block ${i + 1 === step ? "text-indigo-600 font-medium" : "text-gray-400"}`}>
                  {label}
                </span>
                {i < STEP_LABELS.length - 1 && (
                  <div className={`h-0.5 w-full mt-4 ${i + 1 < step ? "bg-teal-400" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Step 1: Vehicle */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Tell us about your vehicle</h2>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1 block">Vehicle Type</Label>
                <select
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 bg-white"
                  value={data.vehicleType}
                  onChange={(e) => setData({ ...data, vehicleType: e.target.value })}
                >
                  <option value="">Select vehicle type</option>
                  {VEHICLE_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1 block">Year</Label>
                  <Input
                    placeholder="2015"
                    value={data.vehicleYear}
                    onChange={(e) => setData({ ...data, vehicleYear: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1 block">Make</Label>
                  <Input
                    placeholder="Ford"
                    value={data.vehicleMake}
                    onChange={(e) => setData({ ...data, vehicleMake: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1 block">Model</Label>
                  <Input
                    placeholder="F-150"
                    value={data.vehicleModel}
                    onChange={(e) => setData({ ...data, vehicleModel: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1 block">
                  VIN{" "}
                  <span className="text-gray-400 font-normal">(Optional - helps us pre-fill documents)</span>
                </Label>
                <Input
                  placeholder="17-character VIN"
                  maxLength={17}
                  value={data.vin}
                  onChange={(e) => setData({ ...data, vin: e.target.value.toUpperCase() })}
                />
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <Button
                onClick={() => setStep(2)}
                disabled={!data.vehicleType}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8"
              >
                Next: Your Situation <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Scenario */}
        {step === 2 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">How did you end up with this vehicle?</h2>
            <p className="text-gray-500 text-sm mb-6">Select the option that best describes your situation.</p>
            <div className="space-y-3">
              {SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setData({ ...data, scenario: s.id })}
                  className={`w-full text-left px-4 py-4 rounded-xl border-2 transition-all text-sm ${
                    data.scenario === s.id
                      ? "border-indigo-500 bg-indigo-50 text-indigo-800 font-medium"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  {s.label}
                  {s.id === "rejected" && data.scenario === s.id && (
                    <span className="ml-2 text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">
                      Most people in your situation get a bond in 24 hours
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="mt-8 flex justify-between">
              <Button variant="ghost" onClick={() => setStep(1)} className="text-gray-500">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!data.scenario}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8"
              >
                Next: Your Documents <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Documents */}
        {step === 3 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Which of these do you have?</h2>
            <p className="text-gray-500 text-sm mb-6">Check all that apply. This affects your document checklist.</p>
            <div className="space-y-3">
              {DOCUMENT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => toggleDoc(opt.id)}
                  className={`w-full text-left px-4 py-4 rounded-xl border-2 transition-all text-sm flex items-center gap-3 ${
                    data.documents.includes(opt.id)
                      ? "border-teal-500 bg-teal-50 text-teal-800"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                      data.documents.includes(opt.id) ? "border-teal-500 bg-teal-500" : "border-gray-300"
                    }`}
                  >
                    {data.documents.includes(opt.id) && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="mt-8 flex justify-between">
              <Button variant="ghost" onClick={() => setStep(2)} className="text-gray-500">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button
                onClick={() => setStep(4)}
                disabled={data.documents.length === 0}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8"
              >
                Next: County + Value <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: County + value */}
        {step === 4 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Your county and vehicle value</h2>
            <div className="space-y-5">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1 block">Your County in Texas</Label>
                <select
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 bg-white"
                  value={data.county}
                  onChange={(e) => setData({ ...data, county: e.target.value })}
                >
                  <option value="">Select your county</option>
                  <optgroup label="Most Common">
                    {TX_COUNTIES_TOP.map((c) => (
                      <option key={c} value={c}>{c} County</option>
                    ))}
                  </optgroup>
                  <optgroup label="All Texas Counties (A-Z)">
                    {TX_COUNTIES_REST.map((c) => (
                      <option key={c} value={c}>{c} County</option>
                    ))}
                  </optgroup>
                </select>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1 block">Estimated Vehicle Value ($)</Label>
                <Input
                  placeholder="e.g. 12000"
                  value={data.vehicleValue}
                  onChange={(e) => setData({ ...data, vehicleValue: e.target.value })}
                />
                {vehicleNum > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="bg-indigo-50 rounded-xl p-3 text-center border border-indigo-100">
                      <p className="text-xs text-gray-500 mb-1">Required Bond Amount</p>
                      <p className="text-lg font-bold text-indigo-700">${bondAmount.toLocaleString()}</p>
                    </div>
                    <div className="bg-teal-50 rounded-xl p-3 text-center border border-teal-100">
                      <p className="text-xs text-gray-500 mb-1">Estimated Premium</p>
                      <p className="text-lg font-bold text-teal-700">{premium}</p>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">When do you need this?</Label>
                <div className="grid grid-cols-3 gap-3">
                  {["This week", "Within a month", "Just researching"].map((u) => (
                    <button
                      key={u}
                      onClick={() => setData({ ...data, urgency: u })}
                      className={`px-3 py-3 rounded-xl border-2 text-xs font-medium transition-all ${
                        data.urgency === u
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-between">
              <Button variant="ghost" onClick={() => setStep(3)} className="text-gray-500">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button
                onClick={() => setStep(5)}
                disabled={!data.county || !data.vehicleValue}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8"
              >
                See My Results <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 5: Results */}
        {step === 5 && (
          <div className="space-y-6">
            {/* Eligibility result */}
            <div
              className={`rounded-2xl p-6 border-2 ${
                eligibility === "approved" || eligibility === "approved-special"
                  ? "bg-teal-50 border-teal-400"
                  : "bg-amber-50 border-amber-300"
              }`}
            >
              {(eligibility === "approved" || eligibility === "approved-special") ? (
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-7 h-7 text-teal-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-900 text-lg mb-1">
                      {eligibility === "approved-special"
                        ? "You qualify — and we specialize in post-rejection bonds"
                        : "You likely qualify for a Texas bonded title bond"}
                    </p>
                    <p className="text-gray-700 text-sm">
                      {eligibility === "approved-special"
                        ? "Most people in your situation get their bond certificate within 24 hours. We handle post-rejection cases regularly."
                        : "Based on your situation and documents, a Texas certificate of title bond is available. Most bonds are issued same-day."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-7 h-7 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-900 text-lg mb-1">You may still qualify — we need to review your situation</p>
                    <p className="text-gray-700 text-sm">
                      {data.scenario === "abandoned"
                        ? "Abandoned vehicles require additional documentation including a Texas Abandoned Vehicle Affidavit. We can guide you through the process."
                        : "Your situation needs a quick review. Contact us and we will confirm eligibility within 1 hour."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Apply Banner */}
            {(eligibility === "approved" || eligibility === "approved-special") && (
              <div className="rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4" style={{background: "linear-gradient(135deg, #0f766e 0%, #0e7490 100%)"}}>
                <div>
                  <p className="font-bold text-white text-sm mb-0.5">Ready to apply now?</p>
                  <p className="text-teal-100 text-xs">Start your application directly — no account needed, takes about 2 minutes.</p>
                </div>
                <a
                  href="https://www.mybondapp.com/329034247/DirectNavBond?BondType=R42DAMBA2&State=TX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center gap-2 bg-white text-teal-800 font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-teal-50 transition-colors whitespace-nowrap"
                >
                  Apply Directly <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            )}

            {/* Bond amount summary */}
            {bondAmount > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Your Bond Summary</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Vehicle Value</p>
                    <p className="text-xl font-bold text-gray-900">${vehicleNum.toLocaleString()}</p>
                  </div>
                  <div className="text-center border-x border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Bond Amount (1.5x)</p>
                    <p className="text-xl font-bold text-indigo-700">${bondAmount.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Your Premium</p>
                    <p className="text-xl font-bold text-teal-600">{premium}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Document checklist */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-1">Your Personalized Document Checklist</h3>
              <p className="text-gray-500 text-xs mb-4">Based on your situation and county</p>
              <div className="space-y-2">
                {checklist.map((doc) => (
                  <div key={doc} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                    <span className="text-gray-700">{doc}</span>
                  </div>
                ))}
              </div>
              {data.county && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>File at your {data.county} County Tax Assessor-Collector office</span>
                </div>
              )}
            </div>

            {/* Lead capture */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              {leadSubmitted ? (
                <div className="text-center py-4">
                  <CheckCircle className="w-10 h-10 text-teal-500 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-900 text-lg mb-2">Checklist Emailed!</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    A Quantum Surety agent will contact you within 1 business day.
                  </p>
                  <p className="text-gray-500 text-sm mb-4">
                    Need it faster? Call{" "}
                    <a href="tel:2146668718" className="text-indigo-600 underline">(214) 666-8718</a>
                  </p>
                  <a href="https://www.mybondapp.com/329034247/DirectNavBond?BondType=R42DAMBA2&State=TX" target="_blank" rel="noopener noreferrer">
                    <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                      Apply Directly Now <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                </div>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-0.5">Get Your Checklist + Quote</h3>
                    <p className="text-gray-500 text-xs">We email your doc checklist and connect you with an agent.</p>
                  </div>
                  <a
                    href="https://www.mybondapp.com/329034247/DirectNavBond?BondType=R42DAMBA2&State=TX"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-2 rounded-lg hover:bg-teal-100 transition-colors whitespace-nowrap"
                  >
                    Or apply directly <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
                  <form onSubmit={submitLead} className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-1 block">Full Name *</Label>
                      <Input
                        required
                        placeholder="Your full name"
                        value={leadData.name}
                        onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-1 block">Email *</Label>
                        <Input
                          type="email"
                          required
                          placeholder="your@email.com"
                          value={leadData.email}
                          onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-1 block">
                          Phone <span className="text-gray-400 font-normal">(optional)</span>
                        </Label>
                        <Input
                          type="tel"
                          placeholder="(555) 000-0000"
                          value={leadData.phone}
                          onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={leadSubmitting}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3"
                    >
                      {leadSubmitting ? "Sending..." : "Get My Document Checklist + Quote"}
                    </Button>
                    <p className="text-center text-xs text-gray-400">
                      No credit check required. TDI License #3480229.
                    </p>
                  </form>
                </>
              )}
            </div>

            {/* Related resources */}
            <div className="grid sm:grid-cols-3 gap-4">
              <Link href="/title-bond-calculator">
                <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-indigo-300 transition-all cursor-pointer">
                  <FileText className="w-5 h-5 text-indigo-500 mb-2" />
                  <p className="font-semibold text-gray-900 text-sm mb-1">Title Bond Calculator</p>
                  <p className="text-xs text-gray-500">Calculate your exact bond amount</p>
                </div>
              </Link>
              <Link href="/bonds/bonded-title-texas">
                <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-indigo-300 transition-all cursor-pointer">
                  <Shield className="w-5 h-5 text-indigo-500 mb-2" />
                  <p className="font-semibold text-gray-900 text-sm mb-1">Bonded Title Guide</p>
                  <p className="text-xs text-gray-500">Complete Texas process guide</p>
                </div>
              </Link>
              <a href="tel:2146668718">
                <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-indigo-300 transition-all cursor-pointer">
                  <Phone className="w-5 h-5 text-indigo-500 mb-2" />
                  <p className="font-semibold text-gray-900 text-sm mb-1">Call Us</p>
                  <p className="text-xs text-gray-500">(214) 666-8718</p>
                </div>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
