// 📦 Import dependencies
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors';
import { Resend } from 'resend';

// 🚀 Initialize app and email service
const app = new Hono()
app.use("*",cors())

const resend = new Resend('re_GHnpRomQ_PFQ6ezbbcKQe483azSPezzLE');

// 📧 Function to send emails
const sendEmail = async (to: string,subject: string,html: string) => {
  try {
    // ✉️ Send email via Resend API
    const email = await resend.emails.send({
      from:"Acme <onboarding@resend.dev>",
      to: [to],
      subject: subject,
      html: html
    });
    // ✅ Log success response
    console.log(email);
  } catch (error) {
    // ❌ Log any errors
    console.error(error);
  }
};

// 🔗 POST endpoint to send email
app.post('/email/send', async (c) => {
  const { to, subject, html } = await c.req.json();
  await sendEmail(to, subject, html);
  return c.json({ message: 'Email sent successfully!' })
})

// 🎯 Start server on port 3000
serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
