import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { posts } from "@/data/blog";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const Blog = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <SEO
        title="Shopify Growth Blog | Toofixitt — Best Premium Shopify Tools Marketplace"
        description="Guides, comparisons and playbooks from Toofixitt — the best premium Shopify tools marketplace. SEO, AI, conversion, and scale tips for serious merchants."
        path="/blog"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Toofixitt Blog",
          url: "https://toofixitt.lovable.app/blog",
          blogPost: posts.map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            url: `https://toofixitt.lovable.app/blog/${p.slug}`,
            datePublished: p.date,
            author: { "@type": "Organization", name: p.author },
          })),
        }}
      />
      <Navbar />
      <section className="gradient-hero border-b border-border py-20">
        <div className="container max-w-4xl text-center">
          <span className="mb-6 inline-block rounded-full border border-accent/40 bg-secondary/70 px-4 py-1.5 text-xs font-semibold text-accent shadow-card backdrop-blur-md">
            Toofixitt Blog
          </span>
          <h1 className="mb-6 text-4xl font-extrabold leading-tight md:text-5xl">
            The best premium <span className="text-gradient">Shopify tools marketplace</span> — and how to use it
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Playbooks, comparisons and real growth tactics for Shopify store owners who want to scale faster.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-5xl">
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((p) => (
              <Link
                key={p.slug}
                to={`/blog/${p.slug}`}
                className="group flex flex-col rounded-2xl border border-border bg-card/80 p-7 shadow-card backdrop-blur-md transition-all hover:-translate-y-1 hover:border-accent/60 hover:shadow-card-hover"
              >
                <div className="mb-4 flex flex-wrap gap-2">
                  {p.tags.slice(0, 2).map((t) => (
                    <span key={t} className="rounded-full border border-accent/30 bg-secondary/60 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                      {t}
                    </span>
                  ))}
                </div>
                <h2 className="mb-3 text-xl font-bold leading-tight group-hover:text-accent">{p.title}</h2>
                <p className="mb-5 flex-1 text-sm text-muted-foreground">{p.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(p.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{p.readTime}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-accent">Read <ArrowRight className="h-3 w-3" /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Blog;