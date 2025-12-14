import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/Task';

@Component({
  selector: 'app-task-item',
  imports: [CommonModule],
  template: `
    <div
      class="flex items-center p-4 mb-1 border rounded-lg bg-white shadow-sm hover:shadow-md hover:bg-cyan-50 transition-all"
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
}
