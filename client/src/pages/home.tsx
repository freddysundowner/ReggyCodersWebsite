import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import ProductsSection from "@/components/products-section";
import AboutSection from "@/components/about-section";
import StartupsSection from "@/components/startups-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "red", minHeight: "100vh" }}>
      <h1 style={{ color: "white", fontSize: "48px", padding: "100px" }}>TEST - Page is rendering</h1>
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
