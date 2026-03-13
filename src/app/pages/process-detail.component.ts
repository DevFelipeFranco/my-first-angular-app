import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { IconComponent } from '../components/ui/icons.component';

// Simulated Process Detail Interface
interface ProcessDetail {
    id: string;
    title: string;
    client: string;
    status: 'Activo' | 'Pausado' | 'Cerrado';
    date: Date;
    ciudad: string;
    especialidad: string;
    despacho: string;
    radicado: string;
}

// Associated Action History Interface
interface ProcessAction {
    id: string;
    date: Date;
    type: string;
    description: string;
    status: string;
}

@Component({
    selector: 'app-process-detail',
    standalone: true,
    imports: [CommonModule, IconComponent],
    template: `
    <div class="h-full flex flex-col p-6 space-y-6 max-w-7xl mx-auto">
      
      <!-- Top Navigation & Header -->
      <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
        
        <div class="space-y-4">
          <!-- Back Button -->
          <button 
            (click)="goBack()"
            class="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-200 transition-colors duration-300 transition-colors"
          >
            <div class="p-1.5 rounded-lg bg-slate-100 group-hover:bg-slate-200 transition-colors">
              <app-icon name="chevron-right" class="rotate-180" [size]="16" [strokeWidth]="2.5"></app-icon>
            </div>
            <span>Volver a Mis Procesos</span>
          </button>

          <!-- Title Area -->
          <div class="flex flex-wrap items-center gap-4">
            <h1 class="text-3xl font-extrabold text-slate-900 dark:text-slate-100 transition-colors duration-300 tracking-tight">
              {{ process()?.title || 'Detalle del Expediente' }}
            </h1>
            
            @if (process()) {
              <!-- Status Badge -->
              <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border shadow-sm transition-all"
                    [ngClass]="{
                      'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 dark:shadow-[0_0_10px_rgba(16,185,129,0.1)]': process()?.status === 'Activo',
                      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20 dark:shadow-[0_0_10px_rgba(249,115,22,0.1)]': process()?.status === 'Pausado',
                      'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20': process()?.status === 'Cerrado'
                    }">
                <div class="w-2 h-2 rounded-full"
                     [ngClass]="{
                       'bg-emerald-500 dark:shadow-[0_0_5px_rgba(16,185,129,0.8)]': process()?.status === 'Activo',
                       'bg-amber-500 dark:bg-orange-500 dark:shadow-[0_0_5px_rgba(249,115,22,0.8)]': process()?.status === 'Pausado',
                       'bg-slate-400': process()?.status === 'Cerrado'
                     }"></div>
                {{ process()?.status }}
              </span>
            }
          </div>
        </div>

        <!-- Desktop Action Buttons -->
        <div class="hidden md:flex items-center gap-3">
           <button class="px-4 py-2 bg-white dark:bg-slate-800 transition-colors duration-300 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 shadow-sm flex items-center gap-2">
             <app-icon name="download" [size]="18" [strokeWidth]="2"></app-icon>
             Exportar
           </button>
           <button class="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 dark:shadow-[0_0_15px_rgba(79,70,229,0.4)] hover:shadow-blue-500/50 dark:hover:shadow-[0_0_20px_rgba(79,70,229,0.6)] flex items-center gap-2 group transition-all outline-none">
             <app-icon name="plus" [size]="18" [strokeWidth]="2.5" class="group-hover:scale-110 transition-transform"></app-icon>
             Nueva Actuación
           </button>
        </div>

      </div>

      @if (process()) {
        <!-- Summary Card -->
        <div class="bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl transition-all duration-300 rounded-2xl border border-slate-200 dark:border-slate-800/60 shadow-sm dark:shadow-[0_4px_25px_-5px_rgba(0,0,0,0.5)] overflow-hidden animate-fade-in-up" style="animation-duration: 0.3s;">
          <div class="px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 transition-colors duration-300 bg-slate-50/50 dark:bg-slate-800/30 flex items-center gap-3">
             <div class="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                 <app-icon name="file-text" [size]="16" [strokeWidth]="2"></app-icon>
             </div>
             <h2 class="text-lg font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300">Información General</h2>
          </div>
          
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-12">
              
              <!-- Radicado (Highlighted) -->
              <div class="col-span-1 md:col-span-2 lg:col-span-3 pb-4 border-b border-slate-100 dark:border-slate-800/80 transition-colors duration-300">
                <p class="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-2">
                  <app-icon name="target" [size]="16"></app-icon>
                  Número de Radicado (CPN)
                </p>
                <div class="flex items-center gap-3">
                  <p class="text-2xl font-mono items-center tracking-wider font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-4 py-2 rounded-xl border border-blue-100 dark:border-blue-500/20 inline-block shadow-sm">
                    {{ process()?.radicado }}
                  </p>
                  <button class="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Copiar Radicado">
                    <app-icon name="file-text" [size]="20" [strokeWidth]="2"></app-icon>
                  </button>
                </div>
              </div>

              <!-- Metadata Item -->
              <div>
                <p class="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-2">
                  <app-icon name="briefcase" [size]="16"></app-icon>
                  Despacho Judicial
                </p>
                <p class="text-base font-medium text-slate-900 dark:text-slate-200 transition-colors duration-300">{{ process()?.despacho }}</p>
              </div>

              <!-- Metadata Item -->
              <div>
                <p class="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-2">
                   <app-icon name="scale" [size]="16"></app-icon>
                  Especialidad
                </p>
                <p class="text-base font-medium text-slate-900 dark:text-slate-200 transition-colors duration-300">{{ process()?.especialidad }}</p>
              </div>

              <!-- Metadata Item -->
              <div>
                <p class="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-2">
                  <app-icon name="home" [size]="16"></app-icon>
                  Ciudad
                </p>
                <p class="text-base font-medium text-slate-900 dark:text-slate-200 transition-colors duration-300">{{ process()?.ciudad }}</p>
              </div>

              <!-- Metadata Item -->
              <div>
                <p class="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-2">
                  <app-icon name="users" [size]="16"></app-icon>
                  Cliente Relacionado
                </p>
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                    {{ process()?.client?.charAt(0) }}
                  </div>
                  <p class="text-base font-medium text-slate-900 dark:text-slate-200 transition-colors duration-300">{{ process()?.client }}</p>
                </div>
              </div>
              
              <!-- Metadata Item -->
              <div>
                <p class="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-2">
                  <app-icon name="calendar" [size]="16"></app-icon>
                  Fecha de Creación
                </p>
                <p class="text-base font-medium text-slate-900 dark:text-slate-200 transition-colors duration-300">{{ process()?.date | date:'longDate' }}</p>
              </div>

            </div>
          </div>
        </div>

        <!-- History/Associated Table Section -->
        <div class="bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl transition-all duration-300 rounded-2xl border border-slate-200 dark:border-slate-800/60 shadow-sm dark:shadow-[0_4px_25px_-5px_rgba(0,0,0,0.5)] overflow-hidden animate-fade-in-up" style="animation-duration: 0.4s;">
          <div class="px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 transition-colors duration-300 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
             <div class="flex items-center gap-3">
                 <div class="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                     <app-icon name="activity" [size]="16" [strokeWidth]="2"></app-icon>
                 </div>
                 <h2 class="text-lg font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300">Actuaciones del Radicado</h2>
             </div>
             <!-- Mobile add action button -->
             <button class="md:hidden p-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-sm">
                <app-icon name="plus" [size]="18"></app-icon>
             </button>
          </div>

          <!-- Table View -->
          <div class="overflow-x-auto min-h-[250px]">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50/80 dark:bg-slate-800/50 transition-colors duration-300 border-b border-slate-200 dark:border-slate-800/80 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                  <th class="px-6 py-4 font-semibold">Fecha</th>
                  <th class="px-6 py-4 font-semibold">Actuación / Documento</th>
                  <th class="px-6 py-4 font-semibold hidden sm:table-cell">Descripción</th>
                  <th class="px-6 py-4 font-semibold text-right">Estado</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                @if (actions().length === 0) {
                  <tr>
                    <td colspan="4" class="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                      <div class="flex flex-col items-center justify-center gap-2">
                        <app-icon name="inbox" [size]="32" class="opacity-50"></app-icon>
                        <p>No hay actuaciones registradas para este expediente.</p>
                      </div>
                    </td>
                  </tr>
                }
                
                @for (action of actions(); track action.id) {
                  <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors duration-200 group">
                    <td class="px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {{ action.date | date:'dd/MM/yyyy' }}
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div class="p-2 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-white dark:bg-slate-800 dark:group-hover:bg-slate-700/50 dark:text-slate-400 transition-colors duration-300 group-hover:shadow-sm">
                          <app-icon name="file-text" [size]="16"></app-icon>
                        </div>
                        <span class="font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300">{{ action.type }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-slate-500 dark:text-slate-400 hidden sm:table-cell line-clamp-2 mt-1 border-b-0 leading-relaxed max-w-sm">
                      {{ action.description }}
                    </td>
                    <td class="px-6 py-4 text-right">
                       <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border border-transparent shadow-sm transition-all"
                             [ngClass]="{
                               'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 dark:shadow-[0_0_10px_rgba(16,185,129,0.1)]': action.status === 'Completado',
                               'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20 dark:shadow-[0_0_10px_rgba(59,130,246,0.1)]': action.status === 'En Trámite',
                               'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20': action.status === 'Pendiente'
                             }">
                         {{ action.status }}
                       </span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      } @else {
        <!-- Loading or Not Found State -->
        <div class="flex-1 flex flex-col items-center justify-center text-slate-400">
          <app-icon name="refresh-cw" [size]="32" class="animate-spin mb-4 text-blue-500"></app-icon>
          <p class="font-medium text-slate-500">Cargando detalles del expediente...</p>
        </div>
      }

    </div>
  `
})
export class ProcessDetailComponent implements OnInit {

    private route = inject(ActivatedRoute);
    private router = inject(Router);

    // Application State
    process = signal<ProcessDetail | null>(null);
    actions = signal<ProcessAction[]>([]);

    ngOnInit() {
        // 1. Get the ID from the route path: /judiciales/mis-procesos/:id
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.loadProcessData(id);
            }
        });
    }

    // Navigate back to the list
    goBack() {
        this.router.navigate(['/judiciales/mis-procesos']);
    }

    // Simulate an API call to load specific process details and its history using the ID
    private loadProcessData(id: string) {
        // Fake Timeout for realism
        setTimeout(() => {
            // Fake Process Object
            this.process.set({
                id: id,
                radicado: '11001310300120230012300', // Fake uniform Radicado for demo
                title: id.includes('NUEVO') ? 'Nuevo Expediente Judicial' : 'Demanda Laboral por Despido Injustificado',
                client: 'Empresa Alpha S.A.',
                status: 'Activo',
                date: new Date(Date.now() - 86400000 * 5),
                ciudad: 'Bogotá D.C.',
                especialidad: 'Laboral',
                despacho: 'Juzgado 05 Laboral del Circuito'
            });

            // Fake Actions/History Table mapping to the Radicado
            this.actions.set([
                {
                    id: 'ACT-001',
                    date: new Date(),
                    type: 'Auto Admisorio',
                    description: 'Se admite la demanda principal y se ordena la notificación al demandado.',
                    status: 'Completado'
                },
                {
                    id: 'ACT-002',
                    date: new Date(Date.now() - 86400000 * 2),
                    type: 'Radicación de Demanda',
                    description: 'Presentación formal del escrito de demanda con sus respectivos anexos documentales.',
                    status: 'Completado'
                },
                {
                    id: 'ACT-003',
                    date: new Date(Date.now() + 86400000 * 5),
                    type: 'Audiencia Inicial',
                    description: 'Programación para audiencia de conciliación, decisión de excepciones previas, saneamiento y fijación del litigio.',
                    status: 'Pendiente'
                }
            ]);
        }, 400); // 400ms loading delay
    }
}
