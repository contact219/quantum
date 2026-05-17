import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

interface TrackEvent {
  type: string;
  page?: string;
  element?: string;
  value?: string;
}

// Maps internal event types → GA4 event names + whether to mark as conversion.
// Conversions must also be toggled in GA4 Admin → Events → Mark as conversion.
const GA4_MAP: Record<string, { name: string; params?: Record<string, string | number> }> = {
  lead_submit:        { name: "generate_lead" },
  quote_submit:       { name: "generate_lead", params: { lead_source: "quote_form" } },
  mybondapp_redirect: { name: "begin_checkout" },
  phone_click:        { name: "phone_call_click" },
};

function getSessionId(): string {
  let sid = sessionStorage.getItem("qs_sid");
  if (!sid) {
    sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem("qs_sid", sid);
  }
  return sid;
}

function getUtmParams() {
  const p = new URLSearchParams(window.location.search);
  return {
    utm_source: p.get("utm_source") || sessionStorage.getItem("qs_utm_src") || "",
    utm_campaign: p.get("utm_campaign") || sessionStorage.getItem("qs_utm_campaign") || "",
  };
}

export function track(event: TrackEvent) {
  try {
    // ── Internal event log ──────────────────────────────────────────────────
    const utms = getUtmParams();
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: getSessionId(),
        event_type: event.type,
        page: event.page || window.location.pathname + window.location.search,
        element: event.element || "",
        value: event.value || "",
        utm_source: utms.utm_source,
        utm_campaign: utms.utm_campaign,
        referrer: document.referrer,
      }),
      keepalive: true,
    }).catch(() => {});

    // ── GA4 event ───────────────────────────────────────────────────────────
    const ga4 = GA4_MAP[event.type];
    if (ga4 && typeof window.gtag === "function") {
      window.gtag("event", ga4.name, {
        ...(ga4.params ?? {}),
        ...(event.value ? { bond_type: event.value } : {}),
      });
    }
  } catch (_) {}
}

export function usePageTracking() {
  const [location] = useLocation();
  const prevRef = useRef("");

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const src = p.get("utm_source");
    const camp = p.get("utm_campaign");
    if (src) sessionStorage.setItem("qs_utm_src", src);
    if (camp) sessionStorage.setItem("qs_utm_campaign", camp);
  }, []);

  useEffect(() => {
    if (location !== prevRef.current) {
      prevRef.current = location;
      track({ type: "pageview", page: location });
    }
  }, [location]);
}
