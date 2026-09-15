import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    title: 'Início',
  },
  {
    path: 'projetos',
    loadComponent: () => import('./pages/projects/projects').then((m) => m.Projects),
    title: 'Projetos',
  },
  {
    path: 'planos',
    loadComponent: () => import('./pages/plans/plans').then((m) => m.Plans),
    title: 'Planos',
  },
  {
    path: 'blog',
    loadComponent: () => import('./pages/blog/blog-list/blog-list').then((m) => m.BlogList),
    title: 'Blog',
  },
  {
    path: 'blog/:slug',
    loadComponent: () => import('./pages/blog/blog-detail/blog-detail').then((m) => m.BlogDetail),
    title: 'Blog',
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./pages/admin/admin-login/admin-login').then((m) => m.AdminLogin),
    title: 'Login',
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin-layout/admin-layout').then((m) => m.AdminLayout),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'perfil', pathMatch: 'full' },
      {
        path: 'perfil',
        loadComponent: () => import('./pages/admin/admin-profile/admin-profile').then((m) => m.AdminProfile),
        title: 'Admin · Perfil',
      },
      {
        path: 'projetos',
        loadComponent: () => import('./pages/admin/admin-projects/admin-projects').then((m) => m.AdminProjects),
        title: 'Admin · Projetos',
      },
      {
        path: 'planos',
        loadComponent: () => import('./pages/admin/admin-plans/admin-plans').then((m) => m.AdminPlans),
        title: 'Admin · Planos',
      },
      {
        path: 'blog',
        loadComponent: () => import('./pages/admin/admin-blog/admin-blog').then((m) => m.AdminBlog),
        title: 'Admin · Blog',
      },
    ],
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
    title: 'Página não encontrada',
  },
];
