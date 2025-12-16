import { Component, ElementRef, output, ViewChild } from '@angular/core';
import { Task } from '../../models/Task';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-form',
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
  styles: `
    input:focus {
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  `,
})
export class TaskFormComponent {
  @ViewChild('taskInput') taskInput!: ElementRef<HTMLInputElement>;

  // 🎯 Public method for parent to focus
  focusInput() {
    this.taskInput?.nativeElement.focus();
  }

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
