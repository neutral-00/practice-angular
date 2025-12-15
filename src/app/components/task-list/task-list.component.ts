import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { TaskItem } from '../task-item/task-item.component';
import { Task } from '../../models/Task';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, TaskItem],
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
  styles: ``,
})
export class TaskList {
  // Signal-based state (Angular 21 style)
  tasks = signal<Task[]>([
    { id: 1, title: '✅ Review Angular 21 signals', completed: true },
    {
      id: 2,
      title:
        '🚀 Implement standalone components Some gibberish text to make it much longer Some gibberish text to make it much longer',
      completed: false,
    },
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
