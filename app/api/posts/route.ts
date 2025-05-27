import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      try {
        const post = await db.getPostById(id);
        return NextResponse.json(post);
      } catch (error) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }
    }

    const posts = await db.getPosts();
    return NextResponse.json(posts);
  } catch (error: any) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch posts" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const isAuth = await db.isAuthenticated(cookieStore);

    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await request.json();
    const user = await db.getUser(cookieStore);

    if (!post.title || !post.content || !post.category || !post.author) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const result = await db.createPost(post, user.token);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Create post error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create post" },
      { status: 500 },
    );
  }
}
