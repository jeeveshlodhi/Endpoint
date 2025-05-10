import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { preloadThemes } from './preload-themes';

const rootElement = document.getElementById('root');

(async () => {
    await preloadThemes('light', ['light', 'dark', 'blue', 'green', 'purple']);

    if (rootElement) {
        ReactDOM.createRoot(rootElement).render(
            <React.StrictMode>
                <App />
            </React.StrictMode>,
        );
    }
})();
