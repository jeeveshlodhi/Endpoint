import './App.css';
import ApiRequest from './pages/api-call';
import Dashboard from './pages/dashboard';
import Settings from './pages/settings/settings';
import { setupGlobalKeybindings } from '@/lib/keybindings';
import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import GlobalDrawer from './global-ui/global-settings-model';
import GlobalSettingsModal from './global-ui/global-settings-model';
import { ThemeProvider } from './components/theme-provider';

const router = createBrowserRouter([
    {
        path: '/',
        element: <ApiRequest />,
    },
    {
        path: 'dashboard',
        element: <Dashboard />,
    },
    {
        path: 'settings',
        element: <Settings />,
    },
]);

function App() {
    useEffect(() => {
        setupGlobalKeybindings();
    }, []);

    return (
        <ThemeProvider defaultTheme="dark" availableThemes={['light', 'dark', 'blue', 'green', 'purple']}>
            <GlobalDrawer />
            <GlobalSettingsModal />
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
