import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [FormsModule, RouterLink],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly email = signal('');
  readonly password = signal('');
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');

  submit(): void {
    this.errorMessage.set('');
    this.isSubmitting.set(true);

    this.authService.login({
      email: this.email().trim(),
      password: this.password(),
    }).subscribe({
      next: () => this.router.navigateByUrl('/dice'),
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(error.error?.message || 'Nao foi possivel entrar.');
        this.isSubmitting.set(false);
      },
      complete: () => this.isSubmitting.set(false),
    });
  }
}
