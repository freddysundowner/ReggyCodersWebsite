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
  return <nav className={`fixed top-0 z-50 w-full transition-all ${scrolled ? "bg-background/90 backdrop-blur-md border-b border-border" : "bg-transparent"}`}>
    <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-10">
      <button onClick={() => go("home")} className={`flex items-center gap-3 transition-colors ${"text-foreground"}`} aria-label="Reggycodas home">
        <span className="grid h-9 w-9 place-items-center bg-accent text-primary-foreground font-bold display-type text-lg skew-x-[-8deg]">R</span>
        <span className="display-type text-xl font-bold tracking-tight"><span className="text-primary">Reggy</span><span className="text-accent">Codas</span></span>
      </button>
      <div className="hidden items-center gap-8 md:flex">
        {links.map((l) => <button key={l.id} onClick={() => go(l.id)} className={`text-sm font-semibold transition-colors ${"text-foreground/70 hover:text-primary"}`}>{l.label}</button>)}
        <Link href="/blog" className={`text-sm font-semibold transition-colors ${"text-foreground/70 hover:text-primary"}`}>Journal</Link>
        <button onClick={() => go("contact")} className="flex items-center gap-2 bg-accent px-4 py-2.5 text-sm font-bold text-accent-foreground hover:bg-primary transition-colors">Start a conversation <ArrowUpRight size={15} /></button>
      </div>
      <button className={`md:hidden transition-colors ${"text-foreground hover:text-primary"}`} onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X /> : <Menu />}</button>
    </div>
    {open && <div className="border-t border-border bg-background px-5 py-5 md:hidden">{links.map((l) => <button key={l.id} onClick={() => go(l.id)} className="block w-full border-b border-border py-4 text-left font-semibold">{l.label}</button>)}<Link href="/blog" onClick={() => setOpen(false)} className="block py-4 font-semibold">Journal</Link></div>}
  </nav>;
}