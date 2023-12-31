import React from 'react';

interface Action {
  nom: string;
  maxValue: number;
  executionValue: number;
}

interface ActionsListProps {
  actions: Action[];
  onAddToQueue: (actionName: string) => void;
}

const ActionsList: React.FC<ActionsListProps> = ({ actions, onAddToQueue }) => {
  return (
    <div className='list-actions-container'>
      <h1>Liste des Actions</h1>
      <ul className='list-actions'>
        {actions.map(action => (
          <li className='one-action' key={action.nom}>
            <button className ="button type1"onClick={() => onAddToQueue(action.nom)}>{action.nom}</button>  {action.executionValue} Crédits
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActionsList;
