import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Create transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4, // force IPv4
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'Mail Service' });
});

// Send verification email endpoint
app.post('/api/send-verification', async (req, res) => {
  const { toEmail, code, name } = req.body;
  const apiKey = req.headers['x-mail-api-key'];
  console.log(apiKey,process.env.MAIL_API_KEY);
  // Verify API Key to prevent unauthorized usage
  if (!apiKey || apiKey !== process.env.MAIL_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing API key' });
  }

  if (!toEmail || !code || !name) {
    return res.status(400).json({ error: 'Missing required fields: toEmail, code, name' });
  }

  try {
    const fromAddress = `"VibrantLink" <${process.env.SMTP_USER}>`; 
    
    const info = await transporter.sendMail({
      from: fromAddress,
      to: toEmail,
      subject: 'Verify your VibrantLink account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #000; border-radius: 12px; background-color: #f8f9fa;">
          <h2 style="color: #006d37; margin-bottom: 20px;">Welcome to VibrantLink, ${name}!</h2>
          <p style="font-size: 16px; color: #191c1d; line-height: 1.5;">
            Thank you for signing up. To complete your registration and secure your account, please use the verification code below:
          </p>
          <div style="background-color: #fff; padding: 20px; border: 2px solid #000; border-radius: 8px; text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #006d37;">${code}</span>
          </div>
          <p style="font-size: 14px; color: #5e5e5e; line-height: 1.5;">
            This code will expire in 15 minutes. If you did not create an account, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    console.log('Verification email sent successfully:', info.messageId);
    return res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Failed to send verification email via Nodemailer:', error.message);
    return res.status(500).json({ error: `Email delivery failed: ${error.message}` });
  }
});

// Send password reset email endpoint
app.post('/api/send-password-reset', async (req, res) => {
  const { toEmail, code, name } = req.body;
  const apiKey = req.headers['x-mail-api-key'];

  // Verify API Key to prevent unauthorized usage
  if (!apiKey || apiKey !== process.env.MAIL_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing API key' });
  }

  if (!toEmail || !code || !name) {
    return res.status(400).json({ error: 'Missing required fields: toEmail, code, name' });
  }

  try {
    const fromAddress = `"VibrantLink" <${process.env.SMTP_USER}>`; 
    
    const info = await transporter.sendMail({
      from: fromAddress,
      to: toEmail,
      subject: 'Reset your VibrantLink password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #000; border-radius: 12px; background-color: #f8f9fa;">
          <h2 style="color: #006d37; margin-bottom: 20px;">Password Reset Request</h2>
          <p style="font-size: 16px; color: #191c1d; line-height: 1.5;">
            Hi ${name}, we received a request to change the password for your VibrantLink account. Please use the verification code below to complete the process:
          </p>
          <div style="background-color: #fff; padding: 20px; border: 2px solid #000; border-radius: 8px; text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #006d37;">${code}</span>
          </div>
          <p style="font-size: 14px; color: #5e5e5e; line-height: 1.5;">
            This code will expire in 15 minutes. If you did not request this password change, you can safely ignore this email and your password will remain unchanged.
          </p>
        </div>
      `,
    });

    console.log('Password reset email sent successfully:', info.messageId);
    return res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Failed to send password reset email via Nodemailer:', error.message);
    return res.status(500).json({ error: `Email delivery failed: ${error.message}` });
  }
});

// Start local server if not running in serverless environment
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Mail Service running on port ${PORT}`);
  });
}

// Export for Vercel
export default app;
