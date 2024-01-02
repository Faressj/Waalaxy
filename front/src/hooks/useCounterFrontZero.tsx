import { SetStateAction, useEffect } from "react";

export const useCounterFrontZero = (queue: any, actions: any, frontendCounter: number | null, setActionRemoving: (arg0: null) => void, setQueue: (arg0: (prevQueue: any) => any) => void, setActions: (arg0: (prevActions: any) => any) => void, updateAction: (arg0: any) => void, setFrontendCounter: { (value: SetStateAction<number | null>): void; (arg0: any): void; }, frontendtime: number) => {

    useEffect(() => {  // useEffect pour gérer la logique de la queue et des compteurs
        if (frontendCounter === 0) {
            if (queue.length > 0) {
                const actionToRemove = queue[0];
                const currentAction = actions.find((action: { nom: any; }) => action.nom === actionToRemove.name);

                if (currentAction && currentAction.executionValue > 0) {
                    setActionRemoving(actionToRemove.id); // Déclencher l'animation

                    setTimeout(() => {
                        setActionRemoving(null); // Fin de l'animation
                        setQueue((prevQueue: string | any[]) => prevQueue.slice(1)); // Retirer l'action de la queue
                        setActions((prevActions: any[]) => prevActions.map((action: { nom: any; executionValue: number; }) => {
                            if (action.nom === actionToRemove.name) {
                                return { ...action, executionValue: action.executionValue - 1 };
                            }
                            return action;
                        }));
                        updateAction({ ...currentAction, executionValue: currentAction.executionValue - 1 }); // Décrémente
                    }, 500); // Durée de l'animation
                }
            }
            setFrontendCounter(frontendtime); // Réinitialiser le compteur
        }
    }, [queue, actions, frontendCounter, setActionRemoving,setQueue,setActions,updateAction,setFrontendCounter,frontendtime]);
}