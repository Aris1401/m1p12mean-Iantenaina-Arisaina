import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { SignUp } from './app/pages/auth/signup';

export const appRoutes: Routes = [
    { path: '', pathMatch: "full", redirectTo: "login"},
    { path: "login", loadChildren: () => import('./app/pages/auth/auth.routes')},
    { path: "signup", component: SignUp },
    {
        path: '',
        component: AppLayout,
        children: [
            // { path: '', component: Dashboard },
            { path: '', loadChildren: () => import('./app/pages/pages.routes') },
            { path: '', loadChildren: () => import('./app/pages/_utilisateur/user.routes') },
            { path: '', loadChildren: () => import('./app/pages/mecanicien/mecanicien.routes') },
            { path: 'manager', loadChildren: () => import('./app/pages/_manager/manager.routes') }
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: '/notfound' }
];
