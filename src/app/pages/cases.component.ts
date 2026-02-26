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
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div class="relative w-full sm:w-64">
          <app-icon name="search" [size]="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></app-icon>
          <input type="text" placeholder="Buscar expediente..." class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400">
        </div>
        <div class="flex gap-2">
           <button class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
            <app-icon name="briefcase" [size]="16"></app-icon>
            Filtrar
          </button>
          <button class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
            <app-icon name="file-text" [size]="16"></app-icon>
            Nuevo Caso
          </button>
        </div>
      </div>

      <!-- Cases Grid/List -->
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-slate-600">
            <thead class="bg-slate-50 border-b border-slate-100">
              <tr>
                <th class="px-6 py-4 font-semibold text-slate-800">Expediente / Asunto</th>
                <th class="px-6 py-4 font-semibold text-slate-800">Cliente</th>
                <th class="px-6 py-4 font-semibold text-slate-800">Tipo</th>
                <th class="px-6 py-4 font-semibold text-slate-800">Estado</th>
                <th class="px-6 py-4 font-semibold text-slate-800">Próxima Acción</th>
                <th class="px-6 py-4 font-semibold text-slate-800 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (caseItem of cases(); track caseItem.id) {
                <tr class="hover:bg-slate-50 transition-colors group">
                  <td class="px-6 py-4">
                    <div class="flex items-start gap-3">
                      <div class="mt-1 min-w-[32px] w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                        <app-icon name="scale" [size]="16"></app-icon>
                      </div>
                      <div>
                        <p class="font-semibold text-slate-800">{{ caseItem.title }}</p>
                        <p class="text-xs text-slate-400">Exp: {{ caseItem.id }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                       <img [src]="caseItem.clientAvatar" class="w-6 h-6 rounded-full object-cover">
                       <span class="font-medium">{{ caseItem.client }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span class="px-2.5 py-1 rounded-full text-xs font-medium border" [class]="getTypeClass(caseItem.type)">
                      {{ caseItem.type }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-1.5">
                      <span class="w-2 h-2 rounded-full" [class]="getStatusDot(caseItem.status)"></span>
                      <span class="text-slate-700">{{ caseItem.status }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2 text-slate-500">
                      <app-icon name="calendar" [size]="14"></app-icon>
                      <span>{{ caseItem.nextDate }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <button class="text-indigo-600 hover:text-indigo-800 font-medium text-xs">Ver Detalle</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        
        <!-- Pagination Mock -->
        <div class="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <p class="text-xs text-slate-500">Mostrando 1-5 de 24 casos</p>
          <div class="flex gap-2">
            <button class="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 disabled:opacity-50">
              <app-icon name="chevron-right" class="rotate-180" [size]="16"></app-icon>
            </button>
            <button class="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600">
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
      case 'Laboral': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Penal': return 'bg-red-50 text-red-700 border-red-100';
      case 'Corporativo': return 'bg-slate-50 text-slate-700 border-slate-200';
      case 'Familiar': return 'bg-purple-50 text-purple-700 border-purple-100';
      default: return 'bg-emerald-50 text-emerald-700 border-emerald-100';
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