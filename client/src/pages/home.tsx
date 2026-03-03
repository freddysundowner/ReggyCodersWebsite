import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import ProductsSection from "@/components/products-section";
import AboutSection from "@/components/about-section";
import StartupsSection from "@/components/startups-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import SeoHead from "@/components/seo-head";

export default function Home() {
  return (
    <div className="min-h-screen">
      <SeoHead pageKey="home" />
      <Navigation />
      <HeroSection />
      <ProductsSection />
      <AboutSection />
      <StartupsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
