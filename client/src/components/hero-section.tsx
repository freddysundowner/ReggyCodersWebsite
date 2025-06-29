import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const scrollToProducts = () => {
    const element = document.getElementById("products");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="pt-16 bg-gradient-to-br from-primary to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Building the Future with{" "}
              <span className="text-accent">Smart Technology</span>
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Reggycodas develops innovative software solutions and launches groundbreaking startups. 
              From mobile apps to enterprise systems, we transform ideas into powerful digital experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={scrollToProducts}
                className="bg-accent hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
              >
                Explore Our Products
              </Button>
              <Button 
                onClick={scrollToContact}
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 rounded-lg font-semibold transition-all"
              >
                Get In Touch
              </Button>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Modern technology workspace" 
              className="rounded-xl shadow-2xl w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
