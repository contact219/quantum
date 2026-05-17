import { Link } from "wouter";
import { useSEO, useSchema } from "@/hooks/useSEO";
import { ArrowRight, Clock, ChevronRight, CheckCircle, Shield, AlertTriangle } from "lucide-react";

const BASE = "https://quantumsurety.bond";

export default function FianzaNotarioTexas() {
  useSEO({
    title: "Fianza de Notario Público en Texas | $50 Instantánea | Quantum Surety",
    description: "Fianza de notario en Texas — $50 por 4 años, sin verificación de crédito, PDF instantáneo. Requerida por §406.010 del Código de Gobierno. Agencia TDI #3480229.",
    canonical: "/es/fianza-notario-texas",
    locale: "es_MX",
    alternates: [
      { hreflang: "es", href: `${BASE}/es/fianza-notario-texas` },
      { hreflang: "en-US", href: `${BASE}/bonds/notary-bond-texas` },
      { hreflang: "x-default", href: `${BASE}/bonds/notary-bond-texas` },
    ],
  });
  useSchema({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Fianza de Notario Público en Texas",
    "serviceType": "Surety Bond",
    "url": `${BASE}/es/fianza-notario-texas`,
    "inLanguage": "es-MX",
    "provider": { "@type": "LocalBusiness", "name": "Quantum Surety Bonds", "url": BASE },
    "areaServed": { "@type": "State", "name": "Texas" },
    "description": "Fianza de garantía de $10,000 requerida para todos los notarios públicos de Texas. $50 precio fijo, 4 años, sin verificación de crédito, PDF instantáneo.",
    "offers": { "@type": "Offer", "priceCurrency": "USD", "price": "50", "priceValidUntil": "2027-12-31", "availability": "https://schema.org/InStock" },
  }, "ld-json-Service");
  useSchema({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "¿Cuánto cuesta la fianza de notario en Texas?", "acceptedAnswer": { "@type": "Answer", "text": "La fianza de notario en Texas cuesta $50 precio fijo por los 4 años del nombramiento. No hay tarifas anuales ni de renovación durante el período del nombramiento. Desde Quantum Surety, el certificado PDF se entrega al instante." } },
      { "@type": "Question", "name": "¿Se requiere verificación de crédito para la fianza de notario en Texas?", "acceptedAnswer": { "@type": "Answer", "text": "No. Las fianzas de notario público en Texas no requieren verificación de crédito. Cualquier persona que cumpla los requisitos de elegibilidad del estado puede obtener la fianza de inmediato." } },
      { "@type": "Question", "name": "¿Qué cubre la fianza de notario de $10,000?", "acceptedAnswer": { "@type": "Answer", "text": "La fianza de notario protege al público — no al notario — en caso de pérdida financiera causada por actos notariales incorrectos o negligencia. Si se presenta un reclamo válido, el garante paga hasta $10,000 al afectado, pero el notario debe reembolsar esa cantidad al garante." } },
      { "@type": "Question", "name": "¿La fianza de notario en Texas me protege personalmente?", "acceptedAnswer": { "@type": "Answer", "text": "No. Este es el aspecto más malinterpretado. La fianza de $10,000 protege al público, no a usted. Si se paga un reclamo, usted está obligado a reembolsar al garante. Para protección personal, considere el seguro de E&O (Errores y Omisiones)." } },
      { "@type": "Question", "name": "¿Qué cambió en 2026 con SB693 para los notarios de Texas?", "acceptedAnswer": { "@type": "Answer", "text": "El Proyecto de Ley del Senado 693, vigente desde el 1 de enero de 2026, añadió: (1) curso de educación obligatorio de 2 horas para nuevos notarios y primeras renovaciones, (2) diario notarial requerido para todos los actos notariales (conservar 10 años), (3) mayores penalidades por mala práctica. El requisito de la fianza de $10,000 no cambió." } },
    ],
  }, "ld-json-FAQ");
  useSchema({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": BASE },
      { "@type": "ListItem", "position": 2, "name": "En Español", "item": `${BASE}/es` },
      { "@type": "ListItem", "position": 3, "name": "Fianza de Notario Texas", "item": `${BASE}/es/fianza-notario-texas` },
    ],
  }, "ld-json-Breadcrumb");

  const pasos = [
    { num: "1", title: "Verifique los requisitos de elegibilidad", body: "Para ser notario en Texas debe: tener al menos 18 años, ser residente de Texas, saber leer y escribir en inglés, y no tener condenas por delitos graves ni crímenes que impliquen depravación moral." },
    { num: "2", title: "Complete el curso SB693 (nuevo en 2026)", body: "La Ley SB693 vigente desde el 1 de enero de 2026 requiere completar un curso de educación notarial aprobado de 2 horas antes de presentar su solicitud. El costo es aproximadamente $20–$25 y está disponible en línea." },
    { num: "3", title: "Obtenga su fianza de notario de $10,000", body: "El §406.010 del Código de Gobierno de Texas exige una fianza de garantía de $10,000 antes de que la Secretaría de Estado emita su nombramiento. En Quantum Surety, la fianza cuesta $50 planos por los 4 años — sin verificación de crédito, PDF al instante." },
    { num: "4", title: "Presente su solicitud a la Secretaría de Estado", body: "Solicite en línea en sos.texas.gov/notary. Necesitará: su certificado de fianza en PDF, su certificado de educación SB693, y el pago de la tarifa de solicitud de $21." },
    { num: "5", title: "Tome su juramento de cargo", body: "Después de recibir su certificado de nombramiento, debe tomar juramento ante otro notario o el secretario del condado. Su nombramiento no está activo hasta que el juramento firmado esté registrado." },
  ];

  const costos = [
    { item: "Fianza de notario de $10,000", amount: "$50", note: "Precio fijo, 4 años — Quantum Surety" },
    { item: "Tarifa de solicitud (Secretaría de Estado)", amount: "$21", note: "Pago único en línea" },
    { item: "Curso de educación SB693", amount: "~$20", note: "Proveedor aprobado por el estado" },
    { item: "Total mínimo", amount: "$91", note: "Para comenzar su nombramiento" },
  ];

  const faqs = [
    { q: "¿Cuánto cuesta la fianza de notario en Texas?", a: "La fianza de notario en Texas cuesta $50 precio fijo por los 4 años completos del nombramiento desde Quantum Surety. No hay tarifas anuales. El costo total para obtener su nombramiento es de aproximadamente $91: $50 de fianza + $21 de tarifa de solicitud + ~$20 del curso SB693." },
    { q: "¿La fianza de notario me protege a mí personalmente?", a: "No, y este es el malentendido más común. La fianza de $10,000 protege al público — no a usted. Si alguien presenta un reclamo válido, el garante paga al afectado, pero usted está obligado a reembolsar esa cantidad al garante. Para protección personal, considere el seguro de E&O." },
    { q: "¿Qué cambió en 2026 con SB693?", a: "Desde el 1 de enero de 2026, todos los nuevos notarios deben: (1) completar un curso de educación de 2 horas antes de presentar la solicitud, (2) mantener un diario notarial para todos los actos (conservar 10 años). Los notarios que renuevan por primera vez bajo la nueva ley también deben completar el curso. El requisito de fianza de $10,000 permanece igual." },
    { q: "¿Cuánto tiempo tarda en obtenerse el nombramiento de notario en Texas?", a: "La Secretaría de Estado de Texas generalmente procesa las solicitudes completas en 2–4 semanas. El tiempo total desde el inicio del proceso hasta un nombramiento activo — incluyendo educación, fianza, solicitud y juramento — suele ser de 3–6 semanas." },
    { q: "¿Necesito ser ciudadano estadounidense para ser notario en Texas?", a: "No. Debe ser residente de Texas, pero no se requiere ciudadanía estadounidense. Los residentes permanentes legales y otros residentes autorizados pueden solicitar el nombramiento." },
    { q: "¿En qué se diferencia la fianza de notario del seguro E&O?", a: "La fianza de $10,000 es obligatoria por ley y protege al público en caso de daños causados por actos notariales. El seguro de E&O es opcional y le protege a usted de los costos de cometer un error honesto. Muchos notarios activos — especialmente los agentes de firma notarial — tienen ambos." },
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-teal-700 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-indigo-300 text-sm mb-4 flex-wrap">
            <Link href="/es"><span className="hover:text-white cursor-pointer">Inicio (ES)</span></Link>
            <ChevronRight className="w-4 h-4" /><span>Fianza de Notario</span>
          </div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-indigo-700 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full">Notario Texas</span>
            <span className="text-indigo-300 text-sm flex items-center gap-1"><Clock className="w-3 h-3" /> 8 min de lectura</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">
            Fianza de Notario Público en Texas
          </h1>
          <p className="text-indigo-100 text-lg leading-relaxed">
            El §406.010 del Código de Gobierno de Texas exige una fianza de garantía de $10,000 para todos los notarios públicos. Desde Quantum Surety, cuesta $50 planos por 4 años — sin verificación de crédito, PDF al instante.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/get-bond?type=notary">
              <button className="bg-white text-indigo-900 font-bold px-6 py-3 rounded-full hover:bg-indigo-50 transition-colors inline-flex items-center gap-2">
                Obtener Fianza — $50 <ArrowRight className="w-4 h-4" />
              </button>
            </a>
            <Link href="/bonds/notary-bond-texas">
              <span className="border border-white/30 text-white px-5 py-3 rounded-full hover:bg-white/10 transition-colors cursor-pointer text-sm font-medium">
                Ver en inglés
              </span>
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-12">

        {/* Quick stats */}
        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5 flex flex-wrap gap-8">
          <div>
            <p className="text-xs text-gray-500 mb-1">Precio de la fianza</p>
            <p className="font-bold text-gray-900">$50 precio fijo / 4 años</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Monto de cobertura</p>
            <p className="font-bold text-gray-900">$10,000</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Verificación de crédito</p>
            <p className="font-bold text-green-700">No requerida</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Entrega</p>
            <p className="font-bold text-gray-900">PDF instantáneo</p>
          </div>
        </div>

        {/* SB693 callout */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-gray-900 text-sm mb-1">Cambios por SB693 vigentes desde el 1 de enero de 2026</p>
              <ul className="text-sm text-gray-700 space-y-1 leading-relaxed">
                <li>• <strong>Curso de educación obligatorio</strong> (2 horas) para nuevos notarios y primera renovación</li>
                <li>• <strong>Diario notarial obligatorio</strong> para todos los actos (conservar 10 años)</li>
                <li>• <strong>Requisito de fianza sin cambios</strong> — sigue siendo $10,000 desde Quantum Surety a $50</li>
              </ul>
            </div>
          </div>
        </div>

        {/* What it is */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">¿Qué es la Fianza de Notario de Texas?</h2>
          <p className="text-gray-700 leading-relaxed mb-4">Una fianza de notario es una fianza de garantía (surety bond) de $10,000 requerida por el §406.010 del Código de Gobierno de Texas para todos los notarios públicos. Sin esta fianza, la Secretaría de Estado de Texas no emitirá su nombramiento.</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { party: "Principal", who: "Usted", desc: "El notario que debe obtener la fianza como condición para obtener su nombramiento." },
              { party: "Obligee", who: "El público / SOS", desc: "La Secretaría de Estado de Texas exige la fianza para proteger al público de actos notariales incorrectos." },
              { party: "Garante", who: "El asegurador", desc: "La compañía de seguros con licencia (RLI Insurance a través de Quantum Surety) que emite la fianza." },
            ].map((p) => (
              <div key={p.party} className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                <p className="text-xs font-bold uppercase text-indigo-600 mb-1">{p.party}</p>
                <p className="font-semibold text-gray-900 text-sm mb-2">{p.who}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-4 mt-4">
            <p className="text-sm text-gray-700"><strong>Importante:</strong> La fianza de $10,000 protege al público — no a usted. Si se paga un reclamo, usted está obligado a reembolsar esa cantidad al garante. Para protección personal, considere el seguro de Errores y Omisiones (E&O).</p>
          </div>
        </section>

        {/* Cost breakdown */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Costo Total para Obtener su Nombramiento</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-indigo-50">
                  <th className="text-left p-3 border border-gray-200 font-semibold">Costo</th>
                  <th className="text-left p-3 border border-gray-200 font-semibold">Cantidad</th>
                  <th className="text-left p-3 border border-gray-200 font-semibold">Notas</th>
                </tr>
              </thead>
              <tbody>
                {costos.map((c, i) => (
                  <tr key={c.item} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="p-3 border border-gray-200 font-medium text-gray-900">{c.item}</td>
                    <td className="p-3 border border-gray-200 text-indigo-700 font-bold">{c.amount}</td>
                    <td className="p-3 border border-gray-200 text-gray-500 text-xs">{c.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Steps */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Pasos para Convertirse en Notario en Texas (2026)</h2>
          <div className="space-y-5">
            {pasos.map((s) => (
              <div key={s.num} className="flex gap-4">
                <div className="shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">{s.num}</div>
                <div className="pt-0.5">
                  <p className="font-semibold text-gray-900 text-sm mb-1">{s.title}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What's covered */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">¿Qué Cubre la Fianza de Notario?</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <p className="font-bold text-green-800 text-sm mb-3">Sí cubre</p>
              {[
                "Pérdida financiera por actos notariales incorrectos",
                "Daños causados por no verificar la identidad del firmante",
                "Errores en procedimientos notariales oficiales",
                "Reclamos de terceros afectados por mala conducta notarial",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-700">{item}</p>
                </div>
              ))}
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-5">
              <p className="font-bold text-red-800 text-sm mb-3">No cubre</p>
              {[
                "Sus gastos legales de defensa personal",
                "Errores honestos (para eso está el E&O)",
                "Daños a su patrimonio personal (la fianza no le protege a usted)",
                "Pérdidas por actividad que excede sus funciones notariales",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 mb-2">
                  <Shield className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-indigo-900 text-white rounded-2xl p-8 text-center">
          <Shield className="w-8 h-8 text-indigo-300 mx-auto mb-3" />
          <h2 className="text-2xl font-bold mb-2">Obtenga su Fianza de Notario — $50</h2>
          <p className="text-indigo-200 mb-5">$50 precio fijo, 4 años de cobertura, $10,000 de garantía, compatible con SB693. PDF instantáneo — satisface el requisito de fianza de la Secretaría de Estado de Texas.</p>
          <a href="/get-bond?type=notary">
            <button className="bg-white text-indigo-900 font-semibold px-8 py-3 rounded-full hover:bg-indigo-50 transition-colors inline-flex items-center gap-2">
              Obtener Mi Fianza de Notario — $50 <ArrowRight className="w-4 h-4" />
            </button>
          </a>
        </div>

        {/* FAQs */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Preguntas Frecuentes</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
                  <p className="font-semibold text-gray-900 text-sm flex items-start gap-2">
                    <Shield className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />{f.q}
                  </p>
                </div>
                <div className="px-5 py-4"><p className="text-gray-700 text-sm leading-relaxed">{f.a}</p></div>
              </div>
            ))}
          </div>
        </div>

        {/* Related */}
        <div className="border-t border-gray-100 pt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Guías relacionadas (en inglés)</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { href: "/blog/how-to-become-texas-notary-2026", label: "How to Become a Texas Notary (2026)" },
              { href: "/blog/texas-notary-bond-sb693-2026-requirements", label: "SB693 Requirements Full Guide" },
              { href: "/blog/texas-notary-bond-vs-eo-insurance", label: "Notary Bond vs E&O Insurance" },
              { href: "/bonds/notary-bond-texas", label: "Texas Notary Bond (English)" },
            ].map((r) => (
              <Link key={r.href} href={r.href}>
                <div className="border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:bg-indigo-50 transition-all cursor-pointer flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{r.label}</span>
                  <ArrowRight className="w-4 h-4 text-indigo-500" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
