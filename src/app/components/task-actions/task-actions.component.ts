import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/Task';

@Component({
  selector: 'app-task-actions',
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
        (change)="filterChangedTriggered()"
      >
        <option value="all">All Tasks</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </select>

      <!-- ✅ NEW: Mark All Complete -->
      <button
        (click)="markAllCompleted()"
        [disabled]="totalPending === 0"
        class="px-6 py-2 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
      >
        Mark Completed ({{ totalPending }})
      </button>

      <!-- Delete All -->
      <button
        (click)="deleteAllCompleted()"
        [disabled]="totalCompleted === 0"
        class="px-6 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
      >
        Delete Completed ({{ totalCompleted }})
      </button>
    </div>
  `,
  styles: ``,
})
export class TaskActionsComponent {
  tasks = input.required<Task[]>();
  filterMode = 'all';

  filterChanged = output<string>();
  deleteCompleted = output<void>();
  markCompleted = output<void>(); // ✅ NEW!

  get totalPending() {
    return this.tasks().filter((t) => !t.completed).length;
  }

  get totalCompleted() {
    return this.tasks().filter((t) => t.completed).length;
  }

  filterChangedTriggered() {
    this.filterChanged.emit(this.filterMode);
  }

  markAllCompleted() {
    this.markCompleted.emit();
  }

  deleteAllCompleted() {
    this.deleteCompleted.emit();
  }
}
