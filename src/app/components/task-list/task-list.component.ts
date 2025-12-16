import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, signal, viewChild, viewChildren } from '@angular/core';
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
      <!-- 🎯 Lifecycle Demo: Stats -->
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

      <!-- Stats (existing) -->
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
        <p class="text-gray-600">Angular 21 • View Queries</p>
      </div>

      <!-- Existing components (unchanged) -->
      <app-task-form #taskFormRef (taskAdded)="addTask($event)"></app-task-form>
      <app-task-actions
        [tasks]="tasks()"
        (filterChanged)="setFilter($event)"
        (deleteCompleted)="deleteCompletedTasks()"
      >
      </app-task-actions>

      <div class="space-y-3">
        <app-task-item
          *ngFor="let task of filteredTasks(); trackBy: trackByTaskId"
          [task]="task"
          (taskToggled)="updateTask($event)"
        >
        </app-task-item>
      </div>

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
    </div>
  `,
  styles: ``,
})
export class TaskList {
  // 🎯 Query TaskForm
  taskFormQuery = viewChild<TaskFormComponent>('taskFormRef');

  // 🎯 Click handler for empty state
  onEmptyStateClick() {
    const taskForm = this.taskFormQuery();
    taskForm?.focusInput();

    // Smooth scroll to form
    taskForm?.taskInput?.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }

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

  // Signal-based state (Angular 21 style)
  tasks = signal<Task[]>([
    { id: 1, title: '✅ Review Angular 21 signals', completed: true },
    {
      id: 2,
      title:
        '🚀 Implement standalone components. Some gibberish text to make it much longer so that tooltip is displayed',
      completed: false,
    },
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

  // ✅ Handle child → parent events
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

  trackByTaskId(index: number, task: Task): number {
    return task.id;
  }
}
