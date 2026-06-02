import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Sends a verification code email to the user.
 * @param {string} toEmail - The user's email address
 * @param {string} code - The 6-digit verification code
 * @param {string} name - The user's name
 */
export const sendVerificationEmail = async (toEmail, code, name) => {
  try {
    const fromAddress = `"VibrantLink" <${process.env.SMTP_USER}>`; 
    
    // Fallback console log for development in case the email fails to send due to unverified domain
    console.log(`\n=========================================`);
    console.log(`🔒 VERIFICATION CODE FOR ${toEmail}: ${code}`);
    console.log(`=========================================\n`);

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
    return { success: true, data: info };
  } catch (error) {
    console.error('Failed to send verification email via Nodemailer:', error.message);
    // We throw the error so the calling function knows the email failed to dispatch
    throw new Error(`Email delivery failed: ${error.message}`);
  }
};
