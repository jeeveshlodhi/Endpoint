import { useState } from 'react';
import reactLogo from './assets/react.svg';
import { invoke } from '@tauri-apps/api/core';
import './App.css';
import AppLayout from '@/layouts/app-layout';

function App() {
    return (
        <AppLayout>
            <div>Hello</div>
        </AppLayout>
    );
}

export default App;
