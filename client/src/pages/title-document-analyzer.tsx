import { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "wouter";
import {
  Upload,
  FileSearch,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  X,
  ChevronLeft,
  FileText,
  Calculator,
  MapPin,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useSEO, useSchema } from "@/hooks/useSEO";

interface AnalysisResult {
  documentType:
    | "bill_of_sale"
    | "texas_title"
    | "out_of_state_title"
    | "auction_receipt"
    | "registration"
    | "lien_release"
    | "other"
    | "unreadable";
  documentTypeLabel: string;
  vehicle: {
    year: number | null;
    make: string | null;
    model: string | null;
    vin: string | null;
    value: number | null;
    mileage: number | null;
  };
  parties: {
    seller: string | null;
    buyer: string | null;
    saleDate: string | null;
  };
  bondAmount: number | null;
  estimatedPremium: { min: number; max: number } | null;
  titleSituation:
    | "bonded_title_needed"
    | "duplicate_title_needed"
    | "clean_transfer"
    | "unclear";
  presentDocuments: string[];
  missingDocuments: string[];
  redFlags: string[];
  timeline: string;
  recommendation: string;
  confidence: "high" | "medium" | "low";
}

type PageState = "upload" | "loading" | "results" | "error";

const formatCurrency = (value: number) =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

const DIRECT_APPLY_URL =
  "https://www.mybondapp.com/329034247/DirectNavBond?BondType=R42DAMBA2&State=TX";

export default function TitleDocumentAnalyzer() {
  useSEO({
    title:
      "AI Title Bond Document Analyzer — Free Texas Vehicle Title Check | Quantum Surety",
    description:
      "Upload your bill of sale, old title, or auction receipt. Our AI extracts vehicle details, calculates your bond amount, and lists every missing document. Free, instant, no login.",
    canonical: "/title-document-analyzer",
    ogType: "website",
  });

  useSchema({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "AI Title Bond Document Analyzer",
    description:
      "Free AI tool that analyzes vehicle title documents and calculates Texas bonded title bond amounts.",
    url: "https://quantumsurety.bond/title-document-analyzer",
    applicationCategory: "FinanceApplication",
    provider: {
      "@type": "Organization",
      name: "Quantum Surety",
      url: "https://quantumsurety.bond",
    },
  });

  const [pageState, setPageState] = useState<PageState>("upload");
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Lead form state
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);
  const [leadError, setLeadError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const ACCEPTED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/heif",
  ];
  const MAX_SIZE_MB = 10;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

  const validateFile = (file: File): string | null => {
    const isImage =
      ACCEPTED_TYPES.includes(file.type) ||
      /\.(jpg|jpeg|png|webp|heic)$/i.test(file.name);
    if (!isImage) {
      return "Please upload a JPG, PNG, WebP, or HEIC image file.";
    }
    if (file.size > MAX_SIZE_BYTES) {
      return `File is too large. Maximum size is ${MAX_SIZE_MB} MB.`;
    }
    return null;
  };

  const handleFileSelect = useCallback((file: File) => {
    const error = validateFile(file);
    if (error) {
      setFileError(error);
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }
    setFileError(null);
    setSelectedFile(file);

    const isImage =
      file.type.startsWith("image/") || /\.(jpg|jpeg|png|webp|heic)$/i.test(file.name);
    if (isImage) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const removeFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Animate loading steps
  useEffect(() => {
    if (pageState !== "loading") return;
    setLoadingStep(0);
    const t1 = setTimeout(() => setLoadingStep(1), 2000);
    const t2 = setTimeout(() => setLoadingStep(2), 4000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pageState]);

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setPageState("loading");

    try {
      const formData = new FormData();
      formData.append("document", selectedFile);

      const response = await fetch("/api/analyze-title-document", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(
          errData?.message || `Server returned ${response.status}`
        );
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
      setPageState("results");
    } catch (err: any) {
      setErrorMessage(
        err?.message ||
          "Something went wrong while analyzing your document. Please try again."
      );
      setPageState("error");
    }
  };

  const handleReset = () => {
    setPageState("upload");
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setFileError(null);
    setResult(null);
    setErrorMessage("");
    setLeadName("");
    setLeadPhone("");
    setLeadEmail("");
    setLeadSuccess(false);
    setLeadError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim()) {
      setLeadError("Please enter your name.");
      return;
    }
    setLeadSubmitting(true);
    setLeadError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadName,
          phone: leadPhone,
          email: leadEmail,
          bond_type: "bonded-title",
          source: "title-doc-analyzer",
        }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setLeadSuccess(true);
    } catch {
      setLeadError("Something went wrong. Please try again or call us directly.");
    } finally {
      setLeadSubmitting(false);
    }
  };

  const confidenceBadge = (confidence: AnalysisResult["confidence"]) => {
    if (confidence === "high")
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
          High Confidence
        </span>
      );
    if (confidence === "medium")
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
          Medium Confidence
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
        Low Confidence
      </span>
    );
  };

  const docTypeBadgeColor = (docType: AnalysisResult["documentType"]) => {
    const map: Record<string, string> = {
      bill_of_sale: "bg-blue-100 text-blue-800",
      texas_title: "bg-green-100 text-green-800",
      out_of_state_title: "bg-purple-100 text-purple-800",
      auction_receipt: "bg-orange-100 text-orange-800",
      registration: "bg-teal-100 text-teal-800",
      lien_release: "bg-indigo-100 text-indigo-800",
      other: "bg-gray-100 text-gray-700",
      unreadable: "bg-red-100 text-red-700",
    };
    return map[docType] || "bg-gray-100 text-gray-700";
  };

  // ─── UPLOAD STATE ────────────────────────────────────────────────────────────
  const renderUpload = () => (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-900 to-teal-800 pt-16 pb-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-teal-300 text-sm font-medium mb-6">
            <FileSearch className="w-4 h-4" />
            Powered by AI Document Analysis
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            AI Title Document Analyzer
          </h1>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Upload your bill of sale, old title, or auction receipt — our AI
            extracts your vehicle details, calculates the bond amount, and tells
            you exactly what documents you're missing.
          </p>

          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !selectedFile && fileInputRef.current?.click()}
            className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 p-8 cursor-pointer
              ${
                dragOver
                  ? "border-teal-400 bg-teal-900/30 scale-[1.01]"
                  : "border-slate-500 bg-white/5 hover:border-teal-500 hover:bg-white/10"
              }
              ${selectedFile ? "cursor-default" : ""}
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.heic,image/*"
              className="hidden"
              onChange={handleInputChange}
            />

            {!selectedFile ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-teal-500/20 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-teal-400" />
                </div>
                <p className="text-white font-semibold text-lg">
                  Drag your document here, or click to browse
                </p>
                <p className="text-slate-400 text-sm">
                  JPG, PNG, WebP, HEIC &mdash; max 10 MB
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Document preview"
                    className="max-h-48 max-w-full rounded-xl shadow-lg object-contain"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-indigo-300" />
                  </div>
                )}
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
                  <span className="text-white text-sm font-medium truncate max-w-xs">
                    {selectedFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    className="text-slate-400 hover:text-red-400 transition-colors ml-1"
                    aria-label="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleAnalyze}
                  className="mt-2 inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-bold py-3 px-8 rounded-xl text-lg transition-colors shadow-lg shadow-teal-900/40"
                >
                  <FileSearch className="w-5 h-5" />
                  Analyze Document
                </button>
              </div>
            )}
          </div>

          {fileError && (
            <p className="mt-3 text-red-400 text-sm font-medium">{fileError}</p>
          )}

          {/* Example chips */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <span className="text-slate-400 text-sm self-center">Examples:</span>
            {["Bill of Sale", "Old Title", "Auction Receipt"].map((label) => (
              <span
                key={label}
                className="bg-white/10 border border-white/20 text-slate-300 text-sm rounded-full px-3 py-1"
              >
                {label}
              </span>
            ))}
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-slate-400 text-sm">
            {[
              "Free",
              "No login",
              "Results in ~10 seconds",
              "TDI-Licensed Agency",
            ].map((badge) => (
              <span key={badge} className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-teal-400" />
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );

  // ─── LOADING STATE ───────────────────────────────────────────────────────────
  const renderLoading = () => (
    <section className="bg-gradient-to-br from-slate-900 via-indigo-900 to-teal-800 min-h-screen flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-10 max-w-sm w-full text-center">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <span className="absolute inset-0 rounded-full border-4 border-teal-400/30 animate-ping" />
          <span className="absolute inset-2 rounded-full border-2 border-teal-400/60 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <FileSearch className="w-10 h-10 text-teal-300" />
          </div>
        </div>

        <h2 className="text-white text-xl font-bold mb-6">Analyzing Document</h2>

        <div className="space-y-3 text-left mb-6">
          {[
            "Reading document type...",
            "Extracting vehicle details...",
            "Calculating bond amount...",
          ].map((step, i) => (
            <div
              key={step}
              className={`flex items-center gap-3 transition-all duration-500 ${
                loadingStep >= i ? "opacity-100" : "opacity-0"
              }`}
            >
              {loadingStep > i ? (
                <CheckCircle className="w-5 h-5 text-teal-400 flex-shrink-0" />
              ) : (
                <Loader2 className="w-5 h-5 text-teal-400 flex-shrink-0 animate-spin" />
              )}
              <span className="text-slate-300 text-sm">{step}</span>
            </div>
          ))}
        </div>

        <p className="text-slate-400 text-xs">This usually takes 5–10 seconds</p>
      </div>
    </section>
  );

  // ─── ERROR STATE ─────────────────────────────────────────────────────────────
  const renderError = () => (
    <section className="bg-gradient-to-br from-slate-900 via-indigo-900 to-teal-800 min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Analysis Failed</h2>
        <p className="text-gray-600 mb-6 text-sm">
          {errorMessage || "Something went wrong. Please try again."}
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors"
        >
          Try Again
        </button>
      </div>
    </section>
  );

  // ─── RESULTS STATE ───────────────────────────────────────────────────────────
  const renderResults = () => {
    if (!result) return null;

    const {
      documentTypeLabel,
      documentType,
      vehicle,
      parties,
      bondAmount,
      estimatedPremium,
      titleSituation,
      presentDocuments,
      missingDocuments,
      redFlags,
      timeline,
      recommendation,
      confidence,
    } = result;

    const vehicleLabel = [vehicle.year, vehicle.make, vehicle.model]
      .filter(Boolean)
      .join(" ");

    return (
      <>
        {/* Condensed Hero */}
        <section className="bg-gradient-to-br from-slate-900 via-indigo-900 to-teal-800 py-8 px-4">
          <div className="max-w-3xl mx-auto">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-teal-300 hover:text-teal-200 text-sm mb-4 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Analyze another document
            </button>
            <h1 className="text-3xl font-extrabold text-white">
              Document Analysis Results
            </h1>
            {vehicleLabel && (
              <p className="text-slate-300 mt-1">{vehicleLabel}</p>
            )}
          </div>
        </section>

        <div className="bg-gray-50 min-h-screen px-4 py-8">
          <div className="max-w-3xl mx-auto space-y-6">

            {/* Card 1 — Document Summary */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Document Summary
              </h2>
              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${docTypeBadgeColor(documentType)}`}
                >
                  {documentTypeLabel}
                </span>
                {confidenceBadge(confidence)}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                {[
                  { label: "Year", value: vehicle.year?.toString() },
                  { label: "Make", value: vehicle.make },
                  { label: "Model", value: vehicle.model },
                  { label: "VIN", value: vehicle.vin },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                    <p
                      className={`text-sm font-semibold ${
                        value ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {value || "Not found"}
                    </p>
                  </div>
                ))}
              </div>

              {vehicle.mileage && (
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Mileage:</span>{" "}
                  {vehicle.mileage.toLocaleString()} mi
                </p>
              )}

              {(parties.seller || parties.buyer) && (
                <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {parties.seller && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Seller:</span>{" "}
                      {parties.seller}
                    </p>
                  )}
                  {parties.buyer && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Buyer:</span>{" "}
                      {parties.buyer}
                    </p>
                  )}
                </div>
              )}

              {parties.saleDate && (
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Sale Date:</span>{" "}
                  {parties.saleDate}
                </p>
              )}
            </div>

            {/* Card 2 — Bond Calculation */}
            <div className="bg-gradient-to-br from-teal-600 to-green-600 rounded-2xl shadow-lg p-6 text-white">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Your Bond Requirement
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-teal-100 text-xs mb-1">Vehicle Value</p>
                  {vehicle.value ? (
                    <p className="text-white text-xl font-bold">
                      {formatCurrency(vehicle.value)}
                    </p>
                  ) : (
                    <Link
                      href="/title-bond-calculator"
                      className="text-teal-200 text-sm underline underline-offset-2 hover:text-white transition-colors"
                    >
                      Value not detected — use our calculator
                    </Link>
                  )}
                </div>

                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-teal-100 text-xs mb-1">Required Bond (1.5×)</p>
                  {bondAmount ? (
                    <p className="text-white text-xl font-bold">
                      {formatCurrency(bondAmount)}
                    </p>
                  ) : (
                    <p className="text-teal-200 text-sm">Depends on value</p>
                  )}
                </div>

                <div className="bg-white/20 rounded-xl p-4 border border-white/30">
                  <p className="text-teal-100 text-xs mb-1">Quantum Surety Premium</p>
                  {estimatedPremium ? (
                    <p className="text-white text-2xl font-extrabold">
                      {formatCurrency(estimatedPremium.min)} –{" "}
                      {formatCurrency(estimatedPremium.max)}
                    </p>
                  ) : (
                    <p className="text-teal-200 text-sm">Quote available on apply</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <a
                  href={DIRECT_APPLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-teal-700 hover:bg-teal-50 font-bold py-3 px-7 rounded-xl transition-colors shadow-md text-base"
                >
                  Apply Directly
                  <ArrowRight className="w-4 h-4" />
                </a>
                <div className="text-teal-100 text-sm space-y-0.5">
                  <p>Same-day issue &middot; No credit check</p>
                  <p>TDI-Licensed #3480229</p>
                </div>
              </div>
            </div>

            {/* Card 3 — Document Checklist */}
            {(presentDocuments.length > 0 || missingDocuments.length > 0) && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Document Checklist
                </h2>

                {presentDocuments.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Found in this document
                    </h3>
                    <ul className="space-y-1.5">
                      {presentDocuments.map((doc, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {missingDocuments.length > 0 && (
                  <div className={presentDocuments.length > 0 ? "pt-4 border-t border-gray-100" : ""}>
                    <h3 className="text-sm font-semibold text-red-600 mb-2 flex items-center gap-1">
                      <XCircle className="w-4 h-4" />
                      Still needed for bonded title
                    </h3>
                    <ul className="space-y-1.5">
                      {missingDocuments.map((doc, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Card 4 — Red Flags */}
            {redFlags.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <h2 className="text-lg font-bold text-amber-900">
                    Potential Red Flags
                  </h2>
                </div>
                <ul className="space-y-1.5 mb-4">
                  {redFlags.map((flag, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0 mt-1.5" />
                      {flag}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-amber-700">
                  These issues may affect your bonded title eligibility.{" "}
                  <a
                    href="tel:+12146668718"
                    className="font-semibold underline underline-offset-2 hover:text-amber-900"
                  >
                    Call us: 214-666-8718
                  </a>
                </p>
              </div>
            )}

            {/* Card 5 — Timeline & Recommendation */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Timeline &amp; Next Steps
              </h2>
              {timeline && (
                <div className="flex items-center gap-2 text-teal-700 font-semibold mb-3">
                  <Clock className="w-5 h-5" />
                  {timeline}
                </div>
              )}
              {recommendation && (
                <blockquote className="border-l-4 border-teal-400 pl-4 text-gray-700 text-sm leading-relaxed italic mb-4">
                  {recommendation}
                </blockquote>
              )}
              <Link
                href="/texas-title-rescue"
                className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-700 font-semibold text-sm transition-colors"
              >
                Check Full Eligibility
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Lead Capture Form */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-indigo-900 mb-1">
                Want us to handle this for you?
              </h2>
              <p className="text-indigo-700 text-sm mb-5">
                Leave your info and Shelby will call you back within 1 business
                hour.
              </p>

              {leadSuccess ? (
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <p className="text-green-800 font-semibold">
                    Got it! We'll be in touch shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Your Name *"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      className="border border-indigo-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white placeholder-gray-400"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone (optional)"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      className="border border-indigo-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white placeholder-gray-400"
                    />
                    <input
                      type="email"
                      placeholder="Email (optional)"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      className="border border-indigo-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white placeholder-gray-400"
                    />
                  </div>
                  {leadError && (
                    <p className="text-red-600 text-xs">{leadError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={leadSubmitting}
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors"
                  >
                    {leadSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : null}
                    {leadSubmitting ? "Sending..." : "Request a Callback"}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </>
    );
  };

  // ─── BOTTOM CTA (shared across upload + results) ─────────────────────────────
  const renderBottomCTA = () => (
    <section className="bg-gray-100 border-t border-gray-200 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-center text-lg font-bold text-gray-800 mb-6">
          More Title &amp; Bond Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/texas-title-rescue"
            className="group flex flex-col items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl p-5 text-center transition-colors shadow-sm"
          >
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm">Title Rescue Wizard</p>
              <p className="text-blue-200 text-xs mt-0.5">
                Step-by-step eligibility check
              </p>
            </div>
          </Link>

          <Link
            href="/title-bond-calculator"
            className="group flex flex-col items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl p-5 text-center transition-colors shadow-sm"
          >
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm">Bond Calculator</p>
              <p className="text-indigo-200 text-xs mt-0.5">
                Estimate your premium instantly
              </p>
            </div>
          </Link>

          <Link
            href="/bonds/bonded-title-texas"
            className="group flex flex-col items-center gap-3 bg-teal-600 hover:bg-teal-500 text-white rounded-2xl p-5 text-center transition-colors shadow-sm"
          >
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm">County Guide</p>
              <p className="text-teal-200 text-xs mt-0.5">
                Texas county-by-county info
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {pageState === "upload" && (
          <>
            {renderUpload()}
            {renderBottomCTA()}
          </>
        )}
        {pageState === "loading" && renderLoading()}
        {pageState === "error" && renderError()}
        {pageState === "results" && (
          <>
            {renderResults()}
            {renderBottomCTA()}
          </>
        )}
      </main>
    </div>
  );
}
