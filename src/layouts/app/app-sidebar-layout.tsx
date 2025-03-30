import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import AppTitle from '@/components/app-title';
import { useEffect, type PropsWithChildren } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useSidebar } from '@/components/ui/sidebar';

import { useKeybinding } from '@/lib/utils';
import { platform } from '@tauri-apps/plugin-os';

export default function AppSidebarLayout({ children }: PropsWithChildren) {
    return (
        <div className="h-screen w-screen overflow-hidden flex flex-col">
            <AppTitle />
            <div className="flex flex-1 overflow-hidden">
                <AppShell variant="sidebar">
                    <AppShellContent>{children}</AppShellContent>
                </AppShell>
            </div>
        </div>
    );
}

function AppShellContent({ children }: { children: React.ReactNode }) {
    const { open, toggleSidebar } = useSidebar(); // Access sidebar state safely

    const currentPlatform = platform();

    useKeybinding(currentPlatform == 'macos' ? 'Cmd+D' : 'Ctrl+D', e => {
        e.preventDefault();
        toggleSidebar();
    });

    return (
        <ResizablePanelGroup direction="horizontal" className="flex-1">
            {/* Sidebar Panel - Collapsible based on isOpen */}
            <ResizablePanel
                defaultSize={open ? 20 : 0}
                minSize={0}
                maxSize={30}
                collapsible
                collapsedSize={open ? 20 : 0}
                translate="yes"
                style={{
                    transition: 'all 180ms ease',
                }}
            >
                {' '}
                <AppSidebar />
            </ResizablePanel>

            {/* Resizable Handle */}
            <ResizableHandle withHandle className="mx-1" onDrag={() => console.log('drag')} />

            {/* Main Content Panel */}
            <ResizablePanel className="flex flex-col">
                <AppContent variant="sidebar" className="flex-1 overflow-hidden">
                    <AppSidebarHeader />
                    <div className="h-full w-full overflow-auto">{children}</div>
                </AppContent>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
