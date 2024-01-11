import ToolButtons from "./ToolButtons";
import { AppHeaderProps } from "../Types/types";
import "../styles/AppHeader.scss";
function AppHeader({
  actions,
  onRecalculate,
  onReset,
  onToggle,
}: AppHeaderProps) {
  return (
    <header className="App-header">
      <ToolButtons onRecalculate={onRecalculate} onReset={onReset} />
      <section className="model-12">
        <div className="checkbox">
          <input onChange={onToggle} type="checkbox" />
          <label></label>
        </div>
      </section>
      <ul className="header-actions">
        {actions.map((action) => (
          <li key={action.name}>
            Action: {action.name}, Max Value: {action.maxValue}
          </li>
        ))}
      </ul>
    </header>
  );
}

export default AppHeader;
