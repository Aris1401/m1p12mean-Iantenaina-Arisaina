import { Routes } from '@angular/router';
import { Empty } from './empty/empty';
import { Dashboard } from './dashboard/dashboard';

export default [
    { path: 'dashboard', component: Dashboard },
    { path: 'empty', component: Empty },
] as Routes;
