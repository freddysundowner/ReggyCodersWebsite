import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, ScanBarcode, ShoppingCart, University, Sprout, Home, Hospital, CreditCard, Bot, Cloud, WalletCards } from "lucide-react";
import type { Product } from "@shared/schema";
import pointifyImg from "@assets/screenshots/pointifypos_com.png";
import proSuiteImg from "@assets/screenshots/pro-suite_co.png";
import sunpayImg from "@assets/screenshots/sunpay_co_ke.png";
const icons: Record<string, any> = { ScanBarcode, ShoppingCart, University, Sprout, Home, Hospital, CreditCard, Bot, Cloud, WalletCards };
const fallback = [
  { id: 0, name: "Prosuite", description: "Property, rental and estate management system.", icon: "Home", image: proSuiteImg, tags: ["Property", "Rental", "Estate"], link: "https://pro-suite.co", sortOrder: 0 },
  { id: 0, name: "Pointify POS", description: "Sales, inventory and business management for growing teams.", icon: "ScanBarcode", image: pointifyImg, tags: ["Sales", "Inventory"], link: "https://pointifypos.com", sortOrder: 1 },
  { id: 0, name: "BankyKit", description: "SACCO, MFI, Chama and bank management system.", icon: "University", image: proSuiteImg, tags: ["SACCO", "MFI", "Chama"], link: "https://bankykit.com", sortOrder: 2 },
  { id: 0, name: "SunPay", description: "Payment collection and billing platform.", icon: "WalletCards", image: sunpayImg, tags: ["Payments", "Billing"], link: "https://sunpay.co.ke", sortOrder: 3 },
  { id: 0, name: "MediCare", description: "Hospital, clinic and medical centre management.", icon: "Hospital", image: sunpayImg, tags: ["Healthcare", "Clinics"], link: null, sortOrder: 4 },
  { id: 0, name: "LeadsIn", description: "AI-powered lead and sales automation.", icon: "Bot", image: pointifyImg, tags: ["AI", "Sales"], link: null, sortOrder: 5 },
];
export default function ProductsSection() {
  const { data } = useQuery<Product[]>({ queryKey: ["/api/products"] });
  const products = (data?.length ? data : fallback) as Product[];
  return <section id="products" className="bg-background py-24 lg:py-32"><div className="mx-auto max-w-7xl px-5 lg:px-10">
    <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="eyebrow text-accent">Building softwares that powers growth</p><h2 className="display-type mt-4 text-5xl font-bold md:text-7xl">Solutions that<br /><span className="text-primary/40">move business forward.</span></h2></div><p className="max-w-xs text-sm leading-6 text-muted-foreground">Smart solutions. Real impact. Lasting growth.</p></div>
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{products.map((product, i) => { const Icon = icons[product.icon] || ScanBarcode; return <article key={product.id || product.name} className={`group border border-border bg-card p-3 transition-all duration-300 hover:-translate-y-1 hover:border-primary ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}><div className={`relative overflow-hidden bg-muted ${i === 0 ? "h-72 md:h-[26rem]" : "h-48"}`}><img src={product.image} alt={`${product.name} interface`} className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105" /><div className="absolute left-4 top-4 grid h-10 w-10 place-items-center bg-secondary text-primary"><Icon size={20} /></div></div><div className="p-4"><div className="flex items-start justify-between gap-4"><div><p className="mono-type text-[10px] uppercase tracking-widest text-accent">0{i + 1} / Product</p><h3 className="display-type mt-1 text-2xl font-bold">{product.name}</h3></div>{product.link && <a href={product.link} target="_blank" rel="noreferrer" aria-label={`Visit ${product.name}`} className="text-primary hover:text-accent"><ArrowUpRight /></a>}</div><p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">{product.description}</p><div className="mt-4 flex flex-wrap gap-2">{product.tags.map(tag => <span key={tag} className="border border-border px-2 py-1 mono-type text-[9px] uppercase">{tag}</span>)}</div></div></article>; })}</div>
  </div></section>;
}