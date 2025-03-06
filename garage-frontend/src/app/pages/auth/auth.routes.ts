import { Routes } from '@angular/router';
import { Access } from './access';
import { Login } from './login';
import { Error } from './error';
import { LoginManager } from './loginManager';
import { LoginMecanicien } from './loginMecanicien';

export default [
    { path: '', component: Login },
    { path: 'manager', component: LoginManager},
    { path: 'mecanicien', component: LoginMecanicien },
    { path: 'access', component: Access },
    { path: 'error', component: Error },
] as Routes;
