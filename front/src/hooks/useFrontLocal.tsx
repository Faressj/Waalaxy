import { useEffect } from "react";

export const useFrontLocal = (frontendCounter: number | null, intervalsStarted: boolean) => {
    useEffect(() => {  // useEffect pour sauvegarder le frontend dans le localStorage
        if (intervalsStarted) {
            if (frontendCounter !== null) {
                localStorage.setItem('frontendCounter', frontendCounter.toString());
            }
        }
    }, [frontendCounter, intervalsStarted]);
}