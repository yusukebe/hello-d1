import app from '../src/index'

describe('Test endpoints', () => {
  it('Should return 200 Response', async () => {
    const res = await app.request('http://localhost/hello')
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('Hello!')
  })
})
