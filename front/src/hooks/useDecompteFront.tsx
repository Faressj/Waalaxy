import { SetStateAction, useEffect } from "react";

export const useDecompteFront = (frontendCounter:number | null, intervalsStarted:boolean,setFrontendCounter: { (value: SetStateAction<number | null>): void; (arg0: (prev: number | null) => number | null): void; }) => {

    useEffect(() => {
        if (intervalsStarted && frontendCounter !== null) {
            const interval = setInterval(() => {
                setFrontendCounter((prev: number | null) => (prev !== null && prev > 0) ? prev - 1000 : prev);
            }, 1000);
            
            return () => clearInterval(interval);
        }
    }, [frontendCounter, intervalsStarted,setFrontendCounter]);
}