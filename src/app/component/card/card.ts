import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  imports: [],
  template: `
    <div
      class="border border-gray-200 rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200"
      [class]="extraClasses"
    >
      <ng-content></ng-content>
    </div>
  `,
  styles: ``,
})
export class Card {
  @Input() extraClasses = '';
}
