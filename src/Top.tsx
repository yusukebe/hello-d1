import { jsx } from 'hono/jsx'
import { Layout } from './Layout'
import type { Post } from './types'

const Form = () => {
  return (
    <form action='/post' method='POST'>
      <label>
        Title:
        <input name='title' />
      </label>
      <label>
        Body:
        <textarea name='body' rows='5' cols='33'></textarea>
      </label>
      <input type='submit' />
    </form>
  )
}

export const Top = (props: { posts: Post[] }) => {
  return (
    <Layout>
      <h1>
        <a href='/'>Hello D1!</a>
      </h1>
      <Form />
      <hr />
      {props.posts.reverse().map((post) => {
        return (
          <article>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </article>
        )
      })}
    </Layout>
  )
}
