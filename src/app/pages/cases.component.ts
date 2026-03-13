import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../components/ui/icons.component';

@Component({
  selector: 'app-cases',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="space-y-6 animate-fade-in">
      
      <!-- Toolbar -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl transition-all duration-300 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)]">
        <div class="relative w-full sm:w-72 group">
          <app-icon name="search" [size]="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"></app-icon>
          <input type="text" placeholder="Buscar expediente..." class="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-500 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-300 hover:dark:bg-slate-800/80">
        </div>
        <div class="flex gap-3">
           <button class="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700/80 hover:dark:text-white transition-all duration-300 group">
            <app-icon name="briefcase" [size]="16" class="text-slate-400 group-hover:text-indigo-500 transition-colors"></app-icon>
            Filtrar
          </button>
          <button class="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-500 transition-all duration-300 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 hover:-translate-y-0.5">
            <app-icon name="file-text" [size]="16"></app-icon>
            Nuevo Caso
          </button>
        </div>
      </div>

      <!-- Cases Grid/List -->
      <div class="bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl transition-all duration-300 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)] overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-slate-600">
            <thead class="bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800/60 transition-colors duration-300 backdrop-blur-sm">
              <tr>
                <th class="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200 transition-colors duration-300">Expediente / Asunto</th>
                <th class="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200 transition-colors duration-300">Cliente</th>
                <th class="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200 transition-colors duration-300">Tipo</th>
                <th class="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200 transition-colors duration-300">Estado</th>
                <th class="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200 transition-colors duration-300">Próxima Acción</th>
                <th class="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200 transition-colors duration-300 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 dark:divide-slate-800/40">
              @for (caseItem of cases(); track caseItem.id) {
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all duration-300 group cursor-pointer">
                  <td class="px-6 py-4">
                    <div class="flex items-start gap-3">
                      <div class="mt-1 min-w-[32px] w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 dark:group-hover:bg-indigo-500/10 transition-all duration-300 border border-transparent dark:border-slate-700/50 dark:group-hover:border-indigo-500/20">
                        <app-icon name="scale" [size]="16"></app-icon>
                      </div>
                      <div>
                        <p class="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors duration-300">{{ caseItem.title }}</p>
                        <p class="text-[11px] font-medium tracking-wide text-slate-400 dark:text-slate-500 uppercase mt-0.5">Exp: {{ caseItem.id }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                       <img [src]="caseItem.clientAvatar" class="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-sm">
                       <span class="font-medium text-slate-800 dark:text-slate-300 group-hover:dark:text-slate-200 transition-colors duration-300">{{ caseItem.client }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span class="px-2.5 py-1.5 rounded-lg text-xs font-bold tracking-wide border dark:backdrop-blur-md" [class]="getTypeClass(caseItem.type)">
                      {{ caseItem.type }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <span class="relative flex h-2.5 w-2.5">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-30" [class]="getStatusDot(caseItem.status)"></span>
                        <span class="relative inline-flex rounded-full h-2.5 w-2.5" [class]="getStatusDot(caseItem.status)"></span>
                      </span>
                      <span class="text-slate-700 dark:text-slate-300 font-medium group-hover:dark:text-slate-200 transition-colors duration-300">{{ caseItem.status }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium tracking-wide text-[13px]">
                      <app-icon name="calendar" [size]="14" class="text-slate-400 dark:text-slate-500"></app-icon>
                      <span>{{ caseItem.nextDate }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <button class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-bold text-xs uppercase tracking-wider transition-colors duration-300 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0">Ver Detalle <app-icon name="chevron-right" [size]="12" class="inline ml-1"></app-icon></button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/20 transition-colors duration-300 flex items-center justify-between">
          <p class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">Mostrando 1-5 de 24 casos</p>
          <div class="flex gap-1.5">
            <button class="p-1.5 rounded-lg border border-transparent hover:bg-white dark:hover:bg-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-50 transition-all duration-300 shadow-sm hover:shadow">
              <app-icon name="chevron-right" class="rotate-180" [size]="16"></app-icon>
            </button>
            <button class="p-1.5 rounded-lg border border-transparent hover:bg-white dark:hover:bg-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-50 transition-all duration-300 shadow-sm hover:shadow">
              <app-icon name="chevron-right" [size]="16"></app-icon>
            </button>
          </div>
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
export class CasesComponent {
  cases = signal([
    { 
      id: 'EXP-2024-001', 
      title: 'Demanda Laboral vs TechCorp', 
      client: 'Roberto Gómez', 
      clientAvatar: 'https://picsum.photos/seed/roberto/50/50',
      type: 'Laboral', 
      status: 'En Proceso', 
      nextDate: '24 Oct 2024' 
    },
    { 
      id: 'EXP-2024-045', 
      title: 'Divorcio Contencioso', 
      client: 'Ana Martínez', 
      clientAvatar: 'https://picsum.photos/seed/ana/50/50',
      type: 'Familiar', 
      status: 'Sentencia', 
      nextDate: '02 Nov 2024' 
    },
    { 
      id: 'EXP-2023-892', 
      title: 'Fusión Empresarial G&S', 
      client: 'Grupo G&S', 
      clientAvatar: 'https://picsum.photos/seed/group/50/50',
      type: 'Corporativo', 
      status: 'Revisión', 
      nextDate: '15 Oct 2024' 
    },
    { 
      id: 'EXP-2024-112', 
      title: 'Defensa Penal - Caso Vial', 
      client: 'Carlos Ruiz', 
      clientAvatar: 'https://picsum.photos/seed/carlos/50/50',
      type: 'Penal', 
      status: 'Instrucción', 
      nextDate: '20 Oct 2024' 
    },
    { 
      id: 'EXP-2024-088', 
      title: 'Contrato de Arrendamiento Comercial', 
      client: 'Inmobiliaria Centro', 
      clientAvatar: 'https://picsum.photos/seed/inmo/50/50',
      type: 'Civil', 
      status: 'Pendiente', 
      nextDate: '12 Oct 2024' 
    }
  ]);

  getTypeClass(type: string): string {
    switch (type) {
      case 'Laboral': return 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-500/20 dark:shadow-[inset_0_0_12px_rgba(59,130,246,0.1)]';
      case 'Penal': return 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-500/20 dark:shadow-[inset_0_0_12px_rgba(244,63,94,0.1)]';
      case 'Corporativo': return 'bg-slate-100 dark:bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-500/20 dark:shadow-[inset_0_0_12px_rgba(148,163,184,0.1)]';
      case 'Familiar': return 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-100 dark:border-purple-500/20 dark:shadow-[inset_0_0_12px_rgba(168,85,247,0.1)]';
      default: return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20 dark:shadow-[inset_0_0_12px_rgba(16,185,129,0.1)]';
    }
  }

  getStatusDot(status: string): string {
    switch (status) {
      case 'En Proceso': return 'bg-blue-500';
      case 'Sentencia': return 'bg-emerald-500';
      case 'Instrucción': return 'bg-orange-500';
      case 'Pendiente': return 'bg-slate-400';
      default: return 'bg-indigo-500';
    }
  }
}