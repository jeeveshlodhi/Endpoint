import { AppContent } from '@/components/shared/general-components/app-content';
import { AppShell } from '@/components/shared/general-components/app-shell';
import { AppSidebar } from '@/components/shared/general-components/app-sidebar';
import { AppSidebarHeader } from '@/components/shared/general-components/app-sidebar-header';
import AppTitle from '@/components/shared/general-components/app-title';
import { useEffect, useState, type PropsWithChildren } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/shared/shadcn-components/resizable';
import { useSidebar } from '@/components/shared/shadcn-components/sidebar';
import { useKeybinding } from '@/config/utils/utils';
import { useIsTauri } from '@/config/hooks/use-isTauri';

export default function AppSidebarLayout({ children }: PropsWithChildren) {
    return (
        <div className="h-screen w-screen overflow-hidden flex flex-col">
            {useIsTauri() && <AppTitle />}
            <div className="flex flex-1 overflow-hidden">
                <AppShell variant="sidebar">
                    <AppShellContent>{children}</AppShellContent>
                </AppShell>
            </div>
        </div>
    );
}

function AppShellContent({ children }: { children: React.ReactNode }) {
    const { open, toggleSidebar } = useSidebar();
    const [currentPlatform, setCurrentPlatform] = useState<string | null>(null);

    useEffect(() => {
        const getPlatform = async () => {
            if (useIsTauri()) {
                const { platform } = await import('@tauri-apps/plugin-os');
                setCurrentPlatform(platform());
            }
        };
        getPlatform();
    }, []);

    useKeybinding(
        currentPlatform === 'macos' ? 'Cmd+D' : 'Ctrl+D',
        e => {
            e.preventDefault();
            toggleSidebar();
        },
        [currentPlatform],
    );

    return (
        <ResizablePanelGroup direction="horizontal" className="flex-1 relative">
            <ResizablePanel
                defaultSize={16}
                minSize={17}
                maxSize={35}
                style={{
                    display: open ? 'block' : 'none',
                    position: 'relative',
                    zIndex: 10,
                }}
                className="h-full"
            >
                <AppSidebar />
            </ResizablePanel>

            {open && <ResizableHandle withHandle className="mx-1" />}

            <ResizablePanel defaultSize={open ? 80 : 100} minSize={65} className="flex flex-col h-full">
                <AppContent variant="sidebar" className="flex-1 overflow-hidden">
                    <AppSidebarHeader />
                    <div className="h-full w-full overflow-auto">{children}</div>
                </AppContent>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
