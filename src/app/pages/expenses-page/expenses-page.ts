import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-expenses-page',
  imports: [RouterLink],
  templateUrl: './expenses-page.html',
  styleUrl: './expenses-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpensesPage {
  private readonly authService = inject(AuthService);

  readonly user = this.authService.user;

  constructor() { }

  logout(): void {
    this.authService.logout();
  }
}
