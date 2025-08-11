import JSZip from 'jszip';
import type { Shape, TextBox, Image, Slide, Document } from '../models/document';

const EMU_PER_INCH = 914400;
// const EMU_PER_CENTIMETER = 360000;
const EMU_PER_PIXEL = EMU_PER_INCH / 96; // 96 DPI

function emuToPixels(emu: number): number {
    return emu / EMU_PER_PIXEL;
}

function findElementWithFallbacks(element: Element, selectors: string[]): Element | null {
    for (const selector of selectors) {
        const found = element.querySelector(selector);
        if (found) return found;
    }
    return null;
}


// async function parseSlide(xml: string, zip: JSZip): Promise<Slide> {
//     const parser = new DOMParser();
//     const doc = parser.parseFromString(xml, 'application/xml');
//     console.log("Full slide XML:", xml);
//     console.log("Document element:", doc.documentElement.outerHTML);

//     const objects: Array<TextBox | Image | Shape> = [];

//     // Parse shapes
//     // const shapes = doc.querySelectorAll('p\\:sp, p\\:pic, p\\:grpSp');
//     // const shapes = doc.querySelectorAll('*|sp, *|pic, *|grpSp');
    
//     const allElements = doc.getElementsByTagName('*');
//     const shapes = Array.from(allElements).filter(el =>
//         el.localName === 'sp' ||
//         el.localName === 'pic' ||
//         el.localName === 'grpSp'
//     );

    
//     console.log("SHAPES FILE ::: ", shapes);
//     shapes.forEach(async (shape) => {
//         const type = shape.tagName;
//         const id = shape.getAttribute('id') || crypto.randomUUID();

//         // Get position and size
//         const xfrm = shape.querySelector('a\\:xfrm');
//         const off = xfrm?.querySelector('a\\:off');
//         const ext = xfrm?.querySelector('a\\:ext');

//         const x = emuToPixels(parseInt(off?.getAttribute('x') || '0'));
//         const y = emuToPixels(parseInt(off?.getAttribute('y') || '0'));
//         const width = emuToPixels(parseInt(ext?.getAttribute('cx') || '0'));
//         const height = emuToPixels(parseInt(ext?.getAttribute('cy') || '0'));
//         const rotation = parseInt(xfrm?.getAttribute('rot') || '0');

//         const position = { x, y };
//         const size = { width, height };

//         if (type === 'p:sp') {
//             // Text box or shape
//             const txBody = shape.querySelector('p\\:txBody');
//             if (txBody) {
//                 // Text box
//                 const paragraphs = txBody.querySelectorAll('a\\:p');
//                 let text = '';
//                 paragraphs.forEach((p) => {
//                     const runs = p.querySelectorAll('a\\:r');
//                     runs.forEach((r) => {
//                         text += r.querySelector('a\\:t')?.textContent || '';
//                     });
//                     text += '\n';
//                 });

//                 const style = parseTextStyle(shape);

//                 objects.push({
//                     type: 'text',
//                     id, // Now valid because BaseObject requires id
//                     text,
//                     position,
//                     size,
//                     rotation,
//                     style,
//                 } as TextBox); // Type assertion if needed
//             } else {
//                 // Shape
//                 const prstGeom = shape.querySelector('a\\:prstGeom');
//                 const shapeType = prstGeom?.getAttribute('prst') || 'rect';

//                 const style = parseShapeStyle(shape);

//                 if (shapeType === 'ellipse') {
//                     objects.push({
//                         type: 'ellipse',
//                         id,
//                         position,
//                         size,
//                         rotation,
//                         style,
//                     });
//                 } else {
//                     objects.push({
//                         type: 'rectangle',
//                         id,
//                         position,
//                         size,
//                         rotation,
//                         style,
//                     });
//                 }
//             }
//         } else if (type === 'p:pic') {
//             // Image
//             // const blip = shape.querySelector('a\\:blip');
//             // const embedId = blip?.getAttribute('r:embed');

//             //Format image type here
//             const imgRes = await parseImage(shape, zip)

//             // In a real app, we'd extract the image data from the PPTX
//             // For this example, we'll just use a placeholder
//             //  picElement: Element,
//             // zip: JSZip,
//             //     slidePath: string
//             objects.push({
//                 type: 'image',
//                 id,
//                 position,
//                 size,
//                 rotation,
//                 src: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=`, // Placeholder
//                 style: {},
//             });
//         } else {
//             console.log("TYPE CHECKER >>>> ", type);
//         }
        

//         // Note: Groups are more complex and omitted for brevity
//     });

//     return {
//         id: crypto.randomUUID(),
//         objects,
//     };
// }

async function parseSlide(xml: string, zip: JSZip, slidePath: string): Promise<Slide> {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');
    const objects: Array<TextBox | Image | Shape> = [];

    // Parse shapes
    const allElements = doc.getElementsByTagName('*');
    const shapes = Array.from(allElements).filter(el =>
        el.localName === 'sp' ||
        el.localName === 'pic' ||
        el.localName === 'grpSp'
    );

    // Process shapes sequentially to maintain order
    for (const shape of shapes) {
        const type = shape.localName; // Use localName instead of tagName
        const id = shape.getAttribute('id') || crypto.randomUUID();

        // Get position and size
        // const xfrm = shape.querySelector('a\\:xfrm');
        // const off = xfrm?.querySelector('a\\:off');
        // const ext = xfrm?.querySelector('a\\:ext');

        const xfrm = findElementWithFallbacks(shape, ['a\\:xfrm', 'xfrm', '*|xfrm']);
        const off = xfrm ? findElementWithFallbacks(xfrm, ['a\\:off', 'off', '*|off']) : null;
        const ext = xfrm ? findElementWithFallbacks(xfrm, ['a\\:ext', 'ext', '*|ext']) : null;


        // const xfrm = findElementWithFallbacks(shape, [
        //     'a\\:xfrm',
        //     'xfrm',
        //     '*|xfrm',
        //     'p\\:xfrm',
        //     'p\\:spPr > a\\:xfrm',
        //     'spPr > xfrm'
        // ]);

        // const off = xfrm ? findElementWithFallbacks(xfrm, [
        //     'a\\:off',
        //     'off',
        //     '*|off'
        // ]) : null;

        // const ext = xfrm ? findElementWithFallbacks(xfrm, [
        //     'a\\:ext',
        //     'ext',
        //     '*|ext'
        // ]) : null;

        const x = emuToPixels(parseInt(off?.getAttribute('x') || '0'));
        const y = emuToPixels(parseInt(off?.getAttribute('y') || '0'));
        const width = emuToPixels(parseInt(ext?.getAttribute('cx') || '0'));
        const height = emuToPixels(parseInt(ext?.getAttribute('cy') || '0'));
        const rotation = parseInt(xfrm?.getAttribute('rot') || '0');

        const position = { x, y };
        const size = { width, height };
        console.log("HJD :: ", position);
        

        if (type === 'sp') {
            // Text box or shape
            const txBody = shape.querySelector('p\\:txBody');
            if (txBody) {
                // Text box
                const paragraphs = txBody.querySelectorAll('a\\:p');
                let text = '';
                paragraphs.forEach((p) => {
                    const runs = p.querySelectorAll('a\\:r');
                    runs.forEach((r) => {
                        text += r.querySelector('a\\:t')?.textContent || '';
                    });
                    text += '\n';
                });

                const style = parseTextStyle(shape);

                objects.push({
                    type: 'text',
                    id,
                    size,
                    text: text.trim(),
                    position,
                    rotation,
                    style: {
                        fontFamily: style.fontFamily,
                        fontSize: style.fontSize,
                        fontWeight: style.fontWeight,
                        textAlign: style.textAlign as 'left' | 'center' | 'right', // Type assertion
                        color: style.color,
                        fill: style.fill
                    },
                });
            } else {
                // Shape
                const prstGeom = shape.querySelector('a\\:prstGeom');
                const shapeType = prstGeom?.getAttribute('prst') || 'rect';

                const style = parseShapeStyle(shape);

                if (shapeType === 'ellipse') {
                    objects.push({
                        type: 'ellipse',
                        id,
                        position,
                        size,
                        rotation,
                        style,
                    });
                } else {
                    objects.push({
                        type: 'rectangle',
                        id,
                        position,
                        size,
                        rotation,
                        style,
                    });
                }
            }
        } else if (type === 'pic') {
            // Image - use the actual parseImage function
            try {
                const imageObj = await parseImage(shape, zip, slidePath, position, size, rotation);
                if (imageObj) {
                    objects.push({
                        type: 'image',
                        id,
                        position,
                        size,
                        rotation,
                        src: imageObj.src,
                        style: {},
                    });
                } else {
                    // Fallback to placeholder if image parsing fails
                    objects.push({
                        type: 'image',
                        id,
                        position,
                        size,
                        rotation,
                        src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
                        style: {},
                    });
                }
            } catch (error) {
                console.error('Error parsing image:', error);
                // Fallback to placeholder
                objects.push({
                    type: 'image',
                    id,
                    position,
                    size,
                    rotation,
                    src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
                    style: {},
                });
            }
        }
    }

    return {
        id: crypto.randomUUID(),
        objects,
    };
}

function parseTextStyle(shape: Element) {
    // Simplified style parsing
    const txBody = shape.querySelector('p\\:txBody');
    const defRPr = txBody?.querySelector('a\\:defRPr');

    return {
        fontFamily: defRPr?.getAttribute('typeface') || 'Arial',
        fontSize: parseInt(defRPr?.getAttribute('sz') || '1200') / 100,
        fontWeight: defRPr?.getAttribute('b') === '1' ? 'bold' : 'normal',
        textAlign: 'left', // Would parse from paragraph properties
        color: defRPr?.getAttribute('srgbClr') || '#000000',
        fill: 'transparent',
    };
}

function parseShapeStyle(shape: Element) {
    // Simplified style parsing
    const spPr = shape.querySelector('p\\:spPr');
    const solidFill = spPr?.querySelector('a\\:solidFill');
    const ln = spPr?.querySelector('a\\:ln');

    return {
        fill: solidFill?.querySelector('a\\:srgbClr')?.getAttribute('val') || 'transparent',
        stroke: ln?.querySelector('a\\:srgbClr')?.getAttribute('val') || 'transparent',
        strokeWidth: ln ? emuToPixels(parseInt(ln.getAttribute('w') || '0')) : 0,
    };
}

async function parseImage(
    picElement: Element,
    zip: JSZip,
    slidePath: string,
    position,
    size,
    rotation
): Promise<Image | null> {
    const blip = picElement.querySelector('a\\:blip');
    const embedId = blip?.getAttribute('r:embed');

    if (!embedId) return null;

    // Get relationships file path
    const relsPath = slidePath.replace('slides/', 'slides/_rels/') + '.rels';
    const relsXml = await zip.file(relsPath)?.async('text');
    if (!relsXml) return null;

    // Find the image path
    const parser = new DOMParser();
    const relsDoc = parser.parseFromString(relsXml, 'application/xml');
    const relationship = relsDoc.querySelector(`Relationship[@Id="${embedId}"]`);
    const imagePath = relationship?.getAttribute('Target');
    if (!imagePath) return null;


    // Get the image file
    const fullImagePath = `ppt/${imagePath}`;
    const imageFile = zip.file(fullImagePath);
    if (!imageFile) return null;

    // Convert to base64
    const imageData = await imageFile.async('base64');
    const extension = imagePath.split('.').pop()?.toLowerCase();
    const mimeType = extension === 'jpg' ? 'image/jpeg' : `image/${extension}`;

    // const rotation = parseInt(xfrm?.getAttribute('rot') || '0');

    return {
        type: 'image',
        src: `data:${mimeType};base64,${imageData}`,
        id: embedId,
        position,
        size,
        rotation: rotation,
        style: {}
    };
}

export async function parsePPTX(file: File): Promise<Document> {
    const zip = await JSZip.loadAsync(file);
    const slides: Slide[] = [];

    const presentation = await zip.file('ppt/presentation.xml')?.async('text');
    if (!presentation) throw new Error('Invalid PPTX file');

    const slideFiles = Object.keys(zip.files)
        .filter((name) => name.startsWith('ppt/slides/slide') && name.endsWith('.xml'));

    for (const slideFile of slideFiles) {
        const slideXml = await zip.file(slideFile)?.async('text');
        if (slideXml) {
            slides.push(await parseSlide(slideXml, zip, slideFile));
        }
    }

    return {
        slides,
        metadata: {
            title: file.name.replace('.pptx', ''),
            created: new Date().toISOString(),
            modified: new Date().toISOString(),
        },
    };
}



// Note: Groups are more complex and omitted for brevity
// Help me handle other types such as group type