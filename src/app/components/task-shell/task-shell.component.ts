import { Component, computed, Signal, signal, viewChild, viewChildren } from '@angular/core';
import { Task } from '../../models/Task';
import { TaskBoardComponent } from '../task-board/task-board.component';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskItem } from '../task-item/task-item.component';

@Component({
  selector: 'app-task-shell',
  imports: [TaskBoardComponent],
  template: `
    <app-task-board
      [tasks]="tasks()"
      [firstTaskTitle]="firstTaskTitle()"
      [lastTaskTitle]="lastTaskTitle()"
      [filteredTasks]="filteredTasks()"
      [emptyMessage]="getEmptyMessage()"
      [emptySubMessage]="getEmptySubMessage()"
      [showEmptyState]="filteredTasks().length === 0"
      (taskAdded)="addTask($event)"
      (taskToggled)="updateTask($event)"
      (filterChanged)="setFilter($event)"
      (deleteCompleted)="deleteCompletedTasks()"
      (markCompleted)="markTaskComplete()"
      (viewChildrenReady)="onViewChildrenReady($event)"
      (emptyStateClick)="onEmptyStateClick($event)"
      #taskBoardRef
    >
    </app-task-board>
  `,
  styles: ``,
})
export class TaskShellComponent {
  // ✅ SMART: Owns state/logic
  tasks = signal<Task[]>([
    { id: 1, title: '✅ Review Angular 21 signals', completed: true },
    { id: 2, title: '🚀 Implement standalone components', completed: false },
    { id: 3, title: '📱 Build responsive task UI', completed: false },
    { id: 4, title: '🧪 Write component tests', completed: false },
  ]);

  filterMode = signal<'all' | 'active' | 'completed'>('all');
  // View query (your magic!)
  taskChildrenQueryFromBoard = signal<ReturnType<typeof viewChildren<TaskItem>> | undefined>(
    undefined,
  );
  taskFormQuery = viewChild<TaskFormComponent>('taskFormRef');
  firstTaskTitle = computed(() => {
    const children = this.taskChildrenQueryFromBoard();
    return children?.()[0]?.task()?.title || 'None';
  });
  lastTaskTitle = computed(() => {
    const children = this.taskChildrenQueryFromBoard();
    const all = children?.();
    return all && all?.length > 1 ? all[all.length - 1]?.task().title : 'None';
  });

  // ✅ Handler receives viewChildren from child
  onViewChildrenReady(childrenQuery: ReturnType<typeof viewChildren<TaskItem>>) {
    this.taskChildrenQueryFromBoard.set(childrenQuery);
    console.log('TaskShell: Received viewChildren from TaskBoard:', childrenQuery().length);
  }

  // Computed state
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

  // Smart methods
  addTask(task: Task) {
    this.tasks.update((t) => [...t, task]);
  }
  updateTask(updated: Task) {
    this.tasks.update((tasks) => tasks.map((t) => (t.id === updated.id ? updated : t)));
  }
  setFilter(mode: string) {
    this.filterMode.set(mode as any);
  }
  deleteCompletedTasks() {
    this.tasks.set(this.tasks().filter((t) => !t.completed));
  }
  markTaskComplete() {
    this.tasks.set(
      this.tasks().map((t) => {
        if (!t.completed) t.completed = true;
        return t;
      }),
    );
  }
  getEmptyMessage() {
    return this.filterMode() === 'active' ? 'No active tasks 🎉' : 'No tasks yet';
  }
  getEmptySubMessage() {
    return this.filterMode() === 'active' ? 'Great job!' : 'Click to add your first task!';
  }

  // 🎯 Empty state click handler
  onEmptyStateClick(taskFormRef: Signal<TaskFormComponent | undefined>) {
    const taskForm = taskFormRef();
    taskForm?.focusInput?.();
    taskForm?.taskInput?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
