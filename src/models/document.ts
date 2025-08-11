interface BaseObject {
    id: string;
    position: Position;
    size: Size;
    rotation?: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface ShapeStyle {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
}

export interface TextBox extends BaseObject {
    type: 'text';
    text: string;
    style: ShapeStyle & {
        fontFamily: string;
        fontSize: number;
        fontWeight: string;
        textAlign: 'left' | 'center' | 'right';
        color: string;
    };
}

// export interface TextBox {
//   type: 'text';
//   text: string;
//   position: Position;
//   size: Size;
//   rotation?: number;
//   style: ShapeStyle & {
//     fontFamily: string;
//     fontSize: number;
//     fontWeight: string;
//     textAlign: 'left' | 'center' | 'right';
//     color: string;
//   };
// }

// export interface Image {
//   type: 'image';
//   position: Position;
//   size: Size;
//   rotation?: number;
//   src: string;
//   style: ShapeStyle;
// }

export interface Image extends BaseObject {
    type: 'image';
    src: string;
    style: ShapeStyle;
}

export interface Shape extends BaseObject {
    type: 'rectangle' | 'ellipse' | 'line';
    style: ShapeStyle;
}

// export interface Shape {
//   type: 'rectangle' | 'ellipse' | 'line';
//   position: Position;
//   size: Size;
//   rotation?: number;
//   style: ShapeStyle;
// }

// interface Group {
//   type: 'group';
//   children: SlideObject[];
//   position: Position;
//   size: Size;
//   rotation?: number;
// }

export interface Group extends BaseObject {
    type: 'group';
    children: SlideObject[];
}

export type SlideObject = TextBox | Image | Shape | Group;

export interface Slide {
  id: string;
  objects: SlideObject[];
  background?: string;
}

export interface Document {
  slides: Slide[];
  metadata: {
    title: string;
    created: string;
    modified: string;
  };
}