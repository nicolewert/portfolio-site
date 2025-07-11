import { Resend } from 'resend'
import { ContactSubmission } from './supabase'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendDailySummaryEmail(submissions: ContactSubmission[]) {
  if (!submissions.length) {
    return { success: true, message: 'No submissions to send' }
  }

  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail) {
    throw new Error('ADMIN_EMAIL environment variable is required')
  }

  const subject = `Portfolio Contact Summary - ${submissions.length} new submission${submissions.length > 1 ? 's' : ''}`

  const htmlContent = `
    <h2>Daily Contact Form Summary</h2>
    <p>You received <strong>${submissions.length}</strong> new contact form submission${submissions.length > 1 ? 's' : ''} today.</p>
    
    ${submissions
      .map(
        (submission, index) => `
      <div style="border: 1px solid #e0e0e0; padding: 16px; margin: 16px 0; border-radius: 8px;">
        <h3>Submission #${index + 1}</h3>
        <p><strong>Name:</strong> ${submission.name}</p>
        <p><strong>Email:</strong> ${submission.email}</p>
        <p><strong>Message:</strong></p>
        <p style="background: #f5f5f5; padding: 12px; border-radius: 4px; white-space: pre-wrap;">${submission.message}</p>
        <p><strong>Received:</strong> ${new Date(submission.created_at!).toLocaleString()}</p>
      </div>
    `
      )
      .join('')}
    
    <hr style="margin: 24px 0;" />
    <p style="color: #666; font-size: 14px;">This is an automated summary from your portfolio contact form.</p>
  `

  const textContent = `
Daily Contact Form Summary

You received ${submissions.length} new contact form submission${submissions.length > 1 ? 's' : ''} today.

${submissions
  .map(
    (submission, index) => `
Submission #${index + 1}
Name: ${submission.name}
Email: ${submission.email}
Message: ${submission.message}
Received: ${new Date(submission.created_at!).toLocaleString()}

---
`
  )
  .join('')}

This is an automated summary from your portfolio contact form.
  `

  try {
    const result = await resend.emails.send({
      from: `Portfolio Contact <noreply@${process.env.DOMAIN}>`,
      to: adminEmail,
      subject,
      html: htmlContent,
      text: textContent,
    })

    return { success: true, messageId: result.data?.id }
  } catch (error) {
    console.error('Failed to send email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
