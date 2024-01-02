import { useEffect } from "react";

export const useBackLocal = (backendCounter: number | null, intervalsStarted: boolean) => {
    useEffect(() => {  // useEffect pour sauvegarder le compteur backend dans le localStorage
        if (intervalsStarted) {
            if (backendCounter !== null) {
                localStorage.setItem('backendCounter', backendCounter.toString());
            }
        }
    }, [backendCounter, intervalsStarted]);
}