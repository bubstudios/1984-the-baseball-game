import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const { feedbackType, message } = await req.json();

    if (!message || !message.trim()) {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

    const subject = feedbackType === 'bug'
      ? '🐞 Bug Report - 1984 Baseball'
      : '💬 Feedback - 1984 Baseball';

    const body = [
      `Type: ${feedbackType === 'bug' ? 'Bug Report' : 'Feedback'}`,
      '',
      'Message:',
      message.trim(),
      '',
      `Submitted: ${new Date().toISOString()}`,
    ].join('\n');

    await base44.integrations.Core.SendEmail({
      to: 'McKeecmatt@gmail.com',
      subject,
      body,
      from_name: '1984 Baseball Feedback',
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('sendFeedback error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});