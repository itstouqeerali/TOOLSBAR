import React, { useState, useMemo } from 'react';
import { 
  KeyRound, Copy, Check, AlertTriangle, CheckCircle2, 
  Clock, ShieldAlert, ShieldCheck, FileJson, AlertCircle,
  HelpCircle, Eye, EyeOff, RotateCcw, Sparkles, Info
} from 'lucide-react';

// Standard educational sample JWT (Header + Payload + Signature)
// Alg: HS256, Sub: user_12345, Exp: Future timestamp
const SAMPLE_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
  "eyJzdWIiOiJ1c2VyXzEyMzQ1IiwibmFtZSI6IkFsZXggTW9yZ2FuIiwiZW1haWwiOiJhbGV4QGV4YW1wbGUuY29tIiwicm9sZXMiOlsiYWRtaW4iLCJkZXZlbG9wZXIiXSwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MjQ5ODk2MDAsImlzcyI6Imh0dHBzOi8vYXV0aC50b29sc2Jhci5kZXYiLCJhdWQiOiJhcGkudG9vbHNiYXIuZGV2IiwianRpIjoiOTg3N2EtYjYyMS00Y2U3LWJjM2MtMTNmZjFlNmEyY2U0In0." +
  "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk";

interface DecodedJwt {
  rawHeader: string;
  rawPayload: string;
  rawSignature: string;
  headerObj: Record<string, any> | null;
  payloadObj: Record<string, any> | null;
  error: string | null;
}

export const JwtDecoder: React.FC = () => {
  const [jwtInput, setJwtInput] = useState<string>(SAMPLE_JWT);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Safe Base64URL decoder
  const decodeBase64Url = (str: string): string => {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const decodedBinary = atob(base64);
    // Convert binary to UTF-8 properly
    const bytes = new Uint8Array(decodedBinary.length);
    for (let i = 0; i < decodedBinary.length; i++) {
      bytes[i] = decodedBinary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  };

  // Decode JWT segments
  const decoded = useMemo<DecodedJwt>(() => {
    const trimmed = jwtInput.trim();
    if (!trimmed) {
      return {
        rawHeader: '',
        rawPayload: '',
        rawSignature: '',
        headerObj: null,
        payloadObj: null,
        error: null
      };
    }

    const parts = trimmed.split('.');
    if (parts.length !== 3) {
      return {
        rawHeader: parts[0] || '',
        rawPayload: parts[1] || '',
        rawSignature: parts[2] || '',
        headerObj: null,
        payloadObj: null,
        error: `Invalid JWT format: A valid JWT must consist of exactly 3 period-separated sections (Header.Payload.Signature). Found ${parts.length} section${parts.length === 1 ? '' : 's'}.`
      };
    }

    const [headerB64, payloadB64, signatureB64] = parts;
    let headerObj: Record<string, any> | null = null;
    let payloadObj: Record<string, any> | null = null;

    // Decode Header
    try {
      const headerJson = decodeBase64Url(headerB64);
      headerObj = JSON.parse(headerJson);
    } catch (err: any) {
      return {
        rawHeader: headerB64,
        rawPayload: payloadB64,
        rawSignature: signatureB64,
        headerObj: null,
        payloadObj: null,
        error: `Malformed Header: Unable to decode Base64URL or parse JSON header (${err?.message || 'Invalid format'}).`
      };
    }

    // Decode Payload
    try {
      const payloadJson = decodeBase64Url(payloadB64);
      payloadObj = JSON.parse(payloadJson);
    } catch (err: any) {
      return {
        rawHeader: headerB64,
        rawPayload: payloadB64,
        rawSignature: signatureB64,
        headerObj,
        payloadObj: null,
        error: `Malformed Payload: Unable to decode Base64URL or parse JSON payload (${err?.message || 'Invalid format'}).`
      };
    }

    return {
      rawHeader: headerB64,
      rawPayload: payloadB64,
      rawSignature: signatureB64,
      headerObj,
      payloadObj,
      error: null
    };
  }, [jwtInput]);

  // Expiration & Timestamps inspection
  const timeDetails = useMemo(() => {
    if (!decoded.payloadObj) return null;
    const nowSec = Math.floor(Date.now() / 1000);
    const exp = typeof decoded.payloadObj.exp === 'number' ? decoded.payloadObj.exp : null;
    const iat = typeof decoded.payloadObj.iat === 'number' ? decoded.payloadObj.iat : null;
    const nbf = typeof decoded.payloadObj.nbf === 'number' ? decoded.payloadObj.nbf : null;

    let isExpired: boolean | null = null;
    let expRelative: string | null = null;

    if (exp !== null) {
      const diffSec = exp - nowSec;
      if (diffSec <= 0) {
        isExpired = true;
        const absDiff = Math.abs(diffSec);
        if (absDiff < 60) expRelative = `Expired ${absDiff}s ago`;
        else if (absDiff < 3600) expRelative = `Expired ${Math.floor(absDiff / 60)}m ago`;
        else if (absDiff < 86400) expRelative = `Expired ${Math.floor(absDiff / 3600)}h ago`;
        else expRelative = `Expired ${Math.floor(absDiff / 86400)}d ago`;
      } else {
        isExpired = false;
        if (diffSec < 60) expRelative = `Expires in ${diffSec}s`;
        else if (diffSec < 3600) expRelative = `Expires in ${Math.floor(diffSec / 60)}m`;
        else if (diffSec < 86400) expRelative = `Expires in ${Math.floor(diffSec / 3600)}h`;
        else expRelative = `Expires in ${Math.floor(diffSec / 86400)}d`;
      }
    }

    return {
      exp,
      iat,
      nbf,
      isExpired,
      expRelative,
      expDate: exp ? new Date(exp * 1000) : null,
      iatDate: iat ? new Date(iat * 1000) : null,
      nbfDate: nbf ? new Date(nbf * 1000) : null
    };
  }, [decoded.payloadObj]);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(label);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const copyClaimValue = async (key: string, value: any) => {
    try {
      const text = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    } catch (e) {
      console.error('Failed to copy claim', e);
    }
  };

  const handleClear = () => {
    setJwtInput('');
  };

  const handleLoadSample = () => {
    setJwtInput(SAMPLE_JWT);
  };

  return (
    <div className="w-full space-y-6">
      {/* Important Security Notice */}
      <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/60 text-amber-200/90 text-xs flex items-start gap-3 shadow-lg">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold text-amber-300">
            Decoder Notice: Decoding a JWT does not verify its signature or authenticity.
          </div>
          <p className="text-amber-300/80 leading-relaxed">
            All parsing is executed locally in your browser memory. Tokens are never logged, stored in local storage, or transmitted to any external server or AI model.
          </p>
        </div>
      </div>

      {/* Input Section */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-medium text-slate-300">
            <KeyRound className="w-4 h-4 text-emerald-400" />
            <span>Paste Encoded JSON Web Token (JWT)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLoadSample}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 font-medium transition-all"
            >
              Load Example JWT
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={!jwtInput}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-all disabled:opacity-40"
              title="Clear input"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Input Textarea with color-coded hints */}
        <textarea
          value={jwtInput}
          onChange={(e) => setJwtInput(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.doNotVerifySignaturesLocally"
          className="w-full h-28 p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-slate-200 font-mono text-xs leading-relaxed resize-none focus:outline-none focus:border-emerald-500/50 placeholder:text-slate-600 select-all"
          spellCheck={false}
        />

        {/* Visual Token Segment Breakdown */}
        {jwtInput.trim() && !decoded.error && (
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-slate-500 font-sans text-[11px]">Segments:</span>
            <span className="px-2 py-0.5 rounded bg-red-500/15 border border-red-500/30 text-red-400 text-[11px]">
              Header ({decoded.rawHeader.length} chars)
            </span>
            <span className="text-slate-600">•</span>
            <span className="px-2 py-0.5 rounded bg-purple-500/15 border border-purple-500/30 text-purple-400 text-[11px]">
              Payload ({decoded.rawPayload.length} chars)
            </span>
            <span className="text-slate-600">•</span>
            <span className="px-2 py-0.5 rounded bg-blue-500/15 border border-blue-500/30 text-blue-400 text-[11px]">
              Signature ({decoded.rawSignature.length} chars)
            </span>
          </div>
        )}
      </div>

      {/* Error Banner */}
      {decoded.error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-xs text-red-300">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-red-200">Unable to Parse Token</div>
            <div className="mt-0.5 text-red-300/90">{decoded.error}</div>
          </div>
        </div>
      )}

      {/* Expiry Overview Card (If available) */}
      {timeDetails && timeDetails.exp !== null && (
        <div className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4 text-xs ${
          timeDetails.isExpired 
            ? 'bg-rose-950/30 border-rose-800/50 text-rose-300' 
            : 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300'
        }`}>
          <div className="flex items-center gap-3">
            <Clock className={`w-5 h-5 ${timeDetails.isExpired ? 'text-rose-400' : 'text-emerald-400'}`} />
            <div>
              <div className="font-semibold text-sm">
                {timeDetails.isExpired ? 'Token Expired' : 'Token Active (Not Expired)'}
              </div>
              <div className="text-[11px] opacity-80 mt-0.5">
                {timeDetails.expRelative} • Expires at {timeDetails.expDate?.toUTCString()}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] bg-slate-950/50 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400">Timestamp:</span>
            <span>{timeDetails.exp}</span>
          </div>
        </div>
      )}

      {/* Decoded Sections Grid */}
      {decoded.headerObj && decoded.payloadObj && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section 1: HEADER */}
          <div className="flex flex-col rounded-2xl bg-slate-900/60 border border-slate-800/80 overflow-hidden shadow-xl">
            <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-semibold text-red-400">
                <FileJson className="w-4 h-4" />
                <span>HEADER: Algorithm & Token Type</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(JSON.stringify(decoded.headerObj, null, 2), 'header')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all"
              >
                {copiedSection === 'header' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copiedSection === 'header' ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Quick Header Chips */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800">
                  <div className="text-[10px] text-slate-500 font-sans">Algorithm (alg)</div>
                  <div className="font-semibold text-slate-200 mt-0.5">{decoded.headerObj.alg || 'none'}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800">
                  <div className="text-[10px] text-slate-500 font-sans">Token Type (typ)</div>
                  <div className="font-semibold text-slate-200 mt-0.5">{decoded.headerObj.typ || 'JWT'}</div>
                </div>
              </div>

              <pre className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 text-red-300 font-mono text-xs overflow-x-auto leading-relaxed">
                {JSON.stringify(decoded.headerObj, null, 2)}
              </pre>
            </div>
          </div>

          {/* Section 2: SIGNATURE */}
          <div className="flex flex-col rounded-2xl bg-slate-900/60 border border-slate-800/80 overflow-hidden shadow-xl">
            <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-semibold text-blue-400">
                <KeyRound className="w-4 h-4" />
                <span>SIGNATURE: Raw Cryptographic Segment</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(decoded.rawSignature, 'sig')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all"
              >
                {copiedSection === 'sig' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copiedSection === 'sig' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-400 leading-relaxed">
                Signature string in Base64URL format. Verification requires your secret key or public certificate and is not performed in this decoder.
              </div>

              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 font-mono text-xs text-blue-300 break-all leading-relaxed">
                {decoded.rawSignature || <span className="text-slate-600 italic">No signature segment</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 3: PAYLOAD & CLAIMS */}
      {decoded.payloadObj && (
        <div className="flex flex-col rounded-2xl bg-slate-900/60 border border-slate-800/80 overflow-hidden shadow-xl">
          <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-semibold text-purple-400">
              <FileJson className="w-4 h-4" />
              <span>PAYLOAD: Claims & Data</span>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(JSON.stringify(decoded.payloadObj, null, 2), 'payload')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all"
            >
              {copiedSection === 'payload' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copiedSection === 'payload' ? 'Copied' : 'Copy Payload JSON'}</span>
            </button>
          </div>

          <div className="p-4 space-y-6">
            {/* Claims Table / Breakdown */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-slate-400">Claims Table:</div>
              <div className="rounded-xl border border-slate-800 overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 text-[11px]">
                      <th className="py-2.5 px-4 font-medium">Claim Key</th>
                      <th className="py-2.5 px-4 font-medium">Description</th>
                      <th className="py-2.5 px-4 font-medium">Value</th>
                      <th className="py-2.5 px-4 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {Object.entries(decoded.payloadObj).map(([key, val]) => {
                      let description = 'Custom Claim';
                      if (key === 'iss') description = 'Issuer';
                      else if (key === 'sub') description = 'Subject (User ID)';
                      else if (key === 'aud') description = 'Audience';
                      else if (key === 'exp') description = 'Expiration Time (epoch)';
                      else if (key === 'nbf') description = 'Not Before (epoch)';
                      else if (key === 'iat') description = 'Issued At (epoch)';
                      else if (key === 'jti') description = 'JWT Unique Identifier';

                      const isEpoch = (key === 'exp' || key === 'iat' || key === 'nbf') && typeof val === 'number';

                      return (
                        <tr key={key} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-2.5 px-4 text-purple-400 font-semibold">{key}</td>
                          <td className="py-2.5 px-4 text-slate-400 font-sans text-[11px]">{description}</td>
                          <td className="py-2.5 px-4 text-slate-200">
                            {isEpoch ? (
                              <div>
                                <span>{val}</span>
                                <span className="text-[10px] text-slate-400 font-sans block mt-0.5">
                                  {new Date(val * 1000).toUTCString()}
                                </span>
                              </div>
                            ) : typeof val === 'object' ? (
                              JSON.stringify(val)
                            ) : (
                              String(val)
                            )}
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => copyClaimValue(key, val)}
                              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                              title={`Copy ${key} value`}
                            >
                              {copiedKey === key ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Formatted JSON Payload */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-slate-400">Raw JSON Payload:</div>
              <pre className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 text-purple-300 font-mono text-xs overflow-x-auto leading-relaxed">
                {JSON.stringify(decoded.payloadObj, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
