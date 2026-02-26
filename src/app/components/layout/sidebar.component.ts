import { Component, input, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { IconComponent } from '../ui/icons.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  template: `
    <aside 
      class="fixed inset-y-0 left-0 z-50 bg-slate-900 text-slate-300 transition-all duration-300 ease-in-out shadow-xl flex flex-col"
      [class.w-64]="expanded()"
      [class.w-20]="!expanded()"
    >
      <!-- Logo Area -->
      <div class="h-20 flex items-center justify-center border-b border-slate-800">
        <div class="flex items-center gap-3 overflow-hidden whitespace-nowrap px-4 transition-all">
          <div class="min-w-[32px] w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/30">
            N
          </div>
          <span class="font-bold text-xl text-white tracking-wide transition-opacity duration-300"
            [class.opacity-100]="expanded()"
            [class.opacity-0]="!expanded()"
            [class.hidden]="!expanded()"
          >
            NEXUS LEGAL
          </span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 py-6 px-3 space-y-2 overflow-y-auto overflow-x-hidden">
        
        <a routerLink="/dashboard" routerLinkActive="bg-indigo-600 text-white shadow-lg shadow-indigo-900/50" 
           class="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-800 transition-all group relative">
          <app-icon name="home" [size]="20" class="min-w-[20px]"></app-icon>
          <span class="whitespace-nowrap transition-opacity duration-300" 
                [class.opacity-0]="!expanded()" [class.hidden]="!expanded()">
            Panel General
          </span>
          @if (!expanded()) {
            <div class="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap text-white">
              Panel General
            </div>
          }
        </a>

        <!-- Admin Only Section -->
        @if (isAdmin()) {
          <div class="my-4 border-t border-slate-800 pt-4" [class.hidden]="!expanded()">
             <p class="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Administración</p>
          </div>
          
          <a routerLink="/users" routerLinkActive="bg-indigo-600 text-white shadow-lg shadow-indigo-900/50" 
             class="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-800 transition-all group relative">
            <app-icon name="shield" [size]="20" class="min-w-[20px]"></app-icon>
            <span class="whitespace-nowrap transition-opacity duration-300" 
                  [class.opacity-0]="!expanded()" [class.hidden]="!expanded()">
              Gestión Usuarios
            </span>
            @if (!expanded()) {
               <div class="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap text-white">
                Gestión Usuarios
              </div>
            }
          </a>
        }

        <div [class.my-4]="isAdmin()" [class.border-t]="isAdmin()" [class.border-slate-800]="isAdmin()" [class.pt-4]="isAdmin()">
          <p *ngIf="expanded() && isAdmin()" class="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Operación</p>
          
          <a routerLink="/cases" routerLinkActive="bg-indigo-600 text-white shadow-lg shadow-indigo-900/50" 
             class="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-800 transition-all group relative">
            <app-icon name="briefcase" [size]="20" class="min-w-[20px]"></app-icon>
            <span class="whitespace-nowrap transition-opacity duration-300" 
                  [class.opacity-0]="!expanded()" [class.hidden]="!expanded()">
              Expedientes
            </span>
            @if (!expanded()) {
               <div class="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap text-white">
                Expedientes
              </div>
            }
          </a>

          <a routerLink="/activities" routerLinkActive="bg-indigo-600 text-white shadow-lg shadow-indigo-900/50" 
             class="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-800 transition-all group relative">
            <app-icon name="activity" [size]="20" class="min-w-[20px]"></app-icon>
            <span class="whitespace-nowrap transition-opacity duration-300" 
                  [class.opacity-0]="!expanded()" [class.hidden]="!expanded()">
              Actividad
            </span>
            @if (!expanded()) {
               <div class="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap text-white">
                Actividad
              </div>
            }
          </a>

          <a routerLink="/clients" routerLinkActive="bg-indigo-600 text-white shadow-lg shadow-indigo-900/50" 
             class="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-800 transition-all group relative">
            <app-icon name="users" [size]="20" class="min-w-[20px]"></app-icon>
            <span class="whitespace-nowrap transition-opacity duration-300" 
                  [class.opacity-0]="!expanded()" [class.hidden]="!expanded()">
              Clientes
            </span>
            @if (!expanded()) {
               <div class="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap text-white">
                Clientes
              </div>
            }
          </a>

          <a routerLink="/calendar" routerLinkActive="bg-indigo-600 text-white shadow-lg shadow-indigo-900/50" 
             class="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-800 transition-all group relative">
            <app-icon name="calendar" [size]="20" class="min-w-[20px]"></app-icon>
            <span class="whitespace-nowrap transition-opacity duration-300" 
                  [class.opacity-0]="!expanded()" [class.hidden]="!expanded()">
              Agenda Judicial
            </span>
             @if (!expanded()) {
               <div class="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap text-white">
                Agenda Judicial
              </div>
            }
          </a>

          <a routerLink="/documents" routerLinkActive="bg-indigo-600 text-white shadow-lg shadow-indigo-900/50" 
             class="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-800 transition-all group relative">
            <app-icon name="file-text" [size]="20" class="min-w-[20px]"></app-icon>
            <span class="whitespace-nowrap transition-opacity duration-300" 
                  [class.opacity-0]="!expanded()" [class.hidden]="!expanded()">
              Documentos
            </span>
             @if (!expanded()) {
               <div class="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap text-white">
                Documentos
              </div>
            }
          </a>
        </div>

        <!-- Judiciales Module (Expandable) -->
        <div class="my-4 border-t border-slate-800 pt-4">
          <p *ngIf="expanded()" class="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Módulo Legal</p>

          <div class="space-y-1">
            <button 
              (click)="toggleJudiciales()"
              class="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-slate-800 transition-all group relative"
              [class.bg-slate-800]="judicialesExpanded()"
              [class.text-indigo-400]="judicialesExpanded()"
            >
              <div class="flex items-center gap-3">
                <app-icon name="gavel" [size]="20" class="min-w-[20px] transition-colors" [class.text-indigo-400]="judicialesExpanded()"></app-icon>
                <span class="whitespace-nowrap transition-opacity duration-300 font-medium" 
                      [class.opacity-0]="!expanded()" [class.hidden]="!expanded()">
                  Judiciales
                </span>
              </div>
              @if (expanded()) {
                <app-icon name="chevron-down" [size]="16" class="text-slate-500 transition-transform duration-300" [class.rotate-180]="judicialesExpanded()"></app-icon>
              }
              
              @if (!expanded()) {
                <div class="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap text-white">
                  Judiciales
                </div>
              }
            </button>

            <!-- Submenu -->
            <div class="overflow-hidden transition-all duration-300 ease-in-out"
                 [class.max-h-0]="!judicialesExpanded() || !expanded()"
                 [class.max-h-40]="judicialesExpanded() && expanded()"
                 [class.opacity-0]="!judicialesExpanded() || !expanded()"
                 [class.opacity-100]="judicialesExpanded() && expanded()">
              <div class="pl-11 pr-3 py-1 space-y-1">
                <a routerLink="/judiciales/mis-procesos" routerLinkActive="text-indigo-400 font-semibold" 
                   class="block py-2 text-sm text-slate-400 hover:text-indigo-300 transition-colors">
                  Mis Procesos
                </a>
                <!-- Future submenus could go here -->
              </div>
            </div>
          </div>
        </div>

      </nav>

      <!-- Toggle & User -->
      <div class="p-3 border-t border-slate-800 mt-auto">
        
        <a routerLink="/settings" routerLinkActive="text-white bg-slate-800"
          class="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all group relative mb-2">
           <app-icon name="settings" [size]="20" class="min-w-[20px]"></app-icon>
           <span class="whitespace-nowrap transition-opacity duration-300" 
                 [class.opacity-0]="!expanded()" [class.hidden]="!expanded()">
             Configuración
           </span>
        </a>

        <button (click)="handleLogout()" 
          class="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 text-slate-400 transition-all group relative overflow-hidden">
           <app-icon name="logout" [size]="20" class="min-w-[20px]"></app-icon>
           <span class="whitespace-nowrap transition-opacity duration-300" 
                 [class.opacity-0]="!expanded()" [class.hidden]="!expanded()">
             Cerrar Sesión
           </span>
            @if (!expanded()) {
             <div class="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap text-white">
              Salir
            </div>
          }
        </button>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  expanded = input.required<boolean>();

  private authService = inject(AuthService);
  private router = inject(Router);

  isAdmin = computed(() => this.authService.currentUser()?.role === 'admin');

  // State for expandable modules
  judicialesExpanded = signal(false);

  toggleJudiciales() {
    // If opening while sidebar is collapsed, we might want to expand the whole sidebar first
    // For now, just toggle the boolean. It's hidden when collapsed via CSS.
    this.judicialesExpanded.update((v: boolean) => !v);
  }

  handleLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}