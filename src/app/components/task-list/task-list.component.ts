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
