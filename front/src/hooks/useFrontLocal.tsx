import { useEffect } from "react";

export const useFrontLocal = (
  frontendCounter: number | null,
  intervalsStarted: boolean
) => {
  useEffect(() => {
    if (intervalsStarted) {
      if (frontendCounter !== null) {
        localStorage.setItem("frontendCounter", frontendCounter.toString());
      }
    }
  }, [frontendCounter, intervalsStarted]);
};
