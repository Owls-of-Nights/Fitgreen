import Mailjet from "node-mailjet"

if (!process.env.MAILJET_API_KEY || !process.env.MAILJET_SECRET_KEY) {
  throw new Error('Invalid/Missing environment variable: "MAILJET_API_KEY" or "MAILJET_SECRET_KEY"')
}

const mailjet = new Mailjet({
  apiKey: process.env.MAILJET_API_KEY,
  apiSecret: process.env.MAILJET_SECRET_KEY,
})

export async function sendEmail(
  to: string,
  subject: string,
  textContent: string,
  htmlContent: string
) {
  try {
    await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: process.env.MAILJET_SENDER_EMAIL,
            Name: "FitGreen"
          },
          To: [{ Email: to }],
          Subject: subject,
          TextPart: textContent,
          HTMLPart: htmlContent
        }
      ]
    })
  } catch (error) {
    console.error('Email sending failed:', error)
    throw error
  }
}

