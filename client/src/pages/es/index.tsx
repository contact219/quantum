import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { ArrowRight, Shield, CheckCircle, MapPin, Zap, Star } from "lucide-react";

const BASE = "https://quantumsurety.bond";

export default function EsHome() {
  useSEO({
    title: "Fianzas de Garantía en Texas | Notario, Contratista y Distribuidor | Quantum Surety",
    description: "Fianzas de notario, distribuidor GDN y contratista en Texas. Desde $50. PDF instantáneo. Sin verificación de crédito. Agencia autorizada por TDI #3480229.",
    canonical: "/es",
    locale: "es_MX",
    alternates: [
      { hreflang: "es", href: `${BASE}/es` },
      { hreflang: "en-US", href: `${BASE}/` },
      { hreflang: "x-default", href: `${BASE}/` },
    ],
  });
  useSchema({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Fianzas de Garantía en Texas — Quantum Surety",
    "description": "Fianzas de notario, distribuidor GDN y contratista en Texas. Desde $50. PDF instantáneo. Sin verificación de crédito.",
    "url": `${BASE}/es`,
    "inLanguage": "es-MX",
    "publisher": { "@type": "Organization", "name": "Quantum Surety", "url": BASE },
  }, "ld-json-WebPage");
  useSchema({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "¿Qué es una fianza de garantía en Texas?", "acceptedAnswer": { "@type": "Answer", "text": "Una fianza de garantía es un contrato de tres partes que garantiza que usted cumplirá con una obligación legal o contractual. Si no cumple, la compañía de seguros (el garante) paga al afectado hasta el monto de la fianza, y usted debe reembolsar al garante." } },
      { "@type": "Question", "name": "¿Cuánto cuesta una fianza de notario en Texas?", "acceptedAnswer": { "@type": "Answer", "text": "La fianza de notario en Texas cuesta $50 por los 4 años completos del nombramiento — sin cargos anuales, sin verificación de crédito. El PDF se entrega al instante." } },
      { "@type": "Question", "name": "¿Necesito verificación de crédito para obtener una fianza?", "acceptedAnswer": { "@type": "Answer", "text": "No para la fianza de notario. Las fianzas de notario en Texas no requieren verificación de crédito. Otras fianzas como la GDN de distribuidor o fianzas de contratista pueden requerir una revisión de crédito." } },
    ],
  }, "ld-json-FAQ");

  const bonds = [
    {
      slug: "/get-bond?type=notary",
      name: "Fianza de Notario Público",
      price: "$50 — 4 años",
      desc: "Requerida por §406.010 del Código de Gobierno de Texas antes de que la Secretaría de Estado emita un nombramiento.",
      badge: "Obligatoria",
      badgeColor: "bg-green-100 text-green-700",
      cta: "Obtener Fianza de Notario",
    },
    {
      slug: "/get-bond?type=dealer",
      name: "Fianza GDN — Distribuidor de Vehículos",
      price: "Desde $100/año",
      desc: "Fianza de $50,000 requerida por §503.033 del Código de Transporte de Texas para todos los distribuidores de vehículos motorizados.",
      badge: "Obligatoria",
      badgeColor: "bg-green-100 text-green-700",
      cta: "Obtener Fianza GDN",
    },
    {
      slug: "/quote?type=license",
      name: "Fianza de Licencia de Contratista",
      price: "Desde $75/año",
      desc: "Requerida por TDLR y municipios de Texas para contratistas eléctricos, HVAC, plomería y otros oficios con licencia.",
      badge: "Por ciudad/TDLR",
      badgeColor: "bg-indigo-100 text-indigo-700",
      cta: "Cotizar Fianza de Contratista",
    },
  ];

  const trust = [
    { icon: <Shield className="w-4 h-4 text-teal-400" />, label: "Agencia TDI #3480229", sub: "Licenciada por el Dep. de Seguros de Texas" },
    { icon: <Star className="w-4 h-4 text-teal-400" />, label: "Portadora Calificación A", sub: "RLI Insurance — calificada por A.M. Best" },
    { icon: <MapPin className="w-4 h-4 text-teal-400" />, label: "254 Condados de Texas", sub: "Cobertura en todo el estado" },
    { icon: <Zap className="w-4 h-4 text-teal-400" />, label: "PDF Instantáneo", sub: "Certificado por correo electrónico al instante" },
    { icon: <CheckCircle className="w-4 h-4 text-teal-400" />, label: "Sin Verificación de Crédito", sub: "Para fianzas de notario" },
  ];

  const faqs = [
    { q: "¿Qué es una fianza de garantía en Texas?", a: "Una fianza de garantía (surety bond) es un contrato de tres partes entre usted (el principal), la autoridad que la exige (el obligee — como la Secretaría de Estado o TxDMV) y la compañía garante. Si usted no cumple con su obligación, el garante paga al afectado hasta el monto de la fianza, y usted debe reembolsar al garante. No es lo mismo que un seguro." },
    { q: "¿Cuánto cuesta una fianza de notario en Texas?", a: "La fianza de notario en Texas cuesta $50 por los 4 años completos de su nombramiento desde Quantum Surety. No hay tarifas anuales, no se requiere verificación de crédito, y el certificado PDF se entrega al instante por correo electrónico." },
    { q: "¿Qué pasa si opero sin una fianza requerida?", a: "Operar sin una fianza requerida puede resultar en multas, suspensión de licencia o incluso cargos penales según la ley de Texas. Por ejemplo, actuar como distribuidor de vehículos sin la fianza GDN es un delito de Clase A en Texas." },
    { q: "¿Puedo obtener mi fianza en español?", a: "Sí. Nuestro equipo puede asistirle en español. El proceso de solicitud en línea es sencillo y el certificado de fianza se entrega en minutos. Para preguntas, contáctenos en nuestra página de contacto." },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-indigo-200 mb-6">
            <Shield className="w-4 h-4" /> Agencia TDI Licenciada #3480229
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
            Fianzas de Garantía<br className="hidden md:block" /> en Texas
          </h1>
          <p className="text-indigo-100 text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Fianzas de notario, distribuidor GDN y contratista en Texas. PDF instantáneo, sin verificación de crédito, portadora con calificación A.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="/get-bond?type=notary">
              <button className="bg-white text-indigo-900 font-bold px-6 py-3 rounded-full hover:bg-indigo-50 transition-colors inline-flex items-center gap-2">
                Fianza Notario — $50 <ArrowRight className="w-4 h-4" />
              </button>
            </a>
            <a href="/get-bond?type=dealer">
              <button className="bg-teal-500 text-white font-bold px-6 py-3 rounded-full hover:bg-teal-400 transition-colors inline-flex items-center gap-2">
                Fianza GDN — Distribuidor <ArrowRight className="w-4 h-4" />
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div className="bg-slate-900 border-y border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap justify-center gap-x-0 divide-x divide-white/[0.06]">
          {trust.map((t) => (
            <div key={t.label} className="flex items-center gap-2.5 px-5 py-2">
              <div className="w-7 h-7 rounded-md bg-teal-500/10 flex items-center justify-center shrink-0">
                {t.icon}
              </div>
              <div>
                <p className="text-white text-xs font-semibold leading-tight">{t.label}</p>
                <p className="text-slate-400 text-[11px] leading-tight">{t.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-14 space-y-14">

        {/* Bond cards */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Fianzas Disponibles en Texas</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {bonds.map((b) => (
              <div key={b.name} className="border border-gray-200 rounded-2xl p-6 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${b.badgeColor} self-start mb-3`}>{b.badge}</span>
                <h3 className="font-bold text-gray-900 mb-1">{b.name}</h3>
                <p className="text-indigo-700 font-bold text-sm mb-2">{b.price}</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-5 flex-1">{b.desc}</p>
                <a href={b.slug}>
                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-full text-sm transition-colors inline-flex items-center justify-center gap-2">
                    {b.cta} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">¿Cómo Funciona?</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { step: "1", title: "Elija su fianza", body: "Seleccione el tipo de fianza que necesita: notario, distribuidor GDN, o contratista." },
              { step: "2", title: "Complete su solicitud", body: "Formulario en línea de 2 minutos. Sin verificación de crédito para fianzas de notario." },
              { step: "3", title: "Reciba su PDF al instante", body: "El certificado de fianza llega a su correo electrónico en minutos, listo para presentar." },
            ].map((s) => (
              <div key={s.step} className="text-center p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3">{s.step}</div>
                <h3 className="font-bold text-gray-900 mb-1">{s.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Preguntas Frecuentes</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
                  <p className="font-semibold text-gray-900 text-sm">{f.q}</p>
                </div>
                <div className="px-5 py-4"><p className="text-gray-700 text-sm leading-relaxed">{f.a}</p></div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-indigo-900 text-white rounded-2xl p-8 text-center">
          <Shield className="w-8 h-8 text-indigo-300 mx-auto mb-3" />
          <h2 className="text-2xl font-bold mb-2">¿Listo para Obtener su Fianza?</h2>
          <p className="text-indigo-200 mb-5">PDF instantáneo • Sin verificación de crédito (notario) • Portadora Calificación A • TDI #3480229</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="/get-bond?type=notary">
              <button className="bg-white text-indigo-900 font-semibold px-6 py-3 rounded-full hover:bg-indigo-50 transition-colors inline-flex items-center gap-2">
                Fianza de Notario — $50 <ArrowRight className="w-4 h-4" />
              </button>
            </a>
            <a href="/get-bond?type=dealer">
              <button className="bg-teal-500 text-white font-semibold px-6 py-3 rounded-full hover:bg-teal-400 transition-colors inline-flex items-center gap-2">
                Fianza GDN <ArrowRight className="w-4 h-4" />
              </button>
            </a>
          </div>
        </div>

        {/* English link */}
        <div className="text-center text-sm text-gray-400">
          <Link href="/"><span className="hover:text-indigo-600 cursor-pointer underline underline-offset-2">View this page in English</span></Link>
        </div>
      </div>
    </div>
  );
}
