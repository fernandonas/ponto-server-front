import { SlicePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { MatchService } from '../../services/match.service';
@Component({
  selector: 'app-home-page',
  imports: [RouterLink, SlicePipe],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  private readonly authService = inject(AuthService);
  private readonly matchService = inject(MatchService);

  readonly user = this.authService.user;
  readonly upcomingMatches = signal<any[]>([]);
  readonly isLoadingMatches = signal(true);
  readonly matchesError = signal('');

  constructor() {
    this.loadUpcomingMatches();
  }

  loadUpcomingMatches(): void {
    this.matchService.getMyUpcoming().subscribe({
      next: matches => {
        const orderedMatches = [...matches].sort((first, second) => {
          const firstDateTime = `${first.matchDate}T${first.startTime}`;
          const secondDateTime = `${second.matchDate}T${second.startTime}`;

          return firstDateTime.localeCompare(secondDateTime);
        });

        this.upcomingMatches.set(orderedMatches);
        this.isLoadingMatches.set(false);
      },
      error: () => {
        this.matchesError.set('Nao foi possivel carregar suas proximas partidas.');
        this.isLoadingMatches.set(false);
      },
    });
  }

  statusLabel(status: string): string {
    return {
      open: 'Aberta',
      in_progress: 'Em andamento',
    }[status] || status;
  }

  logout(): void {
    this.authService.logout();
  }
}
