import React from 'react';
import { Shield, Lock, Cpu, Database, Eye, Server, Cookie, HelpCircle, ArrowRight, ExternalLink } from 'lucide-react';

interface PrivacyViewProps {
  onNavigate: (path: string) => void;
}

export const PrivacyView: React.FC<PrivacyViewProps> = ({ onNavigate }) => {
  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12" id="privacy-policy-view">
      {/* Hero Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          <Shield className="w-3.5 h-3.5" /> Legal & Transparency
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-500 dark:text-neutral-400">
          Last Updated: August 27, 2026 &bull; Effective Date: August 27, 2026
        </p>
        <p className="text-slate-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
          Toolsbar is committed to transparent, privacy-first computing. This Privacy Policy explains how our website operates, how client-side utility processing protects your data, and what information is collected when you create an account or interact with our services.
        </p>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-8">
        {/* Section 1: Overview & Client-Side Architecture */}
        <div className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-sm dark:shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              1. Browser-First & Client-Side Processing
            </h2>
          </div>
          <p className="text-slate-600 dark:text-neutral-300 text-sm leading-relaxed">
            Toolsbar provides web-based productivity, development, and conversion tools designed to run directly on your device.
          </p>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-white/5 space-y-2 text-xs sm:text-sm text-slate-700 dark:text-neutral-300">
            <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-500" /> Local Memory Execution:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-1 leading-relaxed">
              <li>
                <strong>Files & Documents:</strong> Uploaded files for file-handling tools (including PDF Merger, PDF Splitter, PDF Compressor, Image Compressor, Image Resizer, JPG/PNG/WebP Converters) are processed purely in browser memory using Web APIs (such as HTML5 Canvas and WebAssembly/JavaScript libraries).
              </li>
              <li>
                <strong>Text & Code Inputs:</strong> Formatter and developer tools (such as JSON Formatter, JSON Minifier, JWT Decoder, Regex Tester, Base64 Encoder/Decoder, Hash Generator) execute locally without sending input text to our servers.
              </li>
              <li>
                <strong>Calculators & Converters:</strong> All mathematical and unit conversions calculate instantaneously on your device.
              </li>
              <li>
                <strong>No Server Storage of Tool Inputs:</strong> Tool input content, uploaded files, generated passwords, cryptographic hashes, or computation results are not uploaded to or stored on Toolsbar's backend servers.
              </li>
            </ul>
          </div>
        </div>

        {/* Section 2: Account Information & Firebase Firestore */}
        <div className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-sm dark:shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Database className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              2. User Accounts & Stored Metadata
            </h2>
          </div>
          <p className="text-slate-600 dark:text-neutral-300 text-sm leading-relaxed">
            All public tools on Toolsbar can be used freely without creating an account. If you choose to create an account to personalize your experience, we utilize Google Firebase for authentication and metadata synchronization.
          </p>
          <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-neutral-300">
            <p>
              <strong>What We Store in Firestore:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 pl-1 leading-relaxed">
              <li>Profile information (email address, display name, account creation timestamp, and account role).</li>
              <li>Saved Favorites (an array of tool slug identifiers, e.g. <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-xs">['json-formatter', 'percentage-calculator']</code>).</li>
              <li>Recently Used Tools (tool identifiers and timestamps capped at 15 items to enable quick navigation across your devices).</li>
            </ul>
            <p className="pt-2">
              <strong>What We DO NOT Store:</strong> We do not store passwords in plain text (authentication is managed by Firebase Authentication), nor do we store any tool inputs, uploaded files, decrypted payloads, or calculation history.
            </p>
          </div>
        </div>

        {/* Section 3: Local Browser Storage */}
        <div className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-sm dark:shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Server className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              3. Local Browser Storage
            </h2>
          </div>
          <p className="text-slate-600 dark:text-neutral-300 text-sm leading-relaxed">
            Toolsbar utilizes client-side web storage mechanisms (<code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-xs font-mono">localStorage</code> and IndexedDB) on your device for operational features:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-neutral-300 pl-1 leading-relaxed">
            <li>
              <strong>Theme Preference:</strong> Stored locally under <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-xs font-mono">toolsbar_theme</code> to persist your preference between Light and Dark mode.
            </li>
            <li>
              <strong>Authentication Persistence:</strong> Stored via Firebase Auth <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-xs font-mono">browserLocalPersistence</code> so you remain signed in across page reloads.
            </li>
          </ul>
        </div>

        {/* Section 4: Advertising & Google AdSense */}
        <div className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-sm dark:shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Cookie className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              4. Advertising & Google AdSense
            </h2>
          </div>
          <p className="text-slate-600 dark:text-neutral-300 text-sm leading-relaxed">
            We use Google AdSense to serve advertisements on Toolsbar to support free access to our tools.
          </p>
          <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-neutral-300 leading-relaxed">
            <ul className="list-disc list-inside space-y-2 pl-1">
              <li>
                <strong>Third-Party Advertising Cookies:</strong> Google and third-party advertising vendors may use cookies, web beacons, and similar tracking technologies to serve ads based on a user's prior visits to Toolsbar or other websites on the Internet.
              </li>
              <li>
                <strong>Ad Personalization:</strong> Google's use of advertising cookies enables it and its partners to serve personalized or non-personalized advertisements based on browsing patterns.
              </li>
              <li>
                <strong>User Opt-Out Choices:</strong> You may opt out of personalized advertising by visiting{' '}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 underline font-medium hover:text-indigo-700 inline-flex items-center gap-0.5"
                >
                  Google Ads Settings <ExternalLink className="w-3 h-3 inline" />
                </a>{' '}
                or by visiting{' '}
                <a
                  href="https://www.aboutads.info/choices/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 underline font-medium hover:text-indigo-700 inline-flex items-center gap-0.5"
                >
                  aboutads.info <ExternalLink className="w-3 h-3 inline" />
                </a>.
              </li>
              <li>
                <strong>Regional Consent:</strong> For visitors in regions with specific privacy frameworks (such as the European Economic Area, United Kingdom, Switzerland, and California), consent choices regarding cookies and personalized ads are handled in compliance with applicable laws (GDPR, UK GDPR, CCPA/CPRA).
              </li>
            </ul>
          </div>
        </div>

        {/* Section 5: Third-Party Services */}
        <div className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-sm dark:shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <Eye className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              5. Third-Party Services
            </h2>
          </div>
          <p className="text-slate-600 dark:text-neutral-300 text-sm leading-relaxed">
            Toolsbar integrates specific third-party services that have their own independent privacy policies:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-neutral-300 pl-1 leading-relaxed">
            <li>
              <strong>Google Firebase:</strong> Provides user authentication and Firestore cloud database services. Covered by{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 underline font-medium hover:text-indigo-700 inline-flex items-center gap-0.5"
              >
                Google Privacy Policy <ExternalLink className="w-3 h-3 inline" />
              </a>.
            </li>
            <li>
              <strong>Google AdSense:</strong> Advertising service provided by Google LLC.
            </li>
            <li>
              <strong>Cloudflare / Hosting:</strong> Content delivery and secure edge routing.
            </li>
          </ul>
        </div>

        {/* Section 6: Security & Data Retention */}
        <div className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-sm dark:shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              6. Data Security & Isolation
            </h2>
          </div>
          <p className="text-slate-600 dark:text-neutral-300 text-sm leading-relaxed">
            We apply security best practices to protect the platform:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-neutral-300 pl-1 leading-relaxed">
            <li><strong>Encrypted Transport:</strong> All web traffic is transmitted exclusively over HTTPS (TLS encryption).</li>
            <li><strong>Role-Based Firestore Security Rules:</strong> User records are strictly owner-isolated (<code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-xs">request.auth.uid == userId</code>), ensuring other users cannot read or modify your saved preferences.</li>
            <li><strong>Ephemeral In-Browser Execution:</strong> Tool files and text remain in browser RAM during computation and are released when the tab is closed or the tool is cleared.</li>
          </ul>
        </div>

        {/* Section 7: User Rights & Inquiries */}
        <div className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-sm dark:shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              7. Your Rights & Contact Information
            </h2>
          </div>
          <p className="text-slate-600 dark:text-neutral-300 text-sm leading-relaxed">
            You have the right to access, update, or delete your account information at any time directly through the{' '}
            <button
              onClick={() => onNavigate('account')}
              className="text-indigo-600 dark:text-indigo-400 font-semibold underline hover:text-indigo-700 cursor-pointer"
            >
              Account Dashboard
            </button>
            .
          </p>
          <p className="text-slate-600 dark:text-neutral-300 text-sm leading-relaxed">
            If you have questions, concerns, or feedback regarding this Privacy Policy or our data handling practices, please submit an inquiry through our Contact page.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
            >
              Go to Contact Us <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
