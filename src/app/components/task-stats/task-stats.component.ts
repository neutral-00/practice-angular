import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { LIFECYCLE_EVENT_ICON } from '../../models/LifecycleEvent';
import { LifecycleTrackerService } from '../../services/lifecycle-tracker.service';

@Component({
  selector: 'app-task-stats',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="p-6 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-2xl shadow-2xl mb-8"
    >
      <h3 class="text-xl font-bold mb-4 flex items-center gap-2">📊 TaskItem Lifecycle Tracker</h3>

      <!-- Global Counters -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="p-4 bg-white/10 backdrop-blur rounded-xl text-center">
          <div class="text-2xl font-bold text-emerald-200">{{ stats().totalInits }}</div>
          <div class="text-xs opacity-90">ngOnInit Calls</div>
        </div>
        <div class="p-4 bg-white/10 backdrop-blur rounded-xl text-center">
          <div class="text-2xl font-bold text-red-800">{{ stats().totalDestroys }}</div>
          <div class="text-xs opacity-90">ngOnDestroy Calls</div>
        </div>
        <div class="p-4 bg-white/10 backdrop-blur rounded-xl text-center">
          <div class="text-2xl font-bold text-blue-300">{{ stats().totalEffects }}</div>
          <div class="text-xs opacity-90">effect() Triggers</div>
        </div>
        <div class="p-4 bg-white/10 backdrop-blur rounded-xl text-center">
          <div class="text-2xl font-bold text-yellow-200">{{ stats().totalAfterviewInits }}</div>
          <div class="text-xs opacity-90">ngAfterViewInit Calls</div>
        </div>
      </div>

      <!-- Recent Events -->
      <div class="mt-6 p-4 bg-white/10 backdrop-blur rounded-xl">
        <div class="font-semibold mb-2 flex items-center gap-2">
          Recent Events ({{ stats().totalEvents }})
        </div>
        <div class="space-y-1 max-h-32 overflow-y-auto">
          <div
            *ngFor="let event of recentEvents()"
            class="text-xs flex justify-between items-center p-1 rounded"
            [ngClass]="{
              'bg-green-200/10': event.type === 'init',
              'bg-red-200/10': event.type === 'destroy',
              'bg-blue-200/10': event.type === 'effect',
              'bg-yellow-200/10': event.type === 'afterViewInit',
            }"
          >
            <span>Task {{ event.taskId }}</span>
            <span class="font-mono text-[10px] opacity-75">
              {{ event.type.toUpperCase() }} {{ LIFECYCLE_EVENT_ICON[event.type] }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class TaskStatsComponent {
  tracker = inject(LifecycleTrackerService);

  stats = computed(() => this.tracker.stats());
  recentEvents = computed(() => this.tracker.recentEvents());
  LIFECYCLE_EVENT_ICON = LIFECYCLE_EVENT_ICON;
}
