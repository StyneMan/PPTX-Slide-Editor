// hooks/useKeyboardShortcuts.ts
import { useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { undo, redo } from '../store/slices/document';

export const useKeyboardShortcuts = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'z':
                        if (!e.shiftKey) {
                            dispatch(undo());
                            e.preventDefault();
                        }
                        break;
                    case 'y':
                    case 'Z':
                        dispatch(redo());
                        e.preventDefault();
                        break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [dispatch]);
};