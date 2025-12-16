# 2.4 Lifecycle Hooks (Service-Based Tracking)

**Perfect approach!** Use a **service** to track lifecycle hooks **only from TaskItemComponents**. No parent-child needed—service acts as a global event bus.

## Project Metadata

- Repository: [https://github.com/neutral-00/practice-angular](https://github.com/neutral-00/practice-angular)
- **Parent Branch:** `2.3-component-communication`
- **Branch:** `2.4-lifecycle-hooks`

## 📁 Branch Setup

```bash
git checkout 2.3-component-communication
git checkout -b 2.4-lifecycle-hooks
```

## Step 1: Lifecycle Tracking Service

```bash
ng g s services/lifecycle-tracker --skip-tests --type=service
```

**`services/lifecycle-tracker.service.ts`**:

```typescript
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
```

## Step 2: TaskItem with Service Integration

**`components/task-item/task-item.component.ts`** (service tracking only):

```typescript
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  effect,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
} from '@angular/core';
import { Task } from '../../models/Task';
import { LifecycleTrackerService } from '../../services/lifecycle-tracker.service';
import { LIFECYCLE_EVENT_ICON } from '../../models/LifecycleEvent';

@Component({
  selector: 'app-task-item',
  imports: [CommonModule],
  template: `
    <div
      class="flex items-center p-4 mb-1 border rounded-lg bg-white shadow-sm hover:shadow-md hover:bg-cyan-50 transition-all"
    >
      <input
        type="checkbox"
        [checked]="task().completed"
        (click)="toggleTask()"
        class="w-5 h-5 rounded mr-4 cursor-pointer"
      />
      <span
        #titleRef
        class="flex-1 text-gray-900 font-medium line-clamp-1 cursor-pointer"
        (click)="toggleTask()"
        [attr.title]="task().title.length > 40 ? task().title : null"
      >
        {{ task().title }}
      </span>
      <span
        class="px-3 py-1 text-xs font-semibold rounded-full
        {{ task().completed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800' }}"
      >
        {{ task().completed ? 'Done' : 'Pending' }}
      </span>
    </div>
  `,
  styles: `
    .line-clamp-1 {
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `,
})
export class TaskItem implements OnInit, OnDestroy, AfterViewInit {
  task = input.required<Task>();

  // ✅ Output: Child → Parent communication
  taskToggled = output<Task>();

  // ✅ Service injection
  private tracker = inject(LifecycleTrackerService);

  constructor() {
    // ✅ effect() tracks input changes globally
    effect(() => {
      this.tracker.trackEffect(this.task().id);
      console.log(`${LIFECYCLE_EVENT_ICON.effect} TaskItem ${this.task().id}: effect() tracked`);
    });
  }

  ngOnInit() {
    this.tracker.trackInit(this.task().id);
    console.log(`${LIFECYCLE_EVENT_ICON.init} TaskItem ${this.task().id}: ngOnInit() tracked`);
  }

  ngAfterViewInit() {
    this.tracker.trackAfterviewInit(this.task().id);
    console.log(
      `${LIFECYCLE_EVENT_ICON.afterViewInit} TaskItem ${this.task().id}: ngAfterViewInit() tracked`,
    );
  }

  ngOnDestroy() {
    this.tracker.trackDestroy(this.task().id);
    console.log(
      `${LIFECYCLE_EVENT_ICON.destroy} TaskItem ${this.task().id}: ngOnDestroy() tracked`,
    );
  }

  toggleTask() {
    const toggledTask = { ...this.task(), completed: !this.task().completed };
    this.taskToggled.emit(toggledTask);
  }
}
```

## Step 3: TaskStats Displays Service Data

```bash
ng g c components/task-stats --standalone --inline-template --inline-style --skip-tests --type=component
```

**`components/task-stats/task-stats.component.ts`**:

```typescript
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
```

## Step 4: Integrate into TaskList (Minimal)

**`components/task-list/task-list.component.ts`** (just add import/display):

```typescript
// Add to imports array:
TaskStatsComponent

// Add to template (top):
<app-task-stats></app-task-stats>
```

## Test the Magic ✨

```bash
ng serve
# Watch console + stats panel
```

**Demo Flow:**

1. ✅ Load → 4 `ngOnInit()` → `totalInits: 4`
2. ✅ Toggle task → `effect()` triggers
3. ✅ **Delete Completed** → 1 `ngOnDestroy()` → `activeInstances: 3`
4. ✅ Stats + Recent Events update live!

## Commit

```bash
git add .
git commit -m "feat: 2.4 Lifecycle Service Tracking
- LifecycleTrackerService: global counters
- TaskItem: service emits lifecycle events
- TaskStats: displays service signals
- Delete Completed → watch destroys live!"
git push -u origin 2.4-lifecycle-hooks
```

## Key Learnings

- ✅ **Service Communication**: No parent-child needed
- ✅ **`inject()`**: Modern DI in standalone components
- ✅ **Global State**: `providedIn: 'root'` service
- ✅ **Real Destroy Tracking**: Delete → watch counters drop

**Perfect foundation for 2.5 View Queries!** 🚀

Save as `docs/2.4-lifecycle-hooks.md`
