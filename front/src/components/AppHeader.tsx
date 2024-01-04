import React from 'react';
import ToolButtons from './ToolButtons';
interface Action {
  nom: string;
  maxValue: number;
}

interface AppHeaderProps {
  actions: Action[];
  onRecalculate: () => void;
  onReset: () => void;
  onToggle: () => void;
}


function AppHeader({ actions, onRecalculate, onReset, onToggle }: AppHeaderProps) {
  return (
    <header className="App-header">
      <ToolButtons onRecalculate={onRecalculate} onReset={onReset} />
      <section className="model-12">
        <div className="checkbox">
          <input onChange={onToggle} type="checkbox" />
          <label></label>
        </div>
      </section>
      <ul className='header-actions'>
        {actions.map(action => (
          <li key={action.nom}>
            Action: {action.nom}, Max Value: {action.maxValue}
          </li>
        ))}
      </ul>
    </header>

  );
}

export default AppHeader;
