import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../components/ui/icons.component';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="space-y-6 animate-fade-in">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Gestión de Usuarios</h1>
          <p class="text-slate-500 mt-1">Administra los accesos y monitorea la actividad del equipo legal.</p>
        </div>
        <div class="flex gap-3">
           <button class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
             <app-icon name="file-text" [size]="16"></app-icon>
             Exportar Lista
           </button>
           <button class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
             <app-icon name="users" [size]="16"></app-icon>
             Invitar Abogado
           </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div class="relative w-full sm:w-80">
          <app-icon name="search" [size]="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></app-icon>
          <input 
            type="text" 
            placeholder="Buscar por nombre o email..." 
            [value]="searchTerm()"
            (input)="updateSearch($event)"
            class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
          >
        </div>
        <div class="w-full sm:w-auto flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          <button (click)="filterStatus.set('all')" [class]="getFilterClass('all')" class="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap">Todos</button>
          <button (click)="filterStatus.set('active')" [class]="getFilterClass('active')" class="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap">Activos</button>
          <button (click)="filterStatus.set('blocked')" [class]="getFilterClass('blocked')" class="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap">Bloqueados</button>
        </div>
      </div>

      <!-- Users Table -->
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-slate-600">
            <thead class="bg-slate-50 border-b border-slate-100">
              <tr>
                <th class="px-6 py-4 font-semibold text-slate-800">Usuario</th>
                <th class="px-6 py-4 font-semibold text-slate-800">Rol / Departamento</th>
                <th class="px-6 py-4 font-semibold text-slate-800">Estado</th>
                <th class="px-6 py-4 font-semibold text-slate-800">Última Conexión</th>
                <th class="px-6 py-4 font-semibold text-slate-800 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (user of filteredUsers(); track user.id) {
                <tr class="hover:bg-slate-50 transition-colors group" [class.bg-red-50]="user.isBlocked && false"> <!-- Optional row highlighting -->
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="relative">
                        <img [src]="user.avatar" class="w-10 h-10 rounded-full border border-slate-200 object-cover" [class.grayscale]="user.isBlocked">
                        @if (user.isBlocked) {
                           <div class="absolute -bottom-1 -right-1 bg-red-500 rounded-full p-0.5 border-2 border-white">
                             <app-icon name="lock" [size]="10" class="text-white"></app-icon>
                           </div>
                        }
                      </div>
                      <div>
                        <p class="font-bold text-slate-800" [class.text-slate-500]="user.isBlocked">{{ user.name }}</p>
                        <p class="text-xs text-slate-400">{{ user.email }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div>
                      <span class="block font-medium text-slate-700 capitalize">{{ user.role === 'admin' ? 'Socio Director' : 'Abogado Asociado' }}</span>
                      <span class="text-xs text-slate-400">{{ user.department || 'General' }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    @if (user.isBlocked) {
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-100">
                        Bloqueado
                      </span>
                    } @else {
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        Activo
                      </span>
                    }
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                       <span class="w-2 h-2 rounded-full" 
                        [class]="user.lastConnection === 'En línea' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'"></span>
                       <span class="text-slate-600 font-medium">{{ user.lastConnection }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-right">
                    @if (user.id !== currentUserId()) {
                      <button 
                        (click)="toggleBlock(user.id)"
                        class="px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1 ml-auto"
                        [class]="user.isBlocked 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                          : 'bg-white text-slate-500 border-slate-200 hover:border-red-200 hover:text-red-600 hover:bg-red-50'"
                      >
                        @if (user.isBlocked) {
                          <app-icon name="unlock" [size]="14"></app-icon> Desbloquear
                        } @else {
                          <app-icon name="lock" [size]="14"></app-icon> Bloquear
                        }
                      </button>
                    } @else {
                      <span class="text-xs text-slate-400 italic">Tu cuenta</span>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        
        <div class="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
           <p class="text-xs text-slate-400 text-center">
             Los usuarios bloqueados no podrán iniciar sesión en la plataforma hasta que sean desbloqueados.
           </p>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.5s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class UsersComponent {
  private authService = inject(AuthService);

  users = this.authService.allUsers;
  currentUserId = computed(() => this.authService.currentUser()?.id);

  searchTerm = signal('');
  filterStatus = signal<'all' | 'active' | 'blocked'>('all');

  filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const status = this.filterStatus();

    return this.users().filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term);
      const matchesStatus = status === 'all'
        ? true
        : status === 'blocked' ? user.isBlocked : !user.isBlocked;

      return matchesSearch && matchesStatus;
    });
  });

  updateSearch(event: Event) {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  toggleBlock(userId: string) {
    if (confirm('¿Estás seguro de cambiar el estado de acceso de este usuario?')) {
      this.authService.toggleUserBlock(userId);
    }
  }

  getFilterClass(filter: string): string {
    const isActive = this.filterStatus() === filter;
    if (isActive) {
      return 'bg-indigo-600 text-white shadow-md shadow-indigo-200';
    }
    return 'bg-slate-100 text-slate-600 hover:bg-slate-200';
  }
}