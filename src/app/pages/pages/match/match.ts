import { DecimalPipe, SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize, take } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { MatchService } from '../../../services/match.service';
import { VenueService } from '../../../services/venue.service';
import { formatLocalizedDate } from '../../../utils/localized-date';

@Component({
  selector: 'app-match',
  imports: [DecimalPipe, SlicePipe, FormsModule, RouterLink],
  templateUrl: './match.html',
  styleUrl: './match.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Match {
  private readonly authService = inject(AuthService);
  private readonly matchService = inject(MatchService);
  private readonly venueService = inject(VenueService);
  readonly user = this.authService.user;

  readonly matches = signal<any[]>([]);
  readonly venues = signal<any[]>([]);
  isEditing = false;
  match = this.emptyMatch();

  constructor() {
    this.loadVenues();
    this.loadMatches();
  }

  loadVenues(): void {
    this.venueService.getAll().pipe(take(1)).subscribe({
      next: venues => this.venues.set(venues),
    });
  }

  loadMatches(): void {
    this.matchService.getAll().pipe(take(1)).subscribe({
      next: matches => this.matches.set(matches),
    });
  }

  createMatch(): void {
    this.matchService.post(this.payload()).pipe(
      take(1),
      finalize(() => this.cancel())
    ).subscribe({
      next: () => this.loadMatches(),
    });
  }

  editMatch(match: any): void {
    this.isEditing = true;
    this.match = {
      ...match,
      matchDate: String(match.matchDate).slice(0, 10),
      startTime: String(match.startTime).slice(0, 5),
      endTime: String(match.endTime).slice(0, 5),
    };
  }

  updateMatch(): void {
    this.matchService.put(this.match.id, this.payload()).pipe(
      take(1),
      finalize(() => this.cancel())
    ).subscribe({
      next: () => this.loadMatches(),
    });
  }

  deleteMatch(id: string): void {
    this.matchService.delete(id).pipe(take(1)).subscribe({
      next: () => this.matches.set(this.matches().filter(match => match.id !== id)),
    });
  }

  cancel(): void {
    this.match = this.emptyMatch();
    this.isEditing = false;
  }

  payload(): any {
    return {
      venueId: this.match.venueId,
      matchDate: this.match.matchDate,
      startTime: this.match.startTime,
      endTime: this.match.endTime,
      hourlyRate: Number(this.match.hourlyRate),
      status: this.match.status,
    };
  }

  statusLabel(status: string): string {
    return {
      open: 'Aberta',
      in_progress: 'Em andamento',
      finished: 'Finalizada',
      cancelled: 'Cancelada',
    }[status] || status;
  }

  formatDate(value: string): string {
    return formatLocalizedDate(value);
  }

  private emptyMatch(): any {
    return {
      id: '',
      venueId: '',
      matchDate: '',
      startTime: '',
      endTime: '',
      hourlyRate: 0,
      status: 'open',
    };
  }
}
