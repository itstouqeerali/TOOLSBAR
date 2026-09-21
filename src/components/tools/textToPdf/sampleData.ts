// Sample documents for TextToPdf Studio

export function sampleTextToHtml(raw: string): string {
  const parts = raw.split('<<<PAGE_BREAK>>>');
  return parts
    .map((section) => {
      const lines = section.trim().split('\n');
      const htmlLines: string[] = [];
      let inUl = false;
      let inOl = false;

      for (let line of lines) {
        line = line.trim();
        if (!line) {
          if (inUl) {
            htmlLines.push('</ul>');
            inUl = false;
          }
          if (inOl) {
            htmlLines.push('</ol>');
            inOl = false;
          }
          continue;
        }

        if (line.startsWith('# ')) {
          if (inUl) {
            htmlLines.push('</ul>');
            inUl = false;
          }
          if (inOl) {
            htmlLines.push('</ol>');
            inOl = false;
          }
          htmlLines.push(`<h1>${line.slice(2)}</h1>`);
        } else if (line.startsWith('## ')) {
          if (inUl) {
            htmlLines.push('</ul>');
            inUl = false;
          }
          if (inOl) {
            htmlLines.push('</ol>');
            inOl = false;
          }
          htmlLines.push(`<h2>${line.slice(3)}</h2>`);
        } else if (line.startsWith('### ')) {
          if (inUl) {
            htmlLines.push('</ul>');
            inUl = false;
          }
          if (inOl) {
            htmlLines.push('</ol>');
            inOl = false;
          }
          htmlLines.push(`<h3>${line.slice(4)}</h3>`);
        } else if (line === '---') {
          if (inUl) {
            htmlLines.push('</ul>');
            inUl = false;
          }
          if (inOl) {
            htmlLines.push('</ol>');
            inOl = false;
          }
          htmlLines.push('<hr />');
        } else if (line.startsWith('- ')) {
          if (inOl) {
            htmlLines.push('</ol>');
            inOl = false;
          }
          if (!inUl) {
            htmlLines.push('<ul>');
            inUl = true;
          }
          htmlLines.push(`<li>${line.slice(2)}</li>`);
        } else if (/^\d+\.\s/.test(line)) {
          if (inUl) {
            htmlLines.push('</ul>');
            inUl = false;
          }
          if (!inOl) {
            htmlLines.push('<ol>');
            inOl = true;
          }
          htmlLines.push(`<li>${line.replace(/^\d+\.\s/, '')}</li>`);
        } else {
          if (inUl) {
            htmlLines.push('</ul>');
            inUl = false;
          }
          if (inOl) {
            htmlLines.push('</ol>');
            inOl = false;
          }
          htmlLines.push(`<p>${line}</p>`);
        }
      }

      if (inUl) htmlLines.push('</ul>');
      if (inOl) htmlLines.push('</ol>');

      return htmlLines.join('\n');
    })
    .join('\n<div data-type="page-break"></div>\n');
}

export const STANDARD_SAMPLE_TEXT = `# Toolsbar Professional Document Studio
Client-Side Rich Text to PDF Generator & Vector Publisher
---
Welcome to the professional WYSIWYG document editor. Format your text using the toolbar above, or paste your content here. What you format here compiles directly into your vector PDF with zero text duplication.

### Key Capabilities
- Selection-Level Formatting: Highlight specific words to make them italic, underlined, bold, or custom colored.
- Smart Highlighting: Highlight key phrases in yellow, cyan, emerald, or orange.
- Document Hierarchy: Organize sections using Heading 1, Heading 2, and Heading 3.
- True Multi-Page Layout: Insert page breaks or let content flow across pages automatically.
- 100% Client-Side Privacy: All compilation runs entirely within your browser sandbox.

### Getting Started
Select any text in this editor to use the formatting toolbar, or clear the editor to write your custom proposal, agreement, or notes.

<<<PAGE_BREAK>>>

# Section 2: Real-Time Pagination & Geometry
Page Layout Algorithms in Browser Environments
---
In standard word processors, continuous text must be mapped to discrete physical media dimensions (such as ISO 216 A4, North American Letter, and Legal). This requires deterministic hyphenation, word wrapping, leading calculation, and page break allocation.

### Typography & Metric Precision
1. Exact AFM (Adobe Font Metrics) character width calculation for Standard 14 PDF fonts.
2. Dynamic reflow upon paper dimension, margin, or orientation modifications.
3. Word-boundary wrapping to prevent awkward character clipping.
4. Running headers, running footers, and dynamic page numbering.

### Performance & Non-Blocking DOM Execution
Because recalculating typography metrics across hundreds of paragraphs can consume processing cycles, the layout engine implements debounced reflow scheduling. Keystroke feedback remains instant, while pagination reflow runs asynchronously without causing input latency.

<<<PAGE_BREAK>>>

# Section 3: Document Styling & Visual Hierarchy
Typography Guidelines, Highlights, and Colors
---
Professional publications rely on strict typographic hierarchy to guide reader attention. The editor provides standard point-scale presets ranging from 8pt for footnotes to 72pt for titles.

### Color Systems & Highlighting
- Primary Body Text: High-contrast slate neutrals ensuring WCAG AA readability.
- Semantic Accents: Rich jewel tones including indigo, emerald, amber, and rose for callouts.
- Highlighting Layer: Vector-drawn background fill rectangles positioned directly beneath text glyphs.

### List Hierarchies & Structural Markers
- Bulleted Lists: Precise 18pt hanging indents with standardized vector bullet glyphs.
- Numbered Sequences: Automatic numeric indexing that reflows across page breaks.
- Horizontal Dividing Rules: Clean 0.75pt structural separators dividing major sections.

<<<PAGE_BREAK>>>

# Section 4: Security, Compliance & Delivery
Client-Side Sandbox Execution & PDF Export
---
Enterprise compliance requirements increasingly restrict sending sensitive text, financial data, and legal contracts to third-party cloud servers for document conversion.

### Cryptographic & Privacy Guarantees
- 100% In-Memory Compilation: No network endpoints, third-party trackers, or cloud storage.
- Immediate Memory Reclamation: Document memory is discarded when the tab closes.
- Pure Vector Output: All exported documents contain true searchable, selectable vector text.

### Conclusion & Final Output
This sample demonstrates a complete four-page technical document. When downloaded, the resulting PDF file will exactly mirror the page breaks, margins, typography, highlights, and headers shown on this screen.
`;

export const STANDARD_SAMPLE_HTML = sampleTextToHtml(STANDARD_SAMPLE_TEXT);

// Helper to generate a genuine 17-page document for large document test
export function generateSeventeenPageDoc(): string {
  const chapters = [
    {
      title: 'Chapter 1: Principles of Client-Side Document Synthesis',
      subtitle: 'Architectural foundations of browser-based typography',
      body: `Modern digital publishing increasingly shifts computational workloads toward client execution threads. Historically, document compilation mandated server-side headless browsers, heavy rendering clusters, and substantial latency overheads. Shifting layout measurement and PDF binary generation directly into the browser sandbox eliminates server operational costs and ensures immediate interactivity.`,
      points: [
        'Deterministic character width measurement via Adobe Font Metrics AFM tables.',
        'Zero-server data exfiltration guaranteeing confidentiality compliance.',
        'Real-time pagination recalculations on font and geometry adjustments.',
        'Seamless multi-page sheet rendering mirroring physical paper output.',
      ],
    },
    {
      title: 'Chapter 2: Canonical Data Models in Rich-Text Systems',
      subtitle: 'Eliminating DOM scraping and mutation anomalies',
      body: `The fundamental flaw in classical web editors stems from treating the contentEditable DOM tree as the single source of truth. When visual pagination algorithms attempt to slice, clone, or split DOM nodes across physical page wrappers, the underlying semantic model becomes corrupted. Maintaining a distinct, immutable Canonical Document state decouples presentation slicing from underlying data integrity.`,
      points: [
        'Formatted blocks and inline styled spans form the single canonical model.',
        'Selection formatting directly transforms span tokens without text duplication.',
        'Visual page containers act as pure read-only projections of the layout solver.',
        'Word and character counts remain invariant across stylistic modifications.',
      ],
    },
    {
      title: 'Chapter 3: Adobe Standard 14 Font Metrics & Hyphenation',
      subtitle: 'Mathematical precision in vector text rendering',
      body: `Standard PDF viewers natively bundle the Standard 14 PostScript typefaces: Helvetica, Times-Roman, Courier, and Symbol. By leveraging exact glyph advance widths rather than non-deterministic DOM clientWidth measurements, the layout engine guarantees that wrapped line boundaries computed in the editor correspond identically to the compiled PDF coordinate streams.`,
      points: [
        'Helvetica provides neutral clarity for corporate documentation.',
        'Times-Roman delivers classical elegance for formal contracts and publications.',
        'Courier provides fixed-pitch alignment for code, tabular records, and transcripts.',
        'Sub-point kerning approximations preserve optical paragraph rhythm.',
      ],
    },
    {
      title: 'Chapter 4: Page Geometry, Margins & Media Formats',
      subtitle: 'Physical dimensions from ISO 216 to North American standards',
      body: `Document layout must adapt dynamically across standard physical paper dimensions. ISO 216 A4 (210 by 297 millimeters) maintains an aspect ratio equal to the square root of two, allowing geometric halving into A5 or doubling into A3 without aspect distortion. Conversely, North American Letter (8.5 by 11 inches) and Legal (8.5 by 14 inches) cater to regional institutional workflows.`,
      points: [
        'Standard 0.75-inch (54 point) margins provide balanced negative space.',
        'Compact 0.5-inch margins maximize printable area for dense reporting.',
        'Wide 1.0-inch margins accommodate formal margins and administrative notes.',
        'Running headers and running footers calculate reserved vertical boundary exclusions.',
      ],
    },
    {
      title: 'Chapter 5: Selection-Level Formatting & Span Splitting',
      subtitle: 'Surgical inline styling without text mutation',
      body: `Applying inline formatting such as background highlighting, font family adjustments, or color alterations requires surgical span decomposition. When a user highlights a five-character substring within a twenty-character span, the parent span splits into three distinct sibling segments: the leading prefix, the newly styled target segment, and the trailing suffix.`,
      points: [
        'Leading unselected characters preserve original stylistic parameters.',
        'Selected substring receives updated typographic attributes.',
        'Trailing substring remains unmodified in character order and style.',
        'The cumulative character sequence remains strictly identical before and after styling.',
      ],
    },
    {
      title: 'Chapter 6: Visual Multi-Page Layout & Sheet Proportions',
      subtitle: 'Rendering discrete paper surfaces in digital interfaces',
      body: `Presenting multiple pages as a single continuous vertical canvas deprives users of spatial orientation. A true WYSIWYG editor must visually construct discrete paper sheets, each bounded by fixed vertical limits, distinct paper backgrounds, drop shadows, and visible inter-page spacing gaps. Users must scroll through separate physical pages that match the generated PDF sheet by sheet.`,
      points: [
        'Each page container maintains an immutable fixed height.',
        'Overflowing block slices continue onto subsequent sheet surfaces.',
        'Vertical page margins and inter-sheet gaps simulate desk presentation.',
        'Page headers and footers repeat consistently across the document hierarchy.',
      ],
    },
    {
      title: 'Chapter 7: Header & Footer Systems with Dynamic Pagination',
      subtitle: 'Automated running headers, footers, and page markers',
      body: `Formal publications demand running headers and footers that adapt across the document lifecycle. The running header establishes context by rendering project titles, classification notices, and date stamps. The running footer provides confidentiality notices and dynamic page counters expressed in the format Page X of Y.`,
      points: [
        'Header text renders at top margin boundary across all pages.',
        'Confidentiality markers provide legal and organizational context.',
        'Dynamic page numbering reflects total calculated pages in real time.',
        'Headers and footers suppress content collision via reserved boundary heights.',
      ],
    },
    {
      title: 'Chapter 8: List Formatting, Numbering & Indentation',
      subtitle: 'Hanging indents and ordered list continuity',
      body: `Structured lists convey procedural instructions and itemized specifications. The layout engine provides standardized 18-point hanging indents for bulleted items and dynamically indexed numeric markers. When a multi-item list crosses a page boundary, numbering continuity is preserved without artificial resetting.`,
      points: [
        'Vector bullet glyphs align optically with following text baselines.',
        'Numbered lists maintain sequential counters across page transitions.',
        'Wrapped secondary list lines align flush with the indented text column.',
        'Vertical item spacing harmonizes with surrounding body text leading.',
      ],
    },
    {
      title: 'Chapter 9: Color Theory & WCAG AA Contrast Compliance',
      subtitle: 'Accessible palette selection for professional documents',
      body: `Document readability hinges on adequate optical contrast between text glyphs and the paper background. The editor enforces a curated palette of neutral slates and deep jewel tones that satisfy WCAG AA contrast criteria against standard white paper surfaces. Highlight overlays utilize high-luminance tints that ensure underlying text legibility.`,
      points: [
        'Primary slate neutrals ensure effortless long-form reading.',
        'Jewel tones (indigo, emerald, amber, rose) emphasize key callouts.',
        'Highlight fills draw behind glyph paths to prevent character obscuration.',
        'Color definitions serialize as standardized RGB tuples in PDF output.',
      ],
    },
    {
      title: 'Chapter 10: Manual Page Breaks vs. Natural Reflow',
      subtitle: 'Deterministic section separation in document architecture',
      body: `While natural reflow distributes paragraphs based on remaining sheet capacity, formal chapters and major thematic transitions require explicit manual page breaks. Inserting a page-break block instructs the layout engine to immediately conclude the active sheet and initiate a fresh physical paper surface for subsequent content.`,
      points: [
        'Manual page breaks create explicit document boundaries.',
        'Following content begins flush at the top margin of the next sheet.',
        'Page breaks reflow dynamically if preceding content expands or contracts.',
        'Visual indicators in the editor display page break boundaries clearly.',
      ],
    },
    {
      title: 'Chapter 11: Real-Time Document Statistics & Integrity',
      subtitle: 'Precise auditing of word, character, and page counts',
      body: `Authors and editors rely on live document telemetry to track progress against length constraints. The statistics engine traverses canonical spans to compute exact word counts based on whitespace boundary tokenization and character counts including spaces. Style changes must never perturb these metrics.`,
      points: [
        'Word count tokenization conforms to standard linguistic delimiters.',
        'Character count includes all textual glyphs across all blocks.',
        'Page count derives directly from active layout engine pagination output.',
        'Formatting operations preserve invariant word and character statistics.',
      ],
    },
    {
      title: 'Chapter 12: Undo & Redo History Architecture',
      subtitle: 'State snapshots and temporal navigation',
      body: `A dependable editorial workflow requires comprehensive undo and redo capabilities. By recording immutable snapshots of the Canonical Document state prior to each destructive mutation or stylistic application, the application guarantees that any formatting error or unintended deletion can be instantly reversed.`,
      points: [
        'Deep cloning prevents unintended reference mutations across history states.',
        'Linear undo and redo stacks maintain sequential revision checkpoints.',
        'Restoring earlier states triggers automated layout recalculation.',
        'History navigation preserves selection coordinates where feasible.',
      ],
    },
    {
      title: 'Chapter 13: Vector PDF Compilation via PDF-Lib',
      subtitle: 'Generating standards-compliant binary PDF streams',
      body: `The final deliverable of the Text to PDF Studio is a clean, standards-compliant PDF file. Utilizing pdf-lib in pure JavaScript, the engine creates PDF pages, embeds standard fonts, draws text streams at precise Cartesian coordinates, draws vector highlight rectangles, and serializes the binary buffer into a downloadable Blob.`,
      points: [
        'Standard 14 font embedding eliminates external font licensing friction.',
        'Vector text remains fully selectable, searchable, and copyable.',
        'Y-axis coordinate transformation bridges browser top-down and PDF bottom-up origins.',
        'Metadata dictionaries record document title, author, and creation timestamps.',
      ],
    },
    {
      title: 'Chapter 14: Client-Side Security & Data Privacy',
      subtitle: 'Zero-exfiltration guarantees in confidential workflows',
      body: `In legal, medical, and financial environments, uploading sensitive draft contracts, patient evaluations, or proprietary financial plans to third-party cloud servers poses severe compliance risks. Performing all layout calculation, typography evaluation, and PDF encoding entirely in the client browser establishes ironclad data confidentiality.`,
      points: [
        'No document content is transmitted across network sockets.',
        'All computations run within the sandboxed browser execution thread.',
        'Browser memory is reclaimed immediately upon closing the session tab.',
        'Audit logs confirm zero external network telemetry during compilation.',
      ],
    },
    {
      title: 'Chapter 15: Responsive Scaling & Mobile Device Adaptation',
      subtitle: 'Preserving paper geometry across varied viewports',
      body: `While mobile displays lack the physical width of desktop monitors, artificially altering document margins or page aspect ratios to fit narrow screens destroys WYSIWYG fidelity. The editor maintains authentic paper aspect ratios and applies uniform CSS transformation scaling to fit mobile displays while preserving spatial layout.`,
      points: [
        'Internal paper sheet coordinates remain constant across all display sizes.',
        'Uniform scale factor adapts sheet presentation to viewport width.',
        'Vertical page stacking and page-by-page scrolling remain consistent.',
        'Touch interactions support text selection and toolbar adjustments.',
      ],
    },
    {
      title: 'Chapter 16: Comparative Analysis with Legacy Word Processors',
      subtitle: 'Benchmarking modern web-native publishing engines',
      body: `Legacy desktop document editors rely on complex C++ native layout engines that do not integrate seamlessly into modern web application stacks. Browser-based tools provide universal accessibility without software installation, instant sharing, cross-platform compatibility, and seamless integration with modern web APIs.`,
      points: [
        'Instant startup time without heavy application cold starts.',
        'Frictionless deployment across macOS, Windows, Linux, and mobile operating systems.',
        'Direct browser printing and PDF download with zero printer driver friction.',
        'Modular, maintainable TypeScript architecture ensuring rapid feature iteration.',
      ],
    },
    {
      title: 'Chapter 17: Comprehensive Verification & Production Sign-Off',
      subtitle: 'Verification matrix for multi-page document reliability',
      body: `This seventeenth chapter concludes the multi-page stress test document. By verifying that every individual chapter renders onto its own discrete paper sheet with proper margins, running headers, running footers, and crisp vector typography, we certify that the Text to PDF Studio satisfies all production standards for professional publishing.`,
      points: [
        'Page count in status bar matches visual paper sheets exactly.',
        'Every page renders as a distinct, fixed-height physical sheet.',
        'Selection formatting preserves text without duplicate copies.',
        'PDF export mirrors editor layout with 100% fidelity.',
      ],
    },
  ];

  const lines: string[] = [];

  for (let i = 0; i < chapters.length; i++) {
    const ch = chapters[i];
    lines.push(`# ${ch.title}`);
    lines.push(ch.subtitle);
    lines.push('---');
    lines.push(ch.body);
    lines.push('');
    lines.push('### Key Specifications');
    for (const pt of ch.points) {
      lines.push(`- ${pt}`);
    }
    lines.push('');
    lines.push(
      `This section establishes rigorous verification standards for page ${i + 1}. The typography, margins, headers, and footers demonstrate full consistency across multi-page document synthesis.`
    );
    lines.push('');

    // Insert explicit page break between chapters to guarantee discrete pages
    if (i < chapters.length - 1) {
      lines.push('<<<PAGE_BREAK>>>');
      lines.push('');
    }
  }

  return lines.join('\n');
}
