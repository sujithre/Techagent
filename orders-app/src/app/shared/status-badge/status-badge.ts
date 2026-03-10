import { Component, input } from '@angular/core';
import { OrderStatus, ORDER_STATUS_LABELS } from '../../models/order.model';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `<span class="badge" [attr.data-status]="status()">{{ label() }}</span>`,
  styles: [
    `
      .badge {
        display: inline-block;
        padding: 0.3rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;

        &[data-status='pending'] {
          background: #fff3cd;
          color: #856404;
        }
        &[data-status='confirmed'] {
          background: #cce5ff;
          color: #004085;
        }
        &[data-status='shipped'] {
          background: #d4edda;
          color: #155724;
        }
        &[data-status='delivered'] {
          background: #d1ecf1;
          color: #0c5460;
        }
        &[data-status='cancelled'] {
          background: #f8d7da;
          color: #721c24;
        }
      }
    `,
  ],
})
export class StatusBadgeComponent {
  status = input.required<OrderStatus>();

  label = () => ORDER_STATUS_LABELS[this.status()];
}
