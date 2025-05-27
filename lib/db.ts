import PocketBase from "pocketbase";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export class DatabaseClient {
  client: PocketBase;

  constructor() {
    this.client = process.env.NEXT_PUBLIC_POCKETBASE_URL
      ? new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL)
      : new PocketBase("http://127.0.0.1:8090");
  }

  async authenticate(email: string, password: string) {
    try {
      const result = await this.client
        .collection("users")
        .authWithPassword(email, password, { fields: "username" });

      if (!result?.token) {
        throw new Error("Invalid email or password");
      }

      return result;
    } catch (err) {
      console.error("Authentication error:", err);
      throw new Error("Invalid email or password");
    }
  }

  async register(username: string, email: string, password: string) {
    try {
      const userData = {
        username,
        email,
        password,
        passwordConfirm: password,
      };

      await this.client.collection("users").create(userData);

      const authResult = await this.client
        .collection("users")
        .authWithPassword(email, password, { fields: "username" });

      if (!authResult?.token) {
        throw new Error("Registration succeeded but authentication failed");
      }

      return authResult;
    } catch (err: any) {
      console.error("Registration error:", err);
      if (err.data?.data?.username?.code === "validation_invalid_username") {
        throw new Error("Username is invalid or already taken");
      }
      if (err.data?.data?.email?.code === "validation_invalid_email") {
        throw new Error("Email is invalid or already registered");
      }
      throw new Error(err.message || "Unable to register user");
    }
  }

  async logout() {
    this.client.authStore.clear();
  }

  async isAuthenticated(cookieStore: ReadonlyRequestCookies) {
    const cookie = cookieStore.get("pb_auth");
    if (!cookie) {
      return false;
    }

    this.client.authStore.loadFromCookie(cookie.value);
    return this.client.authStore.isValid;
  }

  async getUser(cookieStore: ReadonlyRequestCookies) {
    const cookie = cookieStore.get("pb_auth");
    if (!cookie) {
      return null;
    }

    this.client.authStore.loadFromCookie(cookie.value);
    if (!this.client.authStore.isValid || !this.client.authStore.model?.id) {
      return null;
    }

    try {
      // Get the full user record from the users collection
      const user = await this.client
        .collection("users")
        .getOne(this.client.authStore.model.id);
      return user;
    } catch (err) {
      console.error("Error getting user:", err);
      return null;
    }
  }

  async getPosts() {
    return await this.client.collection("posts").getFullList({
      sort: "-created",
    });
  }

  async getPostById(id: string) {
    return await this.client.collection("posts").getOne(id);
  }

  async createPost(post: {
    title: string;
    content: string;
    category: string;
    author: string;
  }) {
    try {
      const result = await this.client.collection("posts").create({
        title: post.title,
        content: post.content,
        category: post.category,
        author: post.author,
        createdAt: new Date().toISOString(),
      });
      return result;
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  }
}

export const db = new DatabaseClient();
export default db;
