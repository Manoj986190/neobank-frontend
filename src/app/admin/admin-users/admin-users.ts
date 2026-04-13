import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, UserProfileResponse } from '../../auth/auth';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css'
})
export class AdminUsers implements OnInit {

  private auth   = inject(AuthService);
  private router = inject(Router);

  users      = signal<UserProfileResponse[]>([]);
  isLoading  = signal(true);
  isAdmin    = signal(false);

  ngOnInit(): void {
    this.isAdmin.set(this.auth.getRole() === 'ADMIN');

    this.auth.getAllUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        if (err.status === 403) {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/auth/login']);
        }
      }
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}