import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  role: string;
  userId: number;
}

export interface UserProfileResponse {
  id: number;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface AccountRequest {
  accountType: 'SAVINGS' | 'CURRENT';
}

export interface AccountResponse {
  id: number;
  accountNumber: string;
  balance: number;
  accountType: string;
  createdAt: string;
}

export interface TransactionRequest {
  type: 'DEBIT' | 'CREDIT';
  amount: number;
  description?: string;
}

export interface TransactionResponse {
  id: number;
  type: string;
  amount: number;
  description: string;
  transactionDate: string;
  balanceAfter: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/auth';

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.baseUrl}/register`, data);
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, data).pipe(
      tap((res) => {
        sessionStorage.setItem('token', res.token);
        sessionStorage.setItem('role', res.role);
        sessionStorage.setItem('userId', String(res.userId));
        sessionStorage.setItem('email', res.email);
      }),
    );
  }

  logout(): void {
    sessionStorage.clear();
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getRole(): string | null {
    return sessionStorage.getItem('role');
  }

  getUserProfile(): Observable<UserProfileResponse> {
    return this.http.get<UserProfileResponse>('http://localhost:8080/api/users/me');
  }

  updateProfile(data: { fullName: string }): Observable<UserProfileResponse> {
    return this.http.put<UserProfileResponse>('http://localhost:8080/api/users/me', data);
  }

  getAllUsers(): Observable<UserProfileResponse[]> {
    return this.http.get<UserProfileResponse[]>('http://localhost:8080/api/admin/users');
  }

  private accountUrl = 'http://localhost:8080/api/accounts';

  createAccount(data: AccountRequest): Observable<AccountResponse> {
    return this.http.post<AccountResponse>(this.accountUrl, data);
  }

  getAccounts(): Observable<AccountResponse[]> {
    return this.http.get<AccountResponse[]>(this.accountUrl);
  }

  getAccountById(id: number): Observable<AccountResponse> {
    return this.http.get<AccountResponse>(`${this.accountUrl}/${id}`);
  }

  createTransaction(accountId: number, data: TransactionRequest): Observable<TransactionResponse> {
    return this.http.post<TransactionResponse>(
      `${this.accountUrl}/${accountId}/transactions`,
      data,
    );
  }

  getTransactions(
    accountId: number,
    page = 0,
    size = 10,
  ): Observable<PageResponse<TransactionResponse>> {
    return this.http.get<PageResponse<TransactionResponse>>(
      `${this.accountUrl}/${accountId}/transactions`,
      { params: { page, size } },
    );
  }
}