import { ArrowDownRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
export default function HeroSection() {
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
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
      <div className="relative hidden min-h-[420px] lg:block reveal reveal-delay-2">
        <div className="absolute right-4 top-2 h-[390px] w-[390px] rounded-full border border-accent/20 bg-white shadow-[0_24px_80px_hsl(232_38%_18%/.12)]" />
        <div className="absolute right-0 top-20 w-[430px] rounded-xl border border-border bg-white p-7 shadow-xl">
          <div className="flex items-center justify-between border-b border-border pb-5"><span className="text-sm font-bold">Business at a glance</span><span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-accent">Live systems</span></div>
          <div className="grid grid-cols-2 gap-4 py-6"><div className="rounded-lg bg-muted p-4"><p className="text-xs text-muted-foreground">Sales today</p><p className="mt-2 text-2xl font-bold text-primary">KES 248,650</p><p className="mt-1 text-xs text-emerald-600">+12.8% this week</p></div><div className="rounded-lg bg-primary p-4 text-primary-foreground"><p className="text-xs text-primary-foreground/60">Operations</p><p className="mt-2 text-2xl font-bold">On track</p><p className="mt-1 text-xs text-primary-foreground/60">Across 4 branches</p></div></div>
          <div className="space-y-3 text-sm"><div className="flex items-center gap-3"><CheckCircle2 size={17} className="text-emerald-600" /> Inventory is up to date</div><div className="flex items-center gap-3"><ShieldCheck size={17} className="text-accent" /> Payments reconciled securely</div><div className="flex items-center gap-3"><Sparkles size={17} className="text-primary" /> Insights ready for review</div></div>
        </div>
      </div>
    </div>
    <div className="section-shell flex items-center gap-3 pb-7 text-primary/50"><span className="h-px w-12 bg-accent/70" /><span className="mono-type text-[10px] uppercase tracking-widest">Built for business in Kenya</span></div>
  </section>;
}