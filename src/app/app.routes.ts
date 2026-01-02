import { Routes } from '@angular/router';
import { BlogpostComponent } from './blogpost/blogpost.component';

export const routes: Routes = [
  { path: '', redirectTo: '/post', pathMatch: 'full' },
  { path: 'post', component: BlogpostComponent },
];
