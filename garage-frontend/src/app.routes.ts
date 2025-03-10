import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
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
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: '', loadChildren: () => import('./app/pages/pages.routes') },
            { path: '', loadChildren: () => import('./app/pages/_utilisateur/user.routes') }
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: '/notfound' }
];
