import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, useLocation } from 'react-router';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = useLocation();
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map(item => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={item.url === page.pathname}>
                            <Link to={item.url} className="flex gap-2 items-center justify-start">
                                {item.icon && <item.icon size={20} />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
