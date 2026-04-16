import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Sidebar } from './shared/sidebar/sidebar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('NEOBANK 360');
  private readonly router = inject(Router);

  /**
   * Checks if the current route is an authentication page (Login/Register).
   * We use this in the HTML to hide the sidebar when the user isn't logged in.
   */
  isAuthPage(): boolean {
    const url = this.router.url;
    return url.includes('/auth/login') || url.includes('/auth/register') || url === '/';
  }
}
