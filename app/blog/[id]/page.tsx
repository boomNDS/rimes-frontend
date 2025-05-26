"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/navbar";
import type { BlogPost } from "@/lib/blog-data";
import { useRouter } from "next/navigation";

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  // const { getPost } = usePosts();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getPost = (id: number) => {
    return {
      id: "1",
      title: "Getting Started with Next.js 15",
      content: `{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Next.js 15 brings exciting new features and improvements that make building web applications even more enjoyable and efficient.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"What's New in Next.js 15","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"heading","version":1,"tag":"h3"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"The latest version includes significant performance optimizations that make your applications faster and more responsive. The new compiler improvements reduce bundle sizes and improve build times.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`,
      author: "Sarah Johnson",
      category: "Technology",
      createdAt: "2024-01-15T10:00:00Z",
    };
  };

  useEffect(() => {
    const fetchPost = () => {
      try {
        setLoading(true);
        const postData = getPost(+id);
        setPost(postData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, getPost]);

  const renderContent = (content: string) => {
    try {
      const parsed = JSON.parse(content);
      // Extract text from the editor state for display
      const extractText = (node: any): string => {
        if (node.type === "text") {
          return node.text;
        }
        if (node.children) {
          return node.children.map(extractText).join("");
        }
        return "";
      };

      return parsed.root?.children?.map((child: any, index: number) => {
        const text = extractText(child);
        if (child.type === "heading") {
          const Tag = child.tag || "h2";
          return (
            <Tag key={index} className="text-2xl font-bold mb-4">
              {text}
            </Tag>
          );
        }
        return (
          <p key={index} className="mb-4 leading-relaxed">
            {text}
          </p>
        );
      });
    } catch {
      return <p className="whitespace-pre-wrap">{content}</p>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-8">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-10 w-32 mb-6" />
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center gap-4 mb-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-10 w-full mb-4" />
              <Skeleton className="h-6 w-3/4 mb-8" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 pt-24">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Post Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              {error || "The blog post you're looking for doesn't exist."}
            </p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>

          <article className="bg-white rounded-lg shadow-sm p-8">
            <header className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <Badge variant="secondary">{post.category}</Badge>
                <div className="flex items-center text-sm text-gray-500 gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {post.author}
                  </div>
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>
            </header>

            <div className="prose prose-lg max-w-none">
              <div className="text-gray-800 leading-relaxed">
                {renderContent(post.content)}
              </div>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
