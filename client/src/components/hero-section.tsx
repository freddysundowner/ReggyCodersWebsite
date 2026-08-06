import { ArrowDownRight } from "lucide-react";
export default function HeroSection() {
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return <section id="home" className="relative min-h-[90vh] overflow-hidden bg-background text-primary pt-20">
    <div className="absolute right-0 top-0 h-full w-1/3 border-l border-primary/10 hidden lg:block" />
    <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[1.25fr_.75fr] lg:px-10 lg:py-32">
      <div className="relative z-10">
        <p className="eyebrow reveal text-accent">Where solutions count · Nairobi, Kenya</p>
        <h1 className="display-type reveal reveal-delay-1 mt-7 max-w-4xl text-6xl font-bold leading-[.92] sm:text-8xl lg:text-[7.2rem]">We build<br /><span className="text-accent">Technology</span><br />that helps<br />business grow<span className="text-accent">.</span></h1>
        <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center">
          <p className="max-w-sm text-base leading-7 text-muted-foreground reveal reveal-delay-2">We build software and smart solutions that help ambitious businesses grow.</p>
          <button onClick={() => go("products")} className="group flex w-fit items-center gap-3 border-b border-accent pb-2 text-sm font-bold text-accent reveal reveal-delay-3">Explore our products <ArrowDownRight size={18} className="transition-transform group-hover:translate-x-1 group-hover:translate-y-1" /></button>
        </div>
      </div>
      <div className="relative hidden min-h-[420px] lg:flex flex-col items-end justify-center gap-8">
        <img src="/reggycodas-logo.png" alt="ReggyCodas — Where Solutions Count" className="w-[340px] reveal reveal-delay-2" />
        <div className="max-w-xs border-l-2 border-accent p-4 pl-5 text-sm leading-6 text-muted-foreground text-right border-l-0 border-r-2 pr-5">Smart solutions. Real impact. Lasting growth.</div>
      </div>
    </div>
    <div className="absolute bottom-7 left-5 flex items-center gap-3 text-primary/50 lg:left-10"><span className="h-px w-12 bg-accent/70" /><span className="mono-type text-[10px] uppercase tracking-widest">Scroll to explore</span></div>
  </section>;
}