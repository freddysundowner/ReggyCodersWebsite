import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User } from "lucide-react";
import type { BlogPost } from "@shared/schema";
import SeoHead from "@/components/seo-head";

export function BlogList() {
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <SeoHead pageKey="blog" />
      <header className="bg-primary text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/" className="text-blue-200 hover:text-white text-sm flex items-center gap-1 mb-4" data-testid="link-back-home">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <h1 className="text-4xl font-bold" data-testid="text-blog-heading">Blog</h1>
          <p className="text-blue-100 mt-2">Insights and updates from the Reggycodas team</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="text-center text-gray-500 py-12">Loading posts...</div>
        ) : posts && posts.length > 0 ? (
          <div className="grid gap-8">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {post.coverImage && (
                        <div className="md:w-64 flex-shrink-0">
                          <img src={post.coverImage} alt={post.title} className="w-full h-48 md:h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none" />
                        </div>
                      )}
                      <div className="p-6 flex-1">
                        <h2 className="text-xl font-bold text-gray-900 mb-2" data-testid={`text-blog-title-${post.id}`}>{post.title}</h2>
                        <p className="text-gray-600 mb-4">{post.excerpt}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1"><User className="h-3 w-3" /> {post.author}</span>
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No blog posts yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function BlogPostPage() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug;

  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: [`/api/blog/${slug}`],
    enabled: !!slug,
  });

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">Loading...</div>;
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Post Not Found</h1>
          <Link href="/blog" className="text-primary hover:underline">Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {post.coverImage && (
        <div className="w-full h-64 md:h-96 relative">
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/blog" className="text-primary hover:underline text-sm flex items-center gap-1 mb-6" data-testid="link-back-blog">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>

        <article>
          <h1 className="text-4xl font-bold text-gray-900 mb-4" data-testid="text-post-title">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b">
            <span className="flex items-center gap-1"><User className="h-4 w-4" /> {post.author}</span>
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap" data-testid="text-post-content">
            {post.content}
          </div>
        </article>
      </div>
    </div>
  );
}
