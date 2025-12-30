import { Routes } from '@angular/router';
import { CounterComponent } from './components/counter/counter.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
  { path: 'counter', component: CounterComponent },
  { path: '', redirectTo: '/counter', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];
