import { useEffect, useState } from 'react';
import { exit } from '@tauri-apps/plugin-process';
import { platform } from '@tauri-apps/plugin-os';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { Maximize, Minimize, X } from 'lucide-react';

const WindowControls = () => {
    const [mac, setMac] = useState(false);

    useEffect(() => {
        const checkPlatform = async () => {
            const platformName = platform(); // Await platform() as it returns a Promise
            setMac(platformName === 'macos'); // Use "macos" instead of "mac"
        };

        checkPlatform();
    }, []);

    const handleClose = async () => await exit(1);
    const handleMinimize = async () => await getCurrentWindow().minimize();
    const handleMaximize = async () => {
        const maximized = await getCurrentWindow().isMaximized();
        if (!maximized) {
            await getCurrentWindow().maximize();
        }
    };
    const handleDoubleClick = () => handleMaximize();

    return (
        <div
            className="flex items-center justify-between w-full bg-gray-900 text-white p-2 select-none"
            data-tauri-drag-region
            onDoubleClick={handleDoubleClick}
        >
            {mac && (
                <div className="flex gap-2">
                    <button onClick={handleMinimize} className="hover:bg-gray-700 p-1 rounded">
                        <Minimize size={16} />
                    </button>
                    <button onClick={handleMaximize} className="hover:bg-gray-700 p-1 rounded">
                        <Maximize size={16} />
                    </button>
                    <button onClick={handleClose} className="hover:bg-red-700 p-1 rounded">
                        <X size={16} />
                    </button>
                </div>
            )}
            <div className="text-sm font-semibold">Endpoint</div>
            {!mac && (
                <div className="flex gap-2">
                    <button onClick={handleMinimize} className="hover:bg-gray-700 p-1 rounded">
                        <Minimize size={16} />
                    </button>
                    <button onClick={handleMaximize} className="hover:bg-gray-700 p-1 rounded">
                        <Maximize size={16} />
                    </button>
                    <button onClick={handleClose} className="hover:bg-red-700 p-1 rounded">
                        <X size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default WindowControls;
