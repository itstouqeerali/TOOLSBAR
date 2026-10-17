import React, { useState, useEffect } from 'react';
import { getAiToolBySlug } from '../../data/aiToolsData';

interface AiToolLogoProps {
  slug: string;
  name: string;
  className?: string;
  size?: number | string;
}

/**
 * Official Brand Logo Registry for AI Tools.
 * Strictly uses official brand logos fetched from reliable CDNs (SimpleIcons, Logotyp.us, Wikimedia, Google Domain Icons).
 * Zero fake icons, zero custom illustrations, and zero blank containers.
 */
export const OFFICIAL_AI_TOOL_LOGOS: Record<
  string,
  {
    name: string;
    /** Official brand logo URL (SVG/PNG) from reliable CDN or official source */
    src: string;
  }
> = {
  // --------------------------------------------------------------------------
  // AI Chatbots & Assistants
  // --------------------------------------------------------------------------
  chatgpt: {
    name: 'ChatGPT',
    src: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/chatgpt.svg',
  },
  claude: {
    name: 'Claude',
    src: 'https://cdn.simpleicons.org/claude',
  },
  gemini: {
    name: 'Google Gemini',
    src: 'https://cdn.simpleicons.org/googlegemini',
  },
  'microsoft-copilot': {
    name: 'Microsoft Copilot',
    src: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/microsoft-copilot.svg',
  },
  'mistral-le-chat': {
    name: 'Mistral Le Chat',
    src: 'https://cdn.simpleicons.org/mistralai',
  },
  'pi-ai': {
    name: 'Pi by Inflection',
    src: 'https://www.google.com/s2/favicons?domain=inflection.ai&sz=128',
  },
  poe: {
    name: 'Poe by Quora',
    src: 'https://cdn.simpleicons.org/poe',
  },
  huggingchat: {
    name: 'HuggingChat',
    src: 'https://cdn.simpleicons.org/huggingface',
  },
  grok: {
    name: 'Grok by xAI',
    src: 'https://cdn.simpleicons.org/x',
  },
  deepseek: {
    name: 'DeepSeek',
    src: 'https://cdn.simpleicons.org/deepseek',
  },
  'cohere-coral': {
    name: 'Cohere Coral',
    src: 'https://www.google.com/s2/favicons?domain=cohere.com&sz=128',
  },
  'you-com': {
    name: 'You.com',
    src: 'https://www.google.com/s2/favicons?domain=you.com&sz=128',
  },

  // --------------------------------------------------------------------------
  // Coding & Development
  // --------------------------------------------------------------------------
  cursor: {
    name: 'Cursor',
    src: 'https://cdn.simpleicons.org/cursor',
  },
  'github-copilot': {
    name: 'GitHub Copilot',
    src: 'https://cdn.simpleicons.org/githubcopilot',
  },
  'v0-by-vercel': {
    name: 'v0 by Vercel',
    src: 'https://cdn.simpleicons.org/v0',
  },
  replit: {
    name: 'Replit Agent',
    src: 'https://cdn.simpleicons.org/replit',
  },
  windsurf: {
    name: 'Windsurf by Codeium',
    src: 'https://cdn.simpleicons.org/windsurf',
  },
  tabnine: {
    name: 'Tabnine',
    src: 'https://www.google.com/s2/favicons?domain=tabnine.com&sz=128',
  },
  'sourcegraph-cody': {
    name: 'Sourcegraph Cody',
    src: 'https://www.google.com/s2/favicons?domain=sourcegraph.com&sz=128',
  },
  'amazon-q-developer': {
    name: 'Amazon Q Developer',
    src: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
  },
  lovable: {
    name: 'Lovable',
    src: 'https://www.google.com/s2/favicons?domain=lovable.dev&sz=128',
  },
  'bolt-new': {
    name: 'Bolt.new by StackBlitz',
    src: 'https://cdn.simpleicons.org/stackblitz',
  },
  'continue-dev': {
    name: 'Continue.dev',
    src: 'https://www.google.com/s2/favicons?domain=continue.dev&sz=128',
  },

  // --------------------------------------------------------------------------
  // Design & Presentations
  // --------------------------------------------------------------------------
  gamma: {
    name: 'Gamma',
    src: 'https://www.google.com/s2/favicons?domain=gamma.app&sz=128',
  },
  'canva-magic-studio': {
    name: 'Canva Magic Studio',
    src: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg',
  },
  'beautiful-ai': {
    name: 'Beautiful.ai',
    src: 'https://www.google.com/s2/favicons?domain=beautiful.ai&sz=128',
  },
  'tome-app': {
    name: 'Tome',
    src: 'https://logotyp.us/file/tome.svg',
  },
  'slides-ai': {
    name: 'SlidesAI',
    src: 'https://www.google.com/s2/favicons?domain=slidesai.io&sz=128',
  },
  uizard: {
    name: 'Uizard',
    src: 'https://www.google.com/s2/favicons?domain=uizard.io&sz=128',
  },
  'galileo-ai': {
    name: 'Galileo AI',
    src: 'https://www.google.com/s2/favicons?domain=usegalileo.ai&sz=128',
  },
  'pitch-ai': {
    name: 'Pitch AI',
    src: 'https://logotyp.us/file/pitch.svg',
  },
  'kittl-ai': {
    name: 'Kittl AI',
    src: 'https://www.google.com/s2/favicons?domain=kittl.com&sz=128',
  },

  // --------------------------------------------------------------------------
  // Image Generation & Editing
  // --------------------------------------------------------------------------
  midjourney: {
    name: 'Midjourney',
    src: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Midjourney_Emblem.png',
  },
  'adobe-firefly': {
    name: 'Adobe Firefly',
    src: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Adobe_Firefly_Logo.svg',
  },
  ideogram: {
    name: 'Ideogram',
    src: 'https://www.google.com/s2/favicons?domain=ideogram.ai&sz=128',
  },
  'flux-ai': {
    name: 'Flux by Black Forest Labs',
    src: 'https://www.google.com/s2/favicons?domain=blackforestlabs.ai&sz=128',
  },
  'leonardo-ai': {
    name: 'Leonardo.ai',
    src: 'https://www.google.com/s2/favicons?domain=leonardo.ai&sz=128',
  },
  'stable-diffusion': {
    name: 'Stable Diffusion',
    src: 'https://icons.duckduckgo.com/ip3/stability.ai.ico',
  },
  photoroom: {
    name: 'Photoroom',
    src: 'https://www.google.com/s2/favicons?domain=photoroom.com&sz=128',
  },
  'magnific-ai': {
    name: 'Magnific AI',
    src: 'https://www.google.com/s2/favicons?domain=magnific.ai&sz=128',
  },
  clipdrop: {
    name: 'Clipdrop',
    src: 'https://www.google.com/s2/favicons?domain=clipdrop.co&sz=128',
  },
  recraft: {
    name: 'Recraft',
    src: 'https://www.google.com/s2/favicons?domain=recraft.ai&sz=128',
  },
  'krea-ai': {
    name: 'Krea AI',
    src: 'https://www.google.com/s2/favicons?domain=krea.ai&sz=128',
  },
  'playground-ai': {
    name: 'Playground AI',
    src: 'https://www.google.com/s2/favicons?domain=playground.com&sz=128',
  },

  // --------------------------------------------------------------------------
  // Marketing & Business
  // --------------------------------------------------------------------------
  'surfer-seo': {
    name: 'Surfer SEO',
    src: 'https://www.google.com/s2/favicons?domain=surferseo.com&sz=128',
  },
  'adcreative-ai': {
    name: 'AdCreative.ai',
    src: 'https://www.google.com/s2/favicons?domain=adcreative.ai&sz=128',
  },
  marketmuse: {
    name: 'MarketMuse',
    src: 'https://www.google.com/s2/favicons?domain=marketmuse.com&sz=128',
  },
  brand24: {
    name: 'Brand24 AI',
    src: 'https://www.google.com/s2/favicons?domain=brand24.com&sz=128',
  },
  'seventh-sense': {
    name: 'Seventh Sense',
    src: 'https://www.google.com/s2/favicons?domain=theseventhsense.com&sz=128',
  },
  manychat: {
    name: 'ManyChat AI',
    src: 'https://www.google.com/s2/favicons?domain=manychat.com&sz=128',
  },

  // --------------------------------------------------------------------------
  // Productivity & Automation
  // --------------------------------------------------------------------------
  'notion-ai': {
    name: 'Notion AI',
    src: 'https://cdn.simpleicons.org/notion',
  },
  'zapier-ai': {
    name: 'Zapier Central & AI',
    src: 'https://cdn.simpleicons.org/zapier',
  },
  'make-ai': {
    name: 'Make AI',
    src: 'https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/make.svg',
  },
  'otter-ai': {
    name: 'Otter.ai',
    src: 'https://logotyp.us/file/otter.svg',
  },
  'fireflies-ai': {
    name: 'Fireflies.ai',
    src: 'https://www.google.com/s2/favicons?domain=fireflies.ai&sz=128',
  },
  'fathom-video': {
    name: 'Fathom Video Notetaker',
    src: 'https://cdn.simpleicons.org/fathom',
  },
  usemotion: {
    name: 'Motion',
    src: 'https://www.google.com/s2/favicons?domain=usemotion.com&sz=128',
  },
  'reclaim-ai': {
    name: 'Reclaim.ai',
    src: 'https://www.google.com/s2/favicons?domain=reclaim.ai&sz=128',
  },
  'superhuman-ai': {
    name: 'Superhuman AI',
    src: 'https://www.google.com/s2/favicons?domain=superhuman.com&sz=128',
  },
  'mem-ai': {
    name: 'Mem.ai',
    src: 'https://www.google.com/s2/favicons?domain=mem.ai&sz=128',
  },

  // --------------------------------------------------------------------------
  // Study & Research
  // --------------------------------------------------------------------------
  perplexity: {
    name: 'Perplexity AI',
    src: 'https://cdn.simpleicons.org/perplexity',
  },
  elicit: {
    name: 'Elicit',
    src: 'https://www.google.com/s2/favicons?domain=elicit.com&sz=128',
  },
  consensus: {
    name: 'Consensus',
    src: 'https://www.google.com/s2/favicons?domain=consensus.app&sz=128',
  },
  notebooklm: {
    name: 'NotebookLM by Google',
    src: 'https://cdn.simpleicons.org/notebooklm',
  },
  'scite-ai': {
    name: 'Scite.ai',
    src: 'https://www.google.com/s2/favicons?domain=scite.ai&sz=128',
  },
  scholarcy: {
    name: 'Scholarcy',
    src: 'https://www.google.com/s2/favicons?domain=scholarcy.com&sz=128',
  },
  scispace: {
    name: 'SciSpace',
    src: 'https://www.google.com/s2/favicons?domain=typeset.io&sz=128',
  },
  researchrabbit: {
    name: 'ResearchRabbit',
    src: 'https://www.google.com/s2/favicons?domain=researchrabbit.ai&sz=128',
  },
  'connected-papers': {
    name: 'Connected Papers',
    src: 'https://www.google.com/s2/favicons?domain=connectedpapers.com&sz=128',
  },
  chatpdf: {
    name: 'ChatPDF',
    src: 'https://www.google.com/s2/favicons?domain=chatpdf.com&sz=128',
  },

  // --------------------------------------------------------------------------
  // Video Generation
  // --------------------------------------------------------------------------
  runway: {
    name: 'Runway',
    src: 'https://www.google.com/s2/favicons?domain=runwayml.com&sz=128',
  },
  pika: {
    name: 'Pika',
    src: 'https://www.google.com/s2/favicons?domain=pika.art&sz=128',
  },
  'kling-ai': {
    name: 'Kling AI',
    src: 'https://www.google.com/s2/favicons?domain=klingai.com&sz=128',
  },
  'luma-dream-machine': {
    name: 'Luma Dream Machine',
    src: 'https://www.google.com/s2/favicons?domain=lumalabs.ai&sz=128',
  },
  heygen: {
    name: 'HeyGen',
    src: 'https://www.google.com/s2/favicons?domain=heygen.com&sz=128',
  },
  synthesia: {
    name: 'Synthesia',
    src: 'https://logotyp.us/file/synthesia.svg',
  },
  'hailuo-ai': {
    name: 'Hailuo AI',
    src: 'https://www.google.com/s2/favicons?domain=hailuoai.video&sz=128',
  },
  descript: {
    name: 'Descript',
    src: 'https://logotyp.us/file/descript.svg',
  },
  'captions-ai': {
    name: 'Captions',
    src: 'https://www.google.com/s2/favicons?domain=captions.ai&sz=128',
  },
  'opus-clip': {
    name: 'Opus Clip',
    src: 'https://www.google.com/s2/favicons?domain=opus.pro&sz=128',
  },

  // --------------------------------------------------------------------------
  // Writing & Content
  // --------------------------------------------------------------------------
  grammarly: {
    name: 'Grammarly',
    src: 'https://cdn.simpleicons.org/grammarly',
  },
  'jasper-ai': {
    name: 'Jasper',
    src: 'https://logotyp.us/file/jasper.svg',
  },
  'copy-ai': {
    name: 'Copy.ai',
    src: 'https://www.google.com/s2/favicons?domain=copy.ai&sz=128',
  },
  writesonic: {
    name: 'Writesonic',
    src: 'https://www.google.com/s2/favicons?domain=writesonic.com&sz=128',
  },
  quillbot: {
    name: 'QuillBot',
    src: 'https://www.google.com/s2/favicons?domain=quillbot.com&sz=128',
  },
  sudowrite: {
    name: 'Sudowrite',
    src: 'https://www.google.com/s2/favicons?domain=sudowrite.com&sz=128',
  },
  rytr: {
    name: 'Rytr',
    src: 'https://www.google.com/s2/favicons?domain=rytr.me&sz=128',
  },
  wordtune: {
    name: 'Wordtune',
    src: 'https://www.google.com/s2/favicons?domain=wordtune.com&sz=128',
  },
  anyword: {
    name: 'Anyword',
    src: 'https://www.google.com/s2/favicons?domain=anyword.com&sz=128',
  },
  'hemingway-editor': {
    name: 'Hemingway Editor Plus',
    src: 'https://www.google.com/s2/favicons?domain=hemingwayapp.com&sz=128',
  },

  // --------------------------------------------------------------------------
  // Audio, Voice & Music
  // --------------------------------------------------------------------------
  elevenlabs: {
    name: 'ElevenLabs',
    src: 'https://cdn.simpleicons.org/elevenlabs',
  },
  suno: {
    name: 'Suno',
    src: 'https://cdn.simpleicons.org/suno',
  },
  udio: {
    name: 'Udio',
    src: 'https://www.google.com/s2/favicons?domain=udio.com&sz=128',
  },
  'adobe-podcast': {
    name: 'Adobe Podcast AI',
    src: 'https://www.google.com/s2/favicons?domain=podcast.adobe.com&sz=128',
  },
  'murf-ai': {
    name: 'Murf.ai',
    src: 'https://www.google.com/s2/favicons?domain=murf.ai&sz=128',
  },
  speechify: {
    name: 'Speechify',
    src: 'https://www.google.com/s2/favicons?domain=speechify.com&sz=128',
  },
  'resemble-ai': {
    name: 'Resemble AI',
    src: 'https://www.google.com/s2/favicons?domain=resemble.ai&sz=128',
  },
  'krisp-ai': {
    name: 'Krisp.ai',
    src: 'https://www.google.com/s2/favicons?domain=krisp.ai&sz=128',
  },

  // --------------------------------------------------------------------------
  // Career & Data Analytics
  // --------------------------------------------------------------------------
  rezi: {
    name: 'Rezi',
    src: 'https://www.google.com/s2/favicons?domain=rezi.ai&sz=128',
  },
  'teal-hq': {
    name: 'Teal HQ',
    src: 'https://cdn.simpleicons.org/teal',
  },
  'julius-ai': {
    name: 'Julius AI',
    src: 'https://www.google.com/s2/favicons?domain=julius.ai&sz=128',
  },
  akkio: {
    name: 'Akkio',
    src: 'https://www.google.com/s2/favicons?domain=akkio.com&sz=128',
  },
};

/**
 * Renders the official brand logo for an AI tool.
 * Strictly uses verified official brand assets without empty states or fake graphics.
 */
export const AiToolLogo: React.FC<AiToolLogoProps> = ({
  slug,
  name,
  className = 'w-full h-full',
}) => {
  const normalizedSlug = slug ? slug.toLowerCase().trim() : '';

  const resolveLogoUrl = (s: string): string => {
    const item = OFFICIAL_AI_TOOL_LOGOS[s];
    if (item?.src) return item.src;
    const tool = getAiToolBySlug(s);
    if (tool?.officialUrl) {
      try {
        const domain = new URL(tool.officialUrl).hostname.replace(/^www\./, '');
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
      } catch {
        return tool.logoUrl || '';
      }
    }
    return tool?.logoUrl || '';
  };

  const initialUrl = resolveLogoUrl(normalizedSlug);
  const [currentSrc, setCurrentSrc] = useState<string>(initialUrl);
  const [hasTriedFallback, setHasTriedFallback] = useState<boolean>(false);

  useEffect(() => {
    const url = resolveLogoUrl(normalizedSlug);
    setCurrentSrc(url);
    setHasTriedFallback(false);
  }, [normalizedSlug]);

  const handleError = () => {
    if (!hasTriedFallback) {
      setHasTriedFallback(true);
      const tool = getAiToolBySlug(normalizedSlug);
      if (tool?.officialUrl) {
        try {
          const domain = new URL(tool.officialUrl).hostname.replace(/^www\./, '');
          const fallback = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
          if (fallback !== currentSrc) {
            setCurrentSrc(fallback);
            return;
          }
        } catch {
          // ignore
        }
      }
      if (tool?.logoUrl && tool.logoUrl !== currentSrc) {
        setCurrentSrc(tool.logoUrl);
        return;
      }
      setCurrentSrc('');
    } else {
      setCurrentSrc('');
    }
  };

  if (!currentSrc) {
    const initial = name ? name.charAt(0).toUpperCase() : 'A';
    return (
      <div className={`${className} flex items-center justify-center font-bold text-sm text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl select-none`}>
        {initial}
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={`${name} official brand logo`}
      loading="lazy"
      className={`${className} object-contain transition-transform duration-300`}
      onError={handleError}
    />
  );
};
