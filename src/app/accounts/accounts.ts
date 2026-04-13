import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService, AccountResponse } from '../auth/auth';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './accounts.html',
  styleUrl: './accounts.css'
})
export class Accounts implements OnInit {

  private auth   = inject(AuthService);
  router = inject(Router);
  private fb     = inject(FormBuilder);

  accounts     = signal<AccountResponse[]>([]);
  isLoading    = signal(true);
  isCreating   = signal(false);
  showForm     = signal(false);
  errorMessage = signal('');
  successMsg   = signal('');
  isAdmin      = signal(false);

  form = this.fb.group({
    accountType: ['SAVINGS', Validators.required]
  });

  get accountType() { return this.form.get('accountType')!; }

  ngOnInit(): void {
    this.isAdmin.set(this.auth.getRole() === 'ADMIN');
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.isLoading.set(true);
    this.auth.getAccounts().subscribe({
      next: (data) => {
        this.accounts.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.auth.logout();
        this.router.navigate(['/auth/login']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isCreating.set(true);
    this.errorMessage.set('');

    this.auth.createAccount({
      accountType: this.accountType.value as 'SAVINGS' | 'CURRENT'
    }).subscribe({
      next: (account) => {
        this.accounts.update(list => [account, ...list]);
        this.isCreating.set(false);
        this.showForm.set(false);
        this.form.reset({ accountType: 'SAVINGS' });
        this.successMsg.set('Account created successfully');
        setTimeout(() => this.successMsg.set(''), 3000);
      },
      error: () => {
        this.isCreating.set(false);
        this.errorMessage.set('Failed to create account. Please try again.');
      }
    });
  }

  getTotalBalance(): number {
    return this.accounts().reduce((sum, a) => sum + a.balance, 0);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}