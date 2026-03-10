import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { OrderService } from '../../services/order-service';
import { OrderStatus, ORDER_STATUS_LABELS } from '../../models/order.model';
import { StatusBadgeComponent } from '../../shared/status-badge/status-badge';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe, StatusBadgeComponent],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.scss',
})
export class OrderDetailComponent {
  private orderService = inject(OrderService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  orderId = signal('');
  statusLabels = ORDER_STATUS_LABELS;
  statuses: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  order = computed(() => this.orderService.getOrderById(this.orderId()));

  constructor() {
    this.route.params.subscribe((params) => {
      this.orderId.set(params['id']);
    });
  }

  updateStatus(status: OrderStatus): void {
    this.orderService.updateStatus(this.orderId(), status);
  }

  deleteOrder(): void {
    if (confirm('Are you sure you want to delete this order?')) {
      this.orderService.deleteOrder(this.orderId());
      this.router.navigate(['/orders']);
    }
  }
}
