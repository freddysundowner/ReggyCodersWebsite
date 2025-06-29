import { Card, CardContent } from "@/components/ui/card";
import { ScanBarcode, ShoppingCart, University, Sprout, Home, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const products = [
  {
    id: "pointify",
    name: "Pointify POS",
    description: "A comprehensive point of sale system available as mobile app, web app, and desktop application. Streamline your business operations with advanced inventory management and sales analytics.",
    icon: ScanBarcode,
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250",
    tags: ["Mobile App", "Web App", "Desktop"],
    color: "bg-primary/10 text-primary"
  },
  {
    id: "tokshop",
    name: "Tokshop App",
    description: "Revolutionary mobile app for live shopping experiences, real-time auctions, and seamless product trading. Connect buyers and sellers in an interactive marketplace.",
    icon: ShoppingCart,
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250",
    tags: ["Live Shopping", "Auctions"],
    color: "bg-accent/10 text-accent"
  },
  {
    id: "banky",
    name: "Banky",
    description: "Complete SACCO and microfinance management solution handling loans, member registration, financial operations, HR management, and comprehensive reporting.",
    icon: University,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250",
    tags: ["Loans", "Finance", "HR"],
    color: "bg-green-100 text-green-700"
  },
  {
    id: "shambakit",
    name: "Shambakit",
    description: "AI-powered agricultural innovation that detects plant diseases, recommends treatments, locates suppliers, and provides disease mapping for farming communities.",
    icon: Sprout,
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250",
    tags: ["AI Detection", "Mapping"],
    color: "bg-green-100 text-green-700"
  },
  {
    id: "listing",
    name: "Listing App",
    description: "Advanced real estate platform for property management and marketing with immersive 3D house viewing capabilities and comprehensive listing tools.",
    icon: Home,
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250",
    tags: ["3D Viewing", "Real Estate"],
    color: "bg-blue-100 text-blue-700"
  }
];

export default function ProductsSection() {
  return (
    <section id="products" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Featured Products</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover our suite of innovative software solutions designed to transform businesses across various industries.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => {
            const Icon = product.icon;
            return (
              <Card key={product.id} className="bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow group">
                <CardContent className="p-6">
                  <div className="mb-6">
                    <img 
                      src={product.image} 
                      alt={`${product.name} interface`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex items-center mb-4">
                    <Icon className="text-primary text-2xl mr-3 h-8 w-8" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{product.name}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {product.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.tags.map((tag) => (
                      <Badge key={tag} className={product.color}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <button className="text-primary font-semibold group-hover:text-accent transition-colors flex items-center">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
