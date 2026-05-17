import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

app.post('/signup', async(c) => {
  const {name,email,password} = await c.req.json();
  console.log(name,email,password);
  return c.json({ message: 'User registered successfully!' })
})

serve({
  fetch: app.fetch,
  port: 3001
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
