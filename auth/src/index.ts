import "dotenv/config"
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { connectDB } from '../config/connect.js';
import { UserDev } from '../models/userModel.js';
import { Redis } from "ioredis";
import { cors } from "hono/cors";
import { generateOTP } from '../lib/generateOTP.js';
import axios from 'axios';
const app = new Hono()
const redis = new Redis({
  password:process.env.REDIS_PASS
});

app.use("*",cors());

app.post('/signup', async(c) => {
  const {email} = await c.req.json();
  if(!email){
    return c.json({message: 'all fields are required'}, 400);
  }
  const existUser = await UserDev.findOne({email});
  if(existUser){
    return c.json({message: 'user already exist,LOGIN'}, 400);
  }

  const otp = generateOTP();
  const emailSend = await axios.post("http://localhost:3000/send/email",{
    to:email,
    subject:"OTP",
    html:`your OTP is ${otp}`
  })

  const red = await redis.hset(email,{
    "otp":otp,
  });
  console.log(otp);
  return c.json({message: 'OTP sent to your email successfully'})
})

app.post("/otp",async(c)=>{
  const {email,password,name,otp} = await c.req.json();
  if(!email || !name || !password || !otp){
    return c.json({message: 'all fields are required'}, 400);
  }
  const redOTP = await redis.hget(email,"otp");

  if(redOTP == otp){
    const newUser = await new UserDev({
      email,
      password,
      name
    })
    newUser.save();
    return c.json({message:"user created"},200)
  }
  return c.json({message:"Please Enter Valid OTP"},400)
})

serve({
  fetch: app.fetch,
  port: 3001
}, async(info) => {
  await connectDB()
  console.log(`Server is running on http://localhost:${info.port}`)
})
