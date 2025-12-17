import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  input,
  output,
  viewChild,
  viewChildren,
} from '@angular/core';
import { Task } from '../../models/Task';
import { TaskActionsComponent } from '../task-actions/task-actions.component';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskItem } from '../task-item/task-item.component';
import { TaskStatsComponent } from '../task-stats/task-stats.component';

@Component({
  selector: 'app-task-board',
  imports: [CommonModule, TaskItem, TaskFormComponent, TaskActionsComponent, TaskStatsComponent],
  template: `
    <div class="max-w-2xl mx-auto p-6 bg-linear-to-br from-blue-50 to-indigo-100 min-h-screen">
      <!-- Stats & Queries (dumb display) -->
      <app-task-stats></app-task-stats>

      <!-- View Query Outputs (from props) -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="p-4 bg-white/70 backdrop-blur rounded-xl shadow-lg text-center">
          <div class="text-2xl font-bold text-blue-600">{{ firstTaskTitle() }}</div>
          <div class="text-xs text-gray-600">First Task</div>
        </div>
        <div class="p-4 bg-white/70 backdrop-blur rounded-xl shadow-lg text-center">
          <div class="text-2xl font-bold text-purple-600">{{ lastTaskTitle() }}</div>
          <div class="text-xs text-gray-600">Last Task</div>
        </div>
      </div>

      <!-- Stats (existing) -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="p-4 bg-white/70 backdrop-blur rounded-xl shadow-lg text-center">
          <div class="text-3xl font-bold text-blue-600">{{ pendingCount() }}</div>
          <div class="text-sm text-gray-600">Pending</div>
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
        <p class="text-gray-600">Angular 21 • Smart/Presentational</p>
      </div>

      <!-- Event emitters to parent -->
      <app-task-form #taskFormRef (taskAdded)="onTaskAdded($event)"></app-task-form>
      <app-task-actions
        [tasks]="tasks()"
        (filterChanged)="onFilterChanged($event)"
        (deleteCompleted)="onDeleteCompleted()"
        (markCompleted)="onMarkCompleted()"
      >
      </app-task-actions>

      <!-- Dumb list display -->
      <div class="space-y-3">
        <app-task-item
          *ngFor="let task of filteredTasks(); trackBy: trackByFn"
          [task]="task"
          (taskToggled)="onTaskToggled($event)"
        >
        </app-task-item>
      </div>

      <!-- Empty state (with your focus magic) -->
      <div
        *ngIf="showEmptyState()"
        class="text-center py-12 text-gray-500 cursor-pointer hover:bg-gray-100 p-8 rounded-2xl transition-all group"
        (click)="onEmptyStateClick()"
        title="Click to add your first task!"
      >
        <div
          class="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-100"
        >
          📝
        </div>
        <h3 class="text-xl font-semibold mb-2 hover:text-blue-600">{{ emptyMessage() }}</h3>
        <p class="hover:underline">{{ emptySubMessage() }}</p>
      </div>
    </div>
  `,
  styles: ``,
})
export class TaskBoardComponent implements AfterViewInit {
  // ✅ LOCAL View Queries (self-contained)
  taskFormRef = viewChild<TaskFormComponent>('taskFormRef');
  taskViewChildrenSignalQuery = viewChildren(TaskItem);

  // ✅ Emit viewChildren to parent for testing
  viewChildrenReady = output<ReturnType<typeof viewChildren<TaskItem>>>();

  ngAfterViewInit() {
    const children = this.taskViewChildrenSignalQuery();
    console.log('TaskBoard: viewChildren ready:', children.length);
    this.viewChildrenReady.emit(this.taskViewChildrenSignalQuery);
  }

  // Presentational props
  tasks = input.required<Task[]>();
  showEmptyState = input<boolean>(false);
  firstTaskTitle = input<string>('None');
  lastTaskTitle = input<string>('None');
  emptyMessage = input<string>('No tasks yet');
  emptySubMessage = input<string>('Add your first task!');
  filteredTasks = input<Task[]>();

  // Local computed stats
  completedCount = computed(() => this.tasks().filter((t) => t.completed).length);
  pendingCount = computed(() => this.tasks().filter((t) => !t.completed).length);

  // Event outputs
  taskAdded = output<Task>();
  taskToggled = output<Task>();
  filterChanged = output<string>();
  deleteCompleted = output<void>();
  markCompleted = output<void>();
  emptyStateClick = output<ReturnType<typeof viewChild<TaskFormComponent>>>();

  // Passthrough handlers
  onTaskAdded(task: Task) {
    this.taskAdded.emit(task);
  }
  onTaskToggled(task: Task) {
    this.taskToggled.emit(task);
  }
  onFilterChanged(filter: string) {
    this.filterChanged.emit(filter);
  }
  onDeleteCompleted() {
    this.deleteCompleted.emit();
  }
  onMarkCompleted() {
    this.markCompleted.emit();
  }
  onEmptyStateClick() {
    this.emptyStateClick.emit(this.taskFormRef);
  }

  trackByFn(index: number, task: Task) {
    return task.id;
  }
}
