import './App.css';
import ApiRequest from './components/screens/api-call';
import Dashboard from './components/screens/dashboard';
import Settings from './components/screens/settings/settings';
import { setupGlobalKeybindings } from '@/config/utils/keybindings';
import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import GlobalDrawer from './components/shared/global/global-settings-model';
import GlobalSettingsModal from './components/shared/global/global-settings-model';
import { ThemeProvider } from './components/shared/general-components/theme-provider';

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
