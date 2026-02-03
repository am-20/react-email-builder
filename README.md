# React Email Builder

A drag-and-drop email template builder built with React and Vite. Create responsive email templates with a visual editor and export them as production-ready HTML files with embedded assets.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Component Types](#component-types)
- [Key Files & Directories](#key-files--directories)
- [Development Workflow](#development-workflow)
- [Export & Deployment](#export--deployment)
- [Technical Details](#technical-details)
- [Contributing](#contributing)

## 🎯 Overview

This email builder provides a visual, drag-and-drop interface for creating email templates. It's designed specifically for generating email-compatible HTML that works across various email clients, including Outlook, Gmail, and mobile clients.

### Key Capabilities

- **Visual Editor**: Drag-and-drop interface for building email templates
- **Live Preview**: See your email template in real-time
- **Asset Management**: Automatic handling of images and assets
- **Email-Compatible HTML**: Generates table-based HTML that works in all major email clients
- **Local Persistence**: Auto-saves your work to browser localStorage
- **Export Functionality**: Export templates as ZIP files containing HTML and assets

## ✨ Features

- 🖱️ **Drag & Drop**: Intuitive component-based building
- 🎨 **Rich Component Library**: 15+ pre-built email components
- 📱 **Responsive Design**: Templates work across devices
- 💾 **Auto-Save**: Work is automatically saved to localStorage
- 🔍 **Live Preview**: Preview your email before exporting
- 📦 **Export to ZIP**: Download complete email packages
- 🖼️ **Image Management**: Upload and manage images with automatic base64 conversion
- 🌐 **Multi-language Support**: Built-in support for Russian and Kazakh languages
- ⚙️ **Customizable Settings**: Fine-tune every aspect of your components

## 📁 Project Structure

```
react-email-builder/
├── public/
│   └── i/                          # Default footer icons (social media, chat, call)
│       ├── facebook.png
│       ├── instagram.png
│       ├── vk.png
│       ├── youtube.png
│       ├── twitter.png
│       ├── linkedin.png
│       ├── chat.png
│       └── call.png
├── scripts/
│   └── convertImagesToBase64.js    # Utility script for image conversion
├── src/
│   ├── components/                 # React components
│   │   ├── EmailBuilder.jsx        # Main builder component
│   │   ├── BlockRenderer.jsx       # Renders individual blocks in editor
│   │   ├── BlockHtmlRenderer.jsx   # Converts blocks to HTML strings
│   │   ├── PreHeader.jsx           # Pre-header section component
│   │   ├── RoundContainer.jsx      # Special container component
│   │   └── EmailBuilder.css        # Main stylesheet
│   ├── config/
│   │   └── emailTemplateConfig.jsx # Component definitions & initial template
│   ├── handlers/
│   │   └── EmailBuilderHandlers.js  # Business logic & event handlers
│   ├── utils/
│   │   ├── assets.js               # Asset management (localStorage)
│   │   ├── htmlGenerator.js       # HTML output generation
│   │   └── imageUtils.js           # Image utility functions
│   ├── App.jsx                     # Root component
│   ├── App.css                     # App-level styles
│   ├── index.css                  # Global styles
│   └── main.jsx                    # Entry point
├── index.html                      # HTML entry point
├── package.json                    # Dependencies and scripts
├── vite.config.js                  # Vite configuration
└── README.md                       # This file
```

## 🚀 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Setup Steps

1. **Clone or navigate to the project directory**
   ```bash
   cd react-email-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:5173` (or the port shown in terminal)

## 📖 Usage

### Building an Email Template

1. **Add Components**: Drag components from the left sidebar onto the canvas
2. **Edit Content**: Click on any block to edit its content and settings
3. **Customize Settings**: Use the settings panel to adjust colors, fonts, spacing, etc.
4. **Reorder Blocks**: Drag blocks up or down to reorder them
5. **Preview**: Click the "Preview" button to see how your email will look
6. **Save**: Click "Save" to export your template as a ZIP file

### Template Settings

Configure global template settings in the sidebar:
- **Template Title**: The title displayed in the email header
- **Title Link Label**: Label for the title link (for analytics)
- **Title Link Label Unsub**: Label for unsubscribe link in header
- **Footer Link Label**: Default label for footer unsubscribe links

### Working with Images

1. **Upload Images**: When editing image blocks, click to upload images
2. **Image Storage**: Images are stored in browser localStorage as base64
3. **Export**: All uploaded images are automatically included in the ZIP export
4. **Default Icons**: Footer icons are automatically included from `/public/i/`

## 🧩 Component Types

### Text Components

- **Header**: Large heading text with optional image
- **Text Block**: Paragraph text with customizable styling
- **Half Text**: Text with an image side-by-side

### Media Components

- **Image**: Single image with optional link
- **Columns (Image)**: Multiple images in a row
- **Columns (Content)**: Images with titles and text in columns

### Interactive Components

- **Button**: Image-based button
- **Button Coded**: CSS-styled button with text
- **Button Group**: Multiple buttons in a row
- **Button Coded Group**: Multiple coded buttons together

### Layout Components

- **Divider**: Horizontal line separator
- **Spacer**: Empty space with configurable height
- **Round Container**: Container with rounded corners (can nest other blocks)

### Footer Components

- **General Footer RU**: Russian language footer with social links
- **Footer General KZ**: Kazakh language footer
- **Footer Sendpulse**: Footer variant for Sendpulse integration

## 📂 Key Files & Directories

### Core Components

#### `src/components/EmailBuilder.jsx`
- **Purpose**: Main application component
- **Key Features**:
  - Manages template state
  - Handles drag & drop
  - Auto-saves to localStorage
  - Coordinates all builder functionality
- **Edit This For**: Main UI changes, new features, state management

#### `src/components/BlockRenderer.jsx`
- **Purpose**: Renders blocks in the editor view
- **Key Features**:
  - Visual representation of blocks
  - Inline editing capabilities
  - Settings panels for each block type
  - Drag & drop handlers
- **Edit This For**: Editor UI, block editing interfaces, settings panels

#### `src/components/BlockHtmlRenderer.jsx`
- **Purpose**: Converts block data to email-compatible HTML
- **Key Features**:
  - Table-based HTML generation (email-safe)
  - Handles all block types
  - Inline style generation
  - Multi-language support (RU/KZ)
- **Edit This For**: HTML output format, email compatibility fixes, new block HTML rendering

### Configuration

#### `src/config/emailTemplateConfig.jsx`
- **Purpose**: Defines available components and initial template structure
- **Key Features**:
  - Component type definitions
  - Default settings for each component
  - Initial template structure
- **Edit This For**: Adding new component types, changing defaults, initial template

### Business Logic

#### `src/handlers/EmailBuilderHandlers.js`
- **Purpose**: Contains all event handlers and business logic
- **Key Functions**:
  - `createNewBlock()`: Creates new block instances
  - `handleDeleteBlock()`: Removes blocks
  - `handleDuplicateBlock()`: Clones blocks
  - `handleUpdateBlockContent()`: Updates block content
  - `handleUpdateBlockSettings()`: Updates block settings
  - `handleSaveTemplate()`: Exports template as ZIP
  - Drag & drop handlers
- **Edit This For**: Adding new operations, modifying block creation logic, export functionality

### Utilities

#### `src/utils/htmlGenerator.js`
- **Purpose**: Generates final HTML output
- **Key Features**:
  - Wraps blocks in email-safe HTML structure
  - Adds pre-header section
  - Includes email client compatibility styles
  - Generates complete HTML document
- **Edit This For**: HTML structure changes, email client compatibility, pre-header customization

#### `src/utils/assets.js`
- **Purpose**: Manages uploaded images/assets
- **Key Features**:
  - Stores assets in localStorage
  - Converts files to base64
  - Provides asset retrieval functions
  - Handles asset cleanup
- **Edit This For**: Asset storage strategy, file handling, storage optimization

#### `src/utils/imageUtils.js`
- **Purpose**: Image-related utility functions
- **Edit This For**: Image processing, path resolution, image helpers

### Supporting Components

#### `src/components/PreHeader.jsx`
- **Purpose**: Renders the pre-header section (title, view in browser, unsubscribe)
- **Edit This For**: Pre-header layout, header customization

#### `src/components/RoundContainer.jsx`
- **Purpose**: Special container component with rounded corners
- **Edit This For**: Container styling, nested block handling

## 🔧 Development Workflow

### Adding a New Component Type

1. **Define in Config** (`src/config/emailTemplateConfig.jsx`):
   ```jsx
   { type: 'myComponent', label: 'My Component', icon: <Icon /> }
   ```

2. **Add Creation Logic** (`src/handlers/EmailBuilderHandlers.js`):
   ```javascript
   case 'myComponent':
     return {
       id,
       type,
       content: 'Default content',
       settings: { /* default settings */ }
     };
   ```

3. **Add Editor Rendering** (`src/components/BlockRenderer.jsx`):
   - Add a case in the render switch statement
   - Create editor UI for the component

4. **Add HTML Rendering** (`src/components/BlockHtmlRenderer.jsx`):
   - Add a case in the `renderBlockHtml` function
   - Generate email-compatible HTML

### Modifying Block Settings

1. **Update Default Settings**: Edit `createNewBlock()` in `EmailBuilderHandlers.js`
2. **Update Editor UI**: Modify the settings panel in `BlockRenderer.jsx`
3. **Update HTML Output**: Adjust `renderBlockHtml()` in `BlockHtmlRenderer.jsx`

### Styling Changes

- **Editor Styles**: `src/components/EmailBuilder.css`
- **Global Styles**: `src/index.css`
- **App Styles**: `src/App.css`

### Testing Changes

1. **Development**: Use `npm run dev` for hot-reload development
2. **Preview**: Use the Preview button to see HTML output
3. **Export**: Use Save button to test ZIP export
4. **Email Testing**: Import exported HTML into email testing tools (Litmus, Email on Acid)

## 📦 Export & Deployment

### Export Process

1. Click the **"Save"** button in the toolbar
2. A ZIP file is generated containing:
   - `index.html`: Complete email template
   - `i/`: Folder with all uploaded images and default icons

### Export Contents

- **HTML File**: Production-ready email HTML
- **Assets Folder**: All images used in the template
- **Default Icons**: Footer social media icons (if not overridden)

### Email Client Compatibility

The generated HTML uses:
- Table-based layouts (required for Outlook)
- Inline styles (required for Gmail)
- Email-safe CSS properties
- MSO conditional comments where needed

### Integration with Email Services

The exported HTML includes:
- Pre-header text for email clients
- Server-side template tags (e.g., `<%@ include %>`)
- Analytics attributes (`_label`, `_type`)
- Unsubscribe links with dynamic URLs

## 🔍 Technical Details

### State Management

- **Template State**: Managed in `EmailBuilder` component using React `useState`
- **Persistence**: Auto-saved to `localStorage` with key `emailBuilderData`
- **Assets**: Stored in `localStorage` with key `emailBuilderAssets`

### Data Structure

```javascript
{
  id: 'template-123',
  title: 'Template Title',
  titleLinkLabel: 'Label',
  titleLinkLabelUnsub: 'Unsub Label',
  footerLinkLabel: 'Footer Label',
  blocks: [
    {
      id: 'block-123',
      type: 'header',
      content: 'Content',
      settings: { /* settings */ }
    }
  ]
}
```

### Image Handling

- **Upload**: Files are converted to base64 and stored in localStorage
- **Preview**: Blob URLs used for immediate preview
- **Export**: Base64 data included in ZIP file
- **Path Format**: `i/{counter}.{ext}` (e.g., `i/1.png`)

### HTML Generation

- **Table-Based**: All layouts use `<table>` elements (email-safe)
- **Inline Styles**: All styles are inline (required for email clients)
- **Role Attributes**: Uses `role="presentation"` for accessibility
- **MSO Support**: Includes Outlook-specific attributes where needed

### Browser Compatibility

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Features Used**: 
  - FileReader API (image uploads)
  - localStorage (persistence)
  - Drag & Drop API
  - Blob URLs

## 🛠️ Available Scripts

- `npm run dev`: Start development server with hot-reload
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

## 📝 Notes

### Email Client Considerations

- **Outlook**: Uses table-based layouts and MSO-specific attributes
- **Gmail**: Inline styles only (no external CSS)
- **Mobile**: Responsive design with viewport meta tags
- **Dark Mode**: Uses `color-scheme: light` meta tag

### LocalStorage Usage

- **Template Data**: `emailBuilderData` - Current template state
- **Assets**: `emailBuilderAssets` - Uploaded images (base64)
- **Asset Counter**: `assetCounter` - Counter for asset filenames

### Performance

- **Auto-save**: Debounced to 400ms to avoid excessive writes
- **Image Rehydration**: Images are rehydrated from localStorage on page load
- **Asset Cleanup**: Use "Clear Local" button to remove all saved data

## 🤝 Contributing

### Making Edits

1. **Understand the Flow**:
   - Components are defined in `emailTemplateConfig.jsx`
   - Creation logic is in `EmailBuilderHandlers.js`
   - Editor UI is in `BlockRenderer.jsx`
   - HTML output is in `BlockHtmlRenderer.jsx`

2. **Test Thoroughly**:
   - Test in development mode
   - Export and test in email clients
   - Verify all block types still work
   - Check localStorage persistence

3. **Follow Patterns**:
   - Use existing block types as templates
   - Maintain email-safe HTML practices
   - Keep inline styles for email compatibility
   - Use table-based layouts