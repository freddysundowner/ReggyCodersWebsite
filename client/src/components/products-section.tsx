import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Bot, CreditCard, Home, Hospital, ScanBarcode, University } from "lucide-react";
import type { Product } from "@shared/schema";
import pointifyImg from "@assets/screenshots/pointifypos_com.png";
import proSuiteImg from "@assets/screenshots/pro-suite_co.png";
import sunpayImg from "@assets/screenshots/sunpay_co_ke.png";

type ProductCard = Product & { accent: string; tagline: string };

const icons: Record<string, typeof ScanBarcode> = {
  ScanBarcode,
  Home,
  University,
  CreditCard,
  Bot,
  Hospital,
};

const fallback: ProductCard[] = [
  {
    id: 0,
    name: "Pointify POS",
    description: "The reliable point-of-sale system for African businesses: instant sales from your phone, real-time sales and profit dashboards, stock and warehouse management, cash-flow tracking, reports, debt management, branches, barcodes, receipts and a free online store.",
    tagline: "Know exactly how much your shop made today — even when you're not there.",
    icon: "ScanBarcode",
    image: pointifyImg,
    tags: ["Retail", "Inventory", "M-Pesa"],
    color: "",
    link: "https://pointifypos.com",
    sortOrder: 0,
    accent: "#8249DF",
  },
  {
    id: 0,
    name: "ProSuite",
    description: "Kenya's all-in-one property platform for rent collection via M-Pesa, arrears, tenants, land and plot sales, payment plans, hotel bookings, and a WhatsApp AI assistant for listings and viewings.",
    tagline: "Property operations, without the paperwork.",
    icon: "Home",
    image: proSuiteImg,
    tags: ["Property", "M-Pesa", "Hospitality"],
    color: "",
    link: "https://pro-suite.co",
    sortOrder: 1,
    accent: "#155DFC",
  },
  {
    id: 0,
    name: "BankyKit",
    description: "A complete banking platform for Saccos, MFIs, chamas and banks, with KYC, flexible loan products, M-Pesa disbursement, savings, shares, deposits, dividends and double-entry accounting.",
    tagline: "Bank-grade tools for financial communities.",
    icon: "University",
    image: proSuiteImg,
    tags: ["SACCO", "MFI", "Accounting"],
    color: "",
    link: "https://bankykit.com",
    sortOrder: 2,
    accent: "#2563EB",
  },
  {
    id: 0,
    name: "SunPay",
    description: "M-Pesa payment infrastructure with STK Push, one API key and endpoint, signed webhooks, a live dashboard, Paybill, STK and B2C from one account. Pay as you go at 1.5% per successful transaction.",
    tagline: "Payments infrastructure, without the Safaricom maze.",
    icon: "CreditCard",
    image: sunpayImg,
    tags: ["Payments API", "STK Push", "B2C"],
    color: "",
    link: "https://sunpay.co.ke",
    sortOrder: 3,
    accent: "#8C3CDD",
  },
  {
    id: 0,
    name: "LeadsIn",
    description: "AI-powered lead discovery and outreach across TikTok, Instagram, Facebook, LinkedIn and Google Maps, followed by personalized WhatsApp, email and SMS campaigns with automated follow-up.",
    tagline: "Someone is looking for exactly what you sell.",
    icon: "Bot",
    image: pointifyImg,
    tags: ["Lead discovery", "AI outreach", "Automation"],
    color: "",
    link: "https://leadsintel.net",
    sortOrder: 4,
    accent: "#0A4F2A",
  },
  {
    id: 0,
    name: "MediCare",
    description: "Hospital, clinic and medical centre management for patient records, appointments, billing, pharmacy, clinical operations and administration.",
    tagline: "A clearer way to care for the whole operation.",
    icon: "Hospital",
    image: sunpayImg,
    tags: ["Healthcare", "Clinical", "Administration"],
    color: "",
    link: null,
    sortOrder: 5,
    accent: "#2B315F",
  },
];

const accentByName: Record<string, string> = Object.fromEntries(fallback.map((product) => [product.name.toLowerCase(), product.accent]));

export default function ProductsSection() {
  const { data } = useQuery<Product[]>({ queryKey: ["/api/products"] });
  const products: ProductCard[] = (data?.length ? data : fallback).map((product) => ({
    ...product,
    accent: accentByName[product.name.toLowerCase()] ?? "#2B315F",
    tagline: (product as ProductCard).tagline || "Smart solutions. Real impact. Lasting growth.",
  }));

  return (
    <section id="products" className="bg-background py-24 lg:py-28">
      <div className="section-shell">
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-accent">Our products</p>
            <h2 className="display-type mt-4 text-4xl font-bold md:text-5xl">Tools built around<br /><span className="text-primary/40">real business needs.</span></h2>
          </div>
          <p className="max-w-xs text-sm leading-6 text-muted-foreground">Smart solutions. Real impact. Lasting growth.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => {
            const Icon = icons[product.icon] || ScanBarcode;
            return (
              <article
                key={product.id || product.name}
                className={`group rounded-lg border border-border bg-card p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${index === 0 ? "md:col-span-2" : ""}`}
                style={{ borderTopColor: product.accent, borderTopWidth: "3px" }}
              >
                <div className={`relative overflow-hidden bg-muted ${index === 0 ? "h-72 md:h-[26rem]" : "h-48"}`}>
                  <img src={product.image} alt={`${product.name} interface`} className="h-full w-full object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0" />
                  <div className="absolute left-4 top-4 grid h-10 w-10 place-items-center text-white" style={{ backgroundColor: product.accent }}>
                    <Icon size={20} />
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="mono-type text-[10px] uppercase tracking-widest" style={{ color: product.accent }}>0{index + 1} / Product</p>
                      <h3 className="display-type mt-1 text-2xl font-bold text-primary">{product.name}</h3>
                    </div>
                    {product.link && (
                      <a href={product.link} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${product.name} website`} className="flex shrink-0 items-center gap-1 text-sm font-bold transition-colors" style={{ color: product.accent }}>
                        Visit site <ArrowUpRight size={16} />
                      </a>
                    )}
                  </div>
                  <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">{product.description}</p>
                  <p className="mt-4 border-l-2 pl-3 text-sm italic text-primary/75" style={{ borderColor: product.accent }}>{product.tagline}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {product.tags.map((tag) => <span key={tag} className="border px-2 py-1 mono-type text-[9px] uppercase" style={{ borderColor: `${product.accent}55`, color: product.accent }}>{tag}</span>)}
                  </div>
                  {!product.link && <span className="mt-5 inline-block text-xs font-semibold text-muted-foreground">Coming soon</span>}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}