import { eq, asc, desc } from "drizzle-orm";
import { db } from "./db";
import {
  users, contacts, products, blogPosts, seoSettings,
  type User, type InsertUser,
  type Contact, type InsertContact,
  type Product, type InsertProduct,
  type BlogPost, type InsertBlogPost,
  type SeoSetting, type InsertSeoSetting,
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
  deleteContact(id: number): Promise<void>;

  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<void>;

  getBlogPosts(publishedOnly?: boolean): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<void>;

  getSeoSettings(): Promise<SeoSetting[]>;
  getSeoSetting(pageKey: string): Promise<SeoSetting | undefined>;
  upsertSeoSetting(setting: InsertSeoSetting): Promise<SeoSetting>;
  deleteSeoSetting(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const [newContact] = await db.insert(contacts).values(contact).returning();
    return newContact;
  }

  async getContacts(): Promise<Contact[]> {
    return db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async deleteContact(id: number): Promise<void> {
    await db.delete(contacts).where(eq(contacts.id, id));
  }

  async getProducts(): Promise<Product[]> {
    return db.select().from(products).orderBy(asc(products.sortOrder));
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updated] = await db.update(products).set(product).where(eq(products.id, id)).returning();
    return updated;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  async getBlogPosts(publishedOnly = false): Promise<BlogPost[]> {
    if (publishedOnly) {
      return db.select().from(blogPosts).where(eq(blogPosts.published, true)).orderBy(desc(blogPosts.createdAt));
    }
    return db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db.insert(blogPosts).values(post).returning();
    return newPost;
  }

  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [updated] = await db.update(blogPosts).set({ ...post, updatedAt: new Date() }).where(eq(blogPosts.id, id)).returning();
    return updated;
  }

  async deleteBlogPost(id: number): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }

  async getSeoSettings(): Promise<SeoSetting[]> {
    return db.select().from(seoSettings);
  }

  async getSeoSetting(pageKey: string): Promise<SeoSetting | undefined> {
    const [setting] = await db.select().from(seoSettings).where(eq(seoSettings.pageKey, pageKey));
    return setting;
  }

  async upsertSeoSetting(setting: InsertSeoSetting): Promise<SeoSetting> {
    const existing = await this.getSeoSetting(setting.pageKey);
    if (existing) {
      const [updated] = await db.update(seoSettings).set(setting).where(eq(seoSettings.pageKey, setting.pageKey)).returning();
      return updated;
    }
    const [created] = await db.insert(seoSettings).values(setting).returning();
    return created;
  }

  async deleteSeoSetting(id: number): Promise<void> {
    await db.delete(seoSettings).where(eq(seoSettings.id, id));
  }
}

export const storage = new DatabaseStorage();
