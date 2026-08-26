import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  QrCode, Download, Copy, Check, Wifi, 
  Link as LinkIcon, Mail, Phone, MessageSquare, 
  User, Sparkles, Sliders 
} from 'lucide-react';

type QrType = 'url' | 'wifi' | 'email' | 'phone' | 'sms' | 'vcard' | 'text';

export const QrGenerator: React.FC = () => {
  const [qrType, setQrType] = useState<QrType>('url');
  
  // Input fields
  const [urlVal, setUrlVal] = useState<string>('https://toolsbar.app');
  const [textVal, setTextVal] = useState<string>('Welcome to Toolsbar');
  
  // WiFi
  const [wifiSsid, setWifiSsid] = useState<string>('MyHomeWiFi');
  const [wifiPass, setWifiPass] = useState<string>('supersecret');
  const [wifiAuth, setWifiAuth] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [wifiHidden, setWifiHidden] = useState<boolean>(false);

  // Email
  const [emailTo, setEmailTo] = useState<string>('hello@toolsbar.app');
  const [emailSubj, setEmailSubj] = useState<string>('Feedback');
  const [emailBody, setEmailBody] = useState<string>('Hello Toolsbar team,');

  // Phone & SMS
  const [phoneNum, setPhoneNum] = useState<string>('+15551234567');
  const [smsMsg, setSmsMsg] = useState<string>('Hello from Toolsbar!');

  // vCard
  const [vCardFirst, setVCardFirst] = useState<string>('Alex');
  const [vCardLast, setVCardLast] = useState<string>('Morgan');
  const [vCardOrg, setVCardOrg] = useState<string>('Toolsbar');
  const [vCardEmail, setVCardEmail] = useState<string>('alex@toolsbar.app');
  const [vCardPhone, setVCardPhone] = useState<string>('+15559876543');

  // Styling Options
  const [fgColor, setFgColor] = useState<string>('#000000');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [ecLevel, setEcLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [margin, setMargin] = useState<number>(2);
  const [size, setSize] = useState<number>(320);
  
  // Result
  const [dataUrl, setDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Build payload string
  const qrString = React.useMemo(() => {
    switch (qrType) {
      case 'url':
        return urlVal.trim();
      case 'text':
        return textVal.trim();
      case 'wifi':
        return `WIFI:S:${wifiSsid};T:${wifiAuth};P:${wifiPass};H:${wifiHidden ? 'true' : 'false'};;`;
      case 'email':
        return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubj)}&body=${encodeURIComponent(emailBody)}`;
      case 'phone':
        return `tel:${phoneNum.trim()}`;
      case 'sms':
        return `smsto:${phoneNum.trim()}:${smsMsg}`;
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nN:${vCardLast};${vCardFirst};;;\nFN:${vCardFirst} ${vCardLast}\nORG:${vCardOrg}\nTEL:${vCardPhone}\nEMAIL:${vCardEmail}\nEND:VCARD`;
      default:
        return urlVal;
    }
  }, [qrType, urlVal, textVal, wifiSsid, wifiPass, wifiAuth, wifiHidden, emailTo, emailSubj, emailBody, phoneNum, smsMsg, vCardFirst, vCardLast, vCardOrg, vCardEmail, vCardPhone]);

  useEffect(() => {
    if (!qrString) {
      setDataUrl('');
      return;
    }

    QRCode.toDataURL(qrString, {
      width: size,
      margin: margin,
      color: {
        dark: fgColor,
        light: bgColor
      },
      errorCorrectionLevel: ecLevel
    })
      .then((url) => setDataUrl(url))
      .catch((err) => console.error('QR Generation error:', err));
  }, [qrString, fgColor, bgColor, ecLevel, margin, size]);

  const handleDownloadPng = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `toolsbar-qr-${Date.now()}.png`;
    a.click();
  };

  const handleDownloadSvg = async () => {
    try {
      const svgString = await QRCode.toString(qrString, {
        type: 'svg',
        margin: margin,
        color: {
          dark: fgColor,
          light: bgColor
        },
        errorCorrectionLevel: ecLevel
      });
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `toolsbar-qr-${Date.now()}.svg`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyImage = async () => {
    if (!dataUrl) return;
    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      navigator.clipboard.writeText(qrString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6" id="qr-generator-tool">
      {/* Category Types Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-neutral-900/60 dark:bg-[#121624]/80 border border-white/10 backdrop-blur-xl">
        {[
          { id: 'url', label: 'URL / Link', icon: LinkIcon },
          { id: 'wifi', label: 'WiFi Network', icon: Wifi },
          { id: 'text', label: 'Plain Text', icon: Sparkles },
          { id: 'email', label: 'Email', icon: Mail },
          { id: 'phone', label: 'Phone', icon: Phone },
          { id: 'sms', label: 'SMS Message', icon: MessageSquare },
          { id: 'vcard', label: 'vCard Contact', icon: User },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setQrType(tab.id as QrType)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                qrType === tab.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Grid Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Inputs & Customization */}
        <div className="lg:col-span-7 space-y-5">
          <div className="rounded-2xl p-6 bg-neutral-900/60 dark:bg-[#121624]/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
            <span className="text-xs uppercase font-bold tracking-wider text-neutral-300">
              Content Information
            </span>

            {qrType === 'url' && (
              <div>
                <label className="block text-xs text-neutral-300 font-medium mb-1.5">Website URL</label>
                <input
                  type="url"
                  value={urlVal}
                  onChange={(e) => setUrlVal(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-all font-mono"
                />
              </div>
            )}

            {qrType === 'wifi' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-neutral-300 font-medium mb-1.5">Network Name (SSID)</label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-300 font-medium mb-1.5">WiFi Password</label>
                  <input
                    type="text"
                    value={wifiPass}
                    onChange={(e) => setWifiPass(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Security Type</label>
                    <select
                      value={wifiAuth}
                      onChange={(e) => setWifiAuth(e.target.value as any)}
                      className="w-full bg-black/50 text-white border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none cursor-pointer"
                    >
                      <option value="WPA" className="bg-neutral-900">WPA/WPA2/WPA3</option>
                      <option value="WEP" className="bg-neutral-900">WEP</option>
                      <option value="nopass" className="bg-neutral-900">None (Open)</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 text-xs text-neutral-300 p-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={wifiHidden}
                        onChange={(e) => setWifiHidden(e.target.checked)}
                        className="rounded border-white/20 bg-black/40 text-indigo-500 focus:ring-0"
                      />
                      Hidden Network
                    </label>
                  </div>
                </div>
              </div>
            )}

            {qrType === 'text' && (
              <div>
                <label className="block text-xs text-neutral-300 font-medium mb-1.5">Text Message</label>
                <textarea
                  rows={4}
                  value={textVal}
                  onChange={(e) => setTextVal(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            )}

            {qrType === 'email' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-neutral-300 font-medium mb-1.5">Recipient Email</label>
                  <input
                    type="email"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-300 font-medium mb-1.5">Subject Line</label>
                  <input
                    type="text"
                    value={emailSubj}
                    onChange={(e) => setEmailSubj(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-300 font-medium mb-1.5">Pre-filled Body</label>
                  <textarea
                    rows={2}
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>
            )}

            {qrType === 'phone' && (
              <div>
                <label className="block text-xs text-neutral-300 font-medium mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  value={phoneNum}
                  onChange={(e) => setPhoneNum(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            )}

            {qrType === 'sms' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-neutral-300 font-medium mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={phoneNum}
                    onChange={(e) => setPhoneNum(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-300 font-medium mb-1.5">SMS Text</label>
                  <textarea
                    rows={2}
                    value={smsMsg}
                    onChange={(e) => setSmsMsg(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>
            )}

            {qrType === 'vcard' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-neutral-300 font-medium mb-1">First Name</label>
                  <input
                    type="text"
                    value={vCardFirst}
                    onChange={(e) => setVCardFirst(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-300 font-medium mb-1">Last Name</label>
                  <input
                    type="text"
                    value={vCardLast}
                    onChange={(e) => setVCardLast(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-300 font-medium mb-1">Company / Org</label>
                  <input
                    type="text"
                    value={vCardOrg}
                    onChange={(e) => setVCardOrg(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-300 font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    value={vCardPhone}
                    onChange={(e) => setVCardPhone(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Style & Error Correction Customizer */}
          <div className="rounded-2xl p-6 bg-neutral-900/60 dark:bg-[#121624]/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
            <span className="text-xs uppercase font-bold tracking-wider text-neutral-300 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" /> Style & Precision Settings
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Foreground</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-9 h-9 rounded-lg bg-transparent border-0 cursor-pointer"
                  />
                  <span className="text-xs font-mono text-neutral-300">{fgColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">Background</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-9 h-9 rounded-lg bg-transparent border-0 cursor-pointer"
                  />
                  <span className="text-xs font-mono text-neutral-300">{bgColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">Error Correction</label>
                <select
                  value={ecLevel}
                  onChange={(e) => setEcLevel(e.target.value as any)}
                  className="w-full bg-black/50 text-white border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none cursor-pointer"
                >
                  <option value="L" className="bg-neutral-900">Low (7%)</option>
                  <option value="M" className="bg-neutral-900">Medium (15%)</option>
                  <option value="Q" className="bg-neutral-900">Quartile (25%)</option>
                  <option value="H" className="bg-neutral-900">High (30%)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">Margin / Border</label>
                <select
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  className="w-full bg-black/50 text-white border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none cursor-pointer"
                >
                  {[0, 1, 2, 4, 6].map(m => (
                    <option key={m} value={m} className="bg-neutral-900">{m} blocks</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Live Preview & Export Stage */}
        <div className="lg:col-span-5 rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-950/70 via-[#131a33]/80 to-[#0e1222]/90 border border-indigo-500/30 backdrop-blur-2xl shadow-2xl flex flex-col items-center justify-between text-center">
          <div className="w-full">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-indigo-300 mb-6">
              <span>Live Render</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Vector Quality
              </span>
            </div>

            {/* QR Canvas Box */}
            <div className="p-5 rounded-2xl bg-white shadow-2xl inline-block max-w-[280px] sm:max-w-[320px] mx-auto border-4 border-white/10">
              {dataUrl ? (
                <img
                  src={dataUrl}
                  alt="Generated QR Code"
                  className="w-full h-auto aspect-square object-contain"
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center text-neutral-400 text-xs">
                  Generating QR...
                </div>
              )}
            </div>

            <div className="text-xs text-neutral-300 mt-4 max-w-xs mx-auto truncate font-mono">
              Payload: {qrString}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full mt-6 space-y-2.5 pt-4 border-t border-white/10">
            <button
              onClick={handleDownloadPng}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download PNG
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleDownloadSvg}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium border border-white/10 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> SVG Vector
              </button>
              <button
                onClick={handleCopyImage}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium border border-white/10 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
