# 2.5 View Queries (Classic + Signals)

**Query child DOM elements and components** with `viewChild()`/`viewChildren()` (Angular 21 signals).

## Project Metadata

- Repository: [https://github.com/neutral-00/practice-angular](https://github.com/neutral-00/practice-angular)
- **Parent Branch:** `2.4-lifecycle-hooks`
- **Branch:** `2.5-view-queries`

## 📁 Branch Setup

```bash
git checkout 2.4-lifecycle-hooks
git checkout -b 2.5-view-queries
```

## Keep or Reuse

- ✅ All existing components + services
- ✅ `src/app/models/Task.ts` & `LifecycleEvent.ts`
- ✅ Lifecycle tracking (your enhanced version)

## Step 1: Display the First and Last Task Title - Using ViewChild and ViewChildren

- We will make the code changes in `task-list.component.ts`
- first query first task using `viewChild`
- then query the last task using `viewChildren` and then filter out the last task
- The and then display their titles

**`components/task-list/task-list.component.ts`** (signal queries):

```typescript
import { CommonModule } from '@angular/common';
import { Component, computed, signal, viewChild, viewChildren } from '@angular/core';
import { Task } from '../../models/Task';
import { TaskActionsComponent } from '../task-actions/task-actions.component';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskItem } from '../task-item/task-item.component';
import { TaskStatsComponent } from '../task-stats/task-stats.component';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, TaskItem, TaskFormComponent, TaskActionsComponent, TaskStatsComponent],
  template: `
    <div class="max-w-2xl mx-auto p-6 bg-linear-to-br from-blue-50 to-indigo-100 min-h-screen">
      <!-- Lifecycle Tracker -->
      <app-task-stats></app-task-stats>

      <!-- 🎯 View Query Output -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="p-4 bg-white/70 backdrop-blur rounded-xl shadow-lg text-center">
          <div class="text-2xl font-bold text-blue-600">{{ firstTaskTitle() }}</div>
          <div class="text-xs text-gray-600">First Task (ViewChild)</div>
        </div>
        <div class="p-4 bg-white/70 backdrop-blur rounded-xl shadow-lg text-center">
          <div class="text-2xl font-bold text-purple-600">{{ lastTaskTitle() }}</div>
          <div class="text-xs text-gray-600">Last Task (ViewChildren)</div>
        </div>
      </div>

      <!-- Rest unchanged... -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <!-- existing stats -->
      </div>

      <!-- Header -->
      <div class="text-center mb-8">
        <h1
          class="text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
        >
          Task Dashboard
        </h1>
        <p class="text-gray-600">Angular 21 • View Queries</p>
      </div>

      <!-- Rest unchanged... -->
    </div>
  `,
})
export class TaskListComponent {
  // 1. SIGNAL View Query (Angular 17+)
  taskViewChildSignalQuery = viewChild(TaskItem); // Queries FIRST TaskItem
  // 2. REACTIVE Computed Signal
  firstTaskTitle = computed(() => {
    const first = this.taskViewChildSignalQuery(); // Get first TaskItem instance
    return first?.task()?.title || 'None'; // Extract task.title signal
  });

  // 3. 🎯 SIGNAL View Query to extract LAST TaskItem later
  taskViewChildrenSignalQuery = viewChildren(TaskItem); // Get ALL TaskItems
  // 4. ✅ Last Task Title (computed signal)
  lastTaskTitle = computed(() => {
    const allTasks = this.taskViewChildrenSignalQuery(); // QueryList<TaskItemComponent>
    const lastTask = allTasks[allTasks.length - 1]; // Get LAST item
    return lastTask?.task()?.title || 'None'; // Extract title
  });

  tasks = signal<Task[]>([
    // existing tasks
  ]);
  // ... existing signals + methods ...
}
```

## View Queries Comparison

| Type         | Classic              | Signal (Angular 21)        |
| ------------ | -------------------- | -------------------------- |
| **Single**   | `@ViewChild(Foo)`    | `foo = viewChild(Foo)`     |
| **Multiple** | `@ViewChildren(Foo)` | `foos = viewChildren(Foo)` |
| **Reactive** | Manual `changes`     | ✅ Auto-reactive           |
| **Timing**   | `{ static: false }`  | Automatic                  |

## Test View Queries

```bash
ng serve
```

## Commit

```bash
git add .
git commit -m "feat: 2.5 View Queries
- TaskItem: template refs + focus management
- TaskList: @ViewChild/@ViewChildren + signal queries
- Live first-task title + item counts
- trackBy prevents lifecycle spam"
git push -u origin 2.5-view-queries
```

## Key Learnings

- ✅ **`viewChild()`/`viewChildren()`**: Reactive queries

**Next**: `2.6 Smart vs Presentational` 🚀

Save as `docs/2.5-view-queries.md`
