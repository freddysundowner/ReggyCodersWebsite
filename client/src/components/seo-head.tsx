import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { SeoSetting } from "@shared/schema";

export default function SeoHead({ pageKey }: { pageKey: string }) {
  const { data: settings } = useQuery<SeoSetting[]>({
    queryKey: ["/api/seo"],
  });

  const pageSeo = settings?.find((s) => s.pageKey === pageKey);
  const globalSeo = settings?.find((s) => s.pageKey === "global");
  const seo = pageSeo || globalSeo;

  useEffect(() => {
    if (!seo) return;

    document.title = seo.title;

    const setMeta = (name: string, content: string | null | undefined) => {
      if (!content) return;
      let el = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        if (name.startsWith("og:")) {
          el.setAttribute("property", name);
        } else {
          el.setAttribute("name", name);
        }
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", seo.description);
    if (seo.keywords) setMeta("keywords", seo.keywords);
    if (seo.ogImage) setMeta("og:image", seo.ogImage);
    setMeta("og:title", seo.title);
    setMeta("og:description", seo.description);
  }, [seo]);

  return null;
}
