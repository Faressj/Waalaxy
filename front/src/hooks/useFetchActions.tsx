import { useEffect } from 'react';

export const useFetchActions = (setActions:any) => {
    useEffect(() => {  // useEffect pour la récupération des actions depuis le backend

        fetch('http://localhost:3001/actions')
          .then(response => response.json())
          .then(data => setActions(data))
          .catch(error => console.error('Erreur lors de la récupération des actions:', error));
      }, [setActions]);
};