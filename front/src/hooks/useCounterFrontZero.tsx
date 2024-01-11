import { SetStateAction, useEffect } from "react";

export const useCounterFrontZero = (
  queue: any,
  actions: any,
  frontendCounter: number | null,
  setActionRemoving: (arg0: null) => void,
  setQueue: (arg0: (prevQueue: any) => any) => void,
  setActions: (arg0: (prevActions: any) => any) => void,
  updateAction: (arg0: any) => void,
  setFrontendCounter: {
    (value: SetStateAction<number | null>): void;
    (arg0: any): void;
  },
  frontendtime: number,
  toggle: boolean
) => {
  const checkexecutionValueFIFO = (queuetesting: any) => {
    let i: number;
    for (i = 0; i < queue.length; i++) {
      let currentAction = actions.find(
        (action: { name: any }) => action.name === queuetesting[i].name
      );
      if (currentAction.executionValue > 0) {
        return i;
      }
    }
  };
  const checkexecutionValueFILO = (queuetesting: any) => {
    let i: number;
    for (i = queue.length - 1; i >= 0; i--) {
      let currentAction = actions.find(
        (action: { name: any }) => action.name === queuetesting[i].name
      );
      if (currentAction.executionValue > 0) {
        return i;
      }
    }
  };
  let actionToRemove: any;
  let indextomove: number | undefined;
  useEffect(() => {
    if (frontendCounter === 0) {
      if (queue.length > 0) {
        if (toggle === true) {
          indextomove = checkexecutionValueFIFO(queue);
          if (indextomove !== undefined) actionToRemove = queue[indextomove];
        } else {
          indextomove = checkexecutionValueFILO(queue);
          if (indextomove !== undefined) actionToRemove = queue[indextomove];
        }

        if (actionToRemove !== undefined) {
          const currentAction = actions.find(
            (action: { name: any }) => action.name === actionToRemove.name
          );

          if (currentAction && currentAction.executionValue > 0) {
            setActionRemoving(actionToRemove.id);

            setTimeout(() => {
              setActionRemoving(null);

              setQueue((prevQueue: string | any[]) => {
                if (Array.isArray(prevQueue)) {
                  let newQueue = [...prevQueue];
                  if (indextomove !== undefined)
                    newQueue.splice(indextomove, 1);
                  prevQueue = newQueue;
                  return prevQueue;
                } else {
                  return prevQueue;
                }
              });

              setActions((prevActions: any[]) =>
                prevActions.map(
                  (action: { name: any; executionValue: number }) => {
                    if (action.name === actionToRemove.name) {
                      return {
                        ...action,
                        executionValue: action.executionValue - 1,
                      };
                    }
                    return action;
                  }
                )
              );
              updateAction({
                ...currentAction,
                executionValue: currentAction.executionValue - 1,
              });
            }, 500); // Durée de l'animation
          }
        }
      }
      setFrontendCounter(frontendtime);
    }
  }, [
    queue,
    actions,
    frontendCounter,
    setActionRemoving,
    setQueue,
    setActions,
    updateAction,
    setFrontendCounter,
    frontendtime,
    toggle,
  ]);
};
