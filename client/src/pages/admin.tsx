import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient, getQueryFn } from "@/lib/queryClient";
import type { Product, Contact } from "@shared/schema";
import {
  LogOut, Plus, Pencil, Trash2, Package, Mail, X, Save, ArrowLeft
} from "lucide-react";

type Tab = "products" | "contacts";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("products");
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
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;
  }

  if (!authQuery.data) {
    setLocation("/admin/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-900 text-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href="/" className="text-gray-400 hover:text-white" data-testid="link-back-home">
              <ArrowLeft className="h-5 w-5" />
            </a>
            <h1 className="text-xl font-bold" data-testid="text-admin-title">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-300 text-sm" data-testid="text-admin-user">{authQuery.data.username}</span>
            <Button variant="ghost" size="sm" onClick={() => logoutMutation.mutate()} className="text-gray-300 hover:text-white" data-testid="button-logout">
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-4 mb-8">
          <Button
            variant={activeTab === "products" ? "default" : "outline"}
            onClick={() => setActiveTab("products")}
            data-testid="button-tab-products"
          >
            <Package className="h-4 w-4 mr-2" /> Products
          </Button>
          <Button
            variant={activeTab === "contacts" ? "default" : "outline"}
            onClick={() => setActiveTab("contacts")}
            data-testid="button-tab-contacts"
          >
            <Mail className="h-4 w-4 mr-2" /> Contact Messages
          </Button>
        </div>

        {activeTab === "products" && <ProductsManager />}
        {activeTab === "contacts" && <ContactsManager />}
      </div>
    </div>
  );
}

function ProductsManager() {
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();

  const productsQuery = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product deleted" });
    },
  });

  if (productsQuery.isLoading) return <div>Loading products...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold" data-testid="text-products-title">Products</h2>
        <Button onClick={() => { setCreating(true); setEditing(null); }} data-testid="button-add-product">
          <Plus className="h-4 w-4 mr-2" /> Add Product
        </Button>
      </div>

      {(creating || editing) && (
        <ProductForm
          product={editing}
          onClose={() => { setCreating(false); setEditing(null); }}
        />
      )}

      <div className="grid gap-4">
        {productsQuery.data?.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                <div>
                  <h3 className="font-bold" data-testid={`text-product-name-${product.id}`}>{product.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                  <div className="flex gap-1 mt-1">
                    {product.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {product.link && (
                  <a href={product.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline self-center mr-2">
                    {product.link}
                  </a>
                )}
                <Button variant="outline" size="sm" onClick={() => { setEditing(product); setCreating(false); }} data-testid={`button-edit-product-${product.id}`}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => deleteMutation.mutate(product.id)} data-testid={`button-delete-product-${product.id}`}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {productsQuery.data?.length === 0 && (
          <p className="text-gray-500 text-center py-8">No products yet. Add your first product above.</p>
        )}
      </div>
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
      if (isEdit) {
        return apiRequest("PUT", `/api/products/${product.id}`, data);
      }
      return apiRequest("POST", "/api/products", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: isEdit ? "Product updated" : "Product created" });
      onClose();
    },
    onError: () => {
      toast({ title: "Error saving product", variant: "destructive" });
    },
  });

  const iconOptions = [
    "ScanBarcode", "ShoppingCart", "University", "Sprout", "Home", "Hospital"
  ];

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{isEdit ? "Edit Product" : "Add Product"}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}><X className="h-4 w-4" /></Button>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} data-testid="input-product-name" />
          </div>
          <div>
            <Label>Icon</Label>
            <select
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="w-full border rounded-md px-3 py-2 text-sm"
              data-testid="select-product-icon"
            >
              {iconOptions.map((icon) => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} data-testid="input-product-description" />
          </div>
          <div>
            <Label>Image URL</Label>
            <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} data-testid="input-product-image" />
          </div>
          <div>
            <Label>Link (optional)</Label>
            <Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="https://example.com" data-testid="input-product-link" />
          </div>
          <div>
            <Label>Tags (comma-separated)</Label>
            <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="Mobile App, Web App" data-testid="input-product-tags" />
          </div>
          <div>
            <Label>Color Classes</Label>
            <Input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} data-testid="input-product-color" />
          </div>
          <div>
            <Label>Sort Order</Label>
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

function ContactsManager() {
  const { toast } = useToast();

  const contactsQuery = useQuery<Contact[]>({
    queryKey: ["/api/contacts"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/contacts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
      toast({ title: "Message deleted" });
    },
  });

  if (contactsQuery.isLoading) return <div>Loading messages...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6" data-testid="text-contacts-title">Contact Messages</h2>
      <div className="grid gap-4">
        {contactsQuery.data?.map((contact) => (
          <Card key={contact.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold" data-testid={`text-contact-name-${contact.id}`}>{contact.name}</h3>
                    <span className="text-sm text-gray-500">{contact.email}</span>
                  </div>
                  {contact.company && <p className="text-sm text-gray-500">Company: {contact.company}</p>}
                  {contact.service && <Badge variant="secondary" className="mb-2">{contact.service}</Badge>}
                  <p className="text-gray-700 mt-2">{contact.message}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(contact.createdAt).toLocaleString()}
                  </p>
                </div>
                <Button variant="destructive" size="sm" onClick={() => deleteMutation.mutate(contact.id)} data-testid={`button-delete-contact-${contact.id}`}>
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
    </div>
  );
}
