import { clsx, type ClassValue } from "clsx";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { registerKeybinding, unregisterKeybinding } from "./keybindings";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
export function useKeybinding(key: string, callback: (e: KeyboardEvent) => void) {
    useEffect(() => {
        registerKeybinding(key, callback);
        return () => unregisterKeybinding(key);
    }, [key, callback]);
}
