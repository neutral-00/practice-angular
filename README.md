# 2.2 Inputs & Outputs

Standalone components communicate via **Inputs** (parent → child) and **Outputs** (child → parent). Angular 21 enhances this with **signal inputs** for reactivity.

## Project Metadata

- Repository: [https://github.com/neutral-00/practice-angular](https://github.com/neutral-00/practice-angular)
- **Parent Branch:** `2.1-standalone-components`
- **Branch:** `2.2-inputs-and-outputs`

## 📁 Branch Setup

```bash
git checkout 2.1-standalone-components
git checkout -b 2.2-inputs-and-outputs
```

## Keep or Reuse

- ✅ `src/app/models/task.model.ts` (Task interface)
- ✅ `components/task-item/` (your updated hover template)
- ✅ `components/task-list/` (signal state + stats)
- ✅ `app.component.ts` (root setup)

## Step 1: Update TaskItem - Add Toggle Output

**`components/task-item/task-item.component.ts`**

```typescript
import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Task } from '../../models/Task';

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
export class TaskItem {
  task = input.required<Task>();

  // ✅ Output: Child → Parent communication
  taskToggled = output<Task>();

  toggleTask() {
    const toggledTask = { ...this.task(), completed: !this.task().completed };
    this.taskToggled.emit(toggledTask);
  }
}
```

## Step 2: Update TaskList - Handle Child Events

**`components/task-list/task-list.component.ts`**

```typescript
import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskItemComponent } from '../task-item/task-item.component';
import type { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskItemComponent],
  template: `
    <div class="max-w-2xl mx-auto p-6 bg-linear-to-br from-blue-50 to-indigo-100 min-h-screen">
      <!-- Stats Cards -->
      <div class="grid grid-cols-2 gap-4 mb-8 text-center">
        <div class="p-4 bg-white/70 backdrop-blur rounded-xl shadow-lg">
          <div class="text-3xl font-bold text-blue-600">{{ totalTasks() }}</div>
          <div class="text-sm text-gray-600">Total</div>
        </div>
        <div class="p-4 bg-white/70 backdrop-blur rounded-xl shadow-lg">
          <div class="text-3xl font-bold text-green-600">{{ completedTasks() }}</div>
          <div class="text-sm text-gray-600">Completed</div>
        </div>
      </div>

      <!-- Header -->
      <div class="text-center mb-8">
        <h1
          class="text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 
                    bg-clip-text text-transparent mb-2"
        >
          Task Dashboard
        </h1>
        <p class="text-gray-600">Angular 21 • Inputs & Outputs</p>
      </div>

      <!-- Interactive Tasks -->
      <div class="space-y-3">
        <app-task-item
          *ngFor="let task of tasks()"
          [task]="task"
          (taskToggled)="updateTask($event)"
        >
        </app-task-item>
      </div>

      <!-- Empty State -->
      <div *ngIf="tasks().length === 0" class="text-center py-12 text-gray-500">
        <div
          class="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center"
        >
          📝
        </div>
        <h3 class="text-xl font-semibold mb-2">No tasks yet</h3>
        <p>Add your first task to get started!</p>
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

  // ✅ Computed signals (reactive derived state)
  totalTasks = computed(() => this.tasks().length);
  completedTasks = computed(() => this.tasks().filter((task) => task.completed).length);

  // ✅ Handle child → parent events
  updateTask(updatedTask: Task) {
    this.tasks.update((tasks) =>
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
    );
  }
}
```

## Communication Flow

```
Parent (TaskList) ──[task]───→ Child (TaskItem)
     ↑                                   ↓
  (taskToggled) ←←←←←←←←←←←←←←←←←←←←←←←←
```

## Test Interactive Features

```bash
ng serve
```

**Expected Results:**

- ✅ Click checkboxes → tasks toggle instantly
- ✅ Stats cards update automatically
- ✅ Hover cyan effect on your TaskItem
- ✅ Signal reactivity throughout

## Commit & Push

```bash
git add .
git commit -m "feat: 2.2 Inputs & Outputs
- TaskItem: output<Task>() + toggle handler
- TaskList: signal.update() + event binding
- computed() stats with live updates
- Your cyan hover styling preserved"
git push -u origin 2.2-inputs-and-outputs
```

## Key Learnings

- ✅ **Signal Inputs**: `input.required<Task>()` - reactive + type-safe
- ✅ **Outputs**: `output<Task>()` - clean child-to-parent
- ✅ **Unidirectional Data Flow**: Parent owns state
- ✅ **signal.update()**: Immutable updates trigger reactivity
- ✅ **computed()**: Auto-updating derived state

**Next Tutorial**: `2.3 Component Communication Patterns` from branch `2.2-inputs-and-outputs`

Save as `docs/2.2-inputs-and-outputs.md` 🚀
