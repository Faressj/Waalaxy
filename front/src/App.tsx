import { useState } from "react";
import ActionsList from "./components/ActionsList";
import Queue from "./components/Queue";
import Counter from "./components/Counter";
import AppHeader from "./components/AppHeader";
import Form from "./components/Form";

import { useFetchActions } from "./hooks/useFetchActions";
import { useSetLocal } from "./hooks/useSetLocal";

import "./App.scss";

import { useCounterFrontZero } from "./hooks/useCounterFrontZero";
import { useDecompteFront } from "./hooks/useDecompteFront";
import { useDecompteBack } from "./hooks/useDecompteBack";
import { useFrontLocal } from "./hooks/useFrontLocal";
import { useBackLocal } from "./hooks/useBackLocal";
import { Action, QueueItem } from "./Types/types";

const backendtime = 900000;
const frontendtime = 15000;

function App() {
  const [queue, setQueue] = useState<QueueItem[]>(() => {
    const savedQueue = localStorage.getItem("queue");
    return savedQueue ? JSON.parse(savedQueue) : [];
  });
  const [actions, setActions] = useState<Action[]>([]);
  const [backendCounter, setBackendCounter] = useState(() => {
    const saved = localStorage.getItem("backendCounter");
    return saved ? parseInt(saved) : null;
  });
  const [frontendCounter, setFrontendCounter] = useState(() => {
    const saved = localStorage.getItem("frontendCounter");
    return saved ? parseInt(saved) : null;
  });
  const [intervalsStarted, setIntervalsStarted] = useState<boolean>(() => {
    const saved = localStorage.getItem("intervalsStarted");
    return saved ? JSON.parse(saved) : false;
  });
  const [actionRemoving, setActionRemoving] = useState<number | null>(null);

  const [toggle, setToggle] = useState<boolean>(true);

  // Fetch Actions
  useFetchActions(setActions);

  useSetLocal(queue, intervalsStarted);

  useCounterFrontZero(
    queue,
    actions,
    frontendCounter,
    setActionRemoving,
    setQueue,
    setActions,
    updateAction,
    setFrontendCounter,
    frontendtime,
    toggle
  );

  useDecompteFront(frontendCounter, intervalsStarted, setFrontendCounter);

  useDecompteBack(
    backendCounter,
    intervalsStarted,
    setBackendCounter,
    backendtime
  );

  useFrontLocal(frontendCounter, intervalsStarted);

  useBackLocal(backendCounter, intervalsStarted);

  function addToQueue(actionName: string) {
    if (intervalsStarted) {
      setQueue((prevQueue) => [
        ...prevQueue,
        { id: Date.now(), name: actionName },
      ]);
    } else {
      alert("Veuillez d'abord Lancer un Recalcul Manuel !");
    }
  }

  function updateAction(action: Action) {
    fetch("http://localhost:3001/update-action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(action),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Échec de la mise à jour de l'action");
        }
        return response.text();
      })
      .then(() => {
        console.log("Action mise à jour avec succès");
      })
      .catch((error) => console.error("Erreur lors de la mise à jour:", error));
  }

  function initiateBackendInterval() {
    fetch("http://localhost:3001/init-update", {
      method: "POST",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Échec de l’initialisation de l’intervalle du backend"
          );
        }
        return response.text();
      })
      .then(() => {
        console.log("Intervalles démarrés");
        setBackendCounter(backendtime);
        setFrontendCounter(frontendtime);
        setIntervalsStarted(true);
        setActions(actions);
      })
      .catch((error) =>
        console.error("Erreur lors de l’initialisation:", error)
      );
    // window.location.reload();
  }

  function handleToggle() {
    setToggle(!toggle);
  }

  function resetApp() {
    setQueue([]);
    localStorage.removeItem("queue");
    setBackendCounter(backendtime);
    setFrontendCounter(frontendtime);
    localStorage.removeItem("backendCounter");
    localStorage.removeItem("frontendCounter");
    setIntervalsStarted(false);
    localStorage.removeItem("intervalsStarted");
  }
  return (
    // Rendu du composant
    <div className="App">
      <AppHeader
        actions={actions}
        onRecalculate={initiateBackendInterval}
        onReset={resetApp}
        onToggle={handleToggle}
      />

      <Form
        actions={actions}
        isDisabled={intervalsStarted}
        setActions={setActions}
      />

      <ActionsList
        actions={actions}
        onAddToQueue={addToQueue}
        setActions={setActions}
      />

      <Queue queue={queue} actionRemoving={actionRemoving} />

      <Counter
        backendCounter={backendCounter}
        frontendCounter={frontendCounter}
      />
    </div>
  );
}

export default App;
