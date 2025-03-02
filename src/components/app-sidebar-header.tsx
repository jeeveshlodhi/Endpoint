import { SidebarTrigger } from '@/components/ui/sidebar';

export function AppSidebarHeader() {
    return (
        <header className="border-sidebar-border/50 flex h-16 shrink-0 items-center gap-2 border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="w-full flex items-center gap-4 justify-between">
                <SidebarTrigger className="-ml-1" />
                {/* <SearchCommand />
                <div className='flex gap-2'>
                    <Notification />
                    <LanguageSelector />
                </div> */}
            </div>
        </header>
    );
}
