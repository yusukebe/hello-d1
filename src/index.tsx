import { Hono } from 'hono'
import { jsx } from 'hono/jsx'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { Top } from './Top'
import type { Post } from './types'

type Env = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Env }>()

app.get('/', async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT id,title,body FROM post;`
  ).all<Post>()
  const posts = results
  return c.html(<Top posts={posts} />)
})

app.post(
  '/post',
  zValidator(
    'form',
    z.object({
      title: z.string().min(1),
      body: z.string().min(1),
    }),
    (res, c) => {
      if (!res.success) {
        return c.redirect('/')
      }
    }
  ),
  async (c) => {
    const { title, body } = c.req.valid('form')
    await c.env.DB.prepare(`INSERT INTO post(title, body) VALUES(?, ?);`)
      .bind(title, body)
      .run()
    return c.redirect('/')
  }
)

app.get('/hello', (c) => c.text('Hello!'))

export default app
