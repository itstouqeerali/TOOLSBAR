import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';

function contactApiPlugin(): Plugin {
  return {
    name: 'contact-api-dev-handler',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/contact' && req.method === 'POST') {
          let bodyStr = '';
          req.on('data', (chunk) => {
            bodyStr += chunk;
          });
          req.on('end', async () => {
            try {
              const body = JSON.parse(bodyStr || '{}');

              // 1. Honeypot check
              if (body.hp && typeof body.hp === 'string' && body.hp.trim().length > 0) {
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 200;
                res.end(JSON.stringify({ success: true, message: 'Message sent successfully.' }));
                return;
              }

              // 2. Validate
              const name = typeof body.name === 'string' ? body.name.trim() : '';
              const email = typeof body.email === 'string' ? body.email.trim() : '';
              const subject = typeof body.subject === 'string' ? body.subject.trim() : 'General Inquiry';
              const message = typeof body.message === 'string' ? body.message.trim() : '';

              if (!name || name.length < 1 || name.length > 100) {
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 400;
                res.end(JSON.stringify({ success: false, error: 'Name must be between 1 and 100 characters.' }));
                return;
              }

              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!email || email.length > 150 || !emailRegex.test(email)) {
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 400;
                res.end(JSON.stringify({ success: false, error: 'Please provide a valid email address.' }));
                return;
              }

              if (!message || message.length < 5 || message.length > 5000) {
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 400;
                res.end(JSON.stringify({ success: false, error: 'Message must be between 5 and 5,000 characters.' }));
                return;
              }

              const adminRecipient = process.env.ADMIN_EMAIL || 'kingtouqeerali@gmail.com';
              const fromEmail = process.env.CONTACT_FROM_EMAIL || 'Toolsbar Contact <onboarding@resend.dev>';
              const resendApiKey = process.env.RESEND_API_KEY;

              if (resendApiKey) {
                const response = await fetch('https://api.resend.com/emails', {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${resendApiKey}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    from: fromEmail,
                    to: [adminRecipient],
                    reply_to: email,
                    subject: `[Toolsbar Contact] ${subject} from ${name}`,
                    text: `From: ${name} <${email}>\nTopic: ${subject}\n\nMessage:\n${message}`,
                    html: `<h3>New Contact Message</h3><p><strong>From:</strong> ${name} &lt;${email}&gt;</p><p><strong>Topic:</strong> ${subject}</p><p><strong>Message:</strong><br/>${message.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`,
                  }),
                });

                if (!response.ok) {
                  const errData = await response.json().catch(() => ({}));
                  console.error('[Dev Contact] Resend error:', errData);
                  res.setHeader('Content-Type', 'application/json');
                  res.statusCode = 502;
                  res.end(JSON.stringify({ success: false, error: 'Failed to deliver message via email provider.' }));
                  return;
                }
              } else {
                console.log(`[Dev Contact Received] Delivery to ${adminRecipient}: From ${name} <${email}> - ${subject}`);
              }

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, message: 'Thanks! Your message has been sent successfully.' }));
            } catch (err) {
              console.error('[Dev Contact Error]:', err);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: 'Server error processing contact form.' }));
            }
          });
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), contactApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
