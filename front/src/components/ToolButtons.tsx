import React from "react";
import { ToolButtonsProps } from "../Types/types";

const ToolButtons: React.FC<ToolButtonsProps> = ({
  onRecalculate,
  onReset,
}) => {
  return (
    <div className="tools-button">
      <div className="tooltip">
        <button
          className="button type1 recalcul-button"
          onClick={onRecalculate}
        >
          Recalcul Manuel
        </button>
        <span className="tooltiptext">
          Démarre un recalcul manuel des valeurs d'exécution.
        </span>
      </div>
      <div className="tooltip">
        <button className="button type1 reset-button" onClick={onReset}>
          Réinitialiser l'Application
        </button>
        <span className="tooltiptext">
          Réinitialise l'application et la queue d'actions.
        </span>
      </div>
    </div>
  );
};

export default ToolButtons;
