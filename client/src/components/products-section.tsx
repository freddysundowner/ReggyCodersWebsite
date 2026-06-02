import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { ScanBarcode, ShoppingCart, University, Sprout, Home, ArrowRight, Hospital, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@shared/schema";
import pointifyImg from "@assets/screenshots/pointifypos_com.png";
import proSuiteImg from "@assets/screenshots/pro-suite_co.png";
import sunpayImg from "@assets/screenshots/sunpay_co_ke.png";

const iconMap: Record<string, any> = {
  ScanBarcode, ShoppingCart, University, Sprout, Home, Hospital, CreditCard,
};

const defaultProducts = [
  {
    id: 0, name: "Pointify POS",
    description: "A comprehensive point of sale system available as mobile app, web app, and desktop application. Streamline your business operations with advanced inventory management and sales analytics.",
    icon: "ScanBarcode", image: pointifyImg,
    tags: ["Mobile App", "Web App", "Desktop"], color: "bg-primary/10 text-primary",
    link: "https://pointifypos.com", sortOrder: 0,
  },
  {
    id: 0, name: "Bankykit",
    description: "Complete SACCO and microfinance management solution handling loans, member registration, financial operations, HR management, and comprehensive reporting.",
    icon: "University", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    tags: ["Loans", "Finance", "HR"], color: "bg-green-100 text-green-700",
    link: "https://bankykit.com", sortOrder: 1,
  },
  {
    id: 0, name: "Tokshop App",
    description: "Revolutionary mobile app for live shopping experiences, real-time auctions, and seamless product trading. Connect buyers and sellers in an interactive marketplace.",
    icon: "ShoppingCart", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    tags: ["Live Shopping", "Auctions"], color: "bg-accent/10 text-accent",
    link: "https://tokshoplive.com", sortOrder: 2,
  },
  {
    id: 0, name: "MediCare",
    description: "Integrated hospital management system supporting patient registration, medical records, outpatient and inpatient care, billing, pharmacy, HR, and detailed clinical and administrative reporting.",
    icon: "Hospital", image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    tags: ["Healthcare", "EMR", "Billing", "HR"], color: "bg-red-100 text-red-700",
    link: null, sortOrder: 3,
  },
  {
    id: 0, name: "Shambakit",
    description: "AI-powered agricultural innovation that detects plant diseases, recommends treatments, locates suppliers, and provides disease mapping for farming communities.",
    icon: "Sprout", image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    tags: ["AI Detection", "Mapping"], color: "bg-green-100 text-green-700",
    link: null, sortOrder: 4,
  },
  {
    id: 0, name: "Pro Suite",
    description: "Kenya's all-in-one property management platform. Collect rent via M-Pesa, track arrears, manage tenants, handle land sales, and run hotel bookings — all from one dashboard.",
    icon: "Home", image: proSuiteImg,
    tags: ["Property", "M-Pesa", "Hospitality"], color: "bg-blue-100 text-blue-700",
    link: "https://pro-suite.co", sortOrder: 5,
  },
  {
    id: 0, name: "SunPay",
    description: "Accept M-Pesa payments in your app with one API key and one endpoint. SunPay sits between your app and Safaricom — handling auth, STK push, and webhooks so you don't have to.",
    icon: "CreditCard", image: sunpayImg,
    tags: ["M-Pesa", "Payments API", "STK Push"], color: "bg-primary/10 text-primary",
    link: "https://sunpay.co.ke", sortOrder: 6,
  },
];

export default function ProductsSection() {
  const { data: apiProducts } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const products = apiProducts && apiProducts.length > 0 ? apiProducts : defaultProducts;
  const sorted = [...products].sort((a, b) => {
    const aHasLink = a.link ? 1 : 0;
    const bHasLink = b.link ? 1 : 0;
    if (bHasLink !== aHasLink) return bHasLink - aHasLink;
    return a.sortOrder - b.sortOrder;
  });

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
          {sorted.map((product) => {
            const Icon = iconMap[product.icon] || ScanBarcode;
            return (
              <Card key={product.id || product.name} className="bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow group">
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
                  {product.link ? (
                    <a href={product.link} target="_blank" rel="noopener noreferrer" className="text-primary font-semibold group-hover:text-accent transition-colors flex items-center" data-testid={`link-product-${product.name}`}>
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  ) : (
                    <span className="text-gray-400 flex items-center" data-testid={`link-product-${product.name}`}>
                      Coming Soon <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
