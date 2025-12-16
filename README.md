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

---

## Bonus UX Enhancement 🚀

**Click empty state → Auto-scroll + focus input** = Super intuitive!

## Step 1: Add Template Reference to TaskForm Input

**`components/task-list/task-list.component.ts` template** - Update TaskForm:

```html
<!-- Add #taskInput ref to TaskForm -->
<app-task-form #taskFormRef (taskAdded)="addTask($event)"></app-task-form>
```

## Step 2: Update TaskForm (Expose Input Ref)

**`components/task-form/task-form.component.ts`** - Add public input ref:

```typescript
import { Component, output, signal, ViewChild, ElementRef, inject } from '@angular/core';
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
        <!-- 🎯 Template ref for parent access -->
        <input
          #taskInput
          [(ngModel)]="newTaskTitle"
          name="taskTitle"
          placeholder="Add new task..."
          class="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
        <button type="submit" [disabled]="!newTaskTitle.trim()" class="...">Add Task</button>
      </div>
    </form>
  `,
})
export class TaskFormComponent {
  @ViewChild('taskInput') taskInput!: ElementRef<HTMLInputElement>;

  newTaskTitle = '';
  taskAdded = output<Task>();

  // 🎯 Public method for parent to focus
  focusInput() {
    this.taskInput?.nativeElement.focus();
  }

  addTask() {
    /* existing */
  }
}
```

## Step 3: TaskList - Query + Click Handler

**`components/task-list/task-list.component.ts`**:

```typescript
import { ..., viewChild } from '@angular/core';
import { TaskFormComponent } from '../task-form/task-form.component';

export class TaskListComponent {
  // 🎯 Query TaskForm
  taskFormQuery = viewChild<TaskFormComponent>('taskFormRef');

  // 🎯 Click handler for empty state
  onEmptyStateClick() {
    const taskForm = this.taskFormQuery();
    taskForm?.focusInput();

    // Smooth scroll to form
    taskForm?.taskInput?.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }

  // ... existing code
}
```

## Step 4: Update Empty State Template

**In TaskList template** - Make clickable:

```html
<!-- Empty State - CLICKABLE -->
<div
  *ngIf="filteredTasks().length === 0"
  class="text-center py-12 text-gray-500 cursor-pointer hover:bg-gray-100 p-8 rounded-2xl transition-all group"
  (click)="onEmptyStateClick()"
  title="Click to add your first task!"
>
  <div
    class="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-100 transition-all"
  >
    📝
  </div>
  <h3 class="text-xl font-semibold mb-2 hover:text-blue-600 transition-colors">
    {{ getEmptyMessage() }}
  </h3>
  <p class="hover:underline">{{ getEmptySubMessage() }}</p>
  <!-- Subtle focus hint -->
  <div class="mt-2 text-xs opacity-0 group-hover:opacity-100 transition-all text-blue-500">
    👆 Click to add task
  </div>
</div>
```

## 🎯 Complete Flow

```
1. Empty list → User sees "Add your first task!"
2. CLICK → onEmptyStateClick()
3. viewChild(TaskFormComponent) → Gets form instance
4. taskForm.focusInput() → Focuses input
5. scrollIntoView() → Smooth scrolls to form
6. ✨ User can type immediately!
```

## Visual Enhancements

```css
/* Add to task-list styles */
:host {
  /* Smooth scroll container */
  scroll-behavior: smooth;
}

.empty-state {
  cursor: pointer;
  transition: all 0.2s;
}

.empty-state:hover {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1));
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
```

## Test It

```bash
ng serve
# 1. Delete all tasks
# 2. Click empty message → MAGIC! ✨
```

**Expected:**
✅ Smooth scroll to form  
✅ Input auto-focused  
✅ Hover animations  
✅ Perfect UX flow

## Commit

```bash
git add .
git commit -m "feat: 2.5 Empty state → Auto-focus input
- Template ref chaining: TaskList → TaskForm → input
- Smooth scroll + focus on click
- Hover animations + UX polish"
```
