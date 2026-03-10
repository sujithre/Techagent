import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe, SlicePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order-service';
import { OrderStatus, ORDER_STATUS_LABELS } from '../../models/order.model';
import { StatusBadgeComponent } from '../../shared/status-badge/status-badge';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe, SlicePipe, FormsModule, StatusBadgeComponent],
  templateUrl: './order-list.html',
  styleUrl: './order-list.scss',
})
export class OrderListComponent {
  private orderService = inject(OrderService);

  searchTerm = signal('');
  filterStatus = signal<OrderStatus | ''>('');
  statusLabels = ORDER_STATUS_LABELS;
  statuses: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  filteredOrders = computed(() => {
    let orders = this.orderService.allOrders();
    const search = this.searchTerm().toLowerCase();
    const status = this.filterStatus();

    if (search) {
      orders = orders.filter(
        (o) =>
          o.customerName.toLowerCase().includes(search) ||
          o.id.toLowerCase().includes(search)
      );
    }
    if (status) {
      orders = orders.filter((o) => o.status === status);
    }
    return orders;
  });

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
  }

  onFilterChange(value: string): void {
    this.filterStatus.set(value as OrderStatus | '');
  }

  deleteOrder(id: string): void {
    if (confirm('Are you sure you want to delete this order?')) {
      this.orderService.deleteOrder(id);
    }
  }
}
