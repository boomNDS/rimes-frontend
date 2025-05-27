import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const isAuth = await db.isAuthenticated(cookieStore);

    if (isAuth) {
      const user = await db.getUser(cookieStore);

      return NextResponse.json({
        isAuth: true,
        username: user?.username || user?.name || user?.email,
        user: {
          id: user?.id,
          username: user?.username || user?.name || user?.email,
          email: user?.email,
        },
      });
    }

    return NextResponse.json({
      isAuth: false,
      username: "",
      user: null,
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      {
        isAuth: false,
        username: "",
        user: null,
      },
      { status: 500 },
    );
  }
}
