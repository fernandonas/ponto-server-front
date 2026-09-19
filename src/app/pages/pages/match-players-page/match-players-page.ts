import { SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { MatchPlayerService } from '../../../services/match-player.service';
import { MatchService } from '../../../services/match.service';

@Component({
  selector: 'app-match-players-page',
  imports: [FormsModule, RouterLink, SlicePipe],
  templateUrl: './match-players-page.html',
  styleUrl: './match-players-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatchPlayersPage {
  private readonly route = inject(ActivatedRoute);
  private readonly matchService = inject(MatchService);
  private readonly matchPlayerService = inject(MatchPlayerService);

  readonly matches = signal<any[]>([]);
  readonly users = signal<any[]>([]);
  readonly players = signal<any[]>([]);
  readonly selectedMatchId = signal('');
  selectedUserId = '';
  errorMessage = '';

  constructor() {
    this.loadMatches();
    this.loadUsers();
  }

  loadMatches(): void {
    this.matchService.getAll().pipe(take(1)).subscribe({
      next: matches => {
        this.matches.set(matches);
        const routeMatchId = this.route.snapshot.paramMap.get('matchId');
        const selectedId = routeMatchId && matches.some((match: any) => match.id === routeMatchId)
          ? routeMatchId
          : matches[0]?.id || '';
        this.selectedMatchId.set(selectedId);
        if (selectedId) {
          this.loadPlayers(selectedId);
        }
      },
    });
  }

  loadUsers(): void {
    this.matchPlayerService.getUsers().pipe(take(1)).subscribe({
      next: users => this.users.set(users),
    });
  }

  selectMatch(matchId: string): void {
    this.selectedMatchId.set(matchId);
    this.selectedUserId = '';
    this.loadPlayers(matchId);
  }

  loadPlayers(matchId: string): void {
    this.matchPlayerService.getByMatch(matchId).pipe(take(1)).subscribe({
      next: players => this.players.set(players),
    });
  }

  addPlayer(): void {
    const matchId = this.selectedMatchId();
    if (!matchId || !this.selectedUserId) {
      return;
    }

    this.errorMessage = '';
    this.matchPlayerService.add(matchId, this.selectedUserId).pipe(take(1)).subscribe({
      next: player => {
        this.players.update(players => [...players, player].sort((first, second) => first.name.localeCompare(second.name)));
        this.selectedUserId = '';
      },
      error: error => {
        this.errorMessage = error.error?.message || 'Nao foi possivel atribuir o jogador.';
      },
    });
  }

  removePlayer(userId: string): void {
    const matchId = this.selectedMatchId();
    this.errorMessage = '';
    this.matchPlayerService.remove(matchId, userId).pipe(take(1)).subscribe({
      next: () => this.players.update(players => players.filter(player => player.userId !== userId)),
      error: error => {
        this.errorMessage = error.error?.message || 'Nao foi possivel remover o jogador.';
      },
    });
  }

  availableUsers(): any[] {
    const assignedIds = new Set(this.players().map(player => player.userId));
    return this.users().filter(user => !assignedIds.has(user.id));
  }

  selectedMatch(): any {
    return this.matches().find(match => match.id === this.selectedMatchId());
  }
}