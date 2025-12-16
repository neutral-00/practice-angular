import { computed, Injectable, signal } from '@angular/core';
import { LifecycleEvent } from '../models/LifecycleEvent';

@Injectable({
  providedIn: 'root',
})
export class LifecycleTrackerService {
  // Global counters
  totalInits = signal(0);
  totalDestroys = signal(0);
  totalEffects = signal(0);
  totalAfterviewInits = signal(0);

  // Recent events (last 12)
  recentEvents = signal<LifecycleEvent[]>([]);

  // Computed stats
  stats = computed(() => ({
    totalInits: this.totalInits(),
    totalDestroys: this.totalDestroys(),
    totalEffects: this.totalEffects(),
    totalAfterviewInits: this.totalAfterviewInits(),
    totalEvents: this.recentEvents().length,
  }));

  trackInit(taskId: number) {
    this.totalInits.update((count) => count + 1);
    this.addEvent(taskId, 'init');
  }

  trackDestroy(taskId: number) {
    this.totalDestroys.update((count) => count + 1);
    this.addEvent(taskId, 'destroy');
  }

  trackEffect(taskId: number) {
    this.totalEffects.update((count) => count + 1);
    this.addEvent(taskId, 'effect');
  }

  trackAfterviewInit(taskId: number) {
    this.totalAfterviewInits.update((count) => count + 1);
    this.addEvent(taskId, 'afterViewInit');
  }

  private addEvent(taskId: number, type: LifecycleEvent['type']) {
    const event: LifecycleEvent = { taskId, type, timestamp: new Date() };
    this.recentEvents.update((events) => {
      const newEvents = [event, ...events].slice(0, 12);
      return newEvents;
    });
  }
}
