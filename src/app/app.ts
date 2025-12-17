import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskShellComponent } from './components/task-shell/task-shell.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TaskShellComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('practice-angular');
}
