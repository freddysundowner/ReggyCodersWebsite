import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { ArrowLeft, ArrowUpRight, Calendar, User } from "lucide-react";
import type { BlogPost } from "@shared/schema";
import SeoHead from "@/components/seo-head";

const formatDate = (date: string | Date) =>
  new Date(date).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });

function SiteHeader({ backLabel = "Back to home", backHref = "/" }: { backLabel?: string; backHref?: string }) {
  return (
    <header className="border-b border-border bg-background">
      <div className="section-shell flex h-[76px] items-center justify-between">
        <Link href="/" className="flex items-center" aria-label="ReggyCodas home">
          <img src="/reggycodas-logo.png" alt="ReggyCodas — Where Solutions Count" className="h-10 w-auto" />
        </Link>
        <Link href={backHref} className="flex items-center gap-2 text-sm font-semibold text-foreground/65 transition-colors hover:text-accent">
          <ArrowLeft size={16} /> {backLabel}
        </Link>
      </div>
    </header>
  );
}

function PageFooter() {
  return (
    <footer className="border-t border-border bg-muted">
      <div className="section-shell flex flex-col gap-3 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex items-center"><img src="/reggycodas-logo.png" alt="ReggyCodas — Where Solutions Count" className="h-9 w-auto" /></Link>
        <span>Useful ideas from Nairobi, Kenya.</span>
      </div>
    </footer>
  );
}

export function BlogList() {
  const { data: posts, isLoading, isError, refetch } = useQuery<BlogPost[]>({ queryKey: ["/api/blog"] });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SeoHead pageKey="blog" />
      <SiteHeader />
      <main className="section-shell py-16 lg:py-24">
        <div className="max-w-3xl">
          <p className="eyebrow text-accent">ReggyCodas journal</p>
          <h1 className="display-type mt-4 text-4xl font-bold leading-tight text-primary md:text-5xl">Ideas for building better businesses.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">Practical thinking on software, operations and the people making technology useful across East Africa.</p>
        </div>
        <div className="mt-14 flex items-center justify-between border-b border-border pb-4">
          <p className="text-sm font-semibold text-primary">Latest articles</p>
          <p className="text-xs text-muted-foreground">{posts?.length ?? 0} {posts?.length === 1 ? "article" : "articles"}</p>
        </div>
        {isLoading ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => <div key={item} className="h-72 animate-pulse rounded-lg border border-border bg-muted" />)}
          </div>
        ) : isError ? (
          <div className="mt-8 rounded-lg border border-orange-200 bg-orange-50 px-6 py-10">
            <p className="font-bold text-primary">The articles are temporarily unavailable.</p>
            <p className="mt-2 text-sm text-muted-foreground">Please try again in a moment.</p>
            <button onClick={() => refetch()} className="mt-5 rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Try again</button>
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block rounded-lg border border-border bg-card p-3 transition-all hover:-translate-y-1 hover:shadow-lg">
                {post.coverImage && <div className="h-52 overflow-hidden rounded-md bg-muted"><img src={post.coverImage} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /></div>}
                <article className="p-4">
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><User size={13} /> {post.author}</span>
                    <span className="flex items-center gap-1"><Calendar size={13} /> {formatDate(post.createdAt)}</span>
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-4">
                    <h2 className="display-type text-2xl font-bold leading-tight text-primary transition-colors group-hover:text-accent" data-testid={`text-blog-title-${post.id}`}>{post.title}</h2>
                    <ArrowUpRight size={19} className="mt-1 shrink-0 text-accent transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
                  <span className="mt-5 inline-block text-sm font-bold text-accent">Read article</span>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-lg border border-dashed border-border py-20 text-center">
            <p className="display-type text-2xl font-bold text-primary">No articles yet.</p>
            <p className="mt-2 text-sm text-muted-foreground">The first article is still being written.</p>
          </div>
        )}
      </main>
      <PageFooter />
    </div>
  );
}

export function BlogPostPage() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug;
  const { data: post, isLoading, isError, refetch } = useQuery<BlogPost>({ queryKey: [`/api/blog/${slug}`], enabled: !!slug });

  if (isLoading) {
    return <div className="min-h-screen bg-background"><SiteHeader backLabel="All articles" backHref="/blog" /><main className="section-shell py-20"><div className="h-5 w-32 animate-pulse rounded bg-muted" /><div className="mt-8 h-14 max-w-3xl animate-pulse rounded bg-muted" /><div className="mt-5 h-4 max-w-sm animate-pulse rounded bg-muted" /></main></div>;
  }
  if (isError) {
    return <div className="min-h-screen bg-background"><SiteHeader backLabel="All articles" backHref="/blog" /><main className="section-shell py-24"><p className="eyebrow text-accent">A small interruption</p><h1 className="display-type mt-4 text-4xl font-bold text-primary">Could not load this article.</h1><button onClick={() => refetch()} className="mt-7 rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Try again</button></main></div>;
  }
  if (!post) {
    return <div className="min-h-screen bg-background"><SiteHeader backLabel="All articles" backHref="/blog" /><main className="section-shell py-24"><p className="eyebrow text-accent">404 / Article missing</p><h1 className="display-type mt-4 text-4xl font-bold text-primary">This article is no longer here.</h1><Link href="/blog" className="mt-7 inline-block rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Back to articles</Link></main></div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SeoHead pageKey="blog" override={{ title: `${post.title} | Reggycodas Blog`, description: post.excerpt || post.content.replace(/<[^>]+>/g, "").substring(0, 160), ogImage: post.coverImage }} />
      <SiteHeader backLabel="All articles" backHref="/blog" />
      <main className="section-shell py-16 lg:py-24">
        <div className="max-w-3xl">
          <p className="eyebrow text-accent">Journal / {formatDate(post.createdAt)}</p>
          <h1 className="display-type mt-5 text-4xl font-bold leading-tight text-primary md:text-5xl" data-testid="text-post-title">{post.title}</h1>
          <div className="mt-6 flex items-center gap-3 border-b border-border pb-7 text-xs text-muted-foreground"><span className="flex items-center gap-1"><User size={13} /> {post.author}</span><span className="h-1 w-1 rounded-full bg-accent" /><span>ReggyCodas journal</span></div>
        </div>
        {post.coverImage && <div className="mt-10 max-w-5xl overflow-hidden rounded-lg bg-muted"><img src={post.coverImage} alt={post.title} className="max-h-[30rem] h-auto w-full object-cover" /></div>}
        <article className="prose prose-slate mt-12 max-w-3xl break-words whitespace-pre-wrap text-base leading-8 text-foreground/80" data-testid="text-post-content">{post.content}</article>
      </main>
      <PageFooter />
    </div>
  );
}