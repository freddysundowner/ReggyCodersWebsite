import { Button } from "@/components/ui/button";
import { Lightbulb, Code, Rocket } from "lucide-react";

const services = [
  {
    icon: Lightbulb,
    title: "Ideation & Strategy",
    description: "Transform your innovative ideas into viable business strategies with our expert guidance and market research."
  },
  {
    icon: Code,
    title: "Development & Design",
    description: "Full-stack development services to bring your startup vision to life with cutting-edge technology."
  },
  {
    icon: Rocket,
    title: "Launch & Scale",
    description: "Strategic launch planning and scaling support to ensure your startup reaches its full potential."
  }
];

export default function StartupsSection() {
  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="startups" className="py-20 bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Startup Incubation</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            We don't just build software - we nurture the next generation of innovative startups. 
            From idea to market, we provide the expertise and resources needed for success.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div key={index} className="text-center">
                <div className="bg-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="text-white h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                <p className="text-blue-100">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button 
            onClick={scrollToContact}
            className="bg-accent hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
          >
            Start Your Startup Journey
          </Button>
        </div>
      </div>
    </section>
  );
}
