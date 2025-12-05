import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Card } from './component/card/card';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Card],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('practice-angular');
}
