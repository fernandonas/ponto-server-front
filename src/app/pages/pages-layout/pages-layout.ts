import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-pages-layout',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './pages-layout.html',
  styleUrl: './pages-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagesLayout {}
