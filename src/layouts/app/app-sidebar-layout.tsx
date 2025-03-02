import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import AppTitle from '@/components/app-title';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({ children }: PropsWithChildren) {
    return (
        <div className="h-screen w-screen overflow-hidden flex flex-col">
            <AppTitle />
            <div className="flex flex-1 overflow-hidden">
                <AppShell variant="sidebar">
                    <div className="h-full">
                        <AppSidebar />
                    </div>
                    <AppContent variant="sidebar" className="flex-1 overflow-hidden">
                        <AppSidebarHeader />
                        <div className="h-full w-full overflow-auto">{children}</div>
                    </AppContent>
                </AppShell>
            </div>
        </div>
    );
}
