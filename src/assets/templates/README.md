# Email Template Assets

This directory is for template-specific assets. Each email template should have its own subdirectory containing its unique images and other assets.

## Directory Structure

```
src/assets/
├── global/           # Global assets used across all templates
│   ├── icon.png     # Common icons and shared assets
│   └── ...
└── templates/        # Template-specific assets
    ├── template1/    # Assets for template 1
    │   ├── header.png
    │   ├── banner.jpg
    │   └── ...
    ├── template2/    # Assets for template 2
    │   ├── header.png
    │   ├── banner.jpg
    │   └── ...
    └── ...
```

## Usage Guidelines

1. **Global Assets**
   - Place common assets used across all templates in the `global` directory
   - Examples: social media icons, common UI elements, logos
   - Import using: `import asset from '../assets/global/asset-name.png'`

2. **Template-Specific Assets**
   - Create a new subdirectory for each template
   - Name the directory descriptively (e.g., `template1`, `newsletter`, `promotion`)
   - Place all template-specific images and assets in the template's directory
   - Import using: `import asset from '../assets/templates/template-name/asset-name.png'`

3. **Best Practices**
   - Use descriptive file names
   - Optimize images for email (compress when possible)
   - Keep file sizes small for better email delivery
   - Use appropriate image formats (PNG for icons, JPG for photos)
   - Include alt text for all images
