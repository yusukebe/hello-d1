import { Hono } from 'hono'
import { jsx } from 'hono/jsx'
import { validator } from 'hono/validator'
import { Top } from './Top'
import type { Post } from './types'

interface Env {
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
  validator(
    (v) => ({
      title: v.body('title').isRequired(),
      body: v.body('body').isRequired(),
    }),
    {
      done: (res, c) => {
        if (res.hasError) {
          return c.redirect('/')
        }
      },
    }
  ),
  async (c) => {
    const { title, body } = c.req.valid()
    await c.env.DB.prepare(`INSERT INTO post(title, body) VALUES(?, ?);`)
      .bind(title, body)
      .run()
    return c.redirect('/')
  }
)

export default app
