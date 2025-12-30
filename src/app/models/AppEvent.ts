export interface AppEvent {
  id: string;
  timestamp: number;
  event: string;
  triggeredBy: 'USER' | 'SYSTEM';
}
