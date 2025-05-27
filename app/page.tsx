"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, BarChart3, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/navbar";
import type { BlogPost } from "@/lib/blog-data";
import { blogPosts } from "@/lib/blog-data";
import CreatePostDialog from "@/components/create-post-dialog";

interface LetterStats {
  counts: {
    r: number;
    i: number;
    m: number;
    e: number;
    s: number;
    total: number;
  };
  percentages: {
    r: string;
    i: string;
    m: string;
    e: string;
    s: string;
  };
  totalPosts: number;
}

export default function Home() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState<LetterStats | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [loadingStats, setLoadingStats] = useState(false);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        // If no posts found, use mock data
        setPosts(blogPosts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      // Use mock data on error
      setPosts(blogPosts);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const response = await fetch('/api/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();
        setIsLoggedIn(data.isAuth);
        setUsername(data.username || "");
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsLoggedIn(false);
        setUsername("");
      }
    };
    checkAuth();
    fetchPosts();
  }, []);

  useEffect(() => {
    if (showStats) {
      fetchStats();
    }
  }, [showStats]);

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

  const handleCreatePost = async (post: Omit<BlogPost, "id" | "createdAt">) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      // Close dialog and refresh posts
      setIsCreateDialogOpen(false);
      await fetchPosts(); // Refresh the posts list
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isLoggedIn={isLoggedIn} username={username} />

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
              variant={showStats ? "default" : "outline"}
              onClick={() => setShowStats(!showStats)}
              className="flex items-center gap-2 transition-colors"
              disabled={loadingStats}
            >
              {loadingStats ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <BarChart3 className="h-4 w-4" />
              )}
              {showStats ? "Hide Stats" : "Show Stats"}
            </Button>
            {isLoggedIn ? (
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Post
              </Button>
            ) : (
              <Link href="/login">
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Login to Create Post
                </Button>
              </Link>
            )}
          </div>
        </div>

        {showStats && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Letter Frequency Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingStats ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : stats ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {Object.entries(stats.percentages).map(([letter, percentage]) => (
                      <div key={letter} className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                          {letter.toUpperCase()}
                        </div>
                        <div className="text-sm text-gray-600">
                          {percentage}%
                        </div>
                        <div className="text-xs text-gray-500">
                          Count: {stats.counts[letter as keyof typeof stats.counts]}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    Total characters analyzed: {stats.counts.total}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Failed to load stats. Please try again.
                </div>
              )}
            </CardContent>
          </Card>
        )}

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
            {isLoggedIn ? (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Post
              </Button>
            ) : (
              <Link href="/login">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Login to Create Post
                </Button>
              </Link>
            )}
          </div>
        )}

        <CreatePostDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onCreatePost={handleCreatePost}
          isLoggedIn={isLoggedIn}
          username={username}
        />
      </main>
    </div>
  );
}
