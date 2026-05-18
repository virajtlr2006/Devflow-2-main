import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { ConnectDB } from '../config/db.js';
import { User } from '../schema/User.js';
import { generateOTP } from '../lib/generateOTP.js';
import axios from 'axios';
import { Redis } from 'ioredis'

const app = new Hono()
const redis = new Redis();

app.post('/signup', async (c) => {
  const { name, email, password } = await c.req.json();
  if (!name || !email || !password) {
    return c.json({ message: "Enter all required field" })
  }
  const CheckUser = await User.find({ email })
  if (CheckUser.length > 0) {
    return c.json({ message: "Please Login " })
  }
  const otp = generateOTP()
  const sendEmail = await axios.post("http://localhost:3000/email/send", {
    to: email,
    subject: "Your OTP, don't share this OTP with anyone",
    html: `Your OTP for signup is ${otp}`
  })
  const res1 = await redis.hset(
    email,
    {
      "otp":otp
    }
  )
  console.log(res1)
  return c.json({ message: CheckUser })
})

serve({
  fetch: app.fetch,
  port: 3030
}, async (info) => {
  await ConnectDB()
  console.log(`Server is running on http://localhost:${info.port}`)
})