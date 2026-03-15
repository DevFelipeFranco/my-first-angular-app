import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../components/ui/icons.component';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="flex flex-col space-y-6 max-w-7xl mx-auto animate-fade-in">
      
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100 transition-colors duration-300 tracking-tight">Gestión de Usuarios</h1>
          <p class="text-slate-500 mt-1">Administra los accesos y monitorea la actividad del equipo legal.</p>
        </div>
        <div class="flex items-center gap-3">
           <button class="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl border border-slate-200 dark:border-slate-800/60 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
             <app-icon name="download" [size]="18" [strokeWidth]="2"></app-icon>
             <span>Exportar</span>
           </button>
           <button class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 transition-all outline-none">
             <app-icon name="plus" [size]="18" [strokeWidth]="2.5"></app-icon>
             <span>Invitar Abogado</span>
           </button>
        </div>
      </div>

      <!-- Main Toolbar (Integrated style from MyProcesses) -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl p-4 rounded-2xl border border-slate-200 dark:border-slate-800/60 shadow-sm">
        <!-- Search & Filter Left -->
        <div class="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div class="relative group w-full sm:w-80">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <app-icon name="search" [size]="15" class="text-slate-400 group-focus-within:text-blue-500 transition-colors"></app-icon>
            </div>
            <input 
              type="text" 
              placeholder="Buscar por nombre o email..." 
              [ngModel]="searchTerm()"
              (ngModelChange)="searchTerm.set($event)"
              class="w-full pl-9 pr-4 py-2 bg-slate-100 focus:bg-white dark:bg-slate-900/50 dark:focus:bg-slate-910 border border-transparent focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-sm outline-none text-slate-800 dark:text-slate-200 placeholder-slate-400 transition-all"
            >
          </div>
          
          <div class="w-px h-6 bg-slate-200 dark:bg-slate-800 hidden sm:block mx-1"></div>
          
          <!-- Status Chips Filters -->
          <div class="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900/60 rounded-xl self-stretch">
            <button (click)="filterStatus.set('all')" 
              [class]="getFilterClass('all')"
              class="px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap">
              Todos
            </button>
            <button (click)="filterStatus.set('active')" 
              [class]="getFilterClass('active')"
              class="px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap">
              Activos
            </button>
            <button (click)="filterStatus.set('blocked')" 
              [class]="getFilterClass('blocked')"
              class="px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap">
              Bloqueados
            </button>
          </div>
        </div>

        <!-- Right Tool Indicators -->
        <div class="hidden lg:flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
           <span class="flex items-center gap-1.5">
             <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
             {{ activeCount() }} En línea
           </span>
           <div class="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></div>
           <span>Total: {{ filteredUsers().length }}</span>
        </div>
      </div>

      <!-- Users Table Redesign -->
      <div class="bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-800/60 shadow-sm dark:shadow-[0_4px_25px_-5px_rgba(0,0,0,0.5)] overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <th class="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Usuario</th>
                <th class="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Estado de Acceso</th>
                <th class="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Rol & Departamento</th>
                <th class="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Última Conexión</th>
                <th class="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
              @for (user of filteredUsers(); track user.id) {
                <tr class="group hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-all duration-200 relative">
                  <!-- User Info -->
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3.5">
                      <div class="relative flex-shrink-0">
                        <div class="absolute inset-0 bg-blue-500/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <img [src]="user.avatar" 
                          class="relative w-11 h-11 rounded-full border-2 border-white dark:border-slate-800 shadow-sm object-cover transition-transform group-hover:scale-105" 
                          [class.grayscale]="user.isBlocked">
                        @if (user.isBlocked) {
                           <div class="absolute -bottom-0.5 -right-0.5 bg-rose-500 rounded-full p-1 border-2 border-white dark:border-slate-900 shadow-sm animate-in zoom-in duration-300">
                             <app-icon name="lock" [size]="10" class="text-white" [strokeWidth]="3"></app-icon>
                           </div>
                        }
                      </div>
                      <div class="min-w-0">
                        <p class="font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" 
                           [class.text-slate-400]="user.isBlocked">
                          {{ user.name }}
                        </p>
                        <p class="text-xs text-slate-400 font-medium truncate">{{ user.email }}</p>
                      </div>
                    </div>
                  </td>

                  <!-- Status Badge -->
                  <td class="px-6 py-4 text-center">
                    <div class="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border shadow-sm"
                      [ngClass]="{
                        'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-510/10 dark:text-rose-400 dark:border-rose-500/20': user.isBlocked,
                        'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20': !user.isBlocked
                      }">
                      <div class="w-1.5 h-1.5 rounded-full mr-2" [class.bg-rose-500]="user.isBlocked" [class.bg-emerald-500]="!user.isBlocked"></div>
                      {{ user.isBlocked ? 'Inactivo' : 'Acceso Total' }}
                    </div>
                  </td>

                  <!-- Role & Dept -->
                  <td class="px-6 py-4">
                    <div class="flex flex-col">
                      <span class="text-sm font-bold text-slate-700 dark:text-slate-200">{{ user.role === 'admin' ? 'Socio Director' : 'Abogado Asociado' }}</span>
                      <div class="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                        <app-icon name="landmark" [size]="10"></app-icon>
                        {{ user.department || 'Dpto. General' }}
                      </div>
                    </div>
                  </td>

                  <!-- Last Connection -->
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2.5">
                       <span class="w-2 h-2 rounded-full shadow-sm" 
                        [class]="user.lastConnection === 'En línea' ? 'bg-emerald-500 shadow-emerald-500/40 animate-pulse' : 'bg-slate-300 dark:bg-slate-700'"></span>
                       <span class="text-sm font-semibold text-slate-600 dark:text-slate-300">{{ user.lastConnection }}</span>
                    </div>
                  </td>

                  <!-- Actions -->
                  <td class="px-6 py-4 text-right">
                    @if (user.id !== currentUserId()) {
                      <button 
                        (click)="toggleBlock(user.id)"
                        class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all hover:shadow-md"
                        [class]="user.isBlocked 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-500 hover:text-white dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 dark:hover:bg-emerald-500 dark:hover:text-white' 
                          : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 hover:border-rose-400 dark:border-slate-700 dark:hover:border-rose-500/50 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 dark:hover:text-rose-400'"
                      >
                        <app-icon [name]="user.isBlocked ? 'unlock' : 'lock'" [size]="14" [strokeWidth]="2.5"></app-icon> 
                        <span>{{ user.isBlocked ? 'Desbloquear' : 'Bloquear' }}</span>
                      </button>
                    } @else {
                      <span class="flex items-center justify-end gap-1.5 text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded-lg">
                        <app-icon name="user" [size]="10"></app-icon> Tu Cuenta
                      </span>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        
        <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/20 text-center">
           <p class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center justify-center gap-2">
             <app-icon name="info" [size]="12"></app-icon>
             El bloqueo de acceso es instantáneo y cerrará cualquier sesión activa del usuario.
           </p>
        </div>
      </div>

    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
  `]
})
export class UsersComponent {
  private authService = inject(AuthService);

  users = this.authService.allUsers;
  currentUserId = computed(() => this.authService.currentUser()?.id);

  searchTerm = signal('');
  filterStatus = signal<'all' | 'active' | 'blocked'>('all');

  activeCount = computed(() => 
    this.users().filter(u => u.lastConnection === 'En línea').length
  );

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

  toggleBlock(userId: string | number) {
    if (confirm('¿Estás seguro de cambiar el estado de acceso de este usuario?')) {
      this.authService.toggleUserBlock(userId);
    }
  }

  getFilterClass(filter: string): string {
    const isActive = this.filterStatus() === filter;
    if (isActive) {
      return 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700';
    }
    return 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50';
  }
}