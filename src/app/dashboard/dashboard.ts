import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div style="padding:40px; font-family: sans-serif;">
      <h1>Dashboard</h1>
      <p>Welcome! You are logged in.</p>
      <div style="display:flex; gap:12px; margin-top:16px;">
        <button
          (click)="goToProfile()"
          style="padding:10px 20px; background:#1a1d2e;
               color:#fff; border:none; border-radius:8px; cursor:pointer;"
        >
          My Profile
        </button>
        <button
          (click)="logout()"
          style="padding:10px 20px; background:#6c63ff;
               color:#fff; border:none; border-radius:8px; cursor:pointer;"
        >
          Logout
        </button>
      </div>
    </div>
  `,
})
export class Dashboard {
  private auth = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  } 
}