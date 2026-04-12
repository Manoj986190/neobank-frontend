import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, UserProfileResponse } from '../auth/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {

  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private router = inject(Router);

  profile      = signal<UserProfileResponse | null>(null);
  isLoading    = signal(true);
  isSaving     = signal(false);
  isSuccess    = signal(false);
  errorMessage = signal('');
  isAdmin      = signal(false);

  form = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]]
  });

  get fullName() { return this.form.get('fullName')!; }

  ngOnInit(): void {
    this.auth.getUserProfile().subscribe({
      next: (data) => {
        this.profile.set(data);
        this.isAdmin.set(data.role === 'ADMIN');
        this.form.patchValue({ fullName: data.fullName });
        this.isLoading.set(false);
      },
      error: () => {
        this.auth.logout();
        this.router.navigate(['/auth/login']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');
    this.isSuccess.set(false);

    this.auth.updateProfile({
      fullName: this.fullName.value!
    }).subscribe({
      next: (updated) => {
        this.profile.set(updated);
        this.isSaving.set(false);
        this.isSuccess.set(true);
        setTimeout(() => this.isSuccess.set(false), 3000);
      },
      error: () => {
        this.isSaving.set(false);
        this.errorMessage.set('Failed to update profile. Please try again.');
      }
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}