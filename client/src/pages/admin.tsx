import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient, getQueryFn } from "@/lib/queryClient";
import type { Product, Contact, BlogPost, SeoSetting } from "@shared/schema";
import {
  LogOut, Plus, Pencil, Trash2, Package, Mail, X, Save,
  LayoutDashboard, FileText, Search, Eye, EyeOff, ExternalLink, ChevronRight
} from "lucide-react";

type Page = "dashboard" | "products" | "blog" | "contacts" | "seo";

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState<Page>("dashboard");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const authQuery = useQuery<{ id: number; username: string } | null>({
    queryKey: ["/api/auth/me"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/auth/logout"),
    onSuccess: () => setLocation("/admin/login"),
  });

  if (authQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!authQuery.data) {
    setLocation("/admin/login");
    return null;
  }

  const navItems = [
    { key: "dashboard" as Page, label: "Dashboard", icon: LayoutDashboard },
    { key: "products" as Page, label: "Products", icon: Package },
    { key: "blog" as Page, label: "Blog Posts", icon: FileText },
    { key: "contacts" as Page, label: "Messages", icon: Mail },
    { key: "seo" as Page, label: "SEO Settings", icon: Search },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-gray-900 text-white flex flex-col fixed h-full">
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Reggycodas" className="h-8" />
          </div>
          <p className="text-xs text-gray-400 mt-1">Content Management</p>
        </div>

        <nav className="flex-1 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActivePage(item.key)}
                className={`w-full flex items-center gap-3 px-5 py-3 text-sm transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
                data-testid={`nav-${item.key}`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-3 transition-colors"
            data-testid="link-view-site"
          >
            <ExternalLink className="h-4 w-4" /> View Site
          </a>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400" data-testid="text-admin-user">{authQuery.data.username}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logoutMutation.mutate()}
              className="text-gray-400 hover:text-white h-8 px-2"
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      <main className="flex-1 ml-64">
        <div className="p-8">
          {activePage === "dashboard" && <DashboardOverview onNavigate={setActivePage} />}
          {activePage === "products" && <ProductsManager />}
          {activePage === "blog" && <BlogManager />}
          {activePage === "contacts" && <ContactsManager />}
          {activePage === "seo" && <SeoManager />}
        </div>
      </main>
    </div>
  );
}

function DashboardOverview({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const productsQuery = useQuery<Product[]>({ queryKey: ["/api/products"] });
  const contactsQuery = useQuery<Contact[]>({ queryKey: ["/api/contacts"] });
  const blogQuery = useQuery<BlogPost[]>({ queryKey: ["/api/blog/all"] });

  const stats = [
    { label: "Products", value: productsQuery.data?.length ?? 0, page: "products" as Page, icon: Package, color: "bg-blue-500" },
    { label: "Blog Posts", value: blogQuery.data?.length ?? 0, page: "blog" as Page, icon: FileText, color: "bg-green-500" },
    { label: "Messages", value: contactsQuery.data?.length ?? 0, page: "contacts" as Page, icon: Mail, color: "bg-orange-500" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900" data-testid="text-dashboard-title">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your website content</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onNavigate(stat.page)}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`${stat.color} text-white p-3 rounded-lg`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900" data-testid={`stat-${stat.label.toLowerCase()}`}>
                    {stat.value}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-300 ml-auto" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Messages</CardTitle>
          </CardHeader>
          <CardContent>
            {contactsQuery.data?.slice(0, 5).map((c) => (
              <div key={c.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium text-sm">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.email}</p>
                </div>
                <p className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
            {(!contactsQuery.data || contactsQuery.data.length === 0) && (
              <p className="text-sm text-gray-400 py-4 text-center">No messages yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Blog Posts</CardTitle>
          </CardHeader>
          <CardContent>
            {blogQuery.data?.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium text-sm">{p.title}</p>
                  <p className="text-xs text-gray-500">{p.author}</p>
                </div>
                <Badge variant={p.published ? "default" : "secondary"} className="text-xs">
                  {p.published ? "Published" : "Draft"}
                </Badge>
              </div>
            ))}
            {(!blogQuery.data || blogQuery.data.length === 0) && (
              <p className="text-sm text-gray-400 py-4 text-center">No blog posts yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ProductsManager() {
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();

  const productsQuery = useQuery<Product[]>({ queryKey: ["/api/products"] });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product deleted" });
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" data-testid="text-products-title">Products</h1>
          <p className="text-gray-500 mt-1">Manage your product listings</p>
        </div>
        <Button onClick={() => { setCreating(true); setEditing(null); }} data-testid="button-add-product">
          <Plus className="h-4 w-4 mr-2" /> Add Product
        </Button>
      </div>

      {(creating || editing) && (
        <ProductForm product={editing} onClose={() => { setCreating(false); setEditing(null); }} />
      )}

      {productsQuery.isLoading ? (
        <div className="text-gray-500 py-8 text-center">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg border">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Tags</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Link</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Order</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {productsQuery.data?.map((product) => (
                <tr key={product.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded" />
                      <div>
                        <p className="font-medium text-sm" data-testid={`text-product-name-${product.id}`}>{product.name}</p>
                        <p className="text-xs text-gray-500 line-clamp-1 max-w-xs">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {product.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {product.link ? (
                      <a href={product.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">{product.link}</a>
                    ) : (
                      <span className="text-xs text-gray-400">None</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{product.sortOrder}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => { setEditing(product); setCreating(false); }} data-testid={`button-edit-product-${product.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => deleteMutation.mutate(product.id)} data-testid={`button-delete-product-${product.id}`}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {productsQuery.data?.length === 0 && (
            <p className="text-gray-500 text-center py-8">No products yet. Add your first product above.</p>
          )}
        </div>
      )}
    </div>
  );
}

function ProductForm({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const { toast } = useToast();
  const isEdit = !!product;

  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    icon: product?.icon || "ScanBarcode",
    image: product?.image || "",
    tags: product?.tags.join(", ") || "",
    color: product?.color || "bg-primary/10 text-primary",
    link: product?.link || "",
    sortOrder: product?.sortOrder ?? 0,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const data = {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        link: form.link || null,
        sortOrder: Number(form.sortOrder),
      };
      if (isEdit) return apiRequest("PUT", `/api/products/${product.id}`, data);
      return apiRequest("POST", "/api/products", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: isEdit ? "Product updated" : "Product created" });
      onClose();
    },
    onError: () => toast({ title: "Error saving product", variant: "destructive" }),
  });

  const iconOptions = ["ScanBarcode", "ShoppingCart", "University", "Sprout", "Home", "Hospital"];

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg">{isEdit ? "Edit Product" : "New Product"}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}><X className="h-4 w-4" /></Button>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-gray-500">Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} data-testid="input-product-name" />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Icon</Label>
            <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm" data-testid="select-product-icon">
              {iconOptions.map((icon) => (<option key={icon} value={icon}>{icon}</option>))}
            </select>
          </div>
          <div className="md:col-span-2">
            <Label className="text-xs text-gray-500">Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} data-testid="input-product-description" />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Image URL</Label>
            <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} data-testid="input-product-image" />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Link (optional)</Label>
            <Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="https://example.com" data-testid="input-product-link" />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Tags (comma-separated)</Label>
            <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="Mobile App, Web App" data-testid="input-product-tags" />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Color Classes</Label>
            <Input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} data-testid="input-product-color" />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Sort Order</Label>
            <Input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} data-testid="input-product-sort" />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} data-testid="button-save-product">
            <Save className="h-4 w-4 mr-2" /> {saveMutation.isPending ? "Saving..." : "Save"}
          </Button>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function BlogManager() {
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();

  const blogQuery = useQuery<BlogPost[]>({ queryKey: ["/api/blog/all"] });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/blog/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog/all"] });
      toast({ title: "Post deleted" });
    },
  });

  const togglePublish = useMutation({
    mutationFn: (post: BlogPost) => apiRequest("PUT", `/api/blog/${post.id}`, { published: !post.published }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" data-testid="text-blog-title">Blog Posts</h1>
          <p className="text-gray-500 mt-1">Create and manage blog content</p>
        </div>
        <Button onClick={() => { setCreating(true); setEditing(null); }} data-testid="button-add-post">
          <Plus className="h-4 w-4 mr-2" /> New Post
        </Button>
      </div>

      {(creating || editing) && (
        <BlogForm post={editing} onClose={() => { setCreating(false); setEditing(null); }} />
      )}

      {blogQuery.isLoading ? (
        <div className="text-gray-500 py-8 text-center">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg border">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Post</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Author</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogQuery.data?.map((post) => (
                <tr key={post.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-sm" data-testid={`text-post-title-${post.id}`}>{post.title}</p>
                      <p className="text-xs text-gray-500 line-clamp-1 max-w-md">{post.excerpt}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{post.author}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => togglePublish.mutate(post)} className="cursor-pointer" data-testid={`button-toggle-publish-${post.id}`}>
                      <Badge variant={post.published ? "default" : "secondary"}>
                        {post.published ? <><Eye className="h-3 w-3 mr-1" />Published</> : <><EyeOff className="h-3 w-3 mr-1" />Draft</>}
                      </Badge>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => { setEditing(post); setCreating(false); }} data-testid={`button-edit-post-${post.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => deleteMutation.mutate(post.id)} data-testid={`button-delete-post-${post.id}`}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {blogQuery.data?.length === 0 && (
            <p className="text-gray-500 text-center py-8">No blog posts yet. Create your first post above.</p>
          )}
        </div>
      )}
    </div>
  );
}

function BlogForm({ post, onClose }: { post: BlogPost | null; onClose: () => void }) {
  const { toast } = useToast();
  const isEdit = !!post;

  const [form, setForm] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    coverImage: post?.coverImage || "",
    author: post?.author || "Fredrick Mundia Githumbi",
    published: post?.published ?? false,
  });

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const data = {
        ...form,
        slug: form.slug || generateSlug(form.title),
        coverImage: form.coverImage || null,
      };
      if (isEdit) return apiRequest("PUT", `/api/blog/${post.id}`, data);
      return apiRequest("POST", "/api/blog", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      toast({ title: isEdit ? "Post updated" : "Post created" });
      onClose();
    },
    onError: () => toast({ title: "Error saving post", variant: "destructive" }),
  });

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg">{isEdit ? "Edit Post" : "New Post"}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}><X className="h-4 w-4" /></Button>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-gray-500">Title</Label>
            <Input
              value={form.title}
              onChange={(e) => {
                const title = e.target.value;
                setForm({ ...form, title, slug: isEdit ? form.slug : generateSlug(title) });
              }}
              data-testid="input-post-title"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Slug</Label>
            <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} data-testid="input-post-slug" />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Author</Label>
            <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} data-testid="input-post-author" />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Cover Image URL (optional)</Label>
            <Input value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} data-testid="input-post-cover" />
          </div>
          <div className="md:col-span-2">
            <Label className="text-xs text-gray-500">Excerpt</Label>
            <Textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="min-h-[60px]" data-testid="input-post-excerpt" />
          </div>
          <div className="md:col-span-2">
            <Label className="text-xs text-gray-500">Content</Label>
            <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="min-h-[200px] font-mono text-sm" data-testid="input-post-content" />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={form.published} onCheckedChange={(checked) => setForm({ ...form, published: checked })} data-testid="switch-post-published" />
            <Label className="text-sm">{form.published ? "Published" : "Draft"}</Label>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} data-testid="button-save-post">
            <Save className="h-4 w-4 mr-2" /> {saveMutation.isPending ? "Saving..." : "Save"}
          </Button>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ContactsManager() {
  const { toast } = useToast();
  const contactsQuery = useQuery<Contact[]>({ queryKey: ["/api/contacts"] });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/contacts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
      toast({ title: "Message deleted" });
    },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900" data-testid="text-contacts-title">Contact Messages</h1>
        <p className="text-gray-500 mt-1">Messages received from your contact form</p>
      </div>

      {contactsQuery.isLoading ? (
        <div className="text-gray-500 py-8 text-center">Loading...</div>
      ) : (
        <div className="grid gap-4">
          {contactsQuery.data?.map((contact) => (
            <Card key={contact.id} className="bg-white">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold" data-testid={`text-contact-name-${contact.id}`}>{contact.name}</h3>
                      <span className="text-sm text-gray-500">{contact.email}</span>
                      {contact.service && <Badge variant="secondary">{contact.service}</Badge>}
                    </div>
                    {contact.company && <p className="text-sm text-gray-500 mb-2">Company: {contact.company}</p>}
                    <p className="text-gray-700 text-sm">{contact.message}</p>
                    <p className="text-xs text-gray-400 mt-3">{new Date(contact.createdAt).toLocaleString()}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => deleteMutation.mutate(contact.id)} data-testid={`button-delete-contact-${contact.id}`}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {contactsQuery.data?.length === 0 && (
            <p className="text-gray-500 text-center py-8">No contact messages yet.</p>
          )}
        </div>
      )}
    </div>
  );
}

function SeoManager() {
  const { toast } = useToast();
  const seoQuery = useQuery<SeoSetting[]>({ queryKey: ["/api/seo"] });
  const [editingPage, setEditingPage] = useState<string | null>(null);

  const pages = [
    { key: "home", label: "Home Page" },
    { key: "blog", label: "Blog" },
    { key: "global", label: "Site-wide Defaults" },
  ];

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/seo/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seo"] });
      toast({ title: "SEO setting removed" });
    },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900" data-testid="text-seo-title">SEO Settings</h1>
        <p className="text-gray-500 mt-1">Manage meta tags and search engine optimization</p>
      </div>

      {editingPage && (
        <SeoForm
          pageKey={editingPage}
          existing={seoQuery.data?.find((s) => s.pageKey === editingPage)}
          onClose={() => setEditingPage(null)}
        />
      )}

      <div className="grid gap-4">
        {pages.map((page) => {
          const setting = seoQuery.data?.find((s) => s.pageKey === page.key);
          return (
            <Card key={page.key} className="bg-white">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{page.label}</h3>
                      <Badge variant={setting ? "default" : "secondary"}>
                        {setting ? "Configured" : "Not Set"}
                      </Badge>
                    </div>
                    {setting && (
                      <div className="mt-2 text-sm text-gray-600">
                        <p><span className="font-medium">Title:</span> {setting.title}</p>
                        <p><span className="font-medium">Description:</span> {setting.description}</p>
                        {setting.keywords && <p><span className="font-medium">Keywords:</span> {setting.keywords}</p>}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setEditingPage(page.key)} data-testid={`button-edit-seo-${page.key}`}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {setting && (
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => deleteMutation.mutate(setting.id)} data-testid={`button-delete-seo-${page.key}`}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function SeoForm({ pageKey, existing, onClose }: { pageKey: string; existing?: SeoSetting; onClose: () => void }) {
  const { toast } = useToast();

  const [form, setForm] = useState({
    pageKey,
    title: existing?.title || "",
    description: existing?.description || "",
    keywords: existing?.keywords || "",
    ogImage: existing?.ogImage || "",
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/seo", {
        ...form,
        keywords: form.keywords || null,
        ogImage: form.ogImage || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seo"] });
      toast({ title: "SEO settings saved" });
      onClose();
    },
    onError: () => toast({ title: "Error saving SEO settings", variant: "destructive" }),
  });

  const pageLabels: Record<string, string> = {
    home: "Home Page",
    blog: "Blog",
    global: "Site-wide Defaults",
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg">SEO: {pageLabels[pageKey] || pageKey}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}><X className="h-4 w-4" /></Button>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label className="text-xs text-gray-500">Page Title</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Reggycodas - Technology Solutions" data-testid="input-seo-title" />
          </div>
          <div className="md:col-span-2">
            <Label className="text-xs text-gray-500">Meta Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="A brief description for search engines..." className="min-h-[80px]" data-testid="input-seo-description" />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Keywords (comma-separated)</Label>
            <Input value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} placeholder="technology, software, Kenya" data-testid="input-seo-keywords" />
          </div>
          <div>
            <Label className="text-xs text-gray-500">OG Image URL (optional)</Label>
            <Input value={form.ogImage} onChange={(e) => setForm({ ...form, ogImage: e.target.value })} placeholder="https://example.com/og-image.png" data-testid="input-seo-og-image" />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} data-testid="button-save-seo">
            <Save className="h-4 w-4 mr-2" /> {saveMutation.isPending ? "Saving..." : "Save"}
          </Button>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </CardContent>
    </Card>
  );
}
