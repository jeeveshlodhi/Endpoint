import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AppSidebarHeader() {
    return (
        <header className="border-sidebar-border/50 flex h-16 shrink-0 items-center gap-2 border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="w-full flex items-center gap-4 justify-between">
                <div className="flex items-center gap-2">
                    {/* Option 1: Use the existing SidebarTrigger with enhanced functionality */}
                    <SidebarTrigger className="-ml-0" />

                    {/* Option 2: Or use a regular Button if you need more control */}
                    {/* <Button
                        variant="ghost"
                        size="icon"
                        className="-ml-0 h-8 w-8"
                        onClick={onToggleCollapse}
                    >
                        {isCollapsed ? (
                            <PanelLeftOpen className="h-4 w-4" />
                        ) : (
                            <PanelLeftClose className="h-4 w-4" />
                        )}
                        <span className="sr-only">Toggle Sidebar</span>
                    </Button> */}
                </div>

                {/* Other header content */}
                {/* <SearchCommand />
                <div className='flex gap-2'>
                    <Notification />
                    <LanguageSelector />
                </div> */}
            </div>
        </header>
    );
}
