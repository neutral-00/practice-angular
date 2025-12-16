export interface LifecycleEvent {
  taskId: number;
  type: 'init' | 'destroy' | 'effect' | 'afterViewInit';
  timestamp: Date;
}

export const LIFECYCLE_EVENT_ICON: Record<LifecycleEvent['type'], String> = {
  init: '🟢',
  destroy: '🔴',
  effect: '🔄',
  afterViewInit: '🟡',
};
