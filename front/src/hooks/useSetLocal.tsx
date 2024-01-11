import { useEffect } from "react";

export const useSetLocal = (queue: any, intervalsStarted: boolean) => {
  useEffect(() => {
    localStorage.setItem("queue", JSON.stringify(queue));
    localStorage.setItem("intervalsStarted", JSON.stringify(intervalsStarted));
  }, [queue, intervalsStarted]);
};
