import React, { useEffect, useState } from 'react';
import ActionsList from './components/ActionsList';
import Queue from './components/Queue';
import Counter from './components/Counter';
import AppHeader from './components/AppHeader';

import './App.scss';

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
  const [intervalsStarted, setIntervalsStarted] = useState(() => {  // État pour savoir si les intervalles ont été démarrés
    const saved = localStorage.getItem('intervalsStarted');
    return saved ? JSON.parse(saved) : false;
  });
  const [actionRemoving, setActionRemoving] = useState<number | null>(null);  // État pour gérer l'action en cours de suppression


  useEffect(() => {  // useEffect pour la récupération des actions depuis le backend
    fetch('http://localhost:3001/actions')
      .then(response => response.json())
      .then(data => setActions(data))
      .catch(error => console.error('Erreur lors de la récupération des actions:', error));
  }, []);

  useEffect(() => {  // useEffect pour sauvegarder la queue et intervalsStarted dans le localStorage
    localStorage.setItem('queue', JSON.stringify(queue));
    localStorage.setItem('intervalsStarted', JSON.stringify(intervalsStarted));
  }, [queue, intervalsStarted]);

  useEffect(() => {  // useEffect pour gérer la logique de la queue et des compteurs
    if (frontendCounter === 0) {
      if (queue.length > 0) {
        const actionToRemove = queue[0];
        const currentAction = actions.find(action => action.nom === actionToRemove.name);

        if (currentAction && currentAction.executionValue > 0) {
          setActionRemoving(actionToRemove.id); // Déclencher l'animation

          setTimeout(() => {
            setActionRemoving(null); // Fin de l'animation
            setQueue(prevQueue => prevQueue.slice(1)); // Retirer l'action de la queue
            setActions(prevActions => prevActions.map(action => {
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
  }, [queue, actions, frontendCounter]);


  useEffect(() => {  // useEffect pour le décompte du compteur frontend
    if (intervalsStarted && frontendCounter !== null) {
      const interval = setInterval(() => {
        setFrontendCounter(prev => (prev !== null && prev > 0) ? prev - 1000 : prev);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [frontendCounter, intervalsStarted]);


  useEffect(() => {  // useEffect pour le décompte du compteur backtend
    if (intervalsStarted && backendCounter !== null) {
      const interval = setInterval(() => {
        const newBackendCounter = backendCounter - 1000;
        setBackendCounter(newBackendCounter);

        if (newBackendCounter <= 0) {
          fetch('http://localhost:3001/init-update', {  // Appeler le endpoint pour déclencher le recalcul des valeurs d'exécution
            method: 'POST'
          }).then(response => {
            if (!response.ok) {
              throw new Error('Échec de la réinitialisation de l’intervalle du backend');
            }
            return response.text();
          }).then(() => {
            console.log("Recalcul des valeurs d'exécution déclenché");
            setBackendCounter(backendtime);  // Réinitialiser le compteur pour les 15 prochaines minutes
          }).catch(error => console.error('Erreur lors de la réinitialisation:', error));
          window.location.reload();
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [backendCounter, intervalsStarted]);

  useEffect(() => {  // useEffect pour sauvegarder le frontend dans le localStorage
    if (intervalsStarted) {
      if (frontendCounter !== null) {
        localStorage.setItem('frontendCounter', frontendCounter.toString());
      }
    }
  }, [frontendCounter, intervalsStarted]);

  useEffect(() => {  // useEffect pour sauvegarder le compteur backend dans le localStorage
    if (intervalsStarted) {
      if (backendCounter !== null) {
        localStorage.setItem('backendCounter', backendCounter.toString());
      }
    }
  }, [backendCounter, intervalsStarted]);

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
          throw new Error("Échec de la mise à jour de l\'action");
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
      <AppHeader actions={actions} onRecalculate={initiateBackendInterval} onReset={resetApp} />

      <ActionsList actions={actions} onAddToQueue={addToQueue} />

      <Queue queue={queue} actionRemoving={actionRemoving} />

      <Counter backendCounter={backendCounter} frontendCounter={frontendCounter} />
    </div>
  );
}

export default App;
