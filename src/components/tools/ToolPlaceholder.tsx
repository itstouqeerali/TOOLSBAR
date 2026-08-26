import React, { useState } from 'react';
import { Sparkles, Clock, Bell, Check, ShieldCheck, ArrowRight, Layers } from 'lucide-react';
import { Tool } from '../../types';

interface ToolPlaceholderProps {
  tool: Tool;
  onNavigate: (slug: string) => void;
}

export const ToolPlaceholder: React.FC<ToolPlaceholderProps> = ({ tool, onNavigate }) => {
  const [notified, setNotified] = useState(false);
  const [email, setEmail] = useState('');

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setNotified(true);
    }
  };

  return (
    <div className="space-y-8" id="tool-placeholder">
      <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-indigo-950/50 via-[#131a33]/60 to-[#0e1222]/80 border border-indigo-500/20 backdrop-blur-2xl shadow-2xl text-center max-w-2xl mx-auto space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto shadow-inner">
          <Clock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-indigo-400">
            Roadmap Pipeline
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            {tool.name} is in Development
          </h2>
          <p className="text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
            {tool.description} Like all Toolsbar utilities, this tool will execute 100% in your browser for zero latency and total client privacy.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2">
          <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs text-neutral-300 font-medium">100% Client-Side Privacy</span>
          </div>
          <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="text-xs text-neutral-300 font-medium">Zero Uploads / Server Limits</span>
          </div>
        </div>

        {/* Notification input */}
        <form onSubmit={handleNotify} className="pt-2 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter email for early release updates"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={notified}
            className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={notified || !email}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {notified ? <Check className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
            {notified ? 'Subscribed' : 'Notify Me'}
          </button>
        </form>
      </div>

      {/* Suggested active tools */}
      <div className="text-center pt-4">
        <span className="text-xs text-neutral-400 block mb-4 font-medium uppercase tracking-wider">
          Or try these active, fully-functional tools right now:
        </span>
        <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
          {[
            { name: 'Percentage Calculator', slug: 'percentage-calculator' },
            { name: 'Word Counter', slug: 'word-counter' },
            { name: 'QR Code Generator', slug: 'qr-generator' },
            { name: 'JSON Formatter', slug: 'json-formatter' },
            { name: 'Password Generator', slug: 'password-generator' },
          ].map((t) => (
            <button
              key={t.slug}
              onClick={() => onNavigate(`tools/${t.slug}`)}
              className="text-xs px-3 py-1.5 rounded-xl bg-neutral-900/60 dark:bg-white/5 hover:bg-indigo-600/20 text-neutral-300 hover:text-white border border-white/10 transition-colors flex items-center gap-1 cursor-pointer"
            >
              {t.name} <ArrowRight className="w-3 h-3 text-indigo-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
