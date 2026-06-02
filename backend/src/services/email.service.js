import dotenv from 'dotenv';
dotenv.config();

/**
 * Sends a verification code email to the user.
 * @param {string} toEmail - The user's email address
 * @param {string} code - The 6-digit verification code
 * @param {string} name - The user's name
 */
export const sendVerificationEmail = async (toEmail, code, name) => {
  try {
    const mailServiceUrl = process.env.MAIL_SERVICE_URL || 'http://localhost:5001';
    
    console.log(`\n=========================================`);
    console.log(`🔒 Dispatching email to mail-service for: ${toEmail}`);
    console.log(`=========================================\n`);

    const response = await fetch(`${mailServiceUrl}/api/send-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-mail-api-key': process.env.MAIL_API_KEY
      },
      body: JSON.stringify({ toEmail, code, name })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send email via mail-service');
    }

    const data = await response.json();
    console.log('Verification email sent successfully via microservice:', data.messageId);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send verification email via mail-service:', error.message);
    throw new Error(`Email delivery failed: ${error.message}`);
  }
};
