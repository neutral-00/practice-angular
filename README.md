# 2.1 Standalone Components

**Angular 21 embraces standalone components as the default architecture.** No more NgModules clutter—components directly import what they need. This reduces boilerplate, improves tree-shaking, and makes lazy-loading trivial.

## Why Standalone Components Matter

```
Traditional (Module-based)          | Standalone (Angular 21 default)
-----------------------------------|----------------------------------
- NgModule boilerplate              | ✅ Zero module boilerplate
- Import/export complexity          | ✅ Direct imports
- Tree-shaking limitations          | ✅ Better tree-shaking
- Lazy loading complexity           | ✅ Trivial route-level lazy loading
- Mental overhead (module vs comp)  | ✅ Single mental model
```

## Real-World Setup: Task Dashboard

We'll build a task management dashboard starting with a standalone task list.

### Step 1: Create Standalone Components

From your `main` branch:

```bash
git checkout main
git checkout -b 2.1-standalone-components
ng g c components/task-list --standalone --inline-template --inline-style --skip-tests --type=component
ng g c components/task-item --standalone --inline-template --inline-style --skip-tests --type=component
```

### Step 2: TaskItem Component (Presentational)

**`components/task-item/task-item.component.ts`**

```typescript
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="flex items-center p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all"
    >
      <input type="checkbox" [checked]="task().completed" class="w-5 h-5 rounded mr-4" disabled />
      <span class="flex-1 text-gray-900 font-medium line-clamp-1">
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
  styles: [
    `
      .line-clamp-1 {
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    `,
  ],
})
export class TaskItemComponent {
  task = input.required<Task>();
}
```

### Step 3: TaskList Component (Smart Container)

**`components/task-list/task-list.component.ts`**

```typescript
import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { TaskItem } from '../task-item/task-item.component';
import { Task } from '../../models/Task';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, TaskItem],
  template: `
    <div class="max-w-2xl mx-auto p-6 bg-linear-to-br from-blue-50 to-indigo-100 min-h-screen">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1
          class="text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
        >
          Task Dashboard
        </h1>
        <p class="text-gray-600">Modern Angular 21 • Standalone Components</p>
      </div>

      <!-- Tasks -->
      <div class="space-y-3">
        <app-task-item *ngFor="let task of tasks()" [task]="task"></app-task-item>
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
  styles: ``,
})
export class TaskList {
  // Signal-based state (Angular 21 style)
  tasks = signal<Task[]>([
    { id: 1, title: '✅ Review Angular 21 signals', completed: true },
    { id: 2, title: '🚀 Implement standalone components', completed: false },
    { id: 3, title: '📱 Build responsive task UI', completed: false },
    { id: 4, title: '🧪 Write component tests', completed: false },
  ]);
}
```

### Step 4: Update App Component

**`app.component.ts`**

```typescript
import { Component } from '@angular/core';
import { TaskListComponent } from './components/task-list/task-list.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TaskListComponent, RouterOutlet],
  template: `
    <main class="min-h-screen bg-linear-to-br from-slate-50 to-slate-200">
      <app-task-list />
    </main>
  `,
})
export class AppComponent {
  title = 'practice-angular';
}
```

### Step 5: Remove App Module (Angular 21 Style)

Delete `app.config.ts` if it exists, or ensure your `main.ts` uses bootstrapApplication:

**`main.ts`**

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

bootstrapApplication(AppComponent, {
  providers: [provideRouter([]), provideAnimations(), importProvidersFrom(BrowserAnimationsModule)],
}).catch((err) => console.error(err));
```

## Key Takeaways

✅ **Direct imports**: `TaskListComponent` imports `TaskItemComponent` directly
✅ **No NgModule**: Zero module boilerplate
✅ **Signals for state**: Modern reactive state management
✅ **Tailwind + Angular**: Perfect harmony
✅ **Tree-shakable**: Unused code gets eliminated

## Commit & Push

```bash
git add .
git commit -m "2.1: Standalone components with Task Dashboard
- TaskItem (presentational)
- TaskList (container)
- Signal-based state
- Tailwind styling
- No NgModules 🎉"
git push -u origin 2.1-standalone-components
```

**Live Demo**: `http://localhost:4200` shows your first standalone Task Dashboard!

---

**Next up**: 2.2 Inputs & Outputs—adding task editing, deletion, and parent-child communication.
