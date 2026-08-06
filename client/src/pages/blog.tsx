import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { ArrowLeft, ArrowUpRight, Calendar, User } from "lucide-react";
import type { BlogPost } from "@shared/schema";
import SeoHead from "@/components/seo-head";

const formatDate = (date: string | Date) =>
  new Date(date).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });

function JournalMark() {
  return <Link href="/" className="flex items-center gap-3 text-primary" aria-label="ReggyCodas home">
    <span className="grid h-9 w-9 place-items-center bg-accent text-lg font-bold text-accent-foreground display-type skew-x-[-8deg]">R</span>
    <span className="display-type text-xl font-bold tracking-tight"><span>Reggy</span><span className="text-accent">Codas</span></span>
  </Link>;
}

export function BlogList() {
  const { data: posts, isLoading, isError, refetch } = useQuery<BlogPost[]>({ queryKey: ["/api/blog"] });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SeoHead pageKey="blog" />
      <header className="relative overflow-hidden border-b border-border bg-background text-primary">
        <div className="absolute right-0 top-0 hidden h-full w-1/3 border-l border-primary/10 lg:block" />
        <div className="mx-auto max-w-7xl px-5 pb-20 pt-7 lg:px-10 lg:pb-28">
          <div className="flex items-center justify-between">
            <JournalMark />
            <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-primary/70 transition-colors hover:text-accent" data-testid="link-back-home">
              <ArrowLeft size={16} /> Back to studio
            </Link>
          </div>
          <div className="relative z-10 mt-24 max-w-4xl">
            <p className="eyebrow text-accent">ReggyCodas / Journal</p>
            <h1 className="display-type mt-6 text-7xl font-bold leading-[.9] sm:text-8xl lg:text-[9.5rem]" data-testid="text-blog-heading">
              Notes<br /><span className="text-accent">from</span><br />the work<span className="text-accent">.</span>
            </h1>
            <p className="mt-10 max-w-md text-base leading-7 text-primary-foreground/65">
              Thinking on products, people and the practical business of making technology useful in East Africa.
            </p>
          </div>
          <div className="absolute bottom-8 right-10 hidden text-right lg:block">
            <p className="eyebrow text-primary/40">Field notes</p>
            <p className="mono-type mt-2 text-xs text-accent">NBO / 01°17′S</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-16 lg:px-10 lg:py-24">
        <div className="mb-10 flex items-center justify-between border-b border-border pb-5">
          <p className="eyebrow text-accent">Latest dispatches</p>
          <p className="mono-type text-[10px] text-muted-foreground">{posts?.length ?? 0} entries</p>
        </div>
        {isLoading ? (
          <div className="grid gap-5 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => <div key={item} className="h-72 animate-pulse border border-border bg-muted" />)}
          </div>
        ) : isError ? (
          <div className="border border-accent/40 bg-accent/5 px-6 py-10">
            <p className="display-type text-2xl font-bold">The notes are out of reach.</p>
            <p className="mt-2 text-sm text-muted-foreground">Something went wrong while loading the journal.</p>
            <button onClick={() => refetch()} className="mt-6 border-b border-primary pb-1 text-sm font-bold text-primary">Try again</button>
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid gap-x-6 gap-y-12 md:grid-cols-2">
            {posts.map((post, index) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className={`group block ${index === 0 ? "md:col-span-2" : ""}`}>
                <article className="grid h-full border-t border-primary pt-4 md:grid-cols-[auto_1fr] md:gap-8">
                  <div className="mb-5 flex items-start justify-between md:mb-0 md:block">
                    <span className="mono-type text-xs text-accent">0{index + 1}</span>
                    <ArrowUpRight className="text-primary transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 md:mt-24" size={20} />
                  </div>
                  <div>
                    {post.coverImage && (
                      <div className={`mb-6 overflow-hidden bg-muted ${index === 0 ? "h-72 md:h-[27rem]" : "h-52"}`}>
                        <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0" />
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-muted-foreground">
                      <span className="mono-type flex items-center gap-1 uppercase"><User size={12} /> {post.author}</span>
                      <span className="mono-type flex items-center gap-1 uppercase"><Calendar size={12} /> {formatDate(post.createdAt)}</span>
                    </div>
                    <h2 className={`display-type mt-4 font-bold leading-tight text-primary transition-colors group-hover:text-accent ${index === 0 ? "text-4xl md:text-6xl" : "text-3xl"}`} data-testid={`text-blog-title-${post.id}`}>{post.title}</h2>
                    <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="border-y border-border py-24 text-center">
            <p className="display-type text-3xl font-bold text-primary">No notes yet<span className="text-accent">.</span></p>
            <p className="mt-3 text-sm text-muted-foreground">The first dispatch is still being written.</p>
          </div>
        )}
      </main>
      <footer className="border-t border-border bg-background px-5 py-8 text-primary lg:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between text-xs text-muted-foreground"><JournalMark /><span>Made with care in Kenya.</span></div>
      </footer>
    </div>
  );
}

export function BlogPostPage() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug;
  const { data: post, isLoading, isError, refetch } = useQuery<BlogPost>({ queryKey: [`/api/blog/${slug}`], enabled: !!slug });

  if (isLoading) {
    return <div className="min-h-screen bg-background px-5 py-8"><div className="mx-auto max-w-4xl"><div className="h-5 w-32 animate-pulse bg-muted" /><div className="mt-28 h-20 w-3/4 animate-pulse bg-muted" /><div className="mt-8 h-4 w-1/2 animate-pulse bg-muted" /></div></div>;
  }
  if (isError) {
    return <div className="grid min-h-screen place-items-center bg-background px-5 text-center"><div><p className="eyebrow text-accent">A small interruption</p><h1 className="display-type mt-4 text-4xl font-bold">Couldn’t load this note.</h1><button onClick={() => refetch()} className="mt-7 border-b border-primary pb-1 text-sm font-bold text-primary">Try again</button></div></div>;
  }
  if (!post) {
    return <div className="grid min-h-screen place-items-center bg-background px-5 text-center"><div><p className="eyebrow text-accent">404 / Note missing</p><h1 className="display-type mt-4 text-5xl font-bold text-primary">This note moved on<span className="text-accent">.</span></h1><Link href="/blog" className="mt-7 inline-block border-b border-primary pb-1 text-sm font-bold text-primary">Back to the journal</Link></div></div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SeoHead
        pageKey="blog"
        override={{
          title: `${post.title} | Reggycodas Blog`,
          description: post.excerpt || post.content.replace(/<[^>]+>/g, "").substring(0, 160),
          ogImage: post.coverImage,
        }}
      />
      <header className="border-b border-border px-5 py-7 lg:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <JournalMark />
          <Link href="/blog" className="flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-accent" data-testid="link-back-blog"><ArrowLeft size={16} /> All notes</Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 pb-24 pt-16 lg:px-10 lg:pt-24">
        <div className="max-w-4xl">
          <p className="eyebrow text-accent">Journal / {formatDate(post.createdAt)}</p>
          <h1 className="display-type mt-7 text-5xl font-bold leading-[.95] text-primary md:text-8xl" data-testid="text-post-title">{post.title}</h1>
          <div className="mt-8 flex items-center gap-3 border-b border-border pb-8 text-xs text-muted-foreground"><span className="mono-type uppercase">Words by {post.author}</span><span className="h-1 w-1 bg-accent" /><span className="mono-type uppercase">Reggycodas field note</span></div>
        </div>
        {post.coverImage && <div className="mt-12 h-72 overflow-hidden bg-muted md:h-[30rem]"><img src={post.coverImage} alt={post.title} className="h-full w-full object-cover grayscale-[30%]" /></div>}
        <article className="mt-14 max-w-3xl whitespace-pre-wrap text-lg leading-8 text-foreground/80 md:ml-24" data-testid="text-post-content">{post.content}</article>
      </main>
       <footer className="border-t border-border bg-background px-5 py-8 text-primary lg:px-10"><div className="mx-auto flex max-w-7xl items-center justify-between text-xs text-muted-foreground"><JournalMark /><Link href="/blog" className="hover:text-accent">Read more notes →</Link></div></footer>
    </div>
  );
}