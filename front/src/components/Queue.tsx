import React from "react";
import { QueueProps } from "../Types/types";
import "../styles/Queue.scss";

const Queue: React.FC<QueueProps> = ({ queue, actionRemoving }) => {
  return (
    <div>
      <h2>Queue d'Actions</h2>
      <div className="queue-container">
        {queue.map((item) => (
          <div
            key={item.id}
            className={`queue-item ${
              item.id === actionRemoving ? "fade-out" : ""
            }`}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Queue;
