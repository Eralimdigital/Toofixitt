import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import { CartProvider } from "./contexts/CartContext";

// Route-level code splitting: only the landing page ships in the initial bundle.
const ToolsPage = lazy(() => import("./pages/ToolsPage.tsx"));
const ToolDetailPage = lazy(() => import("./pages/ToolDetailPage.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const Privacy = lazy(() => import("./pages/Privacy.tsx"));
const Terms = lazy(() => import("./pages/Terms.tsx"));
const Refund = lazy(() => import("./pages/Refund.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const Cart = lazy(() => import("./pages/Cart.tsx"));
const Blog = lazy(() => import("./pages/Blog.tsx"));
const BlogPost = lazy(() => import("./pages/BlogPost.tsx"));
const Activate = lazy(() => import("./pages/Activate.tsx"));

// Non-critical UI: loaded after the page is interactive.
const Toaster = lazy(() => import("@/components/ui/toaster").then((m) => ({ default: m.Toaster })));
const ChatbotWidget = lazy(() => import("./components/ChatbotWidget"));
const PurchaseNotifications = lazy(() => import("./components/PurchaseNotifications"));
const SoundSettings = lazy(() => import("./components/SoundSettings"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/tools" element={<ToolsPage />} />
              <Route path="/tools/:slug" element={<ToolDetailPage />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/activate" element={<Activate />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/refund" element={<Refund />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Suspense fallback={null}>
            <Toaster />
            <ChatbotWidget />
            <PurchaseNotifications />
            <SoundSettings />
          </Suspense>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
