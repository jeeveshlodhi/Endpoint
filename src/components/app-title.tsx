import { useEffect, useState } from 'react';
import { exit } from '@tauri-apps/plugin-process';
import { platform } from '@tauri-apps/plugin-os';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, Maximize, Minimize, X } from 'lucide-react';
import { Avatar, AvatarImage } from './ui/avatar';
import { UserMenuContent } from './user-menu-content';
import { User } from '@/types';
import { AvatarFallback } from '@radix-ui/react-avatar';

const user: User = {
    id: 1,
    name: 'Jeevesh Lodhi',
    email: 'jeevesh@gmail.com',
    avatar: '',
    email_verified_at: null,
    created_at: '',
    updated_at: '',
};

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
            <>
                {mac && (
                    <div className="flex gap-2">
                        {/* Close Button - Red */}
                        <button
                            onClick={handleClose}
                            className="bg-red-500 w-3 h-3 rounded-full hover:bg-red-600 border border-red-700"
                        />

                        {/* Minimize Button - Yellow */}
                        <button
                            onClick={handleMinimize}
                            className="bg-yellow-500 w-3 h-3 rounded-full hover:bg-yellow-600 border border-yellow-700"
                        />

                        {/* Maximize Button - Green */}
                        <button
                            onClick={handleMaximize}
                            className="bg-green-500 w-3 h-3 rounded-full hover:bg-green-600 border border-green-700"
                        />
                    </div>
                )}
                <div className="text-sm font-semibold">Endpoint</div>
            </>
            <>
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center justify-center ">
                        <Avatar className="w-6 h-6">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <ChevronDown size={16} />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent side="bottom">
                        <UserMenuContent user={user} />
                    </DropdownMenuContent>
                </DropdownMenu>
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
            </>
        </div>
    );
};

export default WindowControls;
