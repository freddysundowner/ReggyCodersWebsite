import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Twitter, Linkedin, Github, Instagram, Facebook, Youtube } from "lucide-react";
import { SiTiktok } from "react-icons/si";
import type { SocialLink } from "@shared/schema";

const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Twitter: Twitter,
  LinkedIn: Linkedin,
  GitHub: Github,
  Instagram: Instagram,
  Facebook: Facebook,
  YouTube: Youtube,
  TikTok: SiTiktok,
};

export default function Footer() {
  const { data: socialLinks } = useQuery<SocialLink[]>({
    queryKey: ["/api/social-links"],
  });

  const visibleLinks = socialLinks?.filter((link) => link.url) ?? [];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const quickLinks = [
    { id: "home", label: "Home" },
    { id: "about", label: "About Us" },
    { id: "products", label: "Products" },
    { id: "startups", label: "Startups" },
    { id: "contact", label: "Contact" },
  ];

  const products = [
    "Pointify POS",
    "Tokshop App",
    "Bankykit",
    "Shambakit",
    "Pro Suite",
  ];

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <img src="/logo.png" alt="Reggycodas" className="h-10 mb-4" data-testid="img-footer-logo" />
            <p className="text-gray-300 mb-6 max-w-md">
              Transforming businesses through innovative technology solutions. 
              From software development to startup incubation, we build the future together.
            </p>
            {visibleLinks.length > 0 && (
              <div className="flex space-x-4">
                {visibleLinks.map((link) => {
                  const Icon = platformIcons[link.platform];
                  return (
                    <a
                      key={link.id}
                      href={link.url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.platform}
                      className="bg-primary hover:bg-blue-700 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                      data-testid={`link-social-${link.platform.toLowerCase()}`}
                    >
                      {Icon ? <Icon className="h-5 w-5" /> : <span className="text-xs font-bold">{link.platform.charAt(0)}</span>}
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Our Products</h4>
            <ul className="space-y-2 text-gray-300">
              {products.map((product) => (
                <li key={product}>
                  <button onClick={() => scrollToSection("products")} className="hover:text-white transition-colors">
                    {product}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Reggycodas. All rights reserved. | Founded by Fredrick Mundia Githumbi</p>
        </div>
      </div>
    </footer>
  );
}
