import { NextResponse } from "next/server";
import db from "@/lib/db";

interface LetterStats {
  r: number;
  i: number;
  m: number;
  e: number;
  s: number;
  total: number;
}

export async function GET() {
  try {
    const posts = await db.getPosts();

    const letterStats: LetterStats = {
      r: 0,
      i: 0,
      m: 0,
      e: 0,
      s: 0,
      total: 0,
    };

    for (const post of posts) {
      const content = post.content.toLowerCase();
      letterStats.r += (content.match(/r/g) || []).length;
      letterStats.i += (content.match(/i/g) || []).length;
      letterStats.m += (content.match(/m/g) || []).length;
      letterStats.e += (content.match(/e/g) || []).length;
      letterStats.s += (content.match(/s/g) || []).length;
      letterStats.total += content.length;
    }

    const percentages = {
      r: ((letterStats.r / letterStats.total) * 100).toFixed(2),
      i: ((letterStats.i / letterStats.total) * 100).toFixed(2),
      m: ((letterStats.m / letterStats.total) * 100).toFixed(2),
      e: ((letterStats.e / letterStats.total) * 100).toFixed(2),
      s: ((letterStats.s / letterStats.total) * 100).toFixed(2),
    };

    return NextResponse.json({
      success: true,
      data: {
        counts: letterStats,
        percentages,
        totalPosts: posts.length,
      },
    });
  } catch (error) {
    console.error("Error calculating stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 },
    );
  }
}
