/**
 * Drop-in replacement for react-helmet-async's <Helmet>.
 *
 * react-helmet-async 3 targets React 19 (native <title>/<meta> hoisting) and renders nothing on
 * this React 18 app, so every <Helmet> block was a silent no-op (found 2026-09-26). Pages keep
 * their existing children:
 *
 *   <Helmet>
 *     <title>…</title>
 *     <meta name="description" content="…" />
 *     <link rel="canonical" href="…" />
 *     <script type="application/ld+json">{JSON.stringify(schema)}</script>
 *   </Helmet>
 *
 * and this component applies them the way useSEO() does: tags are upserted in place (the server
 * already injected title/description/canonical, so appending would create duplicates), and pages
 * on the shared noindex list keep "noindex, follow" unless they set robots themselves.
 */
import { Children, isValidElement, useEffect, type ReactNode } from "react";
import { isNoindexedPath, CITY_BOND_ROBOTS } from "@shared/city-bond-pages";

const BASE_URL = "https://quantumsurety.bond";

function text(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (Array.isArray(node)) return node.map(text).join("");
  return String(node);
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href.startsWith("http") ? href : `${BASE_URL}${href}`;
}

export function Helmet({ children }: { children?: ReactNode }) {
  let title: string | null = null;
  const metas: Array<["name" | "property", string, string]> = [];
  const links: Array<[string, string]> = [];
  const schemas: string[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    const props = child.props as Record<string, any>;
    if (child.type === "title") title = text(props.children);
    else if (child.type === "meta") {
      if (props.name && props.content !== undefined) metas.push(["name", props.name, String(props.content)]);
      else if (props.property && props.content !== undefined) metas.push(["property", props.property, String(props.content)]);
    } else if (child.type === "link" && props.rel && props.href) links.push([props.rel, props.href]);
    else if (child.type === "script" && props.type === "application/ld+json") {
      const body = props.dangerouslySetInnerHTML?.__html ?? text(props.children);
      if (body) schemas.push(body);
    }
  });

  const key = JSON.stringify([title, metas, links, schemas]);

  useEffect(() => {
    if (title) document.title = title;
    for (const [attr, k, v] of metas) upsertMeta(attr, k, v);
    for (const [rel, href] of links) upsertLink(rel, href);
    // Robots: never default to "index". The server sets robots per record (most notary pages are
    // deliberately "noindex, follow"), and Google renders JS, so overwriting it here would index
    // pages the server excluded. Only enforce the shared noindex list; otherwise leave it alone.
    const setsRobots = metas.some(([attr, k]) => attr === "name" && k === "robots");
    if (!setsRobots && isNoindexedPath(window.location.pathname)) {
      upsertMeta("name", "robots", CITY_BOND_ROBOTS);
      upsertMeta("name", "googlebot", CITY_BOND_ROBOTS);
    }
    const created = schemas.map((json, i) => {
      const el = document.createElement("script");
      el.type = "application/ld+json";
      el.id = `ld-json-head-${i}`;
      document.getElementById(el.id)?.remove();
      el.textContent = json;
      document.head.appendChild(el);
      return el;
    });
    return () => created.forEach((el) => el.remove());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return null;
}

export default Helmet;
