import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, MapPin, Phone, Clock, FileText, Shield, ArrowRight, Car } from "lucide-react";
import { COUNTY_TITLE_BOND_DATA } from "@/data/county-title-bonds";

function getPremium(bondAmt: number): string {
  if (bondAmt <= 7500) return "$50";
  if (bondAmt <= 15000) return "$75";
  if (bondAmt <= 22500) return "$100";
  if (bondAmt <= 37500) return "$150";
  if (bondAmt <= 75000) return "$250";
  if (bondAmt <= 150000) return "$400";
  return "Call for quote";
}

const REQUIRED_DOCS = [
  "Government-issued photo ID",
  "Completed TxDMV Form VTR-130-SOF (Statement of Fact)",
  "Vehicle appraisal from a TxDMV-approved appraiser",
  "Quantum Surety bond certificate (we provide this)",
  "Title application fee (paid at county tax office)",
  "Original bill of sale or purchase documentation (if available)",
  "Prior vehicle registration records (if available)",
];

export default function CountyTitleBondPage() {
  const [location] = useLocation();
  const match = location.match(/\/bonds\/bonded-title-(.+)-county/);
  const countySlug = match ? match[1] : "";
  const data = COUNTY_TITLE_BOND_DATA[countySlug];

  const [calcValue, setCalcValue] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", vehicle: "", scenario: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const vehicleNum = parseFloat(calcValue.replace(/[^0-9.]/g, "")) || 0;
  const bondAmount = vehicleNum > 0 ? Math.ceil(vehicleNum * 1.5) : 0;
  const premium = bondAmount > 0 ? getPremium(bondAmount) : "";

  const pageTitle = data
    ? `${data.name} Certificate of Title Bond | Bonded Title | Quantum Surety`
    : "Texas Certificate of Title Bond | Quantum Surety";
  const pageDesc = data
    ? `Get a Texas certificate of title bond in ${data.name}. File at ${data.assessorAddress}. Same-day bond issuance. TDI-licensed agency #3480229.`
    : "Texas certificate of title bond (bonded title). Same-day issuance. TDI-licensed agency #3480229.";
  const pageCanonical = data ? `/bonds/bonded-title-${data.slug}-county` : "/bonds/bonded-title-texas";

  useSEO({ title: pageTitle, description: pageDesc, canonical: pageCanonical });

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">County page not found</h1>
          <Link href="/bonds/bonded-title-texas">
            <span className="text-indigo-600 hover:underline cursor-pointer">View Texas Bonded Title Bonds</span>
          </Link>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          bond_type: "bonded-title",
          source: `county-title-bond-${data.slug}`,
          notes: `Vehicle: ${formData.vehicle} | Scenario: ${formData.scenario} | Value: $${calcValue} | County: ${data.name}`,
        }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm mb-6">
            <Car className="w-4 h-4" />
            Texas Certificate of Title Bond
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            {data.name} Certificate of Title Bond
          </h1>
          <p className="text-xl text-indigo-100 mb-4 max-w-2xl mx-auto">
            Get your bonded title bond for {data.county} County vehicles. Same-day issuance. File at the {data.mainCity} tax office.
          </p>
          <p className="text-indigo-200 text-sm mb-8">
            Bond = 1.5x appraised vehicle value · TxDMV Form VTR-130-SOF · TDI License #3480229
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#apply">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Get My Bond Certificate <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href="tel:2146668718">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                <Phone className="w-4 h-4 mr-2" /> (214) 666-8718
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-teal-50 border-b border-teal-100 py-6 px-4">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-4 gap-4 text-center">
          {[
            { label: "Bond amount", value: "1.5x value" },
            { label: "Typical premium", value: "$50-$200" },
            { label: "Bond term", value: "3 years" },
            { label: "File at", value: `${data.county} Co. Tax Office` },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-xl p-4 border border-teal-100">
              <p className="text-xl font-bold text-gray-900">{item.value}</p>
              <p className="text-xs text-gray-500 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* County Tax Office Info */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {data.name} Tax Assessor-Collector Office
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <Shield className="w-6 h-6 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 text-lg">{data.assessorName}</p>
                  <p className="text-gray-600 text-sm">{data.county} County Tax Assessor-Collector</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700">{data.assessorAddress}</span>
                </div>
                {data.assessorPhone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-indigo-500 shrink-0" />
                    <a href={`tel:${data.assessorPhone.replace(/\D/g, "")}`} className="text-indigo-600 hover:underline">
                      {data.assessorPhone}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span className="text-gray-700">{data.filingHours}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">{data.name} Filing Notes</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{data.filingNote}</p>
              <p className="text-gray-600 text-sm">
                Bring your completed Quantum Surety bond certificate, TxDMV appraisal, and Form VTR-130-SOF to this office to receive your bonded title.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Common scenarios */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Common {data.name} Certificate of Title Bond Situations
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {data.commonScenarios.map((s, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-200">
                <CheckCircle className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                <p className="text-gray-700 text-sm">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick calculator */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Bond Amount Calculator</h2>
          <p className="text-gray-500 text-sm mb-6">Enter your estimated vehicle value to see the required bond amount and premium.</p>
          <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
            <div className="mb-4">
              <Label htmlFor="vehicleValue" className="text-sm font-medium text-gray-700 mb-1 block">
                Estimated Vehicle Value ($)
              </Label>
              <Input
                id="vehicleValue"
                placeholder="e.g. 12000"
                value={calcValue}
                onChange={(e) => setCalcValue(e.target.value)}
                className="max-w-xs"
              />
            </div>
            {bondAmount > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-white rounded-xl p-4 text-center border border-indigo-100">
                  <p className="text-xs text-gray-500 mb-1">Vehicle Value</p>
                  <p className="text-lg font-bold text-gray-900">${vehicleNum.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-xl p-4 text-center border border-indigo-200">
                  <p className="text-xs text-gray-500 mb-1">Bond Amount (1.5x)</p>
                  <p className="text-lg font-bold text-indigo-700">${bondAmount.toLocaleString()}</p>
                </div>
                <div className="bg-indigo-600 rounded-xl p-4 text-center">
                  <p className="text-xs text-indigo-200 mb-1">Your Premium</p>
                  <p className="text-lg font-bold text-white">{premium}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Process steps */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">How to Get a Certificate of Title Bond in {data.name}</h2>
          <div className="space-y-4">
            {[
              {
                n: "1",
                title: "Get your vehicle appraised",
                body: "Obtain an appraisal from a TxDMV-approved appraiser. The appraisal establishes the vehicle value. Your bond amount will be 1.5x this value."
              },
              {
                n: "2",
                title: "Purchase your bond from Quantum Surety",
                body: "Provide your vehicle details, appraisal, and contact information. We issue your bond certificate through an A-rated carrier accepted by TxDMV. Most bonds are issued same-day."
              },
              {
                n: "3",
                title: "Complete Form VTR-130-SOF",
                body: "Fill out TxDMV Form VTR-130-SOF (Statement of Fact). This form is available from TxDMV or your county tax assessor-collector's office."
              },
              {
                n: "4",
                title: `File at ${data.assessorName}'s office`,
                body: `Bring your bond certificate, vehicle appraisal, completed VTR-130-SOF, and payment for the title application fee to ${data.assessorAddress}.`
              },
              {
                n: "5",
                title: "Receive your bonded title",
                body: "TxDMV issues a title with a 'Bonded' notation. After 3 years with no claims filed, request TxDMV issue a clear, unrestricted title."
              },
            ].map((s) => (
              <div key={s.n} className="flex gap-4">
                <div className="w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold shrink-0 mt-1 text-sm">
                  {s.n}
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">{s.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Document checklist */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Required Documents</h2>
          <div className="space-y-3">
            {REQUIRED_DOCS.map((doc) => (
              <div key={doc} className="flex items-start gap-3 p-3 border border-gray-200 rounded-xl">
                <FileText className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">{doc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wizard CTA banner */}
      <section className="py-10 px-4 bg-indigo-50 border-y border-indigo-100">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-6">
          <div>
            <p className="font-semibold text-gray-900 mb-1">Not sure if you qualify?</p>
            <p className="text-gray-600 text-sm">
              Answer 4 questions to get your eligibility result and a personalized document checklist for {data.name}.
            </p>
          </div>
          <Link href="/texas-title-rescue" className="shrink-0">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white whitespace-nowrap">
              Use the Eligibility Wizard <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Direct apply bar */}
      <section className="py-6 px-4 bg-teal-700">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white font-semibold text-sm">Already know your vehicle value? Start your bond application in 2 minutes.</p>
          <a
            href="https://www.mybondapp.com/329034247/DirectNavBond?BondType=R42DAMBA2&State=TX"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 bg-white text-teal-800 font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-teal-50 transition-colors whitespace-nowrap"
          >
            Apply Directly <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Lead form */}
      <section id="apply" className="py-16 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Get Your {data.name} Title Bond</h2>
          <p className="text-gray-500 text-sm mb-8">
            Fill out the form and we will confirm your bond amount and have your certificate ready — usually same-day.
          </p>
          {submitted ? (
            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-8 text-center">
              <CheckCircle className="w-10 h-10 text-teal-500 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 text-lg mb-2">Request Received!</h3>
              <p className="text-gray-600 text-sm mb-2">We will email your bond details within 1 hour.</p>
              <p className="text-gray-500 text-sm">
                Need it faster? Call{" "}
                <a href="tel:2146668718" className="text-indigo-600 underline">(214) 666-8718</a>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1 block">Full Name *</Label>
                  <Input
                    required
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1 block">Email *</Label>
                  <Input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1 block">Phone</Label>
                  <Input
                    type="tel"
                    placeholder="(555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1 block">Vehicle (Year Make Model)</Label>
                  <Input
                    placeholder="e.g. 2018 Ford F-150"
                    value={formData.vehicle}
                    onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1 block">How did you get this vehicle?</Label>
                <select
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 bg-white"
                  value={formData.scenario}
                  onChange={(e) => setFormData({ ...formData, scenario: e.target.value })}
                >
                  <option value="">Select your situation</option>
                  <option value="private-sale">Bought from private seller - never got title</option>
                  <option value="auction">Won at auction (Copart, IAA, estate, etc.)</option>
                  <option value="inherited">Inherited from family member</option>
                  <option value="dealer-closed">Bought from dealer that went out of business</option>
                  <option value="rejected">Title rejected at tax office</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3"
              >
                {submitting ? "Submitting..." : `Get My ${data.name} Bond Certificate`}
              </Button>
              <p className="text-center text-xs text-gray-400">No credit check for most vehicles. TDI License #3480229.</p>
            </form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">{data.name} Bonded Title FAQ</h2>
          <div className="space-y-4">
            {[
              {
                q: `What is a certificate of title bond in ${data.name}?`,
                a: `A Texas certificate of title bond (bonded title bond) is a surety bond required by TxDMV when you have a vehicle without a clear title in ${data.name}. The bond amount equals 1.5 times the vehicle appraised value. After 3 years with no claims, TxDMV issues a clear title.`,
              },
              {
                q: `Where do I file my bonded title application in ${data.name}?`,
                a: `File at the ${data.name} Tax Assessor-Collector office: ${data.assessorAddress}. Bring your Quantum Surety bond certificate, TxDMV vehicle appraisal, completed Form VTR-130-SOF, and payment for the title application fee.`,
              },
              {
                q: "How quickly can I get my bond certificate?",
                a: "Quantum Surety typically issues bond certificates same-day for vehicles under $50,000. Once you submit your vehicle information and appraisal, we will email your certificate - usually within 1-2 hours during business hours.",
              },
              {
                q: "Do I need good credit to get a bonded title bond?",
                a: "No credit check is required for most personal vehicles. Bonded title bonds are non-recourse bonds — your creditworthiness does not affect qualification.",
              },
              {
                q: `How much does a certificate of title bond cost in ${data.name}?`,
                a: "The bond amount is 1.5 times your vehicle appraised value. Quantum Surety's premium starts at $50 for most personal vehicles and ranges up to $400 depending on the bond amount required.",
              },
            ].map((faq) => (
              <div key={faq.q} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-white px-5 py-4 border-b border-gray-100">
                  <p className="font-semibold text-gray-900 text-sm flex items-start gap-2">
                    <Shield className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                    {faq.q}
                  </p>
                </div>
                <div className="px-5 py-4 bg-gray-50">
                  <p className="text-gray-700 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related counties */}
      <section className="py-10 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Other Texas County Title Bond Pages</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {data.relatedCounties.map((rSlug) => {
              const c = COUNTY_TITLE_BOND_DATA[rSlug];
              if (!c) return null;
              return (
                <Link key={rSlug} href={`/bonds/bonded-title-${rSlug}-county`}>
                  <div className="border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer">
                    <p className="font-semibold text-gray-900 text-sm mb-1">{c.name}</p>
                    <p className="text-xs text-gray-500">Certificate of title bond - {c.mainCity}</p>
                    <p className="text-indigo-600 text-xs font-medium mt-2">View details</p>
                  </div>
                </Link>
              );
            })}
            <Link href="/bonds/bonded-title-texas">
              <div className="border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer">
                <p className="font-semibold text-gray-900 text-sm mb-1">All Texas Counties</p>
                <p className="text-xs text-gray-500">Texas bonded title bond complete guide</p>
                <p className="text-indigo-600 text-xs font-medium mt-2">View guide</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-14 px-4 bg-indigo-900 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">Get Your {data.name} Certificate of Title Bond</h2>
          <p className="text-indigo-200 mb-6 text-sm">
            Same-day issuance - Accepted at {data.mainCity} tax office - TDI Licensed #3480229
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#apply">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8">
                Apply Now <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href="tel:2146668718">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                <Phone className="w-4 h-4 mr-2" /> (214) 666-8718
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
