import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/layout/sidebar.component';
import { BreadcrumbsComponent } from './components/layout/breadcrumbs.component';
import { IconComponent } from './components/ui/icons.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, SidebarComponent, BreadcrumbsComponent, IconComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('my-first-angular-app');

  private authService = inject(AuthService);
  private router = inject(Router);

  sidebarExpanded = signal(true);
  currentUser = this.authService.currentUser;

  // Simple check based on signal; router guard also handles protection but this handles layout
  isLoggedIn = this.authService.currentUser;

  toggleSidebar() {
    this.sidebarExpanded.update(v => !v);
  }
}
