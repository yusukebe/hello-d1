import { Hono } from "hono";
import { jsx } from "hono/jsx";
import type { Database } from "@cloudflare/d1";
import { Top } from "./Top";
import type { Post } from "./Top";

interface Env {
  DB: Database;
}

const app = new Hono<Env>();

app.get("/", async (c) => {
  const response = await c.env.DB.prepare(
    `SELECT id,title,body FROM post`
  ).all();
  const posts: Array<Post> = response.results;
  return c.html(<Top posts={posts} />);
});

app.post("/post", async (c) => {
  const { title, body } = await c.req.parseBody();
  if (title && body) {
    await c.env.DB.prepare(`INSERT INTO post(title, body) VALUES(?, ?);`)
      .bind(title, body)
      .run();
  }
  return c.redirect("/");
});

export default app;
