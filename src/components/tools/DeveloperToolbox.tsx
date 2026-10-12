import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Code2, Binary, ShieldCheck, Fingerprint, Clock, 
  Terminal, KeyRound, Globe, FileCode
} from 'lucide-react';
import { Base64Tool } from './Base64Tool';
import { UrlEncoderDecoder } from './UrlEncoderDecoder';
import { JwtDecoder } from './JwtDecoder';
import { UuidGenerator } from './UuidGenerator';
import { HashGenerator } from './HashGenerator';
import { RegexTester } from './RegexTester';
import { HtmlFormatter } from './HtmlFormatter';
import { CssFormatter } from './CssFormatter';
import { JavascriptFormatter } from './JavascriptFormatter';
import { PasswordGenerator } from './PasswordGenerator';
import { UnixTimestampConverter } from './UnixTimestampConverter';

type DevGroup = 'code' | 'encoding' | 'security' | 'ids' | 'time';
type CodeLang = 'html' | 'css' | 'js';
type EncodingType = 'base64' | 'url';
type SecurityType = 'password' | 'jwt' | 'hash';
type IdsType = 'uuid' | 'regex';

export const DeveloperToolbox: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getInitialState = () => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab')?.toLowerCase() || '';

    if (tabParam === 'html' || tabParam === 'html-formatter') {
      return { group: 'code' as DevGroup, codeLang: 'html' as CodeLang, encType: 'base64' as EncodingType, secType: 'password' as SecurityType, idType: 'uuid' as IdsType };
    }
    if (tabParam === 'css' || tabParam === 'css-formatter') {
      return { group: 'code' as DevGroup, codeLang: 'css' as CodeLang, encType: 'base64' as EncodingType, secType: 'password' as SecurityType, idType: 'uuid' as IdsType };
    }
    if (tabParam === 'js' || tabParam === 'javascript' || tabParam === 'javascript-formatter') {
      return { group: 'code' as DevGroup, codeLang: 'js' as CodeLang, encType: 'base64' as EncodingType, secType: 'password' as SecurityType, idType: 'uuid' as IdsType };
    }
    if (tabParam === 'url' || tabParam === 'url-encoder-decoder') {
      return { group: 'encoding' as DevGroup, codeLang: 'html' as CodeLang, encType: 'url' as EncodingType, secType: 'password' as SecurityType, idType: 'uuid' as IdsType };
    }
    if (tabParam === 'base64') {
      return { group: 'encoding' as DevGroup, codeLang: 'html' as CodeLang, encType: 'base64' as EncodingType, secType: 'password' as SecurityType, idType: 'uuid' as IdsType };
    }
    if (tabParam === 'jwt' || tabParam === 'jwt-decoder') {
      return { group: 'security' as DevGroup, codeLang: 'html' as CodeLang, encType: 'base64' as EncodingType, secType: 'jwt' as SecurityType, idType: 'uuid' as IdsType };
    }
    if (tabParam === 'hash' || tabParam === 'hash-generator') {
      return { group: 'security' as DevGroup, codeLang: 'html' as CodeLang, encType: 'base64' as EncodingType, secType: 'hash' as SecurityType, idType: 'uuid' as IdsType };
    }
    if (tabParam === 'password' || tabParam === 'password-generator') {
      return { group: 'security' as DevGroup, codeLang: 'html' as CodeLang, encType: 'base64' as EncodingType, secType: 'password' as SecurityType, idType: 'uuid' as IdsType };
    }
    if (tabParam === 'uuid' || tabParam === 'uuid-generator') {
      return { group: 'ids' as DevGroup, codeLang: 'html' as CodeLang, encType: 'base64' as EncodingType, secType: 'password' as SecurityType, idType: 'uuid' as IdsType };
    }
    if (tabParam === 'regex' || tabParam === 'regex-tester') {
      return { group: 'ids' as DevGroup, codeLang: 'html' as CodeLang, encType: 'base64' as EncodingType, secType: 'password' as SecurityType, idType: 'regex' as IdsType };
    }
    if (tabParam === 'timestamp' || tabParam === 'unix' || tabParam === 'unix-timestamp-converter' || tabParam === 'time') {
      return { group: 'time' as DevGroup, codeLang: 'html' as CodeLang, encType: 'base64' as EncodingType, secType: 'password' as SecurityType, idType: 'uuid' as IdsType };
    }

    // Default to Code Formatter
    return { group: 'code' as DevGroup, codeLang: 'html' as CodeLang, encType: 'base64' as EncodingType, secType: 'password' as SecurityType, idType: 'uuid' as IdsType };
  };

  const [activeGroup, setActiveGroup] = useState<DevGroup>(() => getInitialState().group);
  const [codeLang, setCodeLang] = useState<CodeLang>(() => getInitialState().codeLang);
  const [encType, setEncType] = useState<EncodingType>(() => getInitialState().encType);
  const [secType, setSecType] = useState<SecurityType>(() => getInitialState().secType);
  const [idType, setIdType] = useState<IdsType>(() => getInitialState().idType);

  useEffect(() => {
    const next = getInitialState();
    setActiveGroup(next.group);
    setCodeLang(next.codeLang);
    setEncType(next.encType);
    setSecType(next.secType);
    setIdType(next.idType);
  }, [location.search]);

  const handleGroupChange = (group: DevGroup) => {
    setActiveGroup(group);
    let tabQuery = group as string;
    if (group === 'code') tabQuery = codeLang;
    if (group === 'encoding') tabQuery = encType;
    if (group === 'security') tabQuery = secType;
    if (group === 'ids') tabQuery = idType;
    if (group === 'time') tabQuery = 'timestamp';
    navigate(`/tools/developer-toolbox?tab=${tabQuery}`, { replace: true });
  };

  return (
    <div className="space-y-8" id="developer-toolbox-workspace">
      {/* Primary Group Navigation Bar */}
      <div className="glass-panel p-2 sm:p-2.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm border border-slate-200/80 dark:border-white/10">
        <div className="flex items-center gap-2 px-2 text-xs font-semibold text-slate-700 dark:text-neutral-300">
          <Terminal className="w-4 h-4 text-emerald-500" />
          <span>Developer Toolbox Workspace</span>
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto p-1 bg-slate-100/80 dark:bg-black/40 rounded-xl border border-slate-200/60 dark:border-white/5 overflow-x-auto">
          {[
            { id: 'code', label: 'Code Formatter', icon: Code2 },
            { id: 'encoding', label: 'Encoding', icon: Binary },
            { id: 'security', label: 'Security & Hashes', icon: ShieldCheck },
            { id: 'ids', label: 'IDs & Regex', icon: Fingerprint },
            { id: 'time', label: 'Unix Timestamp', icon: Clock },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeGroup === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleGroupChange(item.id as DevGroup)}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-white/10'
                    : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-500' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-bar for Code Formatter */}
      {activeGroup === 'code' && (
        <div className="flex items-center justify-center gap-2 pb-2">
          {[
            { id: 'html', label: 'HTML Formatter & Minifier' },
            { id: 'css', label: 'CSS Formatter & Minifier' },
            { id: 'js', label: 'JavaScript Formatter & Minifier' },
          ].map((sub) => {
            const isSubActive = codeLang === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => {
                  setCodeLang(sub.id as CodeLang);
                  navigate(`/tools/developer-toolbox?tab=${sub.id}`, { replace: true });
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isSubActive
                    ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 shadow-sm font-semibold'
                    : 'glass-button text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {sub.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Sub-bar for Encoding */}
      {activeGroup === 'encoding' && (
        <div className="flex items-center justify-center gap-2 pb-2">
          {[
            { id: 'base64', label: 'Base64 Encoder & Decoder' },
            { id: 'url', label: 'URL Encoder & Decoder' },
          ].map((sub) => {
            const isSubActive = encType === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => {
                  setEncType(sub.id as EncodingType);
                  navigate(`/tools/developer-toolbox?tab=${sub.id}`, { replace: true });
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isSubActive
                    ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 shadow-sm font-semibold'
                    : 'glass-button text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {sub.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Sub-bar for Security & Hashes */}
      {activeGroup === 'security' && (
        <div className="flex items-center justify-center gap-2 pb-2">
          {[
            { id: 'password', label: 'Cryptographic Password Generator' },
            { id: 'jwt', label: 'JWT Token Inspector & Decoder' },
            { id: 'hash', label: 'Hash & Checksum Generator' },
          ].map((sub) => {
            const isSubActive = secType === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => {
                  setSecType(sub.id as SecurityType);
                  navigate(`/tools/developer-toolbox?tab=${sub.id}`, { replace: true });
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isSubActive
                    ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 shadow-sm font-semibold'
                    : 'glass-button text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {sub.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Sub-bar for IDs & Testing */}
      {activeGroup === 'ids' && (
        <div className="flex items-center justify-center gap-2 pb-2">
          {[
            { id: 'uuid', label: 'UUID v4 Generator' },
            { id: 'regex', label: 'Regex Tester & Matcher' },
          ].map((sub) => {
            const isSubActive = idType === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => {
                  setIdType(sub.id as IdsType);
                  navigate(`/tools/developer-toolbox?tab=${sub.id}`, { replace: true });
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isSubActive
                    ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 shadow-sm font-semibold'
                    : 'glass-button text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {sub.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Active Tab Panel */}
      <div className="animate-in fade-in duration-200">
        {activeGroup === 'code' && (
          <>
            {codeLang === 'html' && <HtmlFormatter />}
            {codeLang === 'css' && <CssFormatter />}
            {codeLang === 'js' && <JavascriptFormatter />}
          </>
        )}
        {activeGroup === 'encoding' && (
          <>
            {encType === 'base64' && <Base64Tool />}
            {encType === 'url' && <UrlEncoderDecoder />}
          </>
        )}
        {activeGroup === 'security' && (
          <>
            {secType === 'password' && <PasswordGenerator />}
            {secType === 'jwt' && <JwtDecoder />}
            {secType === 'hash' && <HashGenerator />}
          </>
        )}
        {activeGroup === 'ids' && (
          <>
            {idType === 'uuid' && <UuidGenerator />}
            {idType === 'regex' && <RegexTester />}
          </>
        )}
        {activeGroup === 'time' && <UnixTimestampConverter />}
      </div>
    </div>
  );
};
