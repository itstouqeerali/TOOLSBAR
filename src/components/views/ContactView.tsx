import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle, Bug, Lightbulb, HelpCircle, Shield, ArrowRight, Loader2 } from 'lucide-react';

interface ContactViewProps {
  onNavigate: (path: string) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onNavigate }) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [subject, setSubject] = useState<string>('General Inquiry');
  const [message, setMessage] = useState<string>('');
  const [hp, setHp] = useState<string>(''); // Honeypot field for bot protection
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side quick checks
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (trimmedMessage.length < 5) {
      setError('Message must be at least 5 characters long.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          subject,
          message: trimmedMessage,
          hp,
        }),
      });

      const data = await response.json().catch(() => null) as { success?: boolean; error?: string; message?: string } | null;

      if (!response.ok || !data?.success) {
        const errorMsg = data?.error || 'Failed to deliver message. Please try again later.';
        setError(errorMsg);
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (err) {
      console.error('[Contact Form Error]:', err);
      setError('A network error occurred while sending your message. Please check your connection and try again.');
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setSubject('General Inquiry');
    setMessage('');
    setHp('');
    setIsSubmitted(false);
    setError('');
  };

  return (
    <div className="pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12" id="contact-us-view">
      {/* Hero Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
          <Mail className="w-3.5 h-3.5" /> Support & Inquiries
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
          Contact Us
        </h1>
        <p className="text-slate-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
          Have feedback, a tool suggestion, or encountered a technical issue? Send us a message or review our support guidance below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Contact Form */}
        <div className="lg:col-span-7 rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-sm dark:shadow-xl space-y-6">
          <div>
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              Send a Message
            </h2>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
              Fill out the form below and our team will review your inquiry.
            </p>
          </div>

          {isSubmitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-center space-y-4 py-8">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Thanks! Your message has been sent successfully.
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-300 max-w-sm mx-auto leading-relaxed">
                  Our team has received your message and will review it shortly.
                </p>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot field for bot protection (hidden from humans) */}
              <input
                type="text"
                name="hp"
                value={hp}
                onChange={(e) => setHp(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium leading-relaxed">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="contact-name" className="text-xs font-semibold text-slate-700 dark:text-neutral-300">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-60"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-email" className="text-xs font-semibold text-slate-700 dark:text-neutral-300">
                    Your Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    disabled={isSubmitting}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-subject" className="text-xs font-semibold text-slate-700 dark:text-neutral-300">
                  Inquiry Topic
                </label>
                <select
                  id="contact-subject"
                  disabled={isSubmitting}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-60"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Tool Suggestion">Tool Suggestion / Feature Request</option>
                  <option value="Bug Report">Bug Report / Technical Issue</option>
                  <option value="Feedback">General Feedback</option>
                  <option value="Privacy / Legal Question">Privacy / Legal Question</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-message" className="text-xs font-semibold text-slate-700 dark:text-neutral-300">
                  Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  disabled={isSubmitting}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your suggestion, issue, or question in detail..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-y disabled:opacity-60"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending Message...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Support Channels & Helpful Information */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl p-6 sm:p-7 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-sm dark:shadow-xl space-y-5">
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-500" />
              Support Topics
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">Feature Requests</h4>
                  <p className="text-slate-600 dark:text-neutral-400 text-xs mt-0.5 leading-relaxed">
                    Have an idea for a new utility, converter, or formatting tool? Let us know what you'd like to see added to our catalog.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                  <Bug className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">Bug Reports</h4>
                  <p className="text-slate-600 dark:text-neutral-400 text-xs mt-0.5 leading-relaxed">
                    If a tool produces an unexpected result or calculation, please include the browser name, operating system, and sample inputs.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">Browser-First Inquiries</h4>
                  <p className="text-slate-600 dark:text-neutral-400 text-xs mt-0.5 leading-relaxed">
                    Questions regarding how our client-side processing, cryptographic security, or file privacy guarantees work on your device.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links Card */}
          <div className="rounded-3xl p-6 bg-slate-50 dark:bg-black/20 border border-slate-200/80 dark:border-white/5 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
              Legal & Directory Links
            </span>
            <div className="flex flex-col gap-2 text-xs font-medium">
              <button
                onClick={() => onNavigate('privacy')}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-white/5 hover:bg-indigo-50 dark:hover:bg-white/10 text-slate-700 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-white border border-slate-200/80 dark:border-white/5 transition-colors cursor-pointer"
              >
                <span>Read our Privacy Policy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('terms')}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-white/5 hover:bg-indigo-50 dark:hover:bg-white/10 text-slate-700 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-white border border-slate-200/80 dark:border-white/5 transition-colors cursor-pointer"
              >
                <span>Read Terms of Service</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('tools')}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-white/5 hover:bg-indigo-50 dark:hover:bg-white/10 text-slate-700 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-white border border-slate-200/80 dark:border-white/5 transition-colors cursor-pointer"
              >
                <span>Explore All 43 Tools</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
