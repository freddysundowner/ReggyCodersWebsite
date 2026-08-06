import type { Express, Request } from "express";
import { storage } from "./storage";

const SITE_NAME = "ReggyCodas";

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeXml(str: string): string {
  return escapeHtml(str).replace(/'/g, "&apos;");
}

export function getBaseUrl(req: Request): string {
  // Prefer explicit configuration over request headers (which are attacker-controllable).
  if (process.env.PUBLIC_BASE_URL) {
    return process.env.PUBLIC_BASE_URL.replace(/\/+$/, "");
  }
  const replitDomain = process.env.REPLIT_DOMAINS?.split(",")[0]?.trim();
  if (replitDomain) {
    return `https://${replitDomain}`;
  }
  const proto = (req.headers["x-forwarded-proto"] as string)?.split(",")[0] || req.protocol || "https";
  const host = req.get("host") || "";
  return `${proto}://${host}`;
}

export interface SeoResult {
  html: string;
  status: number;
}

interface SeoData {
  title: string;
  description: string;
  keywords?: string | null;
  author?: string | null;
  canonicalPath: string;
  ogType: "website" | "article";
  ogImage?: string | null;
  publishedTime?: string;
  modifiedTime?: string;
  jsonLd: object[];
  noindex?: boolean;
  notFound?: boolean;
}

function absoluteUrl(baseUrl: string, pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return baseUrl + (pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`);
}

function organizationJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    slogan: "Where Solutions Count",
    url: baseUrl,
    logo: `${baseUrl}/favicon.ico`,
    founder: { "@type": "Person", name: "Fredrick Mundia Githumbi" },
    email: "info@reggycodas.com",
    telephone: "+254720044055",
    address: { "@type": "PostalAddress", streetAddress: "Spur Mall, 1st Floor, Room F48", addressCountry: "KE" },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+254720044055",
      email: "info@reggycodas.com",
      contactType: "customer service",
    },
  };
}

function webSiteJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: baseUrl,
  };
}

async function resolveSeoData(url: string, baseUrl: string): Promise<SeoData | null> {
  const path = url.split("?")[0].replace(/\/+$/, "") || "/";

  // Admin pages: noindex, minimal tags
  if (path.startsWith("/admin")) {
    return {
      title: `Admin | ${SITE_NAME}`,
      description: "Administration area.",
      canonicalPath: path,
      ogType: "website",
      jsonLd: [],
      noindex: true,
    };
  }

  // Blog post
  if (path.startsWith("/blog/") && path.length > 6) {
    const slug = path.replace("/blog/", "");
    const post = await storage.getBlogPostBySlug(slug);
    if (post && post.published) {
      const description = (post.excerpt || post.content.replace(/<[^>]+>/g, "").substring(0, 160)).trim();
      const jsonLd: object[] = [
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description,
          author: { "@type": "Person", name: post.author },
          publisher: { "@type": "Organization", name: SITE_NAME, url: baseUrl },
          datePublished: new Date(post.createdAt).toISOString(),
          dateModified: new Date(post.updatedAt).toISOString(),
          mainEntityOfPage: { "@type": "WebPage", "@id": `${baseUrl}/blog/${post.slug}` },
          ...(post.coverImage ? { image: absoluteUrl(baseUrl, post.coverImage) } : {}),
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
            { "@type": "ListItem", position: 2, name: "Blog", item: `${baseUrl}/blog` },
            { "@type": "ListItem", position: 3, name: post.title, item: `${baseUrl}/blog/${post.slug}` },
          ],
        },
      ];
      return {
        title: `${post.title} | ${SITE_NAME} Blog`,
        description,
        author: post.author,
        canonicalPath: `/blog/${post.slug}`,
        ogType: "article",
        ogImage: post.coverImage,
        publishedTime: new Date(post.createdAt).toISOString(),
        modifiedTime: new Date(post.updatedAt).toISOString(),
        jsonLd,
      };
    }
    // Unknown or unpublished post: serve as a soft 404 with noindex
    return {
      title: `Post not found | ${SITE_NAME}`,
      description: "The post you are looking for does not exist or is no longer available.",
      canonicalPath: "/blog",
      ogType: "website",
      jsonLd: [],
      noindex: true,
      notFound: true,
    };
  }

  const pageKey = path.startsWith("/blog") ? "blog" : "home";
  const pageSeo = await storage.getSeoSetting(pageKey);
  const globalSeo = await storage.getSeoSetting("global");
  const seo = pageSeo || globalSeo;
  if (!seo) return null;

  const jsonLd: object[] = [organizationJsonLd(baseUrl)];
  if (pageKey === "home") jsonLd.push(webSiteJsonLd(baseUrl));

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    canonicalPath: pageKey === "blog" ? "/blog" : "/",
    ogType: "website",
    ogImage: seo.ogImage,
    jsonLd,
  };
}

function buildHeadTags(data: SeoData, baseUrl: string): string {
  const canonical = `${baseUrl}${data.canonicalPath === "/" ? "" : data.canonicalPath}` || baseUrl;
  const title = escapeHtml(data.title);
  const description = escapeHtml(data.description);
  const lines: string[] = [];

  lines.push(`<title>${title}</title>`);
  lines.push(`<meta name="description" content="${description}" />`);
  if (data.keywords) lines.push(`<meta name="keywords" content="${escapeHtml(data.keywords)}" />`);
  if (data.author) lines.push(`<meta name="author" content="${escapeHtml(data.author)}" />`);
  lines.push(`<meta name="robots" content="${data.noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large"}" />`);
  lines.push(`<link rel="canonical" href="${escapeHtml(canonical)}" />`);

  // Open Graph
  lines.push(`<meta property="og:title" content="${title}" />`);
  lines.push(`<meta property="og:description" content="${description}" />`);
  lines.push(`<meta property="og:type" content="${data.ogType}" />`);
  lines.push(`<meta property="og:url" content="${escapeHtml(canonical)}" />`);
  lines.push(`<meta property="og:site_name" content="${SITE_NAME}" />`);
  lines.push(`<meta property="og:locale" content="en_US" />`);
  if (data.ogImage) lines.push(`<meta property="og:image" content="${escapeHtml(absoluteUrl(baseUrl, data.ogImage))}" />`);
  if (data.ogType === "article") {
    if (data.publishedTime) lines.push(`<meta property="article:published_time" content="${data.publishedTime}" />`);
    if (data.modifiedTime) lines.push(`<meta property="article:modified_time" content="${data.modifiedTime}" />`);
    if (data.author) lines.push(`<meta property="article:author" content="${escapeHtml(data.author)}" />`);
  }

  // Twitter Card
  lines.push(`<meta name="twitter:card" content="${data.ogImage ? "summary_large_image" : "summary"}" />`);
  lines.push(`<meta name="twitter:title" content="${title}" />`);
  lines.push(`<meta name="twitter:description" content="${description}" />`);
  if (data.ogImage) lines.push(`<meta name="twitter:image" content="${escapeHtml(absoluteUrl(baseUrl, data.ogImage))}" />`);

  // Structured data
  for (const obj of data.jsonLd) {
    lines.push(`<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`);
  }

  return lines.map((l) => `    ${l}`).join("\n");
}

/**
 * Replace/augment the head of the HTML template with full SEO tags for the requested URL.
 */
export async function injectSeoTags(html: string, url: string, baseUrl: string): Promise<SeoResult> {
  try {
    const data = await resolveSeoData(url, baseUrl);
    if (!data) return { html, status: 200 };
    const tags = buildHeadTags(data, baseUrl);
    const injected = html
      .replace(/<title>[\s\S]*?<\/title>\s*/g, "")
      .replace(/<meta name="(description|keywords|author|robots)"[^>]*\/?>(\s*)/g, "")
      .replace(/<meta property="og:[^"]*"[^>]*\/?>(\s*)/g, "")
      .replace(/<meta name="twitter:[^"]*"[^>]*\/?>(\s*)/g, "")
      .replace(/<link rel="canonical"[^>]*\/?>(\s*)/g, "")
      .replace("</head>", `${tags}\n  </head>`);
    return { html: injected, status: data.notFound ? 404 : 200 };
  } catch {
    return { html, status: 200 };
  }
}

/** Register /sitemap.xml and /robots.txt */
export function registerSeoRoutes(app: Express) {
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const baseUrl = getBaseUrl(req);
      const posts = await storage.getBlogPosts(true);
      const urls: { loc: string; lastmod?: string; priority: string; changefreq: string }[] = [
        { loc: `${baseUrl}/`, priority: "1.0", changefreq: "weekly" },
        { loc: `${baseUrl}/blog`, priority: "0.8", changefreq: "daily" },
        ...posts.map((p) => ({
          loc: `${baseUrl}/blog/${p.slug}`,
          lastmod: new Date(p.updatedAt).toISOString().split("T")[0],
          priority: "0.7",
          changefreq: "monthly",
        })),
      ];
      const xml =
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        urls
          .map(
            (u) =>
              `  <url>\n    <loc>${escapeXml(u.loc)}</loc>\n` +
              (u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>\n` : "") +
              `    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`,
          )
          .join("\n") +
        `\n</urlset>`;
      res.set("Content-Type", "application/xml").send(xml);
    } catch {
      res.status(500).send("Error generating sitemap");
    }
  });

  app.get("/robots.txt", (req, res) => {
    const baseUrl = getBaseUrl(req);
    res
      .set("Content-Type", "text/plain")
      .send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api\n\nSitemap: ${baseUrl}/sitemap.xml\n`);
  });
}
