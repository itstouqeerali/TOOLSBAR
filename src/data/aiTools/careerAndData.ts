import { AiTool } from '../../types/aiTools';

export const CAREER_AND_DATA_TOOLS: AiTool[] = [
  {
    id: 'rezi',
    slug: 'rezi',
    name: 'Rezi',
    logoUrl: 'https://www.rezi.ai/favicon.ico',
    officialUrl: 'https://www.rezi.ai',
    shortDescription: 'AI resume builder optimized for ATS algorithms, keyword targeting, cover letters, and interview coaching.',
    fullDescription: `Rezi is an artificial intelligence-powered resume builder, cover letter generator, and career acceleration platform engineered specifically to help job seekers create resumes that pass Applicant Tracking Systems (ATS). Founded by Jacob Jacquet, Rezi addresses the primary reason qualified job seekers fail to land interviews: legacy formatting, missing keywords, and poor document structure that cause automated enterprise hiring algorithms (such as Workday, Taleo, and Greenhouse) to filter out resumes before a human recruiter ever sees them.

At the technical foundation of Rezi is its proprietary "Rezi Score" and ATS content optimization engine. When a job seeker pastes a target job description alongside their resume draft, Rezi's semantic parser analyzes the job posting to identify critical technical skills, required certifications, action verbs, and domain terminology. It then evaluates the resume against standard ATS parsing rules—checking single-column hierarchy, standard font formatting, bullet point structure, and keyword density. Rezi provides real-time, actionable suggestions to weave missing keywords naturally into experience bullet points without keyword stuffing.

Rezi's suite includes specialized generative tools, including the "AI Bullet Point Writer," which transforms vague job descriptions into high-impact, quantifiable accomplishment statements following proven resume formulas (Action Verb + Context + Measurable Result). The platform also features automated Cover Letter generation, Resignation Letter builders, and AI-driven mock interview practice tailored to the user's specific target job description. All exported documents adhere strictly to ATS-compatible formatting standards, available in clean PDF and Microsoft Word (.docx) formats.

Rezi operates on a freemium model with a free plan for basic resume building alongside affordable Pro subscriptions and lifetime access options that unlock unlimited resume versions, AI generation credits, and professional resume review services. Trusted by over two million job seekers worldwide, Rezi levels the playing field against automated recruiting software, empowering professionals to land interviews with confidence. Furthermore, Rezi provides continuous content audits and real-time formatting validation, alerting job seekers to formatting inconsistencies or punctuation errors that might trigger rejection by strict applicant tracking systems. By pairing intelligent career drafting tools with proven ATS formatting benchmarks, Rezi equips job applicants with an essential career accelerator for navigating modern hiring processes with confidence.`,
    primaryCategory: 'hr-career',
    categories: ['hr-career', 'writing-content'],
    tags: ['ATS Resume', 'Job Search', 'Career AI', 'Cover Letter', 'Resume Optimizer'],
    bestFor: ['Job seekers optimizing resumes to bypass automated corporate ATS filters', 'Targeting resume bullet points to match specific job description keywords', 'Drafting personalized cover letters and resignation letters in seconds'],
    pricingType: 'freemium',
    startingPrice: '$29/month',
    currency: 'USD',
    pricingSummary: 'Free tier allows creating 1 basic resume with limited AI credits; Pro subscription is $29/month for unlimited resumes, AI keyword targeting, and cover letters; Lifetime access available for $129.',
    pricingUrl: 'https://www.rezi.ai/pricing',
    hasFreePlan: true,
    hasFreeTrial: false,
    platforms: ['Web'],
    keyFeatures: [
      'Rezi Score: real-time metric auditing your resume against 23 ATS formatting and content criteria',
      'AI Keyword Targeting: paste a target job posting to identify missing technical skills and keywords',
      'AI Bullet Point Writer: rewrites weak job descriptions into high-impact, metric-driven achievements',
      'Cover Letter Generator: creates bespoke, professionally formatted cover letters matching your resume style'
    ],
    useCases: [
      'Tailoring a single master resume for 5 different senior software engineering job applications',
      'Rewriting passive bullet points ("Responsible for sales") into active impact ("Drove $1.2M in net revenue, exceeding quota by 18%")',
      'Exporting clean single-column machine-readable PDF and DOCX files guaranteed to parse cleanly in Workday'
    ],
    strengths: [
      'Strict adherence to single-column, machine-readable ATS formats that actually get through recruiter screens',
      'Rezi Score provides an objective, actionable checklist to improve resume strength',
      'Offers a one-time lifetime license option ($129) to avoid perpetual subscriptions'
    ],
    limitations: [
      'Focuses strictly on clean, minimalist ATS formatting rather than colorful creative graphic design resumes',
      'Free tier restricts AI generation credits and limits you to a single resume document',
      'AI bullet points still require human verification to ensure accurate personal career statistics'
    ],
    targetAudience: ['Job Seekers', 'Career Switchers', 'Recent Graduates', 'Executives', 'Recruiters'],
    alternatives: ['teal-hq', 'grammarly'],
    faq: [
      {
        question: 'What is an ATS-friendly resume?',
        answer: 'An ATS-friendly resume uses standard single-column layouts, clean typography, and clear section headings that Applicant Tracking Systems (like Workday, Greenhouse, and Lever) can parse accurately without dropping information.'
      },
      {
        question: 'Can I use Rezi for free?',
        answer: 'Yes, Rezi provides a free tier that allows you to create and download a basic ATS resume with limited AI credits.'
      },
      {
        question: 'Does Rezi offer a lifetime plan?',
        answer: 'Yes, Rezi offers a popular one-time lifetime purchase option ($129) that provides unlimited access forever without recurring monthly fees.'
      }
    ],
    dateAdded: '2026-09-08',
    lastVerifiedAt: 'October 2026',
    lastPricingVerifiedAt: 'October 2026',
    isFeatured: false,
    isPublished: true,
    seoTitle: 'Rezi AI — ATS Resume Builder, Keyword Targeting & Review',
    seoDescription: 'Independent guide to Rezi AI resume builder. Learn about ATS optimization, Rezi Score grading, keyword targeting, cover letters, and pricing.'
  },
  {
    id: 'teal-hq',
    slug: 'teal-hq',
    name: 'Teal HQ',
    logoUrl: 'https://www.tealhq.com/favicon.ico',
    officialUrl: 'https://www.tealhq.com',
    shortDescription: 'Comprehensive career growth platform and AI job search tracker with resume builder, LinkedIn review, and job board CRM.',
    fullDescription: `Teal (Teal HQ) is an all-in-one career growth platform, AI resume builder, and job search management system founded by David Fano. Engineered to help modern job seekers navigate competitive employment markets, Teal acts as an intelligent career copilot, replacing scattered spreadsheets, bookmarked job boards, and fragmented resume drafts with a centralized, automated job search tracker.

The core of Teal's platform is its Chrome browser extension and unified "Job Tracker." As users browse job listings across LinkedIn, Indeed, Glassdoor, BuiltIn, and company career pages, Teal's extension allows them to save any job posting to their personal job tracker with a single click. Teal automatically extracts crucial job metadata: job title, company name, salary compensation ranges, location, and key requirements. Users can manage their application pipeline through an intuitive Kanban board, tracking stages from saved and applied to interviewing and offer negotiation.

Teal pairs its job tracking system with an advanced "AI Resume Builder" and matching engine. When a user links a specific saved job description to their master career history, Teal analyzes the alignment between the candidate's experience and the job's requirements. The platform highlights matching skills, flags experience gaps, and uses generative AI to draft customized, metric-driven resume bullet points and tailored cover letters aligned with the specific role. Candidates can maintain a single "Work History" repository and instantly export customized, ATS-friendly resume variations for every application.

Teal operates on a freemium model with free access to core tracking and resume building tools alongside an affordable Teal+ subscription that unlocks unlimited AI keyword matching, automated work history imports from LinkedIn, and advanced application insights. By turning an overwhelming job search into an organized, data-driven process, Teal empowers job seekers to apply with precision and land rewarding careers. In addition, Teal provides interview preparation modules, automated follow-up email templates, and personalized application analytics, helping professionals track which resume versions achieve the highest interview callback rates. By combining strategic organization with targeted AI drafting, Teal transforms the job search into an empowering, data-driven journey toward career advancement across competitive corporate industries and fast-growing technology sectors worldwide, ensuring candidates present their strongest qualifications.`,
    primaryCategory: 'hr-career',
    categories: ['hr-career', 'productivity-automation'],
    tags: ['Job Tracker', 'Career Growth', 'Resume Builder', 'LinkedIn Optimizer', 'Job Search CRM'],
    bestFor: ['Managing a structured job search across multiple job boards in a single dashboard', 'Comparing resumes directly against job postings to identify missing keywords', 'Tracking application statuses, interview rounds, and follow-up reminders'],
    pricingType: 'freemium',
    startingPrice: '$9/week',
    currency: 'USD',
    pricingSummary: 'Free tier includes unlimited job tracking and basic resume building; Teal+ is $9/week (or $29/month) for unlimited AI generation, deep keyword matching, and advanced LinkedIn analysis.',
    pricingUrl: 'https://www.tealhq.com/pricing',
    hasFreePlan: true,
    hasFreeTrial: false,
    platforms: ['Web', 'Chrome Extension'],
    keyFeatures: [
      'Chrome Extension Job Tracker: save jobs with one click from LinkedIn, Indeed, Greenhouse, and Lever',
      'AI Matching Score: grades how closely your resume aligns with any saved job description',
      'AI Resume Builder: craft tailored bullet points and summaries aligned with target job titles',
      'LinkedIn Profile Review: audits headline, summary, and experience to boost recruiter discovery'
    ],
    useCases: [
      'Organizing a 60-application tech job search across a structured kanban board with interview notes',
      'Generating tailored resume bullet points highlighting specific skills requested in a job description',
      'Optimizing your LinkedIn headline and summary to rank higher in LinkedIn Recruiter searches'
    ],
    strengths: [
      'Acts as a complete personal CRM for your entire job search journey from application to offer',
      'Chrome extension makes saving jobs from any website seamless and effortless',
      'Generous free plan allows unlimited job tracking without paying'
    ],
    limitations: [
      'Teal+ subscription uses a weekly billing structure ($9/week) which requires careful management',
      'AI bullet generation requires Teal+ for unlimited uses',
      'Best suited for individual job seekers rather than corporate hiring managers'
    ],
    targetAudience: ['Job Seekers', 'Career Switchers', 'Remote Workers', 'Tech Professionals'],
    alternatives: ['rezi', 'grammarly'],
    faq: [
      {
        question: 'Is Teal’s Job Tracker free?',
        answer: 'Yes, Teal’s Job Application Tracker and Chrome extension are 100% free with no limits on how many jobs you can track.'
      },
      {
        question: 'How does Teal’s AI Matching Score work?',
        answer: 'Teal scans the text of the job posting you saved and compares it against your resume, highlighting matching hard skills, soft skills, and missing keywords.'
      },
      {
        question: 'Can Teal help optimize my LinkedIn profile?',
        answer: 'Yes, Teal includes an automated LinkedIn review tool that analyzes your headline, summary, and experience sections to improve recruiter visibility.'
      }
    ],
    dateAdded: '2026-09-09',
    lastVerifiedAt: 'October 2026',
    lastPricingVerifiedAt: 'October 2026',
    isFeatured: false,
    isPublished: true,
    seoTitle: 'Teal HQ — AI Job Application Tracker, Resume Builder & Review',
    seoDescription: 'Review of Teal HQ. Explore the free Chrome job tracker, AI resume keyword matching, LinkedIn profile optimizer, and Teal+ pricing.'
  },
  {
    id: 'julius-ai',
    slug: 'julius-ai',
    name: 'Julius AI',
    logoUrl: 'https://julius.ai/favicon.ico',
    officialUrl: 'https://julius.ai',
    shortDescription: 'AI data analyst that writes and executes Python to analyze spreadsheets, create interactive charts, and build statistical models.',
    fullDescription: `Julius AI is an advanced artificial intelligence data analyst and computational assistant designed to make data analysis, statistical modeling, and data visualization accessible to non-technical professionals, researchers, financial analysts, and business operators. Founded to eliminate the steep learning curve of programming languages like Python, R, and SQL, Julius AI allows users to upload raw data files and perform complex analytical operations using natural language prompts.

Under the hood, Julius AI operates by converting user questions into executable Python and R code inside a secure computational sandbox. When a user uploads structured data—such as CSV spreadsheets, Excel workbooks (.xlsx), Google Sheets, SQL database dumps, or PDF tables—Julius analyzes the schema, data types, and null values. When asked a question—such as "Clean the customer churn column, build a correlation matrix between tenure and lifetime spend, and plot a regression chart with confidence intervals"—Julius writes clean Python code, executes it in its container, and returns both the calculated answer and publication-quality visual charts.

Julius AI is renowned for generating interactive, aesthetically refined visualizations using modern plotting libraries like Seaborn, Plotly, and Matplotlib. Users can easily customize chart styles, modify axis scales, change color palettes, and export high-resolution PNGs, SVGs, or raw Python scripts for internal team documentation. In addition to exploratory data analysis, Julius can build predictive machine learning models, forecast time-series data, run ANOVA hypothesis tests, and synthesize multi-page PDF analytical briefing reports.

Julius AI adheres to strict data privacy standards, guaranteeing that customer spreadsheets and uploaded financial figures are never used to train public foundation models and ensuring that data is encrypted both in transit and at rest. Operating on a freemium subscription model with free monthly message allowances alongside paid tiers for heavy computing power, Julius AI transforms data analysis from a frustrating technical chore into an intuitive, high-speed conversational dialogue. Furthermore, Julius AI supports multi-file dataset merges, automated missing value imputation, and natural language statistical hypothesis testing, allowing business analysts to uncover hidden correlations with complete ease. By transforming complex data analysis into a fluid conversational dialogue, Julius AI democratizes data science across corporate teams, research laboratories, and growing enterprises.`,
    primaryCategory: 'data-analytics',
    categories: ['data-analytics', 'productivity-automation'],
    tags: ['Data Analyst', 'Python Execution', 'Spreadsheet AI', 'Data Visualizations', 'Statistics'],
    bestFor: ['Analyzing complex Excel and CSV spreadsheets without writing formulas or code', 'Generating publication-ready charts (scatter plots, heatmaps, histograms) in seconds', 'Conducting rigorous statistical modeling, linear regressions, and hypothesis testing'],
    pricingType: 'freemium',
    startingPrice: '$17.99/month',
    currency: 'USD',
    pricingSummary: 'Free tier allows 15 messages per month; Basic plan is $17.99/month (billed annually) for 250 messages/month; Pro plan is $37.99/month for unlimited messages, longer processing, and advanced export.',
    pricingUrl: 'https://julius.ai/pricing',
    hasFreePlan: true,
    hasFreeTrial: false,
    platforms: ['Web', 'iOS', 'Android'],
    keyFeatures: [
      'Deterministic Python sandbox: writes and runs real Python (Pandas, NumPy, Matplotlib) behind the scenes',
      'Supports CSV, XLSX, Google Sheets, PDF tables, Postgres, and MySQL database connections',
      'Interactive chart customizer: fine-tune chart colors, axes, titles, and download in vector SVG or PNG',
      'Advanced statistical tools: run ANOVA, regressions, forecasting, and clustering in plain English'
    ],
    useCases: [
      'Uploading an e-commerce sales ledger and asking "Which customer cohort had the highest lifetime value in Q3?"',
      'Cleaning messy spreadsheet data by automatically handling null values and standardized date formats',
      'Generating visual correlation heatmaps and boxplots for academic research dissertations'
    ],
    strengths: [
      'Executes actual Python code deterministically, eliminating the math hallucinations common in standard LLMs',
      'Produces beautiful, publication-quality data visualizations with interactive controls',
      'Mobile apps allow querying business data and viewing generated charts on the go'
    ],
    limitations: [
      'Free plan message limit (15 queries/month) is intended strictly for initial trial evaluation',
      'Extremely large multi-gigabyte datasets require enterprise cloud database connections',
      'Users should have a basic understanding of statistical principles to interpret complex regression outputs'
    ],
    targetAudience: ['Data Analysts', 'Product Managers', 'Academic Researchers', 'Financial Analysts', 'Marketing Leaders'],
    alternatives: ['akkio', 'chatgpt'],
    faq: [
      {
        question: 'Does Julius AI guess calculations or run actual code?',
        answer: 'Julius writes and runs real Python and R code in a secure sandbox environment to compute answers deterministically, ensuring mathematical precision with zero guesswork.'
      },
      {
        question: 'Can I connect Google Sheets and SQL databases to Julius?',
        answer: 'Yes, Julius supports direct connections to Google Sheets, PostgreSQL, and MySQL, as well as file uploads of CSV, Excel, and PDF tables.'
      },
      {
        question: 'Is Julius AI free to try?',
        answer: 'Yes, Julius offers a free plan with 15 queries per month so you can upload a dataset and test data analysis features.'
      }
    ],
    dateAdded: '2026-09-09',
    lastVerifiedAt: 'October 2026',
    lastPricingVerifiedAt: 'October 2026',
    isFeatured: true,
    isPublished: true,
    seoTitle: 'Julius AI Data Analyst — Review, Python Features & Official Access',
    seoDescription: 'In-depth guide to Julius AI. Explore spreadsheet analysis, automated charting, statistical modeling, pricing, and official access.'
  },
  {
    id: 'akkio',
    slug: 'akkio',
    name: 'Akkio',
    logoUrl: 'https://www.akkio.com/favicon.ico',
    officialUrl: 'https://www.akkio.com',
    shortDescription: 'Generative AI business intelligence and predictive analytics platform for agencies and marketing teams.',
    fullDescription: `Akkio is an enterprise-grade artificial intelligence analytics, generative business intelligence, and predictive modeling platform designed specifically for digital marketing agencies, growth operators, and enterprise business teams. Founded by Abe Parangi and Jonathon Reilly, Akkio bridges the gap between raw corporate data stores and actionable commercial insights by allowing users to clean data, build predictive machine learning models, and create interactive executive dashboards in minutes without writing code.

The core technological breakthrough of Akkio is its automated machine learning (AutoML) engine combined with conversational AI analytics ("Chat Explore"). Users connect their live data sources—including Google Sheets, Snowflake, BigQuery, HubSpot, Salesforce, Google Ads, and Meta Ads. With Chat Explore, business analysts can ask natural language questions about performance trends—such as "Which digital marketing channels generated the highest customer lifetime value last quarter, and what factors drove churn?"—and Akkio immediately generates clean charts, key insight summaries, and anomaly alerts.

Beyond historical reporting, Akkio specializes in predictive machine learning models. Without requiring a data science degree, marketing operators can build predictive models for lead scoring, customer churn prevention, sales forecasting, and lifetime value prediction. Akkio automatically handles data cleaning, feature engineering, model selection, and hyperparameter tuning, providing transparent model explainability metrics that show exactly which variables have the greatest impact on predictions. Teams can deploy these models via real-time webhooks or sync scored leads back into CRMs like HubSpot.

Akkio operates on tiered subscription plans tailored to agencies and fast-growing businesses, offering multi-client workspace management, white-label reporting, and SOC 2 Type II data security compliance. By empowering non-technical business professionals to harness the predictive power of machine learning, Akkio is an essential business intelligence engine for modern data-driven enterprises. In addition, Akkio provides intuitive white-label client dashboards, scheduled automated reports, and team collaboration features, allowing agency teams to present machine learning insights to stakeholders with complete clarity. By uniting automated machine learning with conversational business intelligence, Akkio empowers modern enterprises to make data-backed commercial decisions with speed, precision, and measurable return on investment across competitive commercial markets, unlocking valuable growth opportunities and strategic operational advantages across demanding enterprise business intelligence environments and modern growth agencies.`,
    primaryCategory: 'data-analytics',
    categories: ['data-analytics', 'marketing-business'],
    tags: ['Predictive Analytics', 'Business Intelligence', 'Lead Scoring', 'Churn Prediction', 'Client Dashboards'],
    bestFor: ['Marketing agencies building white-labeled predictive dashboards for clients', 'Predicting customer churn, lead conversion probability, and sales forecasting without code', 'Chatting with enterprise database records in natural language using Chat Explore'],
    pricingType: 'paid',
    startingPrice: '$49/month',
    currency: 'USD',
    pricingSummary: 'Starter plan is $49/month (billed annually) for 2 users and 1M data rows; Professional plan is $89/month for 5 users and automated predictive modeling; Team is $299/month for white-label client dashboards.',
    pricingUrl: 'https://www.akkio.com/pricing',
    hasFreePlan: false,
    hasFreeTrial: true,
    platforms: ['Web'],
    keyFeatures: [
      'Chat Data Explore: ask natural language questions across connected databases and receive instant charts',
      'No-Code Predictive Modeling: train predictive ML algorithms for lead scoring, churn, and revenue forecasting in minutes',
      'Generative BI Dashboards: automatically generate interactive client dashboards from connected data streams',
      'Native connectors: integrations with Google BigQuery, Snowflake, HubSpot, Salesforce, and Google Sheets'
    ],
    useCases: [
      'Training a machine learning model to score inbound leads (High/Medium/Low conversion) based on past sales history',
      'Building automated executive reporting dashboards that update in real time from advertising platforms',
      'Identifying high-risk customer segments likely to cancel recurring subscriptions within 60 days'
    ],
    strengths: [
      'Brings enterprise-level predictive machine learning to non-technical marketing and operations teams',
      'Combines conversational chat with automated dashboard generation and predictive modeling',
      'Strong white-labeling features for marketing agencies serving multiple clients'
    ],
    limitations: [
      'Paid platform starting at $49/month following the 14-day free trial; no permanent free plan',
      'Predictive models require historical data with clear outcome labels for accurate training',
      'Connecting enterprise warehouses (Snowflake, BigQuery) requires initial database credentials'
    ],
    targetAudience: ['Marketing Agencies', 'Operations Directors', 'RevOps Leaders', 'Growth Marketers'],
    alternatives: ['julius-ai', 'chatgpt'],
    faq: [
      {
        question: 'What is no-code predictive modeling in Akkio?',
        answer: 'Akkio lets you select an outcome column in your dataset (like "Converted: Yes/No") and automatically trains, tests, and deploys a machine learning prediction model in under 10 minutes without writing code.'
      },
      {
        question: 'Can agencies white-label Akkio dashboards?',
        answer: 'Yes, on agency and team plans, you can remove Akkio branding and share interactive live dashboards with your own agency logo and custom domain.'
      },
      {
        question: 'Does Akkio offer a free trial?',
        answer: 'Yes, Akkio offers a 14-day free trial with full access to predictive models and data exploration tools.'
      }
    ],
    dateAdded: '2026-09-10',
    lastVerifiedAt: 'October 2026',
    lastPricingVerifiedAt: 'October 2026',
    isFeatured: false,
    isPublished: true,
    seoTitle: 'Akkio — Generative BI, No-Code Predictive Analytics & Review',
    seoDescription: 'Independent review of Akkio. Discover no-code predictive machine learning, generative BI dashboards, Chat Data Explore, and pricing.'
  }
];
