import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const fn = () => setScrolled(window.scrollY > 24); window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn); }, []);
  const links = [{ id: "about", label: "About" }, { id: "products", label: "Products" }, { id: "startups", label: "Incubation" }, { id: "contact", label: "Contact" }];
  const go = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setOpen(false); };
  const overHero = !scrolled;
  return <nav className={`fixed top-0 z-50 w-full transition-all ${scrolled ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm" : "bg-background"}`}>
    <div className="section-shell flex h-[76px] items-center justify-between">
        <button onClick={() => go("home")} className="flex items-center" aria-label="Reggycodas home">
         <img src="/reggycodas-logo.png" alt="ReggyCodas — Where Solutions Count" className="h-10 w-auto" />
      </button>
      <div className="hidden items-center gap-8 md:flex">
        {links.map((l) => <button key={l.id} onClick={() => go(l.id)} className={`text-sm font-semibold transition-colors ${"text-foreground/70 hover:text-primary"}`}>{l.label}</button>)}
        <Link href="/blog" className={`text-sm font-semibold transition-colors ${"text-foreground/70 hover:text-primary"}`}>Journal</Link>
         <button onClick={() => go("contact")} className="flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-bold text-accent-foreground hover:bg-primary transition-colors">Talk to us <ArrowUpRight size={15} /></button>
      </div>
      <button className={`md:hidden transition-colors ${"text-foreground hover:text-primary"}`} onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X /> : <Menu />}</button>
    </div>
    {open && <div className="border-t border-border bg-background px-5 py-5 md:hidden">{links.map((l) => <button key={l.id} onClick={() => go(l.id)} className="block w-full border-b border-border py-4 text-left font-semibold">{l.label}</button>)}<Link href="/blog" onClick={() => setOpen(false)} className="block py-4 font-semibold">Journal</Link></div>}
  </nav>;
}