import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { ConnectDB } from '../config/db.js';
import { User } from '../schema/User.js';

const app = new Hono()

app.post('/signup', async(c) => {
  const {name,email,password} = await c.req.json();
  console.log(name,email,password);
  const NewUser = await User.find({})
  return c.json({ message: NewUser })
})

serve({
  fetch: app.fetch,
  port: 3030
}, async (info) => {
  await ConnectDB()
  console.log(`Server is running on http://localhost:${info.port}`)
})