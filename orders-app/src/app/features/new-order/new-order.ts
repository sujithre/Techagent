import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormArray,
  Validators,
} from '@angular/forms';
import { OrderService } from '../../services/order-service';
import { OrderItem } from '../../models/order.model';

@Component({
  selector: 'app-new-order',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './new-order.html',
  styleUrl: './new-order.scss',
})
export class NewOrderComponent {
  private orderService = inject(OrderService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  submitted = signal(false);

  orderForm = this.fb.group({
    customerName: ['', [Validators.required, Validators.minLength(2)]],
    customerEmail: ['', [Validators.required, Validators.email]],
    items: this.fb.array([this.createItemGroup()]),
  });

  get items(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  createItemGroup() {
    return this.fb.group({
      productName: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0.01)]],
    });
  }

  addItem(): void {
    this.items.push(this.createItemGroup());
  }

  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  onSubmit(): void {
    this.submitted.set(true);
    if (this.orderForm.invalid) return;

    const { customerName, customerEmail, items } = this.orderForm.value;
    const orderItems: OrderItem[] = (items || []).map((item: any) => ({
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.quantity * item.unitPrice,
    }));

    this.orderService.addOrder(customerName!, customerEmail!, orderItems);
    this.router.navigate(['/orders']);
  }
}
