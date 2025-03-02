import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

// React Imports
import type { ReactNode } from 'react';

export type Layout = 'vertical' | 'collapsed' | 'horizontal';

export type Skin = 'default' | 'bordered';

export type Mode = 'system' | 'light' | 'dark';

export type SystemMode = 'light' | 'dark';

export type Direction = 'ltr' | 'rtl';

export type LayoutComponentWidth = 'compact' | 'wide';

export type LayoutComponentPosition = 'fixed' | 'static';

export type ChildrenType = {
    children: ReactNode;
};

// Tailwind-Specific Theme Colors
export type ThemeColor =
    | 'primary'
    | 'secondary'
    | 'error'
    | 'warning'
    | 'info'
    | 'success'
    | 'gray'
    | 'blue'
    | 'red'
    | 'green'
    | 'yellow'
    | 'purple';

// Theme Configuration for Tailwind Utility Classes
export interface ThemeConfig {
    mode: Mode;
    layout: Layout;
    direction: Direction;
    themeColor: ThemeColor;
    skin: Skin;
    width: LayoutComponentWidth;
    position: LayoutComponentPosition;
}

// Default Theme Settings
export const defaultTheme: ThemeConfig = {
    mode: 'system',
    layout: 'vertical',
    direction: 'ltr',
    themeColor: 'primary',
    skin: 'default',
    width: 'wide',
    position: 'fixed',
};
