import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  AuthService,
  AccountResponse,
  TransactionResponse
} from '../auth/auth';

interface RecentTx extends TransactionResponse {
  accountNumber: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  private auth   = inject(AuthService);
  readonly router = inject(Router);

  // ── State signals ─────────────────────────────────────
  accounts      = signal<AccountResponse[]>([]);
  recentTxs     = signal<RecentTx[]>([]);
  isLoading     = signal(true);
  userName      = signal('');
  userEmail     = signal('');
  isAdmin       = signal(false);

  // ── Computed ──────────────────────────────────────────
  totalBalance = computed(() =>
    this.accounts().reduce((sum, a) => sum + a.balance, 0));

  totalAccounts = computed(() => this.accounts().length);

  savingsCount = computed(() =>
    this.accounts().filter(a => a.accountType === 'SAVINGS').length);

  currentCount = computed(() =>
    this.accounts().filter(a => a.accountType === 'CURRENT').length);

  ngOnInit(): void {
    this.userName.set(sessionStorage.getItem('email')?.split('@')[0] || 'User');
    this.userEmail.set(sessionStorage.getItem('email') || '');
    this.isAdmin.set(this.auth.getRole() === 'ADMIN');
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.isLoading.set(true);
    this.auth.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts.set(accounts);
        this.isLoading.set(false);
        this.loadRecentTransactions(accounts);
      },
      error: () => {
        this.auth.logout();
        this.router.navigate(['/auth/login']);
      }
    });
  }

  loadRecentTransactions(accounts: AccountResponse[]): void {
    if (accounts.length === 0) return;

    const allTxs: RecentTx[] = [];
    let completed = 0;

    accounts.forEach(account => {
      this.auth.getRecentTransactions(account.id, 3).subscribe({
        next: (page) => {
          const txs = page.content.map(tx => ({
            ...tx,
            accountNumber: account.accountNumber
          }));
          allTxs.push(...txs);
          completed++;

          if (completed === accounts.length) {
            // Sort all by date desc, take latest 6
            const sorted = allTxs.sort((a, b) =>
              new Date(b.transactionDate).getTime() -
              new Date(a.transactionDate).getTime()
            ).slice(0, 6);
            this.recentTxs.set(sorted);
          }
        },
        error: () => { completed++; }
      });
    });
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}