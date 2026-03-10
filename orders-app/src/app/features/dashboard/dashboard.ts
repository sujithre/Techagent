import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../services/order-service';
import { ORDER_STATUS_LABELS } from '../../models/order.model';
import { CurrencyPipe, KeyValuePipe } from '@angular/common';
import { OrderStatus } from '../../models/order.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, KeyValuePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent {
  private orderService = inject(OrderService);

  orderCount = this.orderService.orderCount;
  totalRevenue = this.orderService.totalRevenue;
  pendingOrders = this.orderService.pendingOrders;
  statusBreakdown = this.orderService.statusBreakdown;
  statusLabels = ORDER_STATUS_LABELS;

  getStatusLabel(key: string): string {
    return this.statusLabels[key as OrderStatus] ?? key;
  }
}
