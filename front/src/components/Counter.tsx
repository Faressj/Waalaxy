import React from "react";
import { CounterProps } from "../Types/types";

const Counter: React.FC<CounterProps> = ({
  backendCounter,
  frontendCounter,
}) => {
  return (
    <div>
      <div className="chrono-back">
        Recalcul dans :
        {backendCounter !== null
          ? Math.ceil(backendCounter / 1000)
          : "Non démarré"}{" "}
        secondes
      </div>
      <div className="chrono-front">
        Action executée dans :
        {frontendCounter !== null
          ? Math.ceil(frontendCounter / 1000)
          : "Non démarré"}{" "}
        secondes
      </div>
    </div>
  );
};

export default Counter;
