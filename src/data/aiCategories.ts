import { AiCategory } from '../types/aiTools';

export const AI_CATEGORIES: AiCategory[] = [
  {
    id: 'chat-assistants',
    slug: 'chat-assistants',
    name: 'Chat & Assistants',
    icon: 'MessageSquare',
    shortDesc: 'Conversational AI agents, multi-modal reasoning models, and personalized desktop assistants.',
    colorAccent: 'from-blue-500/20 to-indigo-500/20',
    editorial: {
      overview: 'Chat assistants and conversational AI models help users brainstorm, solve problems, analyze files, synthesize knowledge, and automate tasks through interactive dialogue. Modern assistants support multi-turn dialogue, web browsing, long context windows, and code execution.',
      commonUseCases: [
        'Answering complex technical, academic, and business questions',
        'Drafting, summarizing, and translating documents or lengthy transcripts',
        'Brainstorming creative strategies, campaign concepts, and project outlines',
        'Debugging scripts, explaining complex formulas, and executing computational logic'
      ],
      selectionGuide: [
        'Context Window: Determine if you need models with massive context windows (e.g. 100k+ tokens) for analyzing entire books or code repositories.',
        'Privacy & Training Policies: Check whether your conversations are used to train future foundation models or if zero-data-retention options are available.',
        'Specialized vs. General Reasoning: Evaluate whether a versatile general assistant or a domain-focused assistant best matches your workflow.'
      ]
    }
  },
  {
    id: 'image-generation',
    slug: 'image-generation',
    name: 'Image Generation & Editing',
    icon: 'Image',
    shortDesc: 'Text-to-image synthesis, generative photo editing, upscale utilities, and visual asset creation.',
    colorAccent: 'from-purple-500/20 to-pink-500/20',
    editorial: {
      overview: 'AI image generators and generative editing suites transform natural language text prompts into high-resolution illustrations, photorealistic scenes, concept art, and commercial product imagery.',
      commonUseCases: [
        'Generating marketing graphics, blog header visuals, and social media creative assets',
        'Storyboarding concept art, character sketches, and visual prototypes for game design',
        'Inpainting, outpainting, generative background replacement, and intelligent resolution upscaling',
        'Designing product packaging mockups and architectural visual concept boards'
      ],
      selectionGuide: [
        'Aesthetic Style: Different models specialize in hyper-realistic photography, painterly artwork, 3D renders, or minimalist vector styles.',
        'Prompt Adherence & Text Rendering: Assess how accurately the model renders embedded typography, fine textures, and complex multi-object spatial relationships.',
        'Commercial Usage Rights: Verify licensing terms to ensure generated assets can be deployed commercially without trademark or copyright ambiguities.'
      ]
    }
  },
  {
    id: 'video-generation',
    slug: 'video-generation',
    name: 'Video Generation & Editing',
    icon: 'Video',
    shortDesc: 'Text-to-video synthesis, motion animation, AI b-roll generation, and automated video editing.',
    colorAccent: 'from-rose-500/20 to-amber-500/20',
    editorial: {
      overview: 'Generative video platforms produce cinematic motion sequences, animate static photographs, generate talking-head avatars, and streamline post-production editing from text descriptions or visual reference frames.',
      commonUseCases: [
        'Producing cinematic b-roll and atmospheric background video for video essays and ads',
        'Animating static product photography into engaging short-form social reels and TikToks',
        'Creating localized multilingual training videos with synchronized virtual presenters',
        'Automatic clip trimming, aspect-ratio reframing, and automated silence removal'
      ],
      selectionGuide: [
        'Temporal Consistency: Look for models that preserve physics, lighting, and character fidelity across multi-second continuous shots.',
        'Camera Motion Control: Evaluate if the platform supports customizable camera paths (pan, zoom, tilt, orbit) and motion brush inputs.',
        'Rendering Speed & Resolution: Review export frame rates, maximum clip length, and credit-based computing limits.'
      ]
    }
  },
  {
    id: 'coding-development',
    slug: 'coding-development',
    name: 'Coding & Development',
    icon: 'Code2',
    shortDesc: 'AI code completion, full-stack scaffolders, automated test writers, and intelligent IDE extensions.',
    colorAccent: 'from-emerald-500/20 to-teal-500/20',
    editorial: {
      overview: 'AI developer tools augment software engineering workflows with contextual code autocomplete, automated refactoring, unit test generation, repository-wide indexing, and natural language terminal commands.',
      commonUseCases: [
        'Accelerating boilerplate construction, API integration, and framework scaffolding',
        'Explaining legacy codebases and generating comprehensive automated unit tests',
        'Real-time inline tab-completions tailored to current project dependencies and patterns',
        'Converting natural language descriptions into responsive web UI components and backend queries'
      ],
      selectionGuide: [
        'Repository Context: The best developer tools index your whole repository to understand cross-file types and architecture.',
        'IDE Integration: Consider whether you prefer an extension for VS Code/JetBrains or a dedicated AI-native IDE.',
        'Code Privacy: Verify whether code snippets or proprietary intellectual property are stored or used for telemetry.'
      ]
    }
  },
  {
    id: 'writing-content',
    slug: 'writing-content',
    name: 'Writing & Content',
    icon: 'PenTool',
    shortDesc: 'Long-form editorial drafting, copy editing, grammar refinement, and creative storytelling.',
    colorAccent: 'from-amber-500/20 to-orange-500/20',
    editorial: {
      overview: 'Writing assistants aid authors, copywriters, and content teams with drafting blog posts, refining tone and cadence, eliminating grammatical errors, restructuring arguments, and overcoming writer’s block.',
      commonUseCases: [
        'Composing structured articles, whitepapers, press releases, and executive summaries',
        'Polishing prose for clarity, active voice, sentence variety, and specific brand guidelines',
        'Repurposing podcasts and webinars into newsletters, LinkedIn posts, and editorial summaries',
        'Overcoming blank-page paralysis with creative outlines and alternative angle suggestions'
      ],
      selectionGuide: [
        'Voice & Brand Tone: Check if the tool allows you to train or establish custom brand style guides and vocabulary.',
        'Plagiarism & Fact Checking: Look for integrated attribution checks and source verification mechanisms.',
        'Workflow Integration: Determine if the tool plugs directly into your CMS, Google Docs, Word, or browser.'
      ]
    }
  },
  {
    id: 'study-research',
    slug: 'study-research',
    name: 'Study & Research',
    icon: 'GraduationCap',
    shortDesc: 'Academic paper search, literature review synthesis, citation discovery, and student revision aids.',
    colorAccent: 'from-cyan-500/20 to-blue-500/20',
    editorial: {
      overview: 'Research platforms apply AI to scientific literature, academic archives, and dense textbook corpora. They extract empirical findings, trace citation networks, synthesize consensus, and explain complex concepts.',
      commonUseCases: [
        'Searching peer-reviewed journals with semantic queries rather than rigid keyword boolean strings',
        'Synthesizing empirical findings across dozens of randomized controlled trials or papers',
        'Generating flashcards, practice questions, and progressive explanations for exam preparation',
        'Summarizing 80-page technical papers into digestible key findings with pinpoint citation anchors'
      ],
      selectionGuide: [
        'Citation Fidelity: Prioritize platforms that cite exact page numbers and DOIs to eliminate hallucinated sources.',
        'Corpus Coverage: Check whether the platform indexes OpenAccess repositories, PubMed, Semantic Scholar, or proprietary databases.',
        'Export Capabilities: Verify support for BibTeX, Zotero, Mendeley, and standard reference managers.'
      ]
    }
  },
  {
    id: 'productivity-automation',
    slug: 'productivity-automation',
    name: 'Productivity & Automation',
    icon: 'Zap',
    shortDesc: 'Workflow automation, calendar management, automated note taking, and task orchestrators.',
    colorAccent: 'from-yellow-500/20 to-emerald-500/20',
    editorial: {
      overview: 'Productivity and automation tools streamline repetitive digital chores by connecting enterprise software, transcribing virtual meetings, drafting follow-ups, and organizing workspace knowledge into self-updating hubs.',
      commonUseCases: [
        'Transcribing remote meetings and auto-assigning action items with contextual timestamps',
        'Building cross-application automations using natural language instruction rather than code',
        'Triaging incoming inboxes, scheduling meetings across conflicting time zones, and drafting replies',
        'Centralizing company wikis and Notion/Slack knowledge into instant-answer search bars'
      ],
      selectionGuide: [
        'Ecosystem Compatibility: Ensure native connectors exist for Google Workspace, Microsoft 365, Slack, and Jira.',
        'Reliability & Fallbacks: Choose tools with clear human-in-the-loop review steps for high-stakes automations.',
        'Security Compliance: Confirm SOC 2 Type II, GDPR, and enterprise access control certifications.'
      ]
    }
  },
  {
    id: 'audio-voice-music',
    slug: 'audio-voice-music',
    name: 'Audio, Voice & Music',
    icon: 'Mic',
    shortDesc: 'Realistic voice synthesis, voice cloning, audio cleanup, and full generative music creation.',
    colorAccent: 'from-indigo-500/20 to-violet-500/20',
    editorial: {
      overview: 'Audio and voice platforms produce hyper-realistic human speech, multi-speaker voice clones, studio-grade vocal isolation, background noise reduction, and custom musical compositions across genres.',
      commonUseCases: [
        'Synthesizing natural voiceovers for e-learning courses, audiobooks, and documentary narration',
        'Cleaning up degraded podcast recordings by removing echo, wind, background chatter, and clicks',
        'Generating bespoke instrumental background tracks tailored to exact video pacing and moods',
        'Translating spoken audio into foreign languages while preserving the speaker’s original vocal timbre'
      ],
      selectionGuide: [
        'Expressiveness & Latency: Look for natural inflection, pauses, emotional range, and real-time streaming latency.',
        'Voice Cloning Ethics: Check for voice ownership verification protocols to ensure responsible usage.',
        'Stems & Mixing: For music generators, evaluate whether separated instrument stems (vocals, drums, bass) can be exported.'
      ]
    }
  },
  {
    id: 'hr-career',
    slug: 'hr-career',
    name: 'HR & Career',
    icon: 'Briefcase',
    shortDesc: 'Resume optimization, interview coaching, candidate screening, and job search intelligence.',
    colorAccent: 'from-sky-500/20 to-indigo-500/20',
    editorial: {
      overview: 'HR and career utilities assist job seekers with tailoring resumes and practicing realistic interview simulations, while helping talent acquisition teams score applicant profiles and draft compelling job descriptions.',
      commonUseCases: [
        'Tailoring resumes to match Applicant Tracking System (ATS) keywords and job descriptions',
        'Simulating interactive behavioral and technical job interviews with tailored feedback',
        'Drafting clear, inclusive job postings and standardized candidate evaluation rubrics',
        'Analyzing salary compensation benchmarks and preparing data-driven negotiation strategies'
      ],
      selectionGuide: [
        'ATS Formatting Standards: Ensure exported resumes use standard single-column machine-readable layouts.',
        'Bias Mitigation: For hiring platforms, confirm algorithms are audited to avoid demographic bias in candidate ranking.',
        'Actionable Feedback: Prefer tools that provide concrete structural suggestions rather than generic score numbers.'
      ]
    }
  },
  {
    id: 'marketing-business',
    slug: 'marketing-business',
    name: 'Marketing & Business',
    icon: 'TrendingUp',
    shortDesc: 'Market research, ad copy optimization, competitor intelligence, and customer insights.',
    colorAccent: 'from-rose-500/20 to-purple-500/20',
    editorial: {
      overview: 'Marketing and business tools leverage AI to analyze customer sentiment, generate high-converting ad variations, track competitor strategies, and predict market trends across multi-channel campaigns.',
      commonUseCases: [
        'Generating dozens of high-performing variations for search and social ad headlines',
        'Synthesizing user reviews and customer feedback into prioritized product feature requests',
        'Analyzing competitor keyword strategies, content gaps, and pricing adjustments',
        'Personalizing outbound sales email sequences based on recipient company news and triggers'
      ],
      selectionGuide: [
        'Performance Attribution: Evaluate whether the platform integrates with Google Analytics, Meta Ads, and CRM data.',
        'Audience Segmentation: Look for tools capable of targeting specific buyer personas with differentiated messaging.',
        'Scale & Batch Generation: Check capabilities for bulk generation across hundreds of SKUs or localized regions.'
      ]
    }
  },
  {
    id: 'design-presentations',
    slug: 'design-presentations',
    name: 'Design & Presentations',
    icon: 'Presentation',
    shortDesc: 'AI presentation generators, UI design assistants, vector creation, and brand asset builders.',
    colorAccent: 'from-fuchsia-500/20 to-pink-500/20',
    editorial: {
      overview: 'Design and presentation platforms generate structured slide decks, design system palettes, interactive UI wireframes, and polished visual collateral from raw text documents or brief bullet points.',
      commonUseCases: [
        'Transforming meeting notes or business proposals into polished executive slide decks in seconds',
        'Generating responsive web wireframes and UI component mockups directly in design canvas tools',
        'Creating custom vector iconography, illustrations, and color palettes adhering to brand rules',
        'Formatting complex pitch decks, investor quarterly updates, and educational slide series'
      ],
      selectionGuide: [
        'Editing Flexibility: Ensure the tool permits granular slide editing, font changes, and asset repositioning.',
        'Export Formats: Look for export options to PowerPoint (.pptx), Google Slides, PDF, and Figma.',
        'Design Consistency: Check if brand templates, logo watermarks, and typography can be locked across slides.'
      ]
    }
  },
  {
    id: 'data-analytics',
    slug: 'data-analytics',
    name: 'Data & Analytics',
    icon: 'BarChart3',
    shortDesc: 'Natural language data queries, automated charting, predictive forecasting, and spreadsheet formula helpers.',
    colorAccent: 'from-cyan-500/20 to-emerald-500/20',
    editorial: {
      overview: 'Data analytics platforms enable users to analyze complex CSV files, SQL databases, and spreadsheets by asking questions in plain English, generating instant charts, correlation matrices, and predictive trend lines.',
      commonUseCases: [
        'Uploading sales spreadsheets and asking conversational questions like "Which product had highest ROI in Q3?"',
        'Generating complex SQL queries, Excel formulas, and Python data visualization code',
        'Detecting anomalies, outliers, and emerging churn trends in customer database records',
        'Creating executive KPI dashboards and interactive charts without writing code'
      ],
      selectionGuide: [
        'Data Security & Compliance: Ensure sensitive financial or customer data is never cached or used for public training.',
        'Connector Support: Confirm integration with PostgreSQL, Snowflake, BigQuery, Excel, and Google Sheets.',
        'Computational Precision: Verify that calculations use rigorous deterministic code (e.g. Python Pandas) rather than probabilistic guesses.'
      ]
    }
  }
];

export function getAiCategoryBySlug(slug: string): AiCategory | undefined {
  return AI_CATEGORIES.find((c) => c.slug === slug || c.id === slug);
}
