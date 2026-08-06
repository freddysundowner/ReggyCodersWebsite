import { ArrowDownRight, ArrowUpRight } from "lucide-react";
export default function HeroSection() {
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return <section id="home" className="relative min-h-[90vh] overflow-hidden bg-primary text-primary-foreground pt-20">
    <div className="absolute right-0 top-0 h-full w-1/3 border-l border-primary-foreground/10 hidden lg:block" />
    <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[1.25fr_.75fr] lg:px-10 lg:py-32">
      <div className="relative z-10">
        <p className="eyebrow reveal text-secondary">Nairobi · Kenya · East Africa</p>
        <h1 className="display-type reveal reveal-delay-1 mt-7 max-w-4xl text-6xl font-bold leading-[.92] sm:text-8xl lg:text-[8.2rem]">Ideas<br /><span className="text-secondary">into</span><br />businesses<span className="text-accent">.</span></h1>
        <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center">
          <p className="max-w-sm text-base leading-7 text-primary-foreground/70 reveal reveal-delay-2">Reggycodas is a product studio for ambitious people building the next useful thing.</p>
          <button onClick={() => go("products")} className="group flex w-fit items-center gap-3 border-b border-secondary pb-2 text-sm font-bold text-secondary reveal reveal-delay-3">See what we’ve shipped <ArrowDownRight size={18} className="transition-transform group-hover:translate-x-1 group-hover:translate-y-1" /></button>
        </div>
      </div>
      <div className="relative hidden min-h-[420px] lg:block">
        <div className="absolute right-5 top-14 h-72 w-72 rounded-full border border-secondary/50" />
        <div className="absolute right-20 top-29 h-52 w-52 rounded-full border border-secondary/30" />
        <div className="absolute bottom-8 right-0 max-w-xs border-l-2 border-accent pl-5 text-sm leading-6 text-primary-foreground/70">We make software with a point of view — grounded in how people actually work, pay, move and grow.</div>
        <div className="absolute right-36 top-36 h-3 w-3 bg-accent" />
      </div>
    </div>
    <div className="absolute bottom-7 left-5 flex items-center gap-3 text-primary-foreground/50 lg:left-10"><span className="h-px w-12 bg-secondary/70" /><span className="mono-type text-[10px] uppercase tracking-widest">Scroll to explore</span></div>
  </section>;
}