import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/shared/shadcn-components/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/shared/shadcn-components/sidebar';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { useIsMobile } from '@/hooks/use-mobile';
import { User } from '@/types';
import { ChevronsUpDown } from 'lucide-react';

export function NavUser() {
    const { state } = useSidebar();
    const isMobile = useIsMobile();

    const user: User = {
        id: 1,
        name: 'Jeevesh Lodhi',
        email: 'jeevesh@gmail.com',
        avatar: '',
        email_verified_at: null,
        created_at: '',
        updated_at: '',
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger className="w-full">
                        <SidebarMenuButton
                            size="lg"
                            className="text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent group"
                        >
                            <UserInfo user={user} />
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent side="top">
                        <UserMenuContent user={user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
