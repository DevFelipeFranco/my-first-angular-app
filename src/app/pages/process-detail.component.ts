import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IconComponent } from '../components/ui/icons.component';
import { RadicadoService, RadicadoDto } from '../services/radicado.service';

// Associated Action History Interface (mock, for future API integration)
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

      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-3">
          <!-- Back Button -->
          <button (click)="goBack()"
            class="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
            <div class="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
              <app-icon name="chevron-right" class="rotate-180" [size]="16" [strokeWidth]="2.5"></app-icon>
            </div>
            <span>Volver a Mis Procesos</span>
          </button>

          @if (process()) {
            <div class="flex flex-wrap items-center gap-3">
              <h1 class="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                Expediente Judicial
              </h1>
              <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border shadow-sm"
                [ngClass]="{
                  'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20': process()!.status === 'COMPLETED' || process()!.status === 'SUCCESS',
                  'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20': process()!.status === 'PENDING',
                  'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20': process()!.status === 'IN_PROGRESS',
                  'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20': process()!.status === 'ERROR' || process()!.status === 'FAILED',
                  'bg-slate-100 text-slate-600 border-slate-200': !['COMPLETED','SUCCESS','PENDING','IN_PROGRESS','ERROR','FAILED'].includes(process()!.status)
                }">
                <div class="w-2 h-2 rounded-full"
                  [ngClass]="{
                    'bg-emerald-500': process()!.status === 'COMPLETED' || process()!.status === 'SUCCESS',
                    'bg-amber-500': process()!.status === 'PENDING',
                    'bg-blue-500': process()!.status === 'IN_PROGRESS',
                    'bg-rose-500': process()!.status === 'ERROR' || process()!.status === 'FAILED',
                    'bg-slate-400': !['COMPLETED','SUCCESS','PENDING','IN_PROGRESS','ERROR','FAILED'].includes(process()!.status)
                  }">
                </div>
                {{ process()!.status }}
              </span>
            </div>
          }
        </div>

        <!-- Action Buttons -->
        <div class="hidden md:flex items-center gap-3">
          <button class="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm flex items-center gap-2 transition-colors">
            <app-icon name="download" [size]="18" [strokeWidth]="2"></app-icon>Exportar
          </button>
          <button class="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all hover:-translate-y-0.5 outline-none">
            <app-icon name="plus" [size]="18" [strokeWidth]="2.5"></app-icon>Nueva Actuación
          </button>
        </div>
      </div>

      @if (isLoading()) {
        <!-- Loading State -->
        <div class="flex-1 flex flex-col items-center justify-center gap-3 text-slate-400">
          <app-icon name="refresh-cw" [size]="32" class="animate-spin text-blue-500"></app-icon>
          <p class="font-medium text-slate-500">Cargando detalles del expediente...</p>
        </div>
      } @else if (process()) {

        <!-- ─── Información General Card (estilo imagen) ─── -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/60 rounded-2xl overflow-hidden shadow-sm">

          <!-- Card Header -->
          <div class="px-6 py-4 bg-slate-100 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-700/60 flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 flex items-center justify-center shadow-sm">
              <app-icon name="file-text" [size]="16" [strokeWidth]="2"></app-icon>
            </div>
            <h2 class="text-base font-bold text-slate-800 dark:text-slate-100">Información General</h2>
          </div>

          <!-- Card Body -->
          <div class="px-6 py-6 bg-slate-900/3 dark:bg-slate-900/60 space-y-6">

            <!-- Número de Radicado (CPN) -->
            <div class="space-y-2">
              <p class="text-xs font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <app-icon name="target" [size]="13"></app-icon>Número de Radicado (CPN)
              </p>
              <div class="flex items-center gap-3">
                <div class="px-4 py-2.5 rounded-xl border-2 border-blue-500/60 dark:border-blue-500/40 bg-blue-50 dark:bg-blue-500/5 inline-block">
                  <span class="font-mono text-lg font-bold tracking-widest text-blue-700 dark:text-blue-400">
                    {{ process()!.radicadoNumber }}
                  </span>
                </div>
                <button class="p-2 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors" title="Copiar Radicado">
                  <app-icon name="copy" [size]="18" [strokeWidth]="2"></app-icon>
                </button>
              </div>
            </div>

            <!-- Divider -->
            <div class="border-t border-slate-100 dark:border-slate-800"></div>

            <!-- Metadata grid — row 1 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-6">

              <div class="space-y-1">
                <p class="text-xs font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                  <app-icon name="landmark" [size]="13"></app-icon>Despacho Judicial
                </p>
                <p class="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug">{{ process()!.despacho }}</p>
              </div>

              <div class="space-y-1">
                <p class="text-xs font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                  <app-icon name="map-pin" [size]="13"></app-icon>Departamento / Ciudad
                </p>
                <p class="text-sm font-bold text-slate-800 dark:text-slate-100">{{ process()!.departamento }}</p>
              </div>

              <div class="space-y-1">
                <p class="text-xs font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                  <app-icon name="activity" [size]="13"></app-icon>Estado
                </p>
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border"
                  [ngClass]="{
                    'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20': process()!.status === 'COMPLETED' || process()!.status === 'SUCCESS',
                    'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20': process()!.status === 'PENDING',
                    'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20': process()!.status === 'IN_PROGRESS',
                    'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20': process()!.status === 'ERROR' || process()!.status === 'FAILED',
                    'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-400': !['COMPLETED','SUCCESS','PENDING','IN_PROGRESS','ERROR','FAILED'].includes(process()!.status)
                  }">
                  <div class="w-1.5 h-1.5 rounded-full"
                    [ngClass]="{
                      'bg-emerald-500': process()!.status === 'COMPLETED' || process()!.status === 'SUCCESS',
                      'bg-amber-500': process()!.status === 'PENDING',
                      'bg-blue-500': process()!.status === 'IN_PROGRESS',
                      'bg-rose-500': process()!.status === 'ERROR' || process()!.status === 'FAILED',
                      'bg-slate-400': !['COMPLETED','SUCCESS','PENDING','IN_PROGRESS','ERROR','FAILED'].includes(process()!.status)
                    }">
                  </div>
                  {{ process()!.status }}
                </span>
              </div>
            </div>

            <!-- Metadata grid — row 2 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-6">
              <div class="space-y-1">
                <p class="text-xs font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                  <app-icon name="calendar" [size]="13"></app-icon>Fecha de Radicación
                </p>
                <p class="text-sm font-bold text-slate-800 dark:text-slate-100">{{ process()!.processDate | date:'MMMM d, yyyy' }}</p>
              </div>

              <div class="space-y-1">
                <p class="text-xs font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                  <app-icon name="clock" [size]="13"></app-icon>Última Actuación
                </p>
                <p class="text-sm font-bold text-slate-800 dark:text-slate-100">{{ process()!.lastActionDate | date:'MMMM d, yyyy' }}</p>
              </div>

              <div class="space-y-1">
                <p class="text-xs font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                  <app-icon name="refresh-cw" [size]="13"></app-icon>Última Actualización
                </p>
                <p class="text-sm font-bold text-slate-800 dark:text-slate-100">{{ process()!.updatedAt | date:'dd MMM yyyy, HH:mm' }}</p>
              </div>
            </div>

          </div>
        </div>


        <!-- ─── Sujetos Procesales ─── -->
        @if (process()!.sujetosProcesales) {
          <div class="bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl border border-slate-200 dark:border-slate-800/60 rounded-2xl overflow-hidden shadow-sm">
            <div class="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/30 flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <app-icon name="users" [size]="16" [strokeWidth]="2"></app-icon>
              </div>
              <h2 class="text-base font-bold text-slate-800 dark:text-slate-200">Sujetos Procesales</h2>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                @for (parte of parseSujetos(process()!.sujetosProcesales!); track $index) {
                  <div class="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/40 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:shadow-sm transition-all">
                    <div class="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-500/20 dark:to-blue-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <app-icon name="user" [size]="16"></app-icon>
                    </div>
                    <div class="min-w-0">
                      <p class="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wide">{{ parte.rol }}</p>
                      <p class="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug mt-0.5">{{ parte.nombre }}</p>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        }

        <!-- ─── Actuaciones Table ─── -->
        <div class="bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl border border-slate-200 dark:border-slate-800/60 rounded-2xl overflow-hidden shadow-sm">
          <div class="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/30 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <app-icon name="activity" [size]="16" [strokeWidth]="2"></app-icon>
              </div>
              <h2 class="text-base font-bold text-slate-800 dark:text-slate-200">Actuaciones del Radicado</h2>
            </div>
            <button class="md:hidden p-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-sm">
              <app-icon name="plus" [size]="18"></app-icon>
            </button>
          </div>

          <div class="overflow-x-auto min-h-[200px]">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800/80 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
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
                        <p class="text-sm font-medium">No hay actuaciones registradas para este expediente.</p>
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
                        <div class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors group-hover:shadow-sm">
                          <app-icon name="file-text" [size]="16"></app-icon>
                        </div>
                        <span class="font-bold text-slate-800 dark:text-slate-200">{{ action.type }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 hidden sm:table-cell max-w-sm leading-relaxed">
                      {{ action.description }}
                    </td>
                    <td class="px-6 py-4 text-right">
                      <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border shadow-sm"
                        [ngClass]="{
                          'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20': action.status === 'Completado',
                          'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20': action.status === 'En Trámite',
                          'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:border-slate-600': action.status === 'Pendiente'
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
        <!-- Not Found -->
        <div class="flex-1 flex flex-col items-center justify-center gap-3 text-slate-400">
          <app-icon name="alert-circle" [size]="40" class="text-rose-400"></app-icon>
          <p class="font-semibold text-slate-600 dark:text-slate-300">Expediente no encontrado</p>
          <p class="text-sm text-slate-400">Puede que haya sido eliminado o no exista.</p>
          <button (click)="goBack()" class="mt-2 px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors">
            Volver al listado
          </button>
        </div>
      }

    </div>
  `
})
export class ProcessDetailComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private radicadoService = inject(RadicadoService);

  process = signal<RadicadoDto | null>(null);
  actions = signal<ProcessAction[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        // Check if data was passed via router navigation state (coming from the list)
        const navState = this.router.getCurrentNavigation()?.extras?.state
          ?? (typeof history !== 'undefined' ? history.state : null);

        if (navState?.['process']) {
          // Use the already-loaded data — instant, no extra API call
          this.process.set(navState['process'] as RadicadoDto);
          this.isLoading.set(false);
          this.actions.set([]);
        } else {
          // Fallback: load from API when the page is accessed directly via URL
          this.loadProcessData(Number(id));
        }
      }
    });
  }

  goBack() { this.router.navigate(['/judiciales/mis-procesos']); }

  /** Parses "ROL: NOMBRE | ROL: NOMBRE" into structured parts */
  parseSujetos(raw: string): { rol: string; nombre: string }[] {
    return raw
      .split('|')
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .map(s => {
        const idx = s.indexOf(':');
        return idx > -1
          ? { rol: s.substring(0, idx).trim(), nombre: s.substring(idx + 1).trim() }
          : { rol: 'Involucrado', nombre: s };
      });
  }

  private loadProcessData(id: number) {
    this.isLoading.set(true);
    this.radicadoService.getRadicadoById(id).subscribe({
      next: (data) => {
        this.process.set(data);
        this.isLoading.set(false);
        // Actuaciones: en el futuro vendrán de un endpoint dedicado
        this.actions.set([]);
      },
      error: () => {
        // Fallback — podría ser que el ID no existe en el backend
        this.process.set(null);
        this.isLoading.set(false);
      }
    });
  }
}
