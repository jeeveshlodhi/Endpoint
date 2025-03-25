import './App.css';
import AppLayout from '@/layouts/app-layout';
import ApiRequest from './pages/api-call';

function App() {
    return (
        <AppLayout>
            <div>
                <ApiRequest />
            </div>
        </AppLayout>
    );
}

export default App;
