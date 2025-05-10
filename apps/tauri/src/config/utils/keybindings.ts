type KeybindingMap = {
    [key: string]: (e: KeyboardEvent) => void;
};

const keybindings: KeybindingMap = {};

export function registerKeybinding(key: string, callback: (e: KeyboardEvent) => void) {
    keybindings[key] = callback;
}

export function unregisterKeybinding(key: string) {
    delete keybindings[key];
}

export function setupGlobalKeybindings() {
    document.addEventListener("keydown", (e) => {
        // Skip if typing in an input/textarea
        if ((e.target as HTMLElement).tagName.match(/INPUT|TEXTAREA|SELECT/)) return;

        const key = [
            e.metaKey ? "Cmd" : "",
            e.ctrlKey ? "Ctrl" : "",
            e.altKey ? "Alt" : "",
            e.shiftKey ? "Shift" : "",
            e.key.toUpperCase(),
        ]
            .filter(Boolean)
            .join("+");

        // console.log("Pressed key combo:", key); // Debug log

        if (keybindings[key]) {
            e.preventDefault();
            keybindings[key](e);
        }
    });
}
