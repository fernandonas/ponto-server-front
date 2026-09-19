import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize, take } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { VenueService } from '../../../services/venue.service';

@Component({
  selector: 'app-venues-page',
  imports: [DecimalPipe, FormsModule],
  templateUrl: './venues-page.html',
  styleUrl: './venues-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VenuesPage {
  private readonly authService = inject(AuthService);
  private readonly venueService = inject(VenueService);
  readonly user = this.authService.user;
  isEditing: boolean = false;
  isFormOpen: boolean = false;
  venuesSimple = signal<any[]>([]);

  venues = signal<any[]>([]);
  venue = {
    id: '',
    name: '',
    address: '',
    hourlyRate: 0
  };
selectedVenueId: any;

  constructor() {
    this.getLocal();
  }

  getLocal(): void {
    this.venueService.getAll()
      .pipe(
        take(1),
        finalize(() => { this.cancel(); })
      ).subscribe({
        next: (venues: any) => {
          this.venues.set(venues);
        }
      });
  }

  deleteLocal(id: string): void {
    this.venueService.delete(id)
      .pipe(
        take(1),
        finalize(() => { this.cancel(); }))
      .subscribe({
        next: () => {
          this.venues.set(this.venues().filter(venue => venue.id !== id));
        }
      });
  }

  cancel(): void {
    this.venue = {
      id: '',
      name: '',
      address: '',
      hourlyRate: 0
    }
    this.isEditing = false;
    this.isFormOpen = false;
  }

  toggleForm(): void {
    if (this.isFormOpen) {
      this.cancel();
      return;
    }

    this.isEditing = false;
    this.isFormOpen = true;
  }


  createVenue(): void {
    this.venueService.post(this.payload())
      .pipe(
        take(1),
        finalize(() => { this.cancel();}))
      .subscribe({ next: () => this.getLocal() });
  }

  editVenue(venue: any) {
    this.isEditing = true;
    this.isFormOpen = true;
    this.venue = { ...venue };
  }

  updateVenue(): void {

    this.venueService.put(this.venue.id, this.payload())
      .pipe(
        take(1),
        finalize(() => {
          this.isEditing = false;
          this.cancel();
        })
      ).subscribe({ next: () => this.getLocal() });
  }

  payload(): any {
    return {
      name: this.venue.name,
      address: this.venue.address || null,
      hourlyRate: Number(this.venue.hourlyRate)
    };
  }
}
