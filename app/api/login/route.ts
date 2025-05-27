import db from "@/lib/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const { email, password } = await request.json();
    const result = await db.authenticate(email, password);
    const { record, token } = result;
    record.token = token;
    cookieStore.set("pb_auth", db.client.authStore.exportToCookie({}));

    return NextResponse.json(record);
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || err.toString() }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
