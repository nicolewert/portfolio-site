import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendDailySummaryEmail } from '@/lib/emailTemplate'

// If you want to force Node.js runtime (uncomment below)
// export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get today's date range (UTC)
    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)

    // Fetch today's submissions
    const { data: submissions, error } = await supabaseAdmin
      .from('contact_submissions')
      .select('*')
      .gte('created_at', today.toISOString())
      .lt('created_at', tomorrow.toISOString())
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error fetching submissions:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // If no submissions, return early
    if (!submissions || submissions.length === 0) {
      return NextResponse.json({
        message: 'No submissions to process',
        count: 0,
      })
    }

    // Send email summary
    console.log(`[CRON] Found ${submissions.length} submissions`)
    const emailResult = await sendDailySummaryEmail(submissions)
    if (!emailResult.success) {
      console.error('[CRON] Email sending failed:', emailResult.error)
      return NextResponse.json(
        {
          error: 'Failed to send email',
          details: emailResult.error,
        },
        { status: 500 }
      )
    }
    console.log(`[CRON] Email sent with ID: ${emailResult.messageId}`)
    return NextResponse.json({
      message: 'Daily summary sent successfully',
      count: submissions.length,
      messageId: emailResult.messageId,
    })
  } catch (error) {
    console.error('[CRON] Cron job error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
