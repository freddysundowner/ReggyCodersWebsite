import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import type { SeoSetting } from "@shared/schema";

function setMeta(name: string, content: string | null | undefined) {
  const isProperty = name.startsWith("og:") || name.startsWith("article:");
  const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let el = document.querySelector(selector);
  if (!content) {
    // Remove stale optional tags when navigating to a page without them
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(isProperty ? "property" : "name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(url: string) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", url);
}

/**
 * Keeps document head in sync during SPA navigation. The server injects the
 * full tag set (canonical, OG, Twitter, JSON-LD) on the initial HTML response;
 * this component updates the dynamic tags when the user navigates client-side.
 */
export default function SeoHead({
  pageKey,
  override,
}: {
  pageKey: string;
  override?: { title: string; description: string; ogImage?: string | null };
}) {
  const [location] = useLocation();
  const { data: settings } = useQuery<SeoSetting[]>({
    queryKey: ["/api/seo"],
  });

  const pageSeo = settings?.find((s) => s.pageKey === pageKey);
  const globalSeo = settings?.find((s) => s.pageKey === "global");
  const seo = override
    ? { title: override.title, description: override.description, keywords: null, ogImage: override.ogImage ?? null }
    : pageSeo || globalSeo;

  useEffect(() => {
    if (!seo) return;

    const canonical = window.location.origin + (location === "/" ? "" : location);

    document.title = seo.title;
    setMeta("description", seo.description);
    setMeta("keywords", seo.keywords);
    setCanonical(canonical);
    setMeta("og:title", seo.title);
    setMeta("og:description", seo.description);
    setMeta("og:url", canonical);
    setMeta("og:image", seo.ogImage);
    setMeta("twitter:title", seo.title);
    setMeta("twitter:description", seo.description);
    setMeta("twitter:image", seo.ogImage);
    setMeta("twitter:card", seo.ogImage ? "summary_large_image" : "summary");
  }, [seo, location]);

  return null;
}
