"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/navbar";
// import CreatePostDialog from "@/components/create-post-dialog"
// import BlogStats from "@/components/blog-stats"
// import { usePosts } from "@/hooks/use-api"
import type { BlogPost } from "@/lib/blog-data";
import { blogPosts } from "@/lib/blog-data";

export default function Home() {
  // const { posts, loading, error, createPost } = usePosts()
  const posts: BlogPost[] = blogPosts;
  const loading = false;
  const [showStats, setShowStats] = useState(false);

  const getTextPreview = (content: string) => {
    try {
      const parsed = JSON.parse(content);
      const firstParagraph = parsed.root?.children?.[0];
      const firstText = firstParagraph?.children?.[0];
      return firstText?.text || "No content";
    } catch {
      return `${content.substring(0, 150)} ...`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Blog Posts
            </h1>
            <p className="text-gray-600">
              Discover amazing stories and insights
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowStats(!showStats)}
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              {showStats ? "Hide Stats" : "Show Stats"}
            </Button>
            <Button
              // onClick={() => setIsCreateDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Post
            </Button>
          </div>
        </div>

        {/* {showStats && (
          <div className="mb-8">
            <BlogStats />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">Error: {error}</p>
          </div>
        )} */}

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={`card-${i + 1}`}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-6 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
              >
                <Link href={`/blog/${post.id}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{post.category}</Badge>
                      <span className="text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <CardTitle className="line-clamp-2 hover:text-blue-600 transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 line-clamp-3 mb-4">
                      {getTextPreview(post.content)}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        By {post.author}
                      </span>
                      <span className="text-sm text-blue-600 hover:text-blue-800">
                        Read more →
                      </span>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No posts yet
            </h3>
            <p className="text-gray-600 mb-4">
              Be the first to create a blog post!
            </p>
            {/* <Button onClick={() => setIsCreateDialogOpen(true)}> */}
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Post
            </Button>
          </div>
        )}
      </main>
      {/*
      <CreatePostDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreatePost={handleCreatePost}
      /> */}
    </div>
  );
}
