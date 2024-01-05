import { useState } from 'react';
import ActionsList from './components/ActionsList';
import Queue from './components/Queue';
import Counter from './components/Counter';
import AppHeader from './components/AppHeader';
import Form from './components/Form';

import { useFetchActions } from './hooks/useFetchActions'
import { useSetLocal } from './hooks/useSetLocal';


import './App.scss';
import { useCounterFrontZero } from './hooks/useCounterFrontZero';
import { useDecompteFront } from './hooks/useDecompteFront';
import { useDecompteBack } from './hooks/useDecompteBack';
import { useFrontLocal } from './hooks/useFrontLocal';
import { useBackLocal } from './hooks/useBackLocal';

// Définition des interfaces pour les actions et éléments de la file d'attente
interface Action {
  nom: string;
  maxValue: number;
  executionValue: number;
}
interface QueueItem {
  id: number;
  name: string;
}

// Initialisation des variables de temps pour les compteurs
let backendtime = 900000;
let frontendtime = 15000;

function App() {
  // Déclaration des états (useState) pour gérer les différents éléments de l'interface
  const [queue, setQueue] = useState<QueueItem[]>(() => {  // Initialisation de la file d'attente à partir du localStorage
    const savedQueue = localStorage.getItem('queue');
    return savedQueue ? JSON.parse(savedQueue) : [];
  });
  const [actions, setActions] = useState<Action[]>([]);  // État pour gérer les actions
  const [backendCounter, setBackendCounter] = useState(() => {  // État pour gérer les compteurs de backend
    const saved = localStorage.getItem('backendCounter');
    return saved ? parseInt(saved) : null;
  });
  const [frontendCounter, setFrontendCounter] = useState(() => {  // État pour gérer les compteurs de frontend
    const saved = localStorage.getItem('frontendCounter');
    return saved ? parseInt(saved) : null;
  });
  const [intervalsStarted, setIntervalsStarted] = useState<boolean>(() => {  // État pour savoir si les intervalles ont été démarrés
    const saved = localStorage.getItem('intervalsStarted');
    return saved ? JSON.parse(saved) : false;
  });
  const [actionRemoving, setActionRemoving] = useState<number | null>(null);  // État pour gérer l'action en cours de suppression

  const [toggle, setToggle] = useState<boolean>(true);

  // Fetch Actions
  useFetchActions(setActions);

  // useEf{fect pour sauvegarder la queue et intervalsStarted dans le localStorage
  useSetLocal(queue, intervalsStarted);

  // useEffect pour gérer la logique de la queue et des compteurs
  useCounterFrontZero(queue, actions, frontendCounter, setActionRemoving, setQueue, setActions, updateAction, setFrontendCounter, frontendtime, toggle);

  // useEffect pour le décompte du compteur frontend
  useDecompteFront(frontendCounter, intervalsStarted, setFrontendCounter);

  // useEffect pour le décompte du compteur backtend
  useDecompteBack(backendCounter, intervalsStarted, setBackendCounter, backendtime);

  // useEffect pour sauvegarder le frontend dans le localStorage
  useFrontLocal(frontendCounter, intervalsStarted);

  // useEffect pour sauvegarder le compteur backend dans le localStorage
  useBackLocal(backendCounter, intervalsStarted);

  function addToQueue(actionName: string) {  // Fonctions pour gérer les actions et les intervalles
    if (intervalsStarted) {
      setQueue(prevQueue => [...prevQueue, { id: Date.now(), name: actionName }]); // Ajouter une action à la queue
    } else {
      alert("Veuillez d'abord Lancer un Recalcul Manuel !");
    }
  }

  function updateAction(action: Action) { // Mettre à jour une action dans le backend
    fetch('http://localhost:3001/update-action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Échec de la mise à jour de l'action");
        }
        return response.text();
      })
      .then(() => {
        console.log('Action mise à jour avec succès');
      })
      .catch(error => console.error('Erreur lors de la mise à jour:', error));
  }

  function initiateBackendInterval() {  // Démarrer les intervalles de backend
    fetch('http://localhost:3001/init-update', {
      method: 'POST',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Échec de l’initialisation de l’intervalle du backend');
        }
        return response.text();
      })
      .then(() => {
        console.log('Intervalles démarrés');
        setBackendCounter(backendtime);
        setFrontendCounter(frontendtime);
        setIntervalsStarted(true);
      })
      .catch(error => console.error("Erreur lors de l’initialisation:", error));
    window.location.reload();
  }

  function handleToggle() {
    setToggle(!toggle)
  }

  function resetApp() {  // Réinitialiser l'application
    setQueue([]);// Vider la queue
    localStorage.removeItem('queue');
    setBackendCounter(backendtime); // Réinitialiser les compteurs
    setFrontendCounter(frontendtime);
    localStorage.removeItem('backendCounter');
    localStorage.removeItem('frontendCounter');
    setIntervalsStarted(false);
    localStorage.removeItem('intervalsStarted');
  }
  return ( // Rendu du composant
    <div className="App">
      <AppHeader actions={actions} onRecalculate={initiateBackendInterval} onReset={resetApp} onToggle={handleToggle} />

      <Form actions={actions} isDisabled={intervalsStarted} />

      <ActionsList actions={actions} onAddToQueue={addToQueue} />

      <Queue queue={queue} actionRemoving={actionRemoving} />

      <Counter backendCounter={backendCounter} frontendCounter={frontendCounter} />
    </div>
  );
}

export default App;
