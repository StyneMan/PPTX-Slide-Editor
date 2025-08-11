import { createTheme } from '@mui/material/styles';
import '@fontsource/raleway/300.css';
import '@fontsource/raleway/400.css';
import '@fontsource/raleway/500.css';
import '@fontsource/raleway/700.css';

const theme = createTheme({
    palette: {
        primary: {
            main: '#0B82B1',
            light: '#48b1e0',
            dark: '#07567a',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#f50057', // Customize as needed
        },
        background: {
            default: '#f5f5f5',
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: '"Inter", -apple-system, sans-serif',
        h1: { fontWeight: 700 },
        h2: { fontWeight: 700 },
        h3: { fontWeight: 600 },
        h4: { fontWeight: 600 },
        h5: { fontWeight: 500 },
        h6: { fontWeight: 500 },
        button: {
            fontWeight: 500,
            // letterSpacing: '0.025em', // Slightly tighter letter spacing
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    px: 2,
                    borderRadius: '8px',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                },
            },
            variants: [
                {
                    props: { size: 'large' },
                    style: {
                        padding: '8px 22px',
                        fontSize: '0.9375rem',
                    },
                },
            ],
        },
        MuiCssBaseline: {
            styleOverrides: {
                html: {
                    fontFeatureSettings: '"cv11"', // Enables OpenType features in Inter
                },
                body: {
                    fontSmooth: 'always',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                },
            },
        },
    },
    shape: {
        borderRadius: 8,
    },
});

export default theme;