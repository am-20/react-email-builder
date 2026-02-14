# React Email Builder

A drag-and-drop email template builder built with React 19 and Vite 6. Create responsive, email-client-compatible templates with a visual editor and export them as production-ready HTML packaged in a ZIP file with all assets included.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture Deep Dive](#architecture-deep-dive)
- [Installation](#installation)
- [Usage Guide](#usage-guide)
- [Component Types](#component-types)
- [File-by-File Reference](#file-by-file-reference)
- [Data Flow & State Management](#data-flow--state-management)
- [How to Add a New Block Type](#how-to-add-a-new-block-type)
- [How to Add a New Settings Control](#how-to-add-a-new-settings-control)
- [Export & Deployment](#export--deployment)
- [Internationalization (i18n)](#internationalization-i18n)
- [Technical Details](#technical-details)
- [Available Scripts](#available-scripts)
- [Troubleshooting](#troubleshooting)

---

## Overview

This project provides a visual, drag-and-drop interface for building email templates that work across all major email clients (Outlook, Gmail, Apple Mail, mobile clients). The builder outputs table-based HTML with inline styles — the industry standard for email compatibility.

### Key Capabilities

- **Visual Editor** — Drag-and-drop interface with a 640px canvas matching email width standards.
- **Live Preview** — View the final email HTML in a new browser tab at any time.
- **14 Block Types** — Headers, text, images, buttons (image and coded), columns, dividers, spacers, round containers, and footers.
- **Auto-Save** — All work is debounced (400ms) and persisted to `localStorage`.
- **ZIP Export** — One-click export produces a ZIP file containing `index.html` and an `i/` folder with all images.
- **Image Management** — Upload images that are stored as base64 in `localStorage`, with blob URLs used for instant preview in the editor.

---

## Tech Stack

| Category       | Technology                                            |
| -------------- | ----------------------------------------------------- |
| Framework      | React 19                                              |
| Build Tool     | Vite 6                                                |
| Icons          | lucide-react 0.503                                    |
| ZIP Generation | JSZip 3.10                                            |
| File Download  | file-saver 2.0                                        |
| Styling        | Plain CSS (Tailwind in devDeps but unused at runtime) |
| Linting        | ESLint 9                                              |

---

## Project Structure

```
react-email-builder/
├── public/
│   └── i/                              # Default footer icons (included in ZIP export)
│       ├── facebook.png
│       ├── instagram.png
│       ├── vk.png
│       ├── youtube.png
│       ├── twitter.png
│       ├── linkedin.png
│       ├── chat.png
│       └── call.png
├── scripts/
│   └── convertImagesToBase64.js        # Utility: batch-convert images to base64
├── src/
│   ├── components/
│   │   ├── EmailBuilder.jsx            # Root builder: state, sidebar, canvas, toolbar
│   │   ├── EmailBuilder.css            # All editor styles
│   │   ├── BlockRenderer.jsx           # Maps block data → editor UI + settings panels
│   │   ├── BlockHtmlRenderer.jsx       # Maps block data → email-safe HTML strings
│   │   ├── PreHeader.jsx               # Title bar with "view in browser" link
│   │   ├── RoundContainer.jsx          # Nestable container with rounded corners
│   │   ├── BlockTypes/                 # Individual block editor components
│   │   │   ├── index.js                # Barrel export
│   │   │   ├── HeaderBlock.jsx
│   │   │   ├── TextBlock.jsx
│   │   │   ├── ImageBlock.jsx
│   │   │   ├── ButtonBlock.jsx
│   │   │   ├── ButtonCodedBlock.jsx
│   │   │   ├── ButtonGroupBlock.jsx
│   │   │   ├── ButtonCodedGroupBlock.jsx
│   │   │   ├── ColumnsBlock.jsx
│   │   │   ├── ColumnsContentBlock.jsx
│   │   │   ├── DividerBlock.jsx
│   │   │   ├── SpacerBlock.jsx
│   │   │   └── FooterBlock.jsx
│   │   ├── BlockUI/                    # Shared block chrome (toolbar, type badge)
│   │   │   ├── index.js
│   │   │   ├── BlockToolbar.jsx        # Duplicate / Delete action buttons
│   │   │   └── BlockTypeIndicator.jsx  # Drag handle + block type label
│   │   └── Controls/                   # Reusable settings form controls
│   │       ├── index.js
│   │       ├── ColorControl.jsx        # Color picker with label
│   │       ├── NumberControl.jsx       # Number input with optional px suffix
│   │       ├── SelectControl.jsx       # Dropdown select
│   │       ├── TextControl.jsx         # Text input
│   │       ├── CheckboxControl.jsx     # Checkbox toggle
│   │       ├── PaddingControl.jsx      # Padding top/bottom presets
│   │       ├── AlignmentControl.jsx    # Text alignment selector
│   │       └── BorderControl.jsx       # Border style controls
│   ├── config/
│   │   └── emailTemplateConfig.jsx     # Component palette + initial template
│   ├── handlers/
│   │   └── EmailBuilderHandlers.js     # All business logic (CRUD, drag-drop, export)
│   ├── helpers/                        # Pure functions for BlockHtmlRenderer
│   │   ├── index.js                    # Barrel export
│   │   ├── htmlHelpers.js              # wrapInTable, createLink, createImage, createLinkedImage
│   │   ├── calculateHelpers.js         # calculateHalfGap, calculateSpacerWidth, calculateColumnWidth
│   │   ├── defaultHelpers.js           # getDefault, getDefaults, COMMON_DEFAULTS
│   │   ├── parsePadding.js             # CSS padding shorthand parser
│   │   └── buttonHelpers.js            # renderButton, renderButtonGroup (HTML generation)
│   ├── hooks/                          # Custom React hooks
│   │   ├── index.js                    # Barrel export
│   │   ├── useImageUpload.js           # Image upload logic for all block types
│   │   ├── useBlockSettings.js         # Calculates block/content styles from settings
│   │   └── useBlockDragAndDrop.js      # Drag-and-drop event handler factory
│   ├── i18n/
│   │   └── translations.js            # Footer text in Russian and Kazakh
│   ├── utils/
│   │   ├── assets.js                   # localStorage asset registry (add, list, get, clear)
│   │   ├── htmlGenerator.js            # Wraps block HTML in full email document
│   │   └── imageUtils.js               # Footer icon paths, social icon map
│   ├── App.jsx                         # Mounts EmailBuilder
│   ├── App.css                         # Minimal app-level styles
│   ├── index.css                       # CSS reset / globals
│   └── main.jsx                        # Vite entry point
├── index.html                          # Vite HTML shell
├── package.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

---

## Architecture Deep Dive

The codebase is organized into clear layers. Understanding these layers is the fastest way to navigate the project.

### Layer 1 — State & Orchestration

**`EmailBuilder.jsx`** is the single source of truth. It holds the `template` state object (via `useState`) and passes everything down as props. It also handles auto-save to `localStorage`, image rehydration on mount, and the toolbar actions (preview, save, clear).

### Layer 2 — Block Rendering (Editor vs. HTML)

There are two parallel rendering pipelines — one for the editor UI, one for the exported HTML:

| File                    | Purpose                                             | Output      |
| ----------------------- | --------------------------------------------------- | ----------- |
| `BlockRenderer.jsx`     | Editor view — what the user sees and interacts with | React JSX   |
| `BlockHtmlRenderer.jsx` | Export view — what gets written to the ZIP          | HTML string |

Both receive the same block data object and must handle all 14 block types. When you add a new block type, you must update **both** files.

`BlockRenderer.jsx` delegates the visual rendering of each block type to individual components inside `BlockTypes/`. It also assembles the settings panels for each block type using controls from `Controls/`.

### Layer 3 — Extracted Components

To keep `BlockRenderer.jsx` manageable, the rendering and controls were extracted into sub-directories:

- **`BlockTypes/`** — One component per block type (e.g., `SpacerBlock.jsx`, `TextBlock.jsx`). Each receives its block's data and renders the editor preview.
- **`Controls/`** — Reusable form elements (color pickers, number inputs, padding selectors, etc.) used across multiple block settings panels.
- **`BlockUI/`** — Shared block chrome: the `BlockToolbar` (duplicate/delete buttons) and `BlockTypeIndicator` (drag handle + type label).

### Layer 4 — Custom Hooks

Three hooks extract reusable logic from `BlockRenderer`:

| Hook                  | Responsibility                                                                                                                                                     |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `useImageUpload`      | Handles file upload for all block types (images, buttons, columns, headers, nested blocks). Returns `handleImageUpload` and manual URL state.                      |
| `useBlockSettings`    | Computes `blockStyle` and `contentStyle` objects from a block's settings using `useMemo`. Handles padding, background color, borders, and type-specific overrides. |
| `useBlockDragAndDrop` | Returns all event handler props (`onDragStart`, `onDragOver`, `onDrop`, `onClick`, `onMouseEnter/Leave`) for a block element.                                      |

### Layer 5 — Helpers (Pure Functions)

The `helpers/` directory contains pure functions used primarily by `BlockHtmlRenderer.jsx` for generating email-safe HTML:

| File                  | What it exports                                                                                                  |
| --------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `htmlHelpers.js`      | `wrapInTable()`, `createLink()`, `createImage()`, `createLinkedImage()` — building blocks for email HTML         |
| `calculateHelpers.js` | `calculateHalfGap()`, `calculateSpacerWidth()`, `calculateColumnWidth()` — layout math                           |
| `defaultHelpers.js`   | `getDefault()`, `getDefaults()`, `COMMON_DEFAULTS` — null-safe settings access and a centralized defaults object |
| `parsePadding.js`     | `parsePadding()` — parses CSS shorthand like `"12px 24px"` into `{ top, bottom, x }`                             |
| `buttonHelpers.js`    | `renderButton()`, `renderButtonGroup()` — generates HTML for image and coded buttons                             |

### Layer 6 — Utilities

| File                     | What it does                                                                                                                                                                                                          |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `utils/assets.js`        | Manages the `localStorage` asset registry. Handles `addFileAsset()` (stores base64 + returns blob preview URL), `listAssets()`, `getAssetDataUrl()`, and `clearAllAssets()`.                                          |
| `utils/htmlGenerator.js` | `generateHtmlOutput()` wraps all rendered block HTML in a complete email document with DOCTYPE, meta tags, inline styles, pre-header text, and the email wrapper tables. Also exports `generateRoundContainerHTML()`. |
| `utils/imageUtils.js`    | Maps social icon names to file paths. Provides `getFooterIcon()`, `socialIcons` map, and a legacy `handleImageUploadForBlock()`.                                                                                      |

---

## Installation

### Prerequisites

- Node.js v16 or higher
- npm (or yarn)

### Setup

```bash
# 1. Navigate to the project
cd react-email-builder

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev

# 4. Open in browser (default: http://localhost:5173)
```

---

## Usage Guide

### Building a Template

1. **Drag components** from the left sidebar onto the canvas.
2. **Click a block** to select it — this reveals the settings panel below the block.
3. **Edit text** inline by clicking into text/header blocks (uses `contentEditable`).
4. **Upload images** by clicking the upload button in the settings panel of image/button blocks.
5. **Reorder blocks** by dragging selected blocks up or down.
6. **Preview** — Click the "Preview" toolbar button to toggle a rendered HTML preview, or use the "View in browser" link in the pre-header to open the full email in a new tab.
7. **Save** — Click "Save" to download a ZIP file containing `index.html` and all images.

### Template Settings (Sidebar)

The sidebar exposes four global template settings:

| Setting                | Purpose                                                               |
| ---------------------- | --------------------------------------------------------------------- |
| Template Title         | Displayed in the email pre-header and used as the ZIP filename        |
| Title Link Label       | Tracking `_label` attribute on the title in the pre-header            |
| Title Link Label Unsub | Tracking `_label` attribute on the unsubscribe link in the pre-header |
| Footer Link Label      | Default `_label` value passed to footer blocks for unsubscribe links  |

### Working with Images

- **Upload**: Click the upload area in any image/button/column block's settings panel.
- **Storage**: Uploaded images are converted to base64 and stored in `localStorage` under the key `emailBuilderAssets`. The editor displays a `blob:` URL for fast rendering.
- **Paths**: Each uploaded image gets a sequential path like `i/1.png`, `i/2.jpg`, etc. This path is what appears in the exported HTML.
- **Export**: All uploaded images are included in the ZIP's `i/` folder. Default footer icons from `public/i/` are also included automatically.

---

## Component Types

### Text & Headings

| Type     | Description                                       | Key Settings                                           |
| -------- | ------------------------------------------------- | ------------------------------------------------------ |
| `header` | Large heading, optionally with an image beside it | fontSize, color, fontFamily, textAlign, isImage toggle |
| `text`   | Paragraph text with inline editing                | fontSize, color, fontFamily, textAlign                 |

### Images

| Type             | Description                                | Key Settings                                                                                         |
| ---------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| `image`          | Single full-width image with optional link | imagePath, altText, linkUrl, linkLabel, margin (for alignment)                                       |
| `columns`        | Multiple images side by side               | Per-column: imagePath, altText, linkUrl. Group: columnGap                                            |
| `columnsContent` | Images with title and text below each      | Per-column: imagePath, title, text, titleFontSize, textFontSize. Group: columnGap, hidetitle, isBold |

### Buttons

| Type               | Description                                        | Key Settings                                                                    |
| ------------------ | -------------------------------------------------- | ------------------------------------------------------------------------------- |
| `button`           | Image-based button (user uploads a button graphic) | imagePath, imageAlt, linkUrl, linkLabel                                         |
| `buttonCoded`      | CSS-styled button with text content                | content, buttonBgColor, color, borderRadius, fontSize, border, padding, linkUrl |
| `buttonGroup`      | Multiple image buttons together                    | Per-button settings + inline toggle, gap                                        |
| `buttonCodedGroup` | Multiple coded buttons together                    | Per-button settings + inline toggle, gap                                        |

### Layout

| Type             | Description                                                             | Key Settings                                                                                                                         |
| ---------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `divider`        | Horizontal line separator                                               | lineColor, lineHeight, padding                                                                                                       |
| `spacer`         | Empty space with configurable height                                    | height, backgroundColor                                                                                                              |
| `roundContainer` | Container with rounded corners that can **nest other blocks** inside it | canvasColor, backgroundColor, bgWidth, borderWidth, borderType, borderColor, borderRadius, paddingTop/Bottom, paddingInnerTop/Bottom |

### Footers

| Type                | Description                                                    | Language |
| ------------------- | -------------------------------------------------------------- | -------- |
| `footer`            | Full footer with social links, disclaimer, legal/privacy links | Russian  |
| `footer_general_kz` | Same structure as above                                        | Kazakh   |

Both footer types support a `theme` setting (`day` / `night`) that switches between light and dark icon variants and adjusts text colors.

---

## File-by-File Reference

This section explains **when to edit each file** so you can jump to the right place immediately.

### Core Components

| File                    | Edit when you need to...                                                                               |
| ----------------------- | ------------------------------------------------------------------------------------------------------ |
| `EmailBuilder.jsx`      | Change the sidebar, toolbar, canvas layout, global state shape, auto-save logic, or image rehydration  |
| `BlockRenderer.jsx`     | Change how blocks look in the editor, add settings panels for new block types, or wire up new controls |
| `BlockHtmlRenderer.jsx` | Change the exported HTML output for any block type, fix email client rendering issues                  |
| `RoundContainer.jsx`    | Modify the round container's editor UI, nested block drag-and-drop, or child block rendering           |
| `PreHeader.jsx`         | Change the pre-header bar (title, "view in browser" link)                                              |

### Block Type Components (`BlockTypes/`)

Each file renders one block type's **editor preview**. Edit the corresponding file when you want to change how that block type looks or behaves in the editor canvas.

### Controls (`Controls/`)

Each file is a small, reusable form control. Edit these when you need to change how a specific input type works across all block settings panels (e.g., changing the padding presets in `PaddingControl.jsx`).

### Block UI (`BlockUI/`)

| File                     | Purpose                                            |
| ------------------------ | -------------------------------------------------- |
| `BlockToolbar.jsx`       | The duplicate/delete buttons shown on hover/active |
| `BlockTypeIndicator.jsx` | The drag handle + block type label                 |

### Hooks (`hooks/`)

| File                     | Purpose                                                                                 |
| ------------------------ | --------------------------------------------------------------------------------------- |
| `useImageUpload.js`      | All image upload logic. Handles normal blocks, nested blocks, buttons, columns, headers |
| `useBlockSettings.js`    | Calculates `blockStyle` and `contentStyle` from settings via `useMemo`                  |
| `useBlockDragAndDrop.js` | Returns drag-and-drop event handler props                                               |

### Helpers (`helpers/`)

| File                  | Purpose                                                                                            |
| --------------------- | -------------------------------------------------------------------------------------------------- |
| `htmlHelpers.js`      | Low-level HTML generation: `wrapInTable()`, `createLink()`, `createImage()`, `createLinkedImage()` |
| `calculateHelpers.js` | Layout math: gap halving, spacer width, column width percentages                                   |
| `defaultHelpers.js`   | Null-safe getters + `COMMON_DEFAULTS` constant object with all shared default values               |
| `parsePadding.js`     | Parses CSS padding shorthand into `{ top, bottom, x }`                                             |
| `buttonHelpers.js`    | Generates button HTML (both image and coded variants, single and grouped)                          |

### Config & i18n

| File                      | Purpose                                                                                                                               |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `emailTemplateConfig.jsx` | Defines the `components` array (sidebar palette) and `initialTemplate` (default template loaded on first visit)                       |
| `translations.js`         | Russian (`translationsRU`) and Kazakh (`translationsKZ`) footer strings. Used by `BlockHtmlRenderer.jsx` when rendering footer blocks |

### Handlers

| File                      | Purpose                                                                                                                                                                                                                                                     |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `EmailBuilderHandlers.js` | All business logic: `createNewBlock()` (factory with defaults for each type), `handleDeleteBlock()`, `handleDuplicateBlock()`, `handleUpdateBlockContent()`, `handleUpdateBlockSettings()`, `handleSaveTemplate()` (ZIP generation), drag-and-drop handlers |

### Utilities

| File               | Purpose                                                                                                                                    |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `assets.js`        | `localStorage`-backed asset registry: `addFileAsset()`, `listAssets()`, `getAssetDataUrl()`, `clearAllAssets()`                            |
| `htmlGenerator.js` | `generateHtmlOutput()` — wraps block HTML in a full email document. `generateRoundContainerHTML()` — produces round container wrapper HTML |
| `imageUtils.js`    | Footer icon path helpers and `socialIcons` name mapping                                                                                    |

---

## Data Flow & State Management

### Template State Shape

The entire application state is a single `template` object:

```javascript
{
  id: "template-1700000000000",
  title: "My Email",
  titleLinkLabel: "",
  titleLinkLabelUnsub: "",
  footerLinkLabel: "",
  blocks: [
    {
      id: "header-1700000000001",
      type: "header",
      content: "Welcome",
      settings: {
        backgroundColor: "#ffffff",
        color: "#000000",
        fontSize: "48px",
        // ... type-specific settings
      }
    },
    {
      id: "round-1700000000002",
      type: "roundContainer",
      settings: { /* container settings */ },
      children: [
        // Nested blocks (same shape as top-level blocks)
      ]
    },
    {
      id: "buttonGroup-1700000000003",
      type: "buttonGroup",
      buttons: [
        { content: "...", settings: { /* per-button settings */ } },
        { content: "...", settings: { /* per-button settings */ } }
      ],
      settings: { /* group-level settings */ }
    }
    // ...
  ]
}
```

Note that different block types may have additional top-level properties beyond `content` and `settings`:

- `buttons` array — for `buttonGroup` and `buttonCodedGroup`
- `columns` array — for `columns` and `columnsContent`
- `children` array — for `roundContainer`

### Data Flow

```
User Action
    ↓
EmailBuilder.jsx (state holder)
    ↓ props
BlockRenderer.jsx (editor UI)        ──→ user sees / edits blocks
    ↓ calls handler
EmailBuilderHandlers.js              ──→ updates template state
    ↓ state change triggers
localStorage auto-save (400ms debounce)

User clicks "Save"
    ↓
EmailBuilderHandlers.handleSaveTemplate()
    ↓ calls
htmlGenerator.generateHtmlOutput(template, renderBlockHtml)
    ↓ iterates blocks, calls
BlockHtmlRenderer.renderBlockHtml(block, template)
    ↓ uses
helpers/* (htmlHelpers, buttonHelpers, etc.)
    ↓ produces
Complete HTML string → packaged into ZIP with assets → downloaded
```

### localStorage Keys

| Key                  | Contents                                                  |
| -------------------- | --------------------------------------------------------- |
| `emailBuilderData`   | JSON-serialized template state                            |
| `emailBuilderAssets` | JSON map of `{ [path]: { dataUrl, mime, name, ts } }`     |
| `assetCounter`       | Integer counter for generating sequential image filenames |

---

## How to Add a New Block Type

Follow these five steps in order. Use an existing block type (e.g., `divider`) as a reference throughout.

### Step 1 — Register in Config

In `src/config/emailTemplateConfig.jsx`, add an entry to the `components` array:

```jsx
{ type: 'myBlock', label: 'My Block', icon: <SomeIcon size={16} /> }
```

### Step 2 — Define Creation Defaults

In `src/handlers/EmailBuilderHandlers.js`, add a `case` to the `createNewBlock()` switch:

```javascript
case 'myBlock':
  return {
    id,
    type,
    content: 'Default content',
    settings: {
      backgroundColor: '#ffffff',
      // your default settings...
    },
  };
```

### Step 3 — Create the Editor Component

Create `src/components/BlockTypes/MyBlock.jsx`:

```jsx
const MyBlock = ({ content, settings, index, isActive }) => {
  return (
    <table
      role='presentation'
      width='100%'
      cellSpacing='0'
      cellPadding='0'
      border='0'>
      <tbody>
        <tr>
          <td>{/* your editor preview */}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default MyBlock;
```

Then add it to `src/components/BlockTypes/index.js`:

```javascript
export { default as MyBlock } from './MyBlock';
```

### Step 4 — Wire Up in BlockRenderer

In `src/components/BlockRenderer.jsx`:

1. Import the new component.
2. Add a `case 'myBlock':` in the block rendering section that renders `<MyBlock ... />`.
3. Add a `case 'myBlock':` in the settings panel section to render the relevant `Controls/` components.

### Step 5 — Add HTML Rendering

In `src/components/BlockHtmlRenderer.jsx`, add a `case 'myBlock':` that returns an email-safe HTML string using table-based layout and inline styles. Use helpers from `helpers/` to keep the code clean.

---

## How to Add a New Settings Control

1. Create `src/components/Controls/MyControl.jsx` — a small functional component that accepts `value`, `onChange`, and a `label` prop at minimum.
2. Export it from `src/components/Controls/index.js`.
3. Import and use it in `BlockRenderer.jsx` inside the relevant block type's settings panel section.

All existing controls follow the same pattern: label + input element, with optional styling props.

---

## Export & Deployment

### What "Save" Produces

Clicking **Save** triggers `handleSaveTemplate()` which:

1. Calls `generateHtmlOutput()` to produce the full HTML document.
2. Creates a ZIP using JSZip containing:
   - `index.html` — the complete email template
   - `i/` folder — all uploaded images (from `localStorage`) + default footer icons (fetched from `public/i/`)
3. Downloads the ZIP using file-saver. The filename is derived from the template title.

### Email Client Compatibility

The generated HTML uses these email-safe practices:

- **Table-based layouts** — required for Outlook rendering.
- **Inline styles** — required for Gmail (strips `<style>` blocks in some contexts).
- **`role="presentation"`** — on all layout tables for accessibility.
- **MSO conditional comments** — where needed for Outlook-specific rendering.
- **`color-scheme: light`** — meta tag to prevent dark mode recoloring.
- **XHTML Transitional DOCTYPE** — maximum compatibility.

### Server-Side Template Tags

The exported HTML includes Adobe Campaign template tags:

- `<%@ include view="MirrorPageUrl" %>` — "View in browser" link
- `<%@ include option='NmsServer_URL' %>` — unsubscribe URL base
- `<%= escapeUrl(recipient.cryptedId) %>` — encrypted recipient ID

These tags are rendered as-is in the HTML and are processed server-side by Adobe Campaign during email delivery.

---

## Internationalization (i18n)

Footer blocks support two languages defined in `src/i18n/translations.js`:

- **Russian (`translationsRU`)** — used by the `footer` block type.
- **Kazakh (`translationsKZ`)** — used by the `footer_general_kz` block type.

Each translation object contains: `questions`, `disclaimer`, `link`, `disclaimer_end`, `all_rights`, `address`, `legal`, and `privacy` strings.

To add a new language, create a new translation object in `translations.js`, export it, then create a corresponding footer block type that references it.

---

## Technical Details

### Image Handling Pipeline

1. **Upload**: User selects a file → `addFileAsset()` in `assets.js` generates a sequential path (`i/1.png`), creates a `blob:` URL for immediate preview, and kicks off a `FileReader` to convert to base64 in the background.
2. **Editor**: The `blob:` URL is stored in `settings.imagePreviewUrl` and displayed in the canvas.
3. **Persistence**: The base64 `dataUrl` is stored in `localStorage` under `emailBuilderAssets` so it survives page reloads.
4. **Rehydration**: On mount, `rehydrateTemplateImages()` in `EmailBuilder.jsx` walks all blocks and restores preview URLs from `localStorage`.
5. **Export**: `listAssets()` reads the full registry; each base64 image is decoded and written to the ZIP's `i/` folder.

### Round Container (Nesting)

`roundContainer` is the only block type that supports nesting. It has a `children` array instead of `content`. The `RoundContainer.jsx` component manages its own internal drag-and-drop zone, allowing users to drag sidebar components into it. Nested blocks use the same block data shape but are managed through the parent's `children` array using a `parentIndex` parameter in `handleUpdateBlockSettings()`.

### Browser Requirements

The editor uses the following browser APIs: FileReader, localStorage, Drag & Drop API, Blob URLs, and contentEditable. It targets modern evergreen browsers (Chrome, Firefox, Safari, Edge).

---

## Available Scripts

| Command           | Purpose                              |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start Vite dev server with HMR       |
| `npm run build`   | Production build to `dist/`          |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint                           |

---

## Troubleshooting

**Images disappear after reload** — `localStorage` might be full. The base64 images are large; clear old assets with the "Clear Local" toolbar button and re-upload.

**Drag and drop not working inside Round Container** — Make sure you're dragging from the sidebar (new components), not reordering existing blocks into the container. Round containers intercept `text/block-type` drag data to distinguish new components from reorder drags.

**Exported HTML looks broken in Outlook** — Check that you're using table-based layout in `BlockHtmlRenderer.jsx`. Outlook ignores `div`, `flexbox`, and `grid` layouts entirely.

**Footer icons missing from ZIP** — The export fetches default icons from the running dev server at `public/i/`. Make sure the dev server is running when you click Save, or that the icons exist at the expected paths.
