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
    <div class="flex min-h-screen bg-slate-50">
      <!-- Sidebar -->
      <app-sidebar [expanded]="sidebarExpanded()"></app-sidebar>

      <!-- Main Content Wrapper -->
      <div class="flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out"
        [class.ml-64]="sidebarExpanded()" [class.ml-20]="!sidebarExpanded()">
        
        <!-- Top Bar -->
        <header
          class="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button (click)="toggleSidebar()"
              class="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-100">
              <app-icon name="menu" [size]="24"></app-icon>
            </button>
            <h1 class="text-xl font-bold text-slate-800 hidden sm:block">
              {{ currentUser()?.role === 'admin' ? 'Panel de Socio' : 'Espacio de Trabajo' }}
            </h1>
          </div>

          <div class="flex items-center gap-4">
            <button class="p-2 text-slate-400 hover:text-indigo-600 transition-colors relative">
              <app-icon name="bell" [size]="20"></app-icon>
              <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div class="h-8 w-[1px] bg-slate-200"></div>
            <div class="flex items-center gap-3">
              <div class="text-right hidden md:block">
                <p class="text-sm font-semibold text-slate-800">{{ currentUser()?.name }}</p>
                <p class="text-xs text-slate-500 uppercase tracking-wide">
                  {{ currentUser()?.role === 'admin' ? 'Administrador' : 'Abogado' }}
                </p>
              </div>
              <img [src]="currentUser()?.avatar"
                class="w-10 h-10 rounded-full border-2 border-slate-100 shadow-sm object-cover" alt="Avatar">
            </div>
          </div>
        </header>

        <!-- Main Content Area -->
        <main class="flex-1 p-6 overflow-x-hidden">
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
