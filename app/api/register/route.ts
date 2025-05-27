import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();
    const result = await db.register(username, email, password);
    const cookieStore = await cookies();

    cookieStore.set("pb_auth", db.client.authStore.exportToCookie(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json({
      token: result.token,
      user: {
        id: result.record.id,
        username: result.record.username,
        email: result.record.email,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || err.toString() },
      { status: 500 },
    );
  }
}
