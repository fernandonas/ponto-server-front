import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User, UserRole } from '../../auth/auth.models';

@Component({
  selector: 'app-admin-users-page',
  imports: [FormsModule, RouterLink],
  templateUrl: './admin-users-page.html',
  styleUrl: './admin-users-page.css',
})
export class AdminUsersPage {
  private readonly http = inject(HttpClient);

  readonly users = signal<User[]>([]);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  constructor() {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.http.get<User[]>(`${environment.apiUrl}/users`).subscribe({
      next: (users) => this.users.set(users),
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(error.error?.message || 'Nao foi possivel carregar usuarios.');
        this.isLoading.set(false);
      },
      complete: () => this.isLoading.set(false),
    });
  }

  updateRole(user: User, role: UserRole): void {
    this.errorMessage.set('');

    this.http.put<User>(`${environment.apiUrl}/users/${user.id}`, { role }).subscribe({
      next: (updatedUser) => {
        this.users.update((users) =>
          users.map((item) => item.id === updatedUser.id ? updatedUser : item),
        );
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(error.error?.message || 'Nao foi possivel alterar a role.');
      },
    });
  }
}
