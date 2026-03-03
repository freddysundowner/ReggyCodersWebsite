import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";
import { storage } from "./storage";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

async function injectSeoTags(html: string, url: string): Promise<string> {
  try {
    let pageKey = "home";
    if (url.startsWith("/blog")) {
      if (url.startsWith("/blog/") && url.length > 6) {
        const slug = url.replace("/blog/", "").split("?")[0];
        const post = await storage.getBlogPostBySlug(slug);
        if (post && post.published) {
          const title = escapeHtml(post.title) + " | Reggycodas Blog";
          const description = escapeHtml(post.excerpt || post.content.substring(0, 160));
          let tags = `<title>${title}</title>\n`;
          tags += `    <meta name="description" content="${description}" />\n`;
          tags += `    <meta name="author" content="${escapeHtml(post.author)}" />\n`;
          tags += `    <meta property="og:title" content="${title}" />\n`;
          tags += `    <meta property="og:description" content="${description}" />\n`;
          tags += `    <meta property="og:type" content="article" />\n`;
          if (post.coverImage) {
            tags += `    <meta property="og:image" content="${escapeHtml(post.coverImage)}" />\n`;
          }
          return html
            .replace(/<title>.*?<\/title>/, "")
            .replace(/<meta name="description"[^>]*\/>/, "")
            .replace(/<meta name="keywords"[^>]*\/>/, "")
            .replace(/<meta name="author"[^>]*\/>/, "")
            .replace(/<meta property="og:title"[^>]*\/>/, "")
            .replace(/<meta property="og:description"[^>]*\/>/, "")
            .replace(/<meta property="og:type"[^>]*\/>/, "")
            .replace(/<meta property="og:site_name"[^>]*\/>/, "")
            .replace(/<meta property="og:image"[^>]*\/>/, "")
            .replace("</head>", `    ${tags}  </head>`);
        }
      }
      pageKey = "blog";
    }

    const pageSeo = await storage.getSeoSetting(pageKey);
    const globalSeo = pageKey !== "global" ? await storage.getSeoSetting("global") : null;
    const seo = pageSeo || globalSeo;

    if (seo) {
      const title = escapeHtml(seo.title);
      const description = escapeHtml(seo.description);
      let tags = `<title>${title}</title>\n`;
      tags += `    <meta name="description" content="${description}" />\n`;
      if (seo.keywords) {
        tags += `    <meta name="keywords" content="${escapeHtml(seo.keywords)}" />\n`;
      }
      tags += `    <meta property="og:title" content="${title}" />\n`;
      tags += `    <meta property="og:description" content="${description}" />\n`;
      tags += `    <meta property="og:type" content="website" />\n`;
      tags += `    <meta property="og:site_name" content="Reggycodas" />\n`;
      if (seo.ogImage) {
        tags += `    <meta property="og:image" content="${escapeHtml(seo.ogImage)}" />\n`;
      }

      return html
        .replace(/<title>.*?<\/title>/, "")
        .replace(/<meta name="description"[^>]*\/>/, "")
        .replace(/<meta name="keywords"[^>]*\/>/, "")
        .replace(/<meta name="author"[^>]*\/>/, "")
        .replace(/<meta property="og:title"[^>]*\/>/, "")
        .replace(/<meta property="og:description"[^>]*\/>/, "")
        .replace(/<meta property="og:type"[^>]*\/>/, "")
        .replace(/<meta property="og:site_name"[^>]*\/>/, "")
        .replace("</head>", `    ${tags}  </head>`);
    }
  } catch (e) {
    log(`SEO injection error: ${(e as Error).message}`);
  }
  return html;
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      template = await injectSeoTags(template, url);
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  app.use("*", async (req, res) => {
    let html = await fs.promises.readFile(path.resolve(distPath, "index.html"), "utf-8");
    html = await injectSeoTags(html, req.originalUrl);
    res.status(200).set({ "Content-Type": "text/html" }).end(html);
  });
}
