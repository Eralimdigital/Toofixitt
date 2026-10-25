import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { getPostBySlug, posts } from "@/data/blog";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import NotFound from "./NotFound";

const BlogPost = () => {
  const { slug = "" } = useParams();
  const post = getPostBySlug(slug);
  if (!post) return <NotFound />;

  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="flex min-h-screen flex-col">
      <SEO
        title={`${post.title} | Toofixitt`}
        description={post.description}
        path={`/blog/${post.slug}`}
        type="article"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            dateModified: post.date,
            author: { "@type": "Organization", name: post.author },
            publisher: {
              "@type": "Organization",
              name: "Toofixitt",
              url: "https://toolfixit.lovable.app/",
            },
            mainEntityOfPage: `https://toolfixit.lovable.app/blog/${post.slug}`,
            keywords: post.tags.join(", "),
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://toolfixit.lovable.app/" },
              { "@type": "ListItem", position: 2, name: "Blog", item: "https://toolfixit.lovable.app/blog" },
              { "@type": "ListItem", position: 3, name: post.title, item: `https://toolfixit.lovable.app/blog/${post.slug}` },
            ],
          },
        ]}
      />
      <Navbar />
      <article className="py-16">
        <div className="container max-w-3xl">
          <Link to="/blog" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to blog
          </Link>
          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <span key={t} className="rounded-full border border-accent/30 bg-secondary/60 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                {t}
              </span>
            ))}
          </div>
          <h1 className="mb-4 text-3xl font-extrabold leading-tight md:text-4xl">{post.title}</h1>
          <div className="mb-10 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(post.date).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}</span>
            <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{post.readTime}</span>
            <span>By {post.author}</span>
          </div>
          <div className="prose prose-invert max-w-none prose-headings:font-bold prose-h1:hidden prose-h2:mt-10 prose-h2:text-2xl prose-h3:text-xl prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-table:text-sm">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          <div className="mt-16 rounded-2xl border border-border gradient-primary p-8 text-center shadow-card">
            <h3 className="mb-2 text-xl font-bold text-primary-foreground">Ready to scale your Shopify store?</h3>
            <p className="mb-5 text-sm text-primary-foreground/85">Browse 40+ premium Shopify tools trusted by 12,000+ stores.</p>
            <Link to="/tools" className="inline-block rounded-lg bg-background px-7 py-3 text-sm font-semibold text-foreground shadow-card transition-all hover:-translate-y-0.5">
              Browse Tools
            </Link>
          </div>

          {related.length > 0 && (
            <div className="mt-16">
              <h3 className="mb-6 text-lg font-bold">Keep reading</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {related.map((r) => (
                  <Link key={r.slug} to={`/blog/${r.slug}`} className="rounded-2xl border border-border bg-card/80 p-5 shadow-card transition-all hover:-translate-y-1 hover:border-accent/60">
                    <h4 className="mb-2 text-base font-semibold">{r.title}</h4>
                    <p className="text-xs text-muted-foreground">{r.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
      <Footer />
    </div>
  );
};

export default BlogPost;