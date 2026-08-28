/**
 * Cloudflare Pages Function for /api/contact
 * Handles secure serverless contact form delivery to the administrator.
 */

interface ContactEnv {
  RESEND_API_KEY?: string;
  CONTACT_FROM_EMAIL?: string;
  ADMIN_EMAIL?: string;
  BREVO_API_KEY?: string;
  SENDGRID_API_KEY?: string;
  CONTACT_WEBHOOK_URL?: string;
  ENVIRONMENT?: string;
}

const DEFAULT_ADMIN_EMAIL = 'kingtouqeerali@gmail.com';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function onRequestPost(context: {
  request: Request;
  env: ContactEnv;
}): Promise<Response> {
  const { request, env } = context;

  // 1. Validate Content-Type
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return new Response(
      JSON.stringify({ success: false, error: 'Invalid content type. Expected application/json.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await request.json() as {
      name?: unknown;
      email?: unknown;
      subject?: unknown;
      message?: unknown;
      hp?: unknown;
    };

    // 2. Honeypot Anti-Spam Check
    if (body.hp && typeof body.hp === 'string' && body.hp.trim().length > 0) {
      // Silently accept bot submissions without processing to deceive spammers
      return new Response(
        JSON.stringify({ success: true, message: 'Message sent successfully.' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. Server-side Field Validation & Sanitization
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const subject = typeof body.subject === 'string' ? body.subject.trim() : 'General Inquiry';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (!name || name.length < 1 || name.length > 100) {
      return new Response(
        JSON.stringify({ success: false, error: 'Name must be between 1 and 100 characters.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || email.length > 150 || !emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Please provide a valid email address.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!subject || subject.length > 150) {
      return new Response(
        JSON.stringify({ success: false, error: 'Subject cannot exceed 150 characters.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!message || message.length < 5 || message.length > 5000) {
      return new Response(
        JSON.stringify({ success: false, error: 'Message must be between 5 and 5,000 characters.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 4. Construct Formatted Email Bodies
    const timestamp = new Date().toISOString();
    const adminRecipient = env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL;
    const fromEmail = env.CONTACT_FROM_EMAIL || 'Toolsbar Contact <onboarding@resend.dev>';
    const emailSubject = `[Toolsbar Contact] ${subject} from ${name}`;

    const textContent = `
[NEW CONTACT FORM SUBMISSION - TOOLSBAR]

Sender Name: ${name}
Sender Email: ${email}
Inquiry Topic: ${subject}
Submitted At: ${timestamp}
Source: Toolsbar Contact Form (https://toolsbar.site/contact)

--------------------------------------------------
MESSAGE:
--------------------------------------------------
${message}

--------------------------------------------------
Note: You can reply directly to this email to contact the visitor (${email}).
`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 24px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .header { background: #4f46e5; color: #ffffff; padding: 24px; text-align: left; }
    .header h1 { margin: 0 0 4px 0; font-size: 20px; font-weight: 700; }
    .header p { margin: 0; font-size: 13px; opacity: 0.9; }
    .content { padding: 24px; }
    .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .meta-table td { padding: 8px 12px; font-size: 14px; border-bottom: 1px solid #f1f5f9; }
    .meta-table td.label { font-weight: 600; color: #64748b; width: 30%; }
    .meta-table td.value { color: #0f172a; }
    .message-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 16px 0; white-space: pre-wrap; font-size: 14px; color: #334155; line-height: 1.6; }
    .footer { padding: 16px 24px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; }
    .badge { display: inline-block; padding: 3px 8px; border-radius: 9999px; background: #e0e7ff; color: #4338ca; font-size: 12px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Message from Toolsbar</h1>
      <p>Submitted via toolsbar.site/contact</p>
    </div>
    <div class="content">
      <table class="meta-table">
        <tr>
          <td class="label">From</td>
          <td class="value"><strong>${escapeHtml(name)}</strong> &lt;<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>&gt;</td>
        </tr>
        <tr>
          <td class="label">Topic</td>
          <td class="value"><span class="badge">${escapeHtml(subject)}</span></td>
        </tr>
        <tr>
          <td class="label">Submitted</td>
          <td class="value">${escapeHtml(timestamp)}</td>
        </tr>
      </table>

      <div style="font-size: 13px; font-weight: 600; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 20px;">
        Visitor Message:
      </div>
      <div class="message-box">${escapeHtml(message)}</div>
    </div>
    <div class="footer">
      This message was sent from the Toolsbar Contact Us form. You can reply directly to this email to reach <strong>${escapeHtml(email)}</strong>.
    </div>
  </div>
</body>
</html>
`;

    // 5. Delivery Logic across supported providers
    let delivered = false;
    let providerError = '';

    // Provider A: Resend (Recommended)
    if (env.RESEND_API_KEY) {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [adminRecipient],
            reply_to: email,
            subject: emailSubject,
            text: textContent,
            html: htmlContent,
          }),
        });

        if (res.ok) {
          delivered = true;
        } else {
          const errData = await res.json().catch(() => ({}));
          providerError = (errData as { message?: string }).message || `Resend HTTP ${res.status}`;
          console.error('[Cloudflare Contact Error] Resend failure:', providerError);
        }
      } catch (err) {
        providerError = err instanceof Error ? err.message : String(err);
        console.error('[Cloudflare Contact Error] Resend fetch exception:', providerError);
      }
    }

    // Provider B: Brevo / Sendinblue (Alternative)
    if (!delivered && env.BREVO_API_KEY) {
      try {
        const res = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'api-key': env.BREVO_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sender: { name: 'Toolsbar Contact', email: fromEmail.includes('<') ? fromEmail.split('<')[1].replace('>', '').trim() : fromEmail },
            to: [{ email: adminRecipient, name: 'Toolsbar Admin' }],
            replyTo: { email: email, name: name },
            subject: emailSubject,
            textContent: textContent,
            htmlContent: htmlContent,
          }),
        });

        if (res.ok) {
          delivered = true;
        } else {
          const errData = await res.json().catch(() => ({}));
          providerError = (errData as { message?: string }).message || `Brevo HTTP ${res.status}`;
          console.error('[Cloudflare Contact Error] Brevo failure:', providerError);
        }
      } catch (err) {
        providerError = err instanceof Error ? err.message : String(err);
        console.error('[Cloudflare Contact Error] Brevo fetch exception:', providerError);
      }
    }

    // Provider C: SendGrid (Alternative)
    if (!delivered && env.SENDGRID_API_KEY) {
      try {
        const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            personalizations: [{ to: [{ email: adminRecipient }] }],
            from: { email: fromEmail.includes('<') ? fromEmail.split('<')[1].replace('>', '').trim() : 'noreply@toolsbar.site', name: 'Toolsbar Contact' },
            reply_to: { email: email, name: name },
            subject: emailSubject,
            content: [
              { type: 'text/plain', value: textContent },
              { type: 'text/html', value: htmlContent },
            ],
          }),
        });

        if (res.ok) {
          delivered = true;
        } else {
          const errText = await res.text().catch(() => '');
          providerError = `SendGrid HTTP ${res.status}: ${errText}`;
          console.error('[Cloudflare Contact Error] SendGrid failure:', providerError);
        }
      } catch (err) {
        providerError = err instanceof Error ? err.message : String(err);
        console.error('[Cloudflare Contact Error] SendGrid fetch exception:', providerError);
      }
    }

    // Provider D: Custom Webhook (Alternative)
    if (!delivered && env.CONTACT_WEBHOOK_URL) {
      try {
        const res = await fetch(env.CONTACT_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            source: 'Toolsbar Contact Form',
            recipient: adminRecipient,
            sender: { name, email },
            subject,
            message,
            timestamp,
          }),
        });

        if (res.ok) {
          delivered = true;
        } else {
          providerError = `Webhook HTTP ${res.status}`;
        }
      } catch (err) {
        providerError = err instanceof Error ? err.message : String(err);
      }
    }

    // Handle Unconfigured / Error States
    if (!delivered) {
      const hasAnyConfig = Boolean(env.RESEND_API_KEY || env.BREVO_API_KEY || env.SENDGRID_API_KEY || env.CONTACT_WEBHOOK_URL);
      
      if (!hasAnyConfig) {
        console.warn('[Cloudflare Contact] No email delivery provider credentials configured.');
        return new Response(
          JSON.stringify({
            success: false,
            error: 'The email delivery service is currently being configured by the administrator. Please try again shortly or contact support.',
          }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          success: false,
          error: 'We encountered an issue sending your message. Please try again in a few moments.',
        }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 6. Return Clean Success Response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Thanks! Your message has been sent successfully.',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('[Cloudflare Contact Exception]:', err);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error processing your request.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
