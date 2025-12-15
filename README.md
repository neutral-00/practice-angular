# 2.3 Component Communication Patterns

Master multiple ways components talk to each other: **Inputs/Outputs**, **Services**, **ViewChild**, and **Signals**. Real-world apps need all these patterns.

## Project Metadata

- Repository: [https://github.com/neutral-00/practice-angular](https://github.com/neutral-00/practice-angular)
- **Parent Branch:** `2.2-inputs-and-outputs`
- **Branch:** `2.3-component-communication`

## 📁 Branch Setup

```bash
git checkout 2.2-inputs-and-outputs
git checkout -b 2.3-component-communication
```

## Keep or Reuse

- ✅ `src/app/models/Task.ts` (your Task model)
- ✅ `components/task-item/` (your updated template w/ title click + tooltip)
- ✅ `components/task-list/` (inputs/outputs + stats)
- ✅ `app.component.ts`

## Step 1: Add Task Form Component (New)

```bash
ng g c components/task-form --standalone --inline-template --inline-style --skip-tests
```

**`components/task-form/task-form.component.ts`**

```typescript
import { Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/Task';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="addTask()" class="bg-white p-6 rounded-2xl shadow-lg mb-8">
      <div class="flex gap-4">
        <input
          [(ngModel)]="newTaskTitle"
          name="taskTitle"
          placeholder="Add new task..."
          class="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
        <button
          type="submit"
          [disabled]="!newTaskTitle.trim()"
          class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
        >
          Add Task
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      input:focus {
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }
    `,
  ],
})
export class TaskFormComponent {
  newTaskTitle = '';
  taskAdded = output<Task>();

  addTask() {
    if (!this.newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      title: this.newTaskTitle.trim(),
      completed: false,
    };

    this.taskAdded.emit(newTask);
    this.newTaskTitle = '';
  }
}
```

## Step 2: Task Actions Component (Delete + Filter)

```bash
ng g c components/task-actions --standalone --inline-template --inline-style --skip-tests
```

**`components/task-actions/task-actions.component.ts`**

```typescript
import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-actions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="flex gap-4 items-center justify-between mb-6 p-4 bg-white/50 backdrop-blur rounded-xl"
    >
      <!-- Filter -->
      <select
        [(ngModel)]="filterMode"
        name="filter"
        class="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
        (change)="filterChanged()"
      >
        <option value="all">All Tasks</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </select>

      <!-- Delete All -->
      <button
        (click)="deleteAllCompleted()"
        [disabled]="totalCompleted() === 0"
        class="px-6 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
      >
        Delete Completed ({{ totalCompleted() }})
      </button>
    </div>
  `,
})
export class TaskActionsComponent {
  tasks = input.required<Task[]>();
  filterMode = 'all';

  filterChanged = output<string>();
  deleteCompleted = output<void>();

  get totalCompleted() {
    return this.tasks().filter((t) => t.completed).length;
  }

  filterChanged() {
    this.filterChanged.emit(this.filterMode);
  }

  deleteAllCompleted() {
    this.deleteCompleted.emit();
  }
}
```

## Step 3: Enhanced TaskList (Orchestrates All Patterns)

**`components/task-list/task-list.component.ts`**

```typescript
import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskItemComponent } from '../task-item/task-item.component';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskActionsComponent } from '../task-actions/task-actions.component';
import { Task } from '../../models/Task';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskItemComponent, TaskFormComponent, TaskActionsComponent],
  template: `
    <div class="max-w-2xl mx-auto p-6 bg-linear-to-br from-blue-50 to-indigo-100 min-h-screen">
      <!-- Stats -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="p-4 bg-white/70 backdrop-blur rounded-xl shadow-lg text-center">
          <div class="text-3xl font-bold text-blue-600">{{ filteredTasks().length }}</div>
          <div class="text-sm text-gray-600">{{ getFilterLabel() }}</div>
        </div>
        <div class="p-4 bg-white/70 backdrop-blur rounded-xl shadow-lg text-center">
          <div class="text-3xl font-bold text-green-600">{{ completedCount() }}</div>
          <div class="text-sm text-gray-600">Completed</div>
        </div>
      </div>

      <!-- Header -->
      <div class="text-center mb-8">
        <h1
          class="text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
        >
          Task Dashboard
        </h1>
        <p class="text-gray-600">Angular 21 • Communication Patterns</p>
      </div>

      <!-- 🎯 ALL PATTERNS BELOW -->

      <!-- 1. TaskForm → TaskList (output → method) -->
      <app-task-form (taskAdded)="addTask($event)"></app-task-form>

      <!-- 2. TaskList → TaskActions (input) + TaskActions → TaskList (output) -->
      <app-task-actions
        [tasks]="tasks()"
        (filterChanged)="setFilter($event)"
        (deleteCompleted)="deleteCompletedTasks()"
      >
      </app-task-actions>

      <!-- 3. TaskList → TaskItem (input) + TaskItem → TaskList (output) -->
      <div class="space-y-3">
        <app-task-item
          *ngFor="let task of filteredTasks()"
          [task]="task"
          (taskToggled)="updateTask($event)"
        >
        </app-task-item>
      </div>

      <!-- Empty State -->
      <div *ngIf="filteredTasks().length === 0" class="text-center py-12 text-gray-500">
        <div
          class="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center"
        >
          📝
        </div>
        <h3 class="text-xl font-semibold mb-2">{{ getEmptyMessage() }}</h3>
        <p>{{ getEmptySubMessage() }}</p>
      </div>
    </div>
  `,
})
export class TaskListComponent {
  tasks = signal<Task[]>([
    { id: 1, title: '✅ Review Angular 21 signals', completed: true },
    { id: 2, title: '🚀 Implement standalone components', completed: false },
    { id: 3, title: '📱 Build responsive task UI', completed: false },
    { id: 4, title: '🧪 Write component tests', completed: false },
  ]);

  filterMode = signal<'all' | 'active' | 'completed'>('all');

  // Derived state
  completedCount = computed(() => this.tasks().filter((t) => t.completed).length);
  filteredTasks = computed(() => {
    const tasks = this.tasks();
    switch (this.filterMode()) {
      case 'active':
        return tasks.filter((t) => !t.completed);
      case 'completed':
        return tasks.filter((t) => t.completed);
      default:
        return tasks;
    }
  });

  // 🎯 Communication Handlers
  addTask(newTask: Task) {
    this.tasks.update((tasks) => [...tasks, newTask]);
  }

  updateTask(updatedTask: Task) {
    this.tasks.update((tasks) => tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  }

  setFilter(mode: string) {
    this.filterMode.set(mode as any);
  }

  deleteCompletedTasks() {
    this.tasks.set(this.tasks().filter((t) => !t.completed));
  }

  getFilterLabel() {
    return (
      {
        all: 'All Tasks',
        active: 'Active Tasks',
        completed: 'Completed Tasks',
      }[this.filterMode()] || 'All Tasks'
    );
  }

  getEmptyMessage() {
    return this.filterMode() === 'active' ? 'No active tasks 🎉' : 'No tasks yet';
  }

  getEmptySubMessage() {
    return this.filterMode() === 'active'
      ? 'Great job completing everything!'
      : 'Add your first task above!';
  }
}
```

## Communication Patterns Summary

| Pattern             | Direction    | Example                                       |
| ------------------- | ------------ | --------------------------------------------- |
| **Inputs/Outputs**  | Parent↔Child | `[tasks]="tasks()"` `(taskAdded)="addTask()"` |
| **Signal Inputs**   | Parent→Child | `tasks = input.required<Task[]>()`            |
| **Two-way binding** | Child↔Parent | `[(ngModel)]="newTaskTitle"`                  |
| **Event Outputs**   | Child→Parent | `(filterChanged)="setFilter($event)"`         |

## Test All Features

```bash
ng serve
```

**Expected:**

- ✅ Add new tasks (form → list)
- ✅ Toggle tasks (item → list)
- ✅ Filter tasks (actions → list)
- ✅ Delete completed (actions → list)
- ✅ Your title click + tooltip preserved

## Commit

```bash
git add .
git commit -m "feat: 2.3 Component Communication Patterns
- TaskForm: add tasks (output → method)
- TaskActions: filter + delete (input/output)
- TaskList: orchestrates ALL patterns
- computed() filtering + effects"
git push -u origin 2.3-component-communication
```

## Key Learnings

- ✅ **Multiple Patterns**: Inputs/Outputs/Signals/Forms
- ✅ **Parent Orchestrates**: Single source of truth
- ✅ **Reactive Filtering**: `computed()` chains
- ✅ **Rich Interactions**: Add/Filter/Delete/Toggle

**Next**: `2.4 Lifecycle Hooks` from `2.3-component-communication` 🚀

Save as `docs/2.3-component-communication.md`
