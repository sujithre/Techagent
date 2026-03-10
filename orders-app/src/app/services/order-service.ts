import { Injectable, signal, computed } from '@angular/core';
import { Order, OrderItem, OrderStatus } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly orders = signal<Order[]>(this.generateSampleOrders());
  private readonly loading = signal(false);
  private readonly error = signal<string | null>(null);

  readonly allOrders = this.orders.asReadonly();
  readonly isLoading = this.loading.asReadonly();
  readonly errorMessage = this.error.asReadonly();

  readonly orderCount = computed(() => this.orders().length);
  readonly totalRevenue = computed(() =>
    this.orders().reduce((sum, o) => sum + o.totalAmount, 0)
  );
  readonly pendingOrders = computed(() =>
    this.orders().filter((o) => o.status === 'pending')
  );
  readonly statusBreakdown = computed(() => {
    const counts: Record<string, number> = {};
    for (const order of this.orders()) {
      counts[order.status] = (counts[order.status] || 0) + 1;
    }
    return counts;
  });

  getOrderById(id: string): Order | undefined {
    return this.orders().find((o) => o.id === id);
  }

  addOrder(
    customerName: string,
    customerEmail: string,
    items: OrderItem[]
  ): void {
    const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const now = new Date();
    const newOrder: Order = {
      id: crypto.randomUUID(),
      customerName,
      customerEmail,
      items,
      status: 'pending',
      totalAmount,
      createdAt: now,
      updatedAt: now,
    };
    this.orders.update((orders) => [newOrder, ...orders]);
  }

  updateStatus(id: string, status: OrderStatus): void {
    this.orders.update((orders) =>
      orders.map((o) =>
        o.id === id ? { ...o, status, updatedAt: new Date() } : o
      )
    );
  }

  deleteOrder(id: string): void {
    this.orders.update((orders) => orders.filter((o) => o.id !== id));
  }

  private generateSampleOrders(): Order[] {
    const names = [
      'Alice Johnson',
      'Bob Smith',
      'Carol Williams',
      'David Brown',
      'Eva Martinez',
    ];
    const products = [
      'Wireless Headphones',
      'Mechanical Keyboard',
      'USB-C Hub',
      'Monitor Stand',
      '27" 4K Monitor',
      'Webcam HD',
      'Desk Lamp',
      'Laptop Sleeve',
    ];
    const statuses: OrderStatus[] = [
      'pending',
      'confirmed',
      'shipped',
      'delivered',
      'cancelled',
    ];

    return Array.from({ length: 12 }, (_, i) => {
      const itemCount = Math.floor(Math.random() * 3) + 1;
      const items: OrderItem[] = Array.from({ length: itemCount }, () => {
        const qty = Math.floor(Math.random() * 5) + 1;
        const price = Math.floor(Math.random() * 200) + 10;
        return {
          productName: products[Math.floor(Math.random() * products.length)],
          quantity: qty,
          unitPrice: price,
          totalPrice: qty * price,
        };
      });
      const createdAt = new Date(
        Date.now() - Math.floor(Math.random() * 30) * 86400000
      );
      return {
        id: crypto.randomUUID(),
        customerName: names[i % names.length],
        customerEmail: `${names[i % names.length].toLowerCase().replace(' ', '.')}@example.com`,
        items,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        totalAmount: items.reduce((s, it) => s + it.totalPrice, 0),
        createdAt,
        updatedAt: createdAt,
      };
    });
  }
}
