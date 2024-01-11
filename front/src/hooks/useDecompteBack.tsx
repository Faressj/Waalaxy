import { SetStateAction, useEffect } from "react";

export const useDecompteBack = (
  backendCounter: number | null,
  intervalsStarted: boolean,
  setBackendCounter: {
    (value: SetStateAction<number | null>): void;
    (arg0: number): void;
  },
  backendtime: number
) => {
  useEffect(() => {
    if (intervalsStarted && backendCounter !== null) {
      const interval = setInterval(() => {
        const newBackendCounter = backendCounter - 1000;
        setBackendCounter(newBackendCounter);

        if (newBackendCounter <= 0) {
          fetch("http://localhost:3001/init-update", {
            method: "POST",
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error(
                  "Échec de la réinitialisation de l’intervalle du backend"
                );
              }
              return response.text();
            })
            .then(() => {
              console.log("Recalcul des valeurs d'exécution déclenché");
              setBackendCounter(backendtime);
            })
            .catch((error) =>
              console.error("Erreur lors de la réinitialisation:", error)
            );
            
        //   window.location.reload();
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [backendCounter, intervalsStarted, setBackendCounter, backendtime]);
};
