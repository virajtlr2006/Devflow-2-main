import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { ConnectDB } from '../config/db.js';
import { User } from '../schema/User.js';
import { generateOTP } from '../lib/generateOTP.js';
import axios from 'axios';
import { Redis } from 'ioredis'
import { cors } from 'hono/cors';

const app = new Hono()
// 🌐 allow cross-origin requests
app.use("*",cors())
// 🧠 redis client for OTP storage
const redis = new Redis();

// ✉️ sign-up: send OTP email
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
  return c.json({ message: "OTP sent to your email" })
})

// 🔐 OTP verification
app.post("/otp",async (c) => {
  const {email,name,password,otp} = await c.req.json()
  if(!email || !otp){
    return c.json({message:"All Fields Are reuired"})
  }
  const getOTP = await redis.hget(email , "otp")
  console.log(getOTP)
  if(getOTP == otp){
    const Create = await User.create({email,name,password})
    return c.json({message:"User Created Successfully"},201)
  }else{
    return c.json({message:"Please Enter Valid OTP"},400)
  }
})

// 🚀 start server
serve({
  fetch: app.fetch,
  port: 3030
}, async (info) => {
  await ConnectDB()
  console.log(`Server is running on http://localhost:${info.port}`)
})