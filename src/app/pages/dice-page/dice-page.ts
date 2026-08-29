import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

interface DiceResponse {
  value: number;
}

@Component({
  selector: 'app-dice-page',
  imports: [RouterLink],
  templateUrl: './dice-page.html',
  styleUrl: './dice-page.css',
})
export class DicePage {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  readonly user = this.authService.user;
  readonly diceValue = signal<number | null>(null);
  readonly diceLabel = computed(() => `Dado ${this.diceValue()}`);
  readonly errorMessage = signal('');
  readonly isLoading = signal(false);

  constructor() {
    this.roll();
  }

  roll(): void {
    this.errorMessage.set('');
    this.isLoading.set(true);

    this.http.get<DiceResponse>('http://localhost:3000/api/dice').subscribe({
      next: (response) => this.diceValue.set(response.value),
      error: (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authService.logout();
          return;
        }

        this.errorMessage.set(error.error?.message || 'Nao foi possivel sortear o dado.');
        this.isLoading.set(false);
      },
      complete: () => this.isLoading.set(false),
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
