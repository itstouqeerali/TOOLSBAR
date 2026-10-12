import React from 'react';
import { FileText, CheckCircle2, AlertTriangle, Scale, ShieldAlert, Cpu, HelpCircle, ArrowRight } from 'lucide-react';

interface TermsViewProps {
  onNavigate: (path: string) => void;
}

export const TermsView: React.FC<TermsViewProps> = ({ onNavigate }) => {
  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12" id="terms-of-service-view">
      {/* Hero Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
          <FileText className="w-3.5 h-3.5" /> Legal Agreement
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
          Terms of Service
        </h1>
        <p className="text-sm text-slate-500 dark:text-neutral-400">
          Last Updated: August 27, 2026 &bull; Effective Date: August 27, 2026
        </p>
        <p className="text-slate-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
          Please read these Terms of Service carefully before using Toolsbar. By accessing or using our website, tools, and services, you agree to be bound by the terms and conditions outlined below.
        </p>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-8">
        {/* Section 1: Acceptance & Service Description */}
        <div className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-sm dark:shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              1. Acceptance of Terms & Services Provided
            </h2>
          </div>
          <p className="text-slate-600 dark:text-neutral-300 text-sm leading-relaxed">
            Toolsbar provides web-based productivity, calculation, developer formatting, and conversion utilities. By accessing <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-xs">toolsbar.site</code>, you agree to these Terms and our Privacy Policy. If you do not agree to these terms, please discontinue use of the site.
          </p>
        </div>

        {/* Section 2: Acceptable Use */}
        <div className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-sm dark:shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Scale className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              2. Acceptable Use Policy
            </h2>
          </div>
          <p className="text-slate-600 dark:text-neutral-300 text-sm leading-relaxed">
            You agree to use Toolsbar exclusively for lawful purposes and in adherence with all applicable local, national, and international laws. You agree NOT to:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-neutral-300 pl-1 leading-relaxed">
            <li>Attempt to probe, scan, or compromise the security, integrity, or availability of the website or its infrastructure.</li>
            <li>Use automated scrapers, denial-of-service scripts, or excessive requests to impair platform availability for other users.</li>
            <li>Use the tools to generate, format, or process harmful, illegal, or malicious software code or content.</li>
            <li>Attempt to bypass or tamper with security rules, role systems, or authentication protocols.</li>
          </ul>
        </div>

        {/* Section 3: User Responsibility & Accuracy Disclaimer */}
        <div className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-sm dark:shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              3. User Responsibility & Disclaimer of Accuracy
            </h2>
          </div>
          <p className="text-slate-600 dark:text-neutral-300 text-sm leading-relaxed">
            Toolsbar utilities (including financial calculators, GST calculators, unit converters, date/time tools, regex testers, and formatters) are designed for convenience and general utility:
          </p>
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2 text-xs sm:text-sm text-slate-700 dark:text-neutral-300">
            <p className="font-semibold text-slate-900 dark:text-white">Important Notice:</p>
            <ul className="list-disc list-inside space-y-1 pl-1 leading-relaxed">
              <li>
                <strong>Verification Required:</strong> You are solely responsible for reviewing and verifying the accuracy of any generated output, formula result, code transformation, or calculation before relying on it for financial, accounting, legal, engineering, or mission-critical applications.
              </li>
              <li>
                <strong>No Professional Advice:</strong> Financial, tax, and health-related tools (such as EMI calculators, GST calculators, and BMI calculators) provide mathematical estimates and do not constitute professional financial, tax, or medical advice.
              </li>
            </ul>
          </div>
        </div>

        {/* Section 4: "As-Is" Warranty & Service Availability */}
        <div className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-sm dark:shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              4. Disclaimer of Warranties ("As Is")
            </h2>
          </div>
          <p className="text-slate-600 dark:text-neutral-300 text-sm leading-relaxed">
            Toolsbar is provided on an <strong>"AS IS"</strong> and <strong>"AS AVAILABLE"</strong> basis without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, non-infringement, or uninterrupted availability.
          </p>
          <p className="text-slate-600 dark:text-neutral-300 text-sm leading-relaxed">
            We do not warrant that the website or any individual utility will be error-free, uninterrupted, or compatible with every browser version or operating environment.
          </p>
        </div>

        {/* Section 5: Intellectual Property */}
        <div className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-sm dark:shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              5. Intellectual Property Rights
            </h2>
          </div>
          <p className="text-slate-600 dark:text-neutral-300 text-sm leading-relaxed">
            All rights, title, and interest in and to the Toolsbar website, including the user interface design, logos, graphics, brand identity, and application source code, are owned by Toolsbar.
          </p>
          <p className="text-slate-600 dark:text-neutral-300 text-sm leading-relaxed">
            <strong>Your Content:</strong> You retain complete ownership of all text, documents, files, images, and data that you input, upload, or process through our client-side tools. Toolsbar claims no ownership or rights over user-processed files.
          </p>
        </div>

        {/* Section 6: Limitation of Liability */}
        <div className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-sm dark:shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/20 flex items-center justify-center text-slate-700 dark:text-white">
              <Scale className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              6. Limitation of Liability
            </h2>
          </div>
          <p className="text-slate-600 dark:text-neutral-300 text-sm leading-relaxed">
            To the maximum extent permitted by applicable law, in no event shall Toolsbar, its operators, or contributors be liable for any direct, indirect, incidental, special, consequential, or punitive damages (including loss of data, revenue, profits, business interruption, or corruption of files) arising out of or in connection with your access to, use of, or inability to use the tools or platform.
          </p>
        </div>

        {/* Section 7: Third-Party Integrations & Modifications */}
        <div className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-sm dark:shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              7. Third-Party Services & Term Updates
            </h2>
          </div>
          <p className="text-slate-600 dark:text-neutral-300 text-sm leading-relaxed">
            Toolsbar utilizes third-party infrastructure components including Google Firebase and Google AdSense. Your use of features dependent on these services is subject to their respective terms.
          </p>
          <p className="text-slate-600 dark:text-neutral-300 text-sm leading-relaxed">
            We reserve the right to revise or update these Terms of Service at any time. When changes are made, the "Last Updated" date at the top of this page will be revised. Continued use of the platform following the posting of modifications constitutes acceptance of the amended terms.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
            >
              Contact Support <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
