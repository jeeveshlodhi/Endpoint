import { useEffect, useState } from "react";

export function useIsTauri(): boolean {
    const [isTauri, setIsTauri] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined" && "__TAURI_INTERNALS__" in window) {
            setIsTauri(true);
        }
    }, []);

    return isTauri;
}
