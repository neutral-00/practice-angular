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
  // ✅ SMART: Owns state
  tasks = signal<Task[]>([
    { id: 1, title: '✅ Review Angular 21 signals', completed: true },
    { id: 2, title: '🚀 Implement standalone components', completed: false },
    { id: 3, title: '📱 Build responsive task UI', completed: false },
    { id: 4, title: '🧪 Write component tests', completed: false },
  ]);

  filterMode = signal<'all' | 'active' | 'completed'>('all');

  // ✅ Receive viewChildren from child (testing concept)
  taskChildrenQueryFromBoard = signal<ReturnType<typeof viewChildren<TaskItem>> | undefined>(
    undefined,
  );

  // Titles from CHILD view query!
  firstTaskTitle = computed(() => {
    const children = this.taskChildrenQueryFromBoard()?.();
    return children?.[0]?.task()?.title || 'None';
  });
  lastTaskTitle = computed(() => {
    const children = this.taskChildrenQueryFromBoard()?.();
    return children && children.length > 0 ? children[children.length - 1]?.task()?.title : 'None';
  });

  onViewChildrenReady(childrenQuery: ReturnType<typeof viewChildren<TaskItem>>) {
    this.taskChildrenQueryFromBoard.set(childrenQuery);
    console.log('TaskShell: Received viewChildren:', childrenQuery().length);
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

  // ✅ NEW: Mark All Complete
  markTaskComplete() {
    this.tasks.set(this.tasks().map((t) => ({ ...t, completed: true })));
  }

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

  getEmptyMessage() {
    return this.filterMode() === 'active' ? 'No active tasks 🎉' : 'No tasks yet';
  }
  getEmptySubMessage() {
    return this.filterMode() === 'active' ? 'Great job!' : 'Click to add your first task!';
  }

  onEmptyStateClick(taskFormRef: ReturnType<typeof viewChild<TaskFormComponent>>) {
    const taskForm = taskFormRef();
    taskForm?.focusInput?.();
    taskForm?.taskInput?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
