import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, seedAdmin, requireAuth } from "./auth";
import { registerSeoRoutes } from "./seo";
import { insertContactSchema, insertProductSchema, insertBlogPostSchema, insertSeoSettingSchema, insertSocialLinkSchema } from "@shared/schema";

async function seedSeoSettings() {
  const defaults = [
    {
      pageKey: "global",
      title: "ReggyCodas - Where Solutions Count | Software Development",
      description: "ReggyCodas builds technology that helps business grow: Prosuite, Pointify POS, BankyKit, SunPay, MediCare and LeadsIn. Software development, AI & automation and cloud solutions.",
      keywords: "ReggyCodas, software development, Pointify POS, BankyKit, SunPay, Prosuite, MediCare, LeadsIn, AI automation, cloud solutions",
    },
    {
      pageKey: "home",
      title: "ReggyCodas - We Build Technology That Helps Business Grow",
      description: "ReggyCodas is a software studio building Prosuite, Pointify POS, BankyKit, SunPay, MediCare and LeadsIn. Custom software, AI & automation and cloud solutions — where solutions count.",
      keywords: "ReggyCodas, Pointify POS, BankyKit, SunPay, Prosuite, MediCare, LeadsIn, software company, business automation",
    },
    {
      pageKey: "blog",
      title: "Blog - ReggyCodas | Tech Insights & Updates",
      description: "Insights, tutorials and updates from the ReggyCodas team on software development, AI, automation and building technology businesses.",
      keywords: "tech blog, software development blog, AI automation, ReggyCodas blog",
    },
  ];

  for (const setting of defaults) {
    const existing = await storage.getSeoSetting(setting.pageKey);
    if (!existing) {
      await storage.upsertSeoSetting(setting);
    }
  }
}

async function seedSocialLinks() {
  const defaults = [
    { platform: "Twitter", url: null, sortOrder: 0 },
    { platform: "LinkedIn", url: null, sortOrder: 1 },
    { platform: "GitHub", url: null, sortOrder: 2 },
    { platform: "Instagram", url: null, sortOrder: 3 },
    { platform: "Facebook", url: null, sortOrder: 4 },
    { platform: "YouTube", url: null, sortOrder: 5 },
    { platform: "TikTok", url: null, sortOrder: 6 },
  ];

  const existing = await storage.getSocialLinks();
  if (existing.length === 0) {
    for (const link of defaults) {
      await storage.upsertSocialLink(link);
    }
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);
  await seedAdmin();
  await seedSeoSettings();
  await seedSocialLinks();
  registerSeoRoutes(app);

  app.get("/api/products", async (_req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.post("/api/products", requireAuth, async (req, res) => {
    const parsed = insertProductSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const product = await storage.createProduct(parsed.data);
    res.json(product);
  });

  app.put("/api/products/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    const parsed = insertProductSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const product = await storage.updateProduct(id, parsed.data);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  });

  app.delete("/api/products/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteProduct(id);
    res.json({ message: "Product deleted" });
  });

  app.post("/api/contacts", async (req, res) => {
    const parsed = insertContactSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const contact = await storage.createContact(parsed.data);
    res.json(contact);
  });

  app.get("/api/contacts", requireAuth, async (_req, res) => {
    const contacts = await storage.getContacts();
    res.json(contacts);
  });

  app.delete("/api/contacts/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteContact(id);
    res.json({ message: "Contact deleted" });
  });

  app.get("/api/blog", async (_req, res) => {
    const posts = await storage.getBlogPosts(true);
    res.json(posts);
  });

  app.get("/api/blog/all", requireAuth, async (_req, res) => {
    const posts = await storage.getBlogPosts(false);
    res.json(posts);
  });

  app.get("/api/blog/:slug", async (req, res) => {
    const post = await storage.getBlogPostBySlug(req.params.slug);
    if (!post || !post.published) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  });

  app.post("/api/blog", requireAuth, async (req, res) => {
    const parsed = insertBlogPostSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const post = await storage.createBlogPost(parsed.data);
    res.json(post);
  });

  app.put("/api/blog/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    const parsed = insertBlogPostSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const post = await storage.updateBlogPost(id, parsed.data);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  });

  app.delete("/api/blog/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteBlogPost(id);
    res.json({ message: "Post deleted" });
  });

  app.get("/api/seo", async (_req, res) => {
    const settings = await storage.getSeoSettings();
    res.json(settings);
  });

  app.get("/api/seo/:pageKey", async (req, res) => {
    const setting = await storage.getSeoSetting(req.params.pageKey);
    if (!setting) return res.status(404).json({ message: "SEO setting not found" });
    res.json(setting);
  });

  app.post("/api/seo", requireAuth, async (req, res) => {
    const parsed = insertSeoSettingSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const setting = await storage.upsertSeoSetting(parsed.data);
    res.json(setting);
  });

  app.delete("/api/seo/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteSeoSetting(id);
    res.json({ message: "SEO setting deleted" });
  });

  app.get("/api/social-links", async (_req, res) => {
    const links = await storage.getSocialLinks();
    res.json(links);
  });

  app.post("/api/social-links", requireAuth, async (req, res) => {
    const parsed = insertSocialLinkSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const link = await storage.upsertSocialLink(parsed.data);
    res.json(link);
  });

  app.delete("/api/social-links/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteSocialLink(id);
    res.json({ message: "Social link deleted" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
