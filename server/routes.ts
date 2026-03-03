import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, seedAdmin, requireAuth } from "./auth";
import { insertContactSchema, insertProductSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);
  await seedAdmin();

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

  const httpServer = createServer(app);
  return httpServer;
}
