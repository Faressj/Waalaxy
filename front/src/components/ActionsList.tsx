import React from "react";
import { ActionsListProps } from "../Types/types";
import "../styles/ActionsList.scss";

const ActionsList: React.FC<ActionsListProps> = ({
  actions,
  onAddToQueue,
  setActions,
}) => {
  return (
    <div className="list-actions-container">
      <h1>Liste des Actions</h1>
      <ul className="list-actions">
        {actions.map((action) => (
          <li className="one-action" key={action.name}>
            <button
              className="button type1"
              onClick={() => onAddToQueue(action.name)}
            >
              {action.name}
            </button>{" "}
            {action.executionValue} Crédits
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActionsList;
