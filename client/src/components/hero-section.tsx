import { ArrowDownRight } from "lucide-react";
export default function HeroSection() {
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const products = [
    { name: "Pointify POS", detail: "Retail & inventory", accent: "#8249DF" },
    { name: "ProSuite", detail: "Property operations", accent: "#155DFC" },
    { name: "BankyKit", detail: "SACCO & finance", accent: "#2563EB" },
    { name: "SunPay", detail: "Payment infrastructure", accent: "#8C3CDD" },
    { name: "LeadsIntel", detail: "AI lead discovery", accent: "#0A4F2A" },
    { name: "MediCare", detail: "Clinical management", accent: "#2B315F" },
  ];
  return <section id="home" className="soft-grid relative overflow-hidden bg-background pt-[76px] text-primary">
    <div className="section-shell grid min-h-[650px] items-center gap-12 py-20 lg:grid-cols-[1.02fr_.98fr] lg:py-28">
      <div className="relative z-10">
        <p className="eyebrow reveal text-accent">Technology partner · Nairobi, Kenya</p>
        <h1 className="display-type reveal reveal-delay-1 mt-5 max-w-2xl text-5xl font-extrabold leading-[1.08] sm:text-6xl lg:text-[4.6rem]">We build technology that helps <span className="text-accent">business grow.</span></h1>
        <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center">
          <p className="max-w-md text-base leading-7 text-muted-foreground reveal reveal-delay-2">Practical software for the people running shops, properties, clinics and financial communities across Kenya.</p>
          <button onClick={() => go("products")} className="group flex w-fit shrink-0 items-center gap-3 whitespace-nowrap rounded-md bg-primary px-5 py-3 text-sm font-bold text-primary-foreground reveal reveal-delay-3">Explore our solutions <ArrowDownRight size={17} className="transition-transform group-hover:translate-x-1 group-hover:translate-y-1" /></button>
        </div>
      </div>
      <div className="relative mt-5 min-h-[300px] w-full self-center reveal reveal-delay-2 sm:min-h-[350px] lg:mt-0 lg:min-h-[420px]">
        <div className="absolute inset-x-5 top-5 h-[calc(100%-2.5rem)] rounded-2xl border border-accent/15 bg-white/80 shadow-[0_24px_80px_hsl(232_38%_18%/.08)] sm:inset-x-8 lg:inset-x-0" />
        <div className="relative mx-auto max-w-[430px] rounded-xl border border-border bg-white p-5 shadow-lg sm:p-7">
          <div className="flex items-start justify-between gap-5 border-b border-border pb-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.14em] text-accent">Our products</p>
              <p className="mt-2 text-lg font-bold text-primary">One partner. Practical tools.</p>
            </div>
            <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-accent" />
          </div>
          <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {products.map((product) => (
              <div key={product.name} className="flex items-center gap-3 rounded-lg border border-border/80 bg-muted/40 px-3.5 py-3.5 transition-colors hover:bg-muted">
                <span className="h-8 w-1 shrink-0 rounded-full" style={{ backgroundColor: product.accent }} />
                <div>
                  <p className="text-sm font-bold text-primary">{product.name}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{product.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">Software designed around the way Kenyan businesses work.</p>
        </div>
      </div>
    </div>
    <div className="section-shell flex items-center gap-3 pb-7 text-primary/50"><span className="h-px w-12 bg-accent/70" /><span className="mono-type text-[10px] uppercase tracking-widest">Built for business in Kenya</span></div>
  </section>;
}