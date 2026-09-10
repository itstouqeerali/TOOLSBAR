export type PageSizeOption = 'a4' | 'letter' | 'legal';
export type PageOrientationOption = 'portrait' | 'landscape';
export type MarginOption = 'compact' | 'standard' | 'wide';
export type FontFamilyOption = 'Helvetica' | 'TimesRoman' | 'Courier';
export type TextAlignOption = 'left' | 'center' | 'right' | 'justify';
export type BlockType = 'p' | 'h1' | 'h2' | 'h3' | 'bullet' | 'number' | 'hr' | 'page-break';

export interface InlineSpan {
  id: string;
  text: string;
  fontFamily: FontFamilyOption;
  fontSizePt: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough?: boolean;
  colorHex: string;
  bgColorHex: string | null; // e.g. '#fef08a' or null
}

export interface FormattedBlock {
  id: string;
  type: BlockType;
  align: TextAlignOption;
  indent?: number;
  listIndex?: number;
  spans: InlineSpan[];
}

export interface CanonicalDocument {
  blocks: FormattedBlock[];
}

export interface PageLine {
  spans: (InlineSpan & { widthPt: number })[];
  lineWidthPt: number;
  lineHeightPt: number;
  isFirstLineOfBlock: boolean;
  listMarker?: string;
}

export interface PageBlockSlice {
  blockId: string;
  type: BlockType;
  align: TextAlignOption;
  indent?: number;
  lines: PageLine[];
}

export interface PaginatedPage {
  pageIndex: number;
  pageNumber: number;
  blockSlices: PageBlockSlice[];
}

export interface DocumentDimensions {
  pageWidthPt: number;
  pageHeightPt: number;
  marginPt: number;
  topMarginPt: number;
  bottomMarginPt: number;
  contentWidthPt: number;
  contentHeightPt: number;
  headerHeightPt: number;
  footerHeightPt: number;
  aspectRatio: number;
}

export interface PaginatedDoc {
  pages: PaginatedPage[];
  dimensions: DocumentDimensions;
  totalPages: number;
}

export interface ColorOption {
  name: string;
  value: string;
  label?: string;
}

export const TEXT_COLOR_PALETTE: ColorOption[] = [
  { name: 'Black', value: '#0f172a' },
  { name: 'Dark Slate', value: '#334155' },
  { name: 'Muted Slate', value: '#64748b' },
  { name: 'Indigo', value: '#4f46e5' },
  { name: 'Blue', value: '#2563eb' },
  { name: 'Cyan', value: '#0891b2' },
  { name: 'Teal', value: '#0d9488' },
  { name: 'Emerald', value: '#059669' },
  { name: 'Amber', value: '#d97706' },
  { name: 'Orange', value: '#ea580c' },
  { name: 'Red', value: '#dc2626' },
  { name: 'Rose', value: '#e11d48' },
  { name: 'Purple', value: '#9333ea' },
];

export const HIGHLIGHT_COLOR_PALETTE: ColorOption[] = [
  { name: 'None', value: 'transparent', label: 'Clear' },
  { name: 'Yellow', value: '#fef08a', label: 'Yellow' },
  { name: 'Amber', value: '#fde68a', label: 'Amber' },
  { name: 'Orange', value: '#fed7aa', label: 'Orange' },
  { name: 'Green', value: '#bbf7d0', label: 'Green' },
  { name: 'Emerald', value: '#a7f3d0', label: 'Emerald' },
  { name: 'Cyan', value: '#a5f3fc', label: 'Cyan' },
  { name: 'Blue', value: '#bfdbfe', label: 'Blue' },
  { name: 'Purple', value: '#e9d5ff', label: 'Purple' },
  { name: 'Pink', value: '#fbcfe8', label: 'Pink' },
  { name: 'Rose', value: '#fecdd3', label: 'Rose' },
];

export const FONT_SIZE_PRESETS = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72];
