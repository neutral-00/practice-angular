import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  effect,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
} from '@angular/core';
import { Task } from '../../models/Task';
import { LifecycleTrackerService } from '../../services/lifecycle-tracker.service';
import { LIFECYCLE_EVENT_ICON } from '../../models/LifecycleEvent';

@Component({
  selector: 'app-task-item',
  imports: [CommonModule],
  template: `
    <div
      class="flex items-center p-4 mb-1 border rounded-lg bg-white shadow-sm hover:shadow-md hover:bg-cyan-50 transition-all"
    >
      <input
        type="checkbox"
        [checked]="task().completed"
        (click)="toggleTask()"
        class="w-5 h-5 rounded mr-4 cursor-pointer"
      />
      <span
        #titleRef
        class="flex-1 text-gray-900 font-medium line-clamp-1 cursor-pointer"
        (click)="toggleTask()"
        [attr.title]="task().title.length > 40 ? task().title : null"
      >
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
export class TaskItem implements OnInit, OnDestroy, AfterViewInit {
  task = input.required<Task>();

  // ✅ Output: Child → Parent communication
  taskToggled = output<Task>();

  // ✅ Service injection
  private tracker = inject(LifecycleTrackerService);

  constructor() {
    // ✅ effect() tracks input changes globally
    effect(() => {
      this.tracker.trackEffect(this.task().id);
      console.log(`${LIFECYCLE_EVENT_ICON.effect} TaskItem ${this.task().id}: effect() tracked`);
    });
  }

  ngOnInit() {
    this.tracker.trackInit(this.task().id);
    console.log(`${LIFECYCLE_EVENT_ICON.init} TaskItem ${this.task().id}: ngOnInit() tracked`);
  }

  ngAfterViewInit() {
    this.tracker.trackAfterviewInit(this.task().id);
    console.log(
      `${LIFECYCLE_EVENT_ICON.afterViewInit} TaskItem ${this.task().id}: ngAfterViewInit() tracked`,
    );
  }

  ngOnDestroy() {
    this.tracker.trackDestroy(this.task().id);
    console.log(
      `${LIFECYCLE_EVENT_ICON.destroy} TaskItem ${this.task().id}: ngOnDestroy() tracked`,
    );
  }

  toggleTask() {
    const toggledTask = { ...this.task(), completed: !this.task().completed };
    this.taskToggled.emit(toggledTask);
  }
}
