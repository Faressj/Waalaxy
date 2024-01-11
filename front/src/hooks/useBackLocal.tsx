import { useEffect } from "react";

export const useBackLocal = (
  backendCounter: number | null,
  intervalsStarted: boolean
) => {
  useEffect(() => {
    if (intervalsStarted) {
      if (backendCounter !== null) {
        localStorage.setItem("backendCounter", backendCounter.toString());
      }
    }
  }, [backendCounter, intervalsStarted]);
};
