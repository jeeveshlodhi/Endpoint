import './App.css';
import ApiRequest from './pages/api-call';
import { Routes, Route } from 'react-router';
import Dashboard from './pages/dashboard';
import Settings from './pages/settings/settings';

function App() {
    return (
        <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route index path="/" element={<ApiRequest />} />
            <Route path="settings" element={<Settings />} />
        </Routes>
    );
}

export default App;
