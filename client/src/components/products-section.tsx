import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, ScanBarcode, ShoppingCart, University, Sprout, Home, Hospital, CreditCard } from "lucide-react";
import type { Product } from "@shared/schema";
import pointifyImg from "@assets/screenshots/pointifypos_com.png";
import proSuiteImg from "@assets/screenshots/pro-suite_co.png";
import sunpayImg from "@assets/screenshots/sunpay_co_ke.png";
const icons: Record<string, any> = { ScanBarcode, ShoppingCart, University, Sprout, Home, Hospital, CreditCard };
const fallback = [
  { id: 0, name: "Pointify POS", description: "A point of sale system for the businesses that keep Kenya moving.", icon: "ScanBarcode", image: pointifyImg, tags: ["Retail", "Operations"], link: "https://pointifypos.com", sortOrder: 0 },
  { id: 0, name: "Bankykit", description: "SACCO and microfinance software that makes financial operations feel human.", icon: "University", image: proSuiteImg, tags: ["Finance", "SACCO"], link: "https://bankykit.com", sortOrder: 1 },
  { id: 0, name: "Tokshop", description: "Live commerce and auctions, built for a more social kind of shopping.", icon: "ShoppingCart", image: sunpayImg, tags: ["Commerce", "Mobile"], link: "https://tokshoplive.com", sortOrder: 2 },
  { id: 0, name: "Pro Suite", description: "Property management that puts landlords, tenants and M-Pesa in one place.", icon: "Home", image: proSuiteImg, tags: ["Property", "M-Pesa"], link: "https://pro-suite.co", sortOrder: 3 },
  { id: 0, name: "SunPay", description: "One clean API for M-Pesa payments, auth, STK push and webhooks.", icon: "CreditCard", image: sunpayImg, tags: ["Payments", "API"], link: "https://sunpay.co.ke", sortOrder: 4 },
];
export default function ProductsSection() {
  const { data } = useQuery<Product[]>({ queryKey: ["/api/products"] });
  const products = (data?.length ? data : fallback) as Product[];
  return <section id="products" className="bg-background py-24 lg:py-32"><div className="mx-auto max-w-7xl px-5 lg:px-10">
    <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="eyebrow text-accent">Selected work / 01—05</p><h2 className="display-type mt-4 text-5xl font-bold md:text-7xl">Things we’ve<br /><span className="text-primary/40">put into the world.</span></h2></div><p className="max-w-xs text-sm leading-6 text-muted-foreground">Not demos. Not decks. Real products solving practical problems for real people.</p></div>
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{products.map((product, i) => { const Icon = icons[product.icon] || ScanBarcode; return <article key={product.id || product.name} className={`group border border-border bg-card p-3 transition-all duration-300 hover:-translate-y-1 hover:border-primary ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}><div className={`relative overflow-hidden bg-muted ${i === 0 ? "h-72 md:h-[26rem]" : "h-48"}`}><img src={product.image} alt={`${product.name} interface`} className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105" /><div className="absolute left-4 top-4 grid h-10 w-10 place-items-center bg-secondary text-primary"><Icon size={20} /></div></div><div className="p-4"><div className="flex items-start justify-between gap-4"><div><p className="mono-type text-[10px] uppercase tracking-widest text-accent">0{i + 1} / Product</p><h3 className="display-type mt-1 text-2xl font-bold">{product.name}</h3></div>{product.link && <a href={product.link} target="_blank" rel="noreferrer" aria-label={`Visit ${product.name}`} className="text-primary hover:text-accent"><ArrowUpRight /></a>}</div><p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">{product.description}</p><div className="mt-4 flex flex-wrap gap-2">{product.tags.map(tag => <span key={tag} className="border border-border px-2 py-1 mono-type text-[9px] uppercase">{tag}</span>)}</div></div></article>; })}</div>
  </div></section>;
}