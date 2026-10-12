import { AiTool } from '../types/aiTools';
import { CHAT_ASSISTANTS_TOOLS } from './aiTools/chatAssistants';
import { IMAGE_GENERATION_TOOLS } from './aiTools/imageGeneration';
import { VIDEO_GENERATION_TOOLS } from './aiTools/videoGeneration';
import { CODING_DEVELOPMENT_TOOLS } from './aiTools/codingDevelopment';
import { WRITING_CONTENT_TOOLS } from './aiTools/writingContent';
import { STUDY_RESEARCH_TOOLS } from './aiTools/studyResearch';
import { PRODUCTIVITY_AUTOMATION_TOOLS } from './aiTools/productivityAutomation';
import { AUDIO_VOICE_MUSIC_TOOLS } from './aiTools/audioVoiceMusic';
import { DESIGN_PRESENTATIONS_TOOLS } from './aiTools/designPresentations';
import { MARKETING_BUSINESS_TOOLS } from './aiTools/marketingBusiness';
import { CAREER_AND_DATA_TOOLS } from './aiTools/careerAndData';

export const AI_TOOLS_SEED: AiTool[] = [
  ...CHAT_ASSISTANTS_TOOLS,
  ...IMAGE_GENERATION_TOOLS,
  ...VIDEO_GENERATION_TOOLS,
  ...CODING_DEVELOPMENT_TOOLS,
  ...WRITING_CONTENT_TOOLS,
  ...STUDY_RESEARCH_TOOLS,
  ...PRODUCTIVITY_AUTOMATION_TOOLS,
  ...AUDIO_VOICE_MUSIC_TOOLS,
  ...DESIGN_PRESENTATIONS_TOOLS,
  ...MARKETING_BUSINESS_TOOLS,
  ...CAREER_AND_DATA_TOOLS,
];

export function getAiToolBySlug(slug: string): AiTool | undefined {
  return AI_TOOLS_SEED.find((t) => t.slug === slug || t.id === slug);
}

export function getPublishedAiTools(): AiTool[] {
  return AI_TOOLS_SEED.filter((t) => t.isPublished);
}

export function getFeaturedAiTools(): AiTool[] {
  return AI_TOOLS_SEED.filter((t) => t.isPublished && t.isFeatured);
}

export function getAiToolsByCategory(categorySlug: string): AiTool[] {
  return AI_TOOLS_SEED.filter(
    (t) =>
      t.isPublished &&
      (t.primaryCategory === categorySlug || t.categories.includes(categorySlug))
  );
}
