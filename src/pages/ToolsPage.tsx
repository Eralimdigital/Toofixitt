import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToolCard from "@/components/ToolCard";
import { tools } from "@/data/tools";

const ToolsPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <section className="py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h1 className="mb-3 text-4xl font-extrabold text-foreground">All Shopify Tools</h1>
            <p className="text-lg text-muted-foreground">
              Browse our complete collection of premium Shopify tools
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ToolsPage;
