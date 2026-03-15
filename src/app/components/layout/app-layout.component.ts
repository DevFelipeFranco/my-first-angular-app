import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { BreadcrumbsComponent } from './breadcrumbs.component';
import { IconComponent } from '../ui/icons.component';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-app-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, SidebarComponent, BreadcrumbsComponent, IconComponent],
    template: `
    <div class="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <!-- Sidebar -->
      <app-sidebar [expanded]="sidebarExpanded()"></app-sidebar>

      <!-- Main Content Wrapper -->
      <div class="flex-1 flex flex-col h-screen transition-all duration-300 ease-in-out"
        [class.ml-64]="sidebarExpanded()" [class.ml-20]="!sidebarExpanded()">
        
        <!-- Top Bar -->
        <header
          class="flex-shrink-0 sticky top-0 z-40 h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-6 flex items-center justify-between transition-colors duration-300">
          <div class="flex items-center gap-4">
            <button (click)="toggleSidebar()"
              class="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-100">
              <app-icon name="menu" [size]="24"></app-icon>
            </button>
            <h1 class="text-xl font-bold text-slate-800 dark:text-slate-100 hidden sm:block transition-colors duration-300">
              {{ currentUser()?.role === 'admin' ? 'Panel de Socio' : 'Espacio de Trabajo' }}
            </h1>
          </div>

          <div class="flex items-center gap-4">
            <button class="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors relative">
              <app-icon name="bell" [size]="20"></app-icon>
              <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>
            </button>
            <div class="h-8 w-[1px] bg-slate-200 dark:bg-slate-700"></div>
            <div class="flex items-center gap-3">
              <div class="text-right hidden md:block">
                <p class="text-sm font-semibold text-slate-800 dark:text-slate-100 transition-colors duration-300">{{ currentUser()?.name }}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  {{ currentUser()?.role === 'admin' ? 'Administrador' : 'Abogado' }}
                </p>
              </div>
              <img [src]="currentUser()?.avatar"
                class="w-10 h-10 rounded-full border-2 border-slate-100 dark:border-slate-800 shadow-sm object-cover transition-colors duration-300" alt="Avatar">
            </div>
          </div>
        </header>

        <!-- Main Content Area — único scrollbar de la app -->
        <main class="flex-1 overflow-y-auto overflow-x-hidden p-6">
          <app-breadcrumbs></app-breadcrumbs>
          <router-outlet></router-outlet>
        </main>

      </div>
    </div>
  `
})
export class AppLayoutComponent {
    private authService = inject(AuthService);

    sidebarExpanded = signal(true);
    currentUser = this.authService.currentUser;

    toggleSidebar() {
        this.sidebarExpanded.update(v => !v);
    }
}
