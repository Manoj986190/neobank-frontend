import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Sidebar } from '../shared/sidebar/sidebar';
import {
  AuthService,
  AccountResponse,
  TransactionResponse,
  PageResponse
} from '../auth/auth';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Sidebar],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css'
})
export class Transactions implements OnInit {

  private auth  = inject(AuthService);
  private route = inject(ActivatedRoute);
  readonly router = inject(Router);
  private fb    = inject(FormBuilder);

  accountId    = signal<number>(0);
  account      = signal<AccountResponse | null>(null);
  transactions = signal<TransactionResponse[]>([]);
  isLoading    = signal(true);
  isSubmitting = signal(false);
  showForm     = signal(false);
  errorMessage = signal('');
  successMsg   = signal('');
  isAdmin      = signal(false);

  // Filter & sort state
  filter       = signal<'ALL' | 'CREDIT' | 'DEBIT'>('ALL');
  sortAsc      = signal(false);

  // Pagination
  currentPage  = signal(0);
  totalPages   = signal(0);
  totalElements = signal(0);

  form = this.fb.group({
    type:        ['CREDIT', Validators.required],
    amount:      [null, [Validators.required, Validators.min(0.01)]],
    description: ['', Validators.maxLength(500)]
  });

  get type()        { return this.form.get('type')!; }
  get amount()      { return this.form.get('amount')!; }
  get description() { return this.form.get('description')!; }

  ngOnInit(): void {
    this.isAdmin.set(this.auth.getRole() === 'ADMIN');
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.accountId.set(id);
    this.loadAccount(id);
    this.loadTransactions(id, 0);
  }

  loadAccount(id: number): void {
    this.auth.getAccountById(id).subscribe({
      next: (data) => this.account.set(data),
      error: () => this.router.navigate(['/accounts'])
    });
  }

  loadTransactions(id: number, page: number): void {
    this.isLoading.set(true);
    this.auth.getTransactions(id, page).subscribe({
      next: (data: PageResponse<TransactionResponse>) => {
        this.transactions.set(data.content);
        this.totalPages.set(data.totalPages);
        this.totalElements.set(data.totalElements);
        this.currentPage.set(data.number);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.router.navigate(['/accounts']);
      }
    });
  }

  get filteredTransactions(): TransactionResponse[] {
    let list = this.transactions();

    if (this.filter() !== 'ALL') {
      list = list.filter(t => t.type === this.filter());
    }

    return [...list].sort((a, b) => {
      const diff = new Date(a.transactionDate).getTime()
                 - new Date(b.transactionDate).getTime();
      return this.sortAsc() ? diff : -diff;
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    this.auth.createTransaction(this.accountId(), {
      type:        this.type.value as 'DEBIT' | 'CREDIT',
      amount:      Number(this.amount.value),
      description: this.description.value || ''
    }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.showForm.set(false);
        this.form.reset({ type: 'CREDIT' });
        this.successMsg.set('Transaction completed successfully');
        setTimeout(() => this.successMsg.set(''), 3000);
        // Reload account balance and transactions
        this.loadAccount(this.accountId());
        this.loadTransactions(this.accountId(), 0);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        if (err.status === 422) {
          this.errorMessage.set(
            err.error?.message || 'Insufficient balance.');
        } else if (err.status === 400) {
          this.errorMessage.set('Invalid amount. Must be greater than zero.');
        } else {
          this.errorMessage.set('Transaction failed. Please try again.');
        }
      }
    });
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages()) return;
    this.loadTransactions(this.accountId(), page);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}