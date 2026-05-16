import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { Resend } from 'resend';

const app = new Hono()
const resend = new Resend('re_RdHCRxWJ_FZHnz7MorBd7akcQZCGHQKTK');

const sendEmail = async(to:string,subject:string,html:string)=>{
   try {
      const email = await resend.emails.send({
         from:"Acme <onboarding@resend.dev>",
         to:[to],
         subject:subject,
         html:html
      })

      console.log(email);
   } catch (error) {
     console.error("Error sending email:", error);
   }
}

app.post("/send/email",async(c)=>{
   const {to,subject,html} = await c.req.json();
   await sendEmail(to,subject,html);
   return c.json({message:"Email sent successfully"})
})
serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})