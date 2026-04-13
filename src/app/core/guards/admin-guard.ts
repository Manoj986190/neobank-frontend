import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth/auth';

export const adminGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  if (auth.getRole() === 'ADMIN') return true;

  router.navigate(['/dashboard']);
  return false;
};