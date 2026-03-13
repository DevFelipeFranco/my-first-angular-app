import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './components/ui/toast.component';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('my-first-angular-app');
  private themeService = inject(ThemeService);
}
