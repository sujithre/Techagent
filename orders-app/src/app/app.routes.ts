import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./features/order-list/order-list').then(
        (m) => m.OrderListComponent
      ),
  },
  {
    path: 'orders/new',
    loadComponent: () =>
      import('./features/new-order/new-order').then(
        (m) => m.NewOrderComponent
      ),
  },
  {
    path: 'orders/:id',
    loadComponent: () =>
      import('./features/order-detail/order-detail').then(
        (m) => m.OrderDetailComponent
      ),
  },
];
