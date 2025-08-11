import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Document, Slide, SlideObject } from '../../models/document';

interface DocumentState {
    document: Document | null;
    currentSlideIndex: number;
    selectedObjectId: string | null;
    clipboard: SlideObject | null;
    zoom: number;
    past: Document[]; // for undo/redo
    future: Document[]; // for redo
    isLoading: boolean;
    error: string | null;
    present: Document | null,
}

// interface DocumentState {
//     document: Document | null;
//     currentSlideIndex: number;
//     isLoading: boolean;
//     error: string | null;
//     clipboard: any;
//     zoom: any;
//     selectedObjectId: any;
// }

const initialState: DocumentState = {
    document: null,
    currentSlideIndex: 0,
    isLoading: false,
    error: null,
    clipboard: null,
    zoom: 1,
    selectedObjectId: null,
    past: [],
    present: null,
    future: [],
};

const documentSlice = createSlice({
    name: 'document',
    initialState,
    reducers: {
        // loadDocument: (state, action: PayloadAction<Document>) => {
        //     state.document = action.payload;
        //     state.currentSlideIndex = 0;
        //     state.isLoading = false;
        //     state.error = null;
        // },
        addSlide: (state) => {
            if (!state.document) return;
            state.document.slides.push({
                id: crypto.randomUUID(),
                objects: [],
            });
        },
        // removeSlide: (state, action: PayloadAction<number>) => {
        //     if (!state.document) return;
        //     state.document.slides.splice(action.payload, 1);
        //     if (state.currentSlideIndex >= action.payload) {
        //         state.currentSlideIndex = Math.max(0, state.currentSlideIndex - 1);
        //     }
        // },

        loadDocument: (state, action: PayloadAction<Document>) => {
            state.isLoading = false;
            state.error = null;
            documentSlice.caseReducers.updateDocumentState(state, {
                ...action,
                payload: action.payload,
            });
        },

        // addSlide: (state) => {
        //     if (!state.present) return;

        //     const newDocument = {
        //         ...state.present,
        //         slides: [
        //             ...state.present.slides,
        //             {
        //                 id: crypto.randomUUID(),
        //                 objects: [],
        //             },
        //         ],
        //     };

        //     documentSlice.caseReducers.updateDocumentState(state, {
        //         payload: newDocument,
        //         type: ''
        //     });
        // },

        removeSlide: (state, action: PayloadAction<number>) => {
            if (!state.present) return;

            const newSlides = [...state.present.slides];
            newSlides.splice(action.payload, 1);

            const newDocument = {
                ...state.present,
                slides: newSlides,
            };

            documentSlice.caseReducers.updateDocumentState(state, {
                ...action,
                payload: newDocument,
            });
        },
        updateCurrentSlide: (state, action: PayloadAction<Slide>) => {
            if (!state.document) return;
            state.document.slides[state.currentSlideIndex] = action.payload;
        },
        addObject: (state, action: PayloadAction<SlideObject>) => {
            if (!state.document) return;
            state.document.slides[state.currentSlideIndex].objects.push(action.payload);
        },
        updateObject: (
            state,
            action: PayloadAction<{ id: string; updates: Partial<SlideObject> }>
        ) => {
            if (!state.document) return;
            const slide = state.document.slides[state.currentSlideIndex];
            const obj = slide.objects.find((o) => o?.id === action.payload.id);
            if (obj) {
                Object.assign(obj, action.payload.updates);
            }
        },
        removeObject: (state, action: PayloadAction<string>) => {
            if (!state.document) return;
            const slide = state.document.slides[state.currentSlideIndex];
            slide.objects = slide.objects.filter((o) => o.id !== action.payload);
        },
        setCurrentSlideIndex: (state, action: PayloadAction<number>) => {
            state.currentSlideIndex = action.payload;
        },
        reset: (state) => {
            state.document = null;
            state.currentSlideIndex = 0;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        // New reducers for toolbar functionality
        selectObject: (state, action: PayloadAction<string | null>) => {
            state.selectedObjectId = action.payload;
        },
        bringObjectForward: (state, action: PayloadAction<string>) => {
            if (!state.document) return;
            const slide = state.document.slides[state.currentSlideIndex];
            const index = slide.objects.findIndex(o => o.id === action.payload);
            if (index < slide.objects.length - 1) {
                const [obj] = slide.objects.splice(index, 1);
                slide.objects.splice(index + 1, 0, obj);
            }
        },
        sendObjectBackward: (state, action: PayloadAction<string>) => {
            if (!state.document) return;
            const slide = state.document.slides[state.currentSlideIndex];
            const index = slide.objects.findIndex(o => o.id === action.payload);
            if (index > 0) {
                const [obj] = slide.objects.splice(index, 1);
                slide.objects.splice(index - 1, 0, obj);
            }
        },
        copyObject: (state, action: PayloadAction<string>) => {
            if (!state.document) return;
            const slide = state.document.slides[state.currentSlideIndex];
            const obj = slide.objects.find(o => o.id === action.payload);
            if (obj) {
                state.clipboard = JSON.parse(JSON.stringify(obj));
            }
        },
        pasteObject: (state) => {
            if (!state.document || !state.clipboard) return;
            const newObj = {
                ...JSON.parse(JSON.stringify(state.clipboard)),
                id: crypto.randomUUID(),
                position: {
                    x: (state.clipboard.position?.x || 0) + 10,
                    y: (state.clipboard.position?.y || 0) + 10,
                },
            };
            state.document.slides[state.currentSlideIndex].objects.push(newObj);
        },
        duplicateObject: (state, action: PayloadAction<string>) => {
            if (!state.document) return;
            const slide = state.document.slides[state.currentSlideIndex];
            const obj = slide.objects.find(o => o.id === action.payload);
            if (obj) {
                const newObj = {
                    ...JSON.parse(JSON.stringify(obj)),
                    id: crypto.randomUUID(),
                    position: {
                        x: (obj.position?.x || 0) + 10,
                        y: (obj.position?.y || 0) + 10,
                    },
                };
                slide.objects.push(newObj);
            }
        },
        zoomIn: (state) => {
            state.zoom = Math.min(state.zoom * 1.1, 3);
        },
        zoomOut: (state) => {
            state.zoom = Math.max(state.zoom / 1.1, 0.5);
        },
        resetZoom: (state) => {
            state.zoom = 1;
        },
        updateDocumentState: (state, action: PayloadAction<Document>) => {
            // Only track history if the document actually changed
            if (state.present && JSON.stringify(state.present) !== JSON.stringify(action.payload)) {
                state.past.push(state.present);
                state.future = []; // Clear redo stack when making new changes
            }
            state.present = action.payload;
            state.document = action.payload;
        },

        // Undo action
        undo: (state) => {
            if (state.past.length > 0) {
                const previous = state.past[state.past.length - 1];
                state.future = [state.present as Document, ...state.future];
                state.past = state.past.slice(0, -1);
                state.present = previous;
                state.document = previous;
            }
        },

        // Redo action
        redo: (state) => {
            if (state.future.length > 0) {
                const next = state.future[0];
                state.past = [...state.past, state.present as Document];
                state.future = state.future.slice(1);
                state.present = next;
                state.document = next;
            }
        },

    },
});

export const {
    loadDocument,
    addSlide,
    removeSlide,
    updateCurrentSlide,
    addObject,
    updateObject,
    removeObject,
    setCurrentSlideIndex,
    reset,
    setLoading,
    setError,
    pasteObject,
    zoomIn,
    zoomOut,
    resetZoom,
    duplicateObject,
    copyObject,
    sendObjectBackward,
    bringObjectForward,
    selectObject,
    undo,
    redo
} = documentSlice.actions;

export default documentSlice.reducer;