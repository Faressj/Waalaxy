export interface Action {
  name: string;
  maxValue: number;
  executionValue: number;
}

export interface QueueItem {
  id: number;
  name: string;
}

export interface ToolButtonsProps {
  onRecalculate: () => void;
  onReset: () => void;
}

export interface QueueProps {
  queue: QueueItem[];
  actionRemoving: number | null;
}

export interface FormProps {
  actions: Action[];
  isDisabled: boolean;
  setActions: React.Dispatch<React.SetStateAction<Action[]>>;
}

export interface CounterProps {
  backendCounter: number | null;
  frontendCounter: number | null;
}

export interface AppHeaderProps {
  actions: Action[];
  onRecalculate: () => void;
  onReset: () => void;
  onToggle: () => void;
}

export interface ActionsListProps {
  actions: Action[];
  onAddToQueue: (actionName: string) => void;
  setActions: React.Dispatch<React.SetStateAction<Action[]>>;

}
