# PPTX SLIDE EDITOR

## Core Technologies:

React + TypeScript with Vite

Fabric.js for canvas-based editing (good support for objects, transformations, and text editing)

JSZip for PPTX file parsing

Reduxjs/Toolkit for state management

## Implementation Steps
### File Processing:
Use JSZip to extract PPTX contents

Parse slide XML files to extract shapes, text, and images

Convert PPTX measurements to pixel values

### Rendering:
Map PPTX shapes to Fabric.js objects (rect, ellipse, text, image, etc.)

Maintain z-order and grouping

Implement basic styling (fills, strokes, fonts)

### Editing Features:
Fabric.js provides built-in selection, movement, resizing
Custom handlers for rotation and z-index manipulation
Double-click text editing with style preservation

### State Management:
Reduxjs/Toolkit store for document model

History tracking for undo/redo

Serialization to/from JSON


- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

