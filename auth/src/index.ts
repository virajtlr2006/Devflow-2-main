import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

app.post('/signup', async(c) => {
  const {email,username,password} = await c.req.json();
  console.log(email,username,password)
  return c.json({message: 'Signup successful'})
})

serve({
  fetch: app.fetch,
  port: 3001
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
