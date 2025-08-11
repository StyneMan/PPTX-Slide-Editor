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


## Trade-offs
### Limited Format Support:
Focusing on basic shapes/text/images to meet core requirements

Advanced PPTX features (animations, complex gradients) will be ignored

### Font Handling:
Will use system fallbacks rather than embedded fonts

Text measurements may not be pixel-perfect

### Performance:
Complex slides may render slower than server-side solutions

Will implement canvas virtualization for large decks


## If Given More Time
### Enhanced Features:
Ungroup/regroup functionality

Basic shape formatting controls

Improved text editing with style controls

### Performance Optimizations:
Lazy loading of slides

Canvas caching for better rendering performance



Github repository [link](https://github.com/StyneMan/PPTX-Slide-Editor) 

Production [demo](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:
 
### By Stanley Nyekpeye

LinkedIn [@Stanley Nyekpeye](https://www.linkedin.com/in/stanley-nyekpeye-03a456194/) 
