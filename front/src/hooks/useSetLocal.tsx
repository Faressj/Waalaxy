import { useEffect } from "react";
export const useSetLocal = (queue: any, intervalsStarted: boolean) => {
    useEffect(() => {  // useEf{fect pour sauvegarder la queue et intervalsStarted dans le localStorage
        localStorage.setItem('queue', JSON.stringify(queue));
        localStorage.setItem('intervalsStarted', JSON.stringify(intervalsStarted));
    }, [queue, intervalsStarted]);
}