import { Hono } from 'hono'
import { jsx } from 'hono/jsx'
import { validation } from '@honojs/validator'
import type { Database } from '@cloudflare/d1'
import { Top } from './Top'
import type { Post } from './type'

interface Env {
  DB: Database
}

const app = new Hono<Env>()

app.get('/', async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT id,title,body FROM post;`
  ).all()
  const posts: Array<Post> = results
  return c.html(<Top posts={posts} />)
})

app.post(
  '/post',
  validation((v) => ({
    body: {
      title: [v.required],
      body: [v.required],
    },
    done: (res, c) => {
      if (res.hasError) {
        return c.redirect('/')
      }
    },
  }))
)

app.post('/post', async (c) => {
  const { title, body } = (await c.req.parseBody()) as Post
  await c.env.DB.prepare(`INSERT INTO post(title, body) VALUES(?, ?);`)
    .bind(title, body)
    .run()
  return c.redirect('/')
})

export default app
