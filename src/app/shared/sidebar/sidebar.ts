import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar implements OnInit {

  private auth   = inject(AuthService);
  readonly router = inject(Router);

  isAdmin   = signal(false);
  userName  = signal('');
  userEmail = signal('');
  activeRoute = signal('');
  
  // --- ADDED FOR MOBILE RESPONSIVENESS ---
  isMenuOpen = signal(false); 

  ngOnInit(): void {
    this.isAdmin.set(this.auth.getRole() === 'ADMIN');
    this.userEmail.set(sessionStorage.getItem('email') || '');
    this.userName.set(
      sessionStorage.getItem('email')?.split('@')[0] || 'User');
    this.activeRoute.set(this.router.url);

    // Update active route on navigation
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      this.activeRoute.set(e.urlAfterRedirects);
    });
  }

  // --- ADDED METHODS FOR MOBILE TOGGLE ---
  toggleMenu(): void {
    this.isMenuOpen.update(val => !val);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  isActive(path: string): boolean {
    return this.activeRoute().startsWith(path);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}