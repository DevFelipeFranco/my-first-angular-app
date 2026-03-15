import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IconComponent } from '../components/ui/icons.component';
import { RadicadoService, RadicadoDto, ProcesoDatosDto } from '../services/radicado.service';

// Associated Action History Interface
interface ProcessAction {
  id: string;
  date: Date;
  type: string;
  description: string;
  status: string;
}

interface ProcesoDocumento {
  id: string;
  name: string;
  date: string;
  size: string;
  type: 'pdf' | 'docx' | 'image';
  category: string;
}

@Component({
  selector: 'app-process-detail',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="flex flex-col space-y-6 max-w-7xl mx-auto pb-10">

      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-2">
          <!-- Back Button -->
          <button (click)="goBack()"
            class="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
            <app-icon name="chevron-right" class="rotate-180" [size]="14" [strokeWidth]="3"></app-icon>
            Volver a Mis Procesos
          </button>

          @if (process()) {
            <div class="flex flex-wrap items-center gap-3">
              <h1 class="text-2xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
                Expediente Judicial
              </h1>
              <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border"
                [ngClass]="{
                  'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400': process()!.status === 'COMPLETED' || process()!.status === 'SUCCESS',
                  'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400': process()!.status === 'PENDING',
                  'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400': process()!.status === 'IN_PROGRESS',
                  'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400': process()!.status === 'ERROR' || process()!.status === 'FAILED',
                  'bg-slate-100 text-slate-600 border-slate-200': !['COMPLETED','SUCCESS','PENDING','IN_PROGRESS','ERROR','FAILED'].includes(process()!.status)
                }">
                {{ process()!.status }}
              </span>
            </div>
          }
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-3">
          <button class="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
            <app-icon name="download" [size]="18"></app-icon> Exportar
          </button>
          <button class="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all flex items-center gap-2">
            <app-icon name="plus" [size]="18"></app-icon> Nueva Actuación
          </button>
        </div>
      </div>

      @if (isLoading()) {
        <div class="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
          <app-icon name="refresh-cw" [size]="40" class="animate-spin text-indigo-500"></app-icon>
          <p class="font-bold">Cargando expediente...</p>
        </div>
      } @else if (process()) {
        
        <!-- ─── Tab Selector ─── -->
        <div class="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl w-fit border border-slate-200 dark:border-slate-700 shadow-sm z-10 sticky top-0">
          <button (click)="selectedTab.set('resumen')"
            [class]="selectedTab() === 'resumen' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'"
            class="px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 outline-none">
            <app-icon name="file-text" [size]="16" [strokeWidth]="2.5"></app-icon> Resumen
          </button>
          <button (click)="selectedTab.set('actuaciones')"
            [class]="selectedTab() === 'actuaciones' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'"
            class="px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 outline-none">
            <app-icon name="activity" [size]="16" [strokeWidth]="2.5"></app-icon> Actuaciones
          </button>
          <button (click)="selectedTab.set('documentos')"
            [class]="selectedTab() === 'documentos' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'"
            class="px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 outline-none">
            <app-icon name="folder" [size]="16" [strokeWidth]="2.5"></app-icon> Documentos
          </button>
        </div>

        <!-- ─── Content Area ─── -->
        <div class="mt-2 min-h-[400px]">
          
          <!-- TAB: RESUMEN -->
          @if (selectedTab() === 'resumen') {
            <div class="space-y-6 animate-fade-in">
              
              <!-- Card: Información Básica -->
              <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div class="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                  <app-icon name="info" [size]="18" class="text-indigo-500"></app-icon>
                  <h2 class="font-bold text-slate-800 dark:text-slate-100">Información del Caso</h2>
                </div>
                <div class="p-6">
                  <div class="mb-6">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Número de Radicado</p>
                    <div class="inline-flex items-center gap-3 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl">
                      <span class="font-mono text-lg font-extrabold text-indigo-700 dark:text-indigo-400 tracking-tighter">{{ process()!.radicadoNumber }}</span>
                      <app-icon name="copy" [size]="16" class="text-indigo-400 cursor-pointer hover:text-indigo-600 transition-colors"></app-icon>
                    </div>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Despacho</p>
                      <p class="text-sm font-bold text-slate-700 dark:text-slate-200">{{ process()!.despacho }}</p>
                    </div>
                    <div>
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ubicación</p>
                      <p class="text-sm font-bold text-slate-700 dark:text-slate-200">{{ process()!.departamento }}</p>
                    </div>
                    <div>
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Fecha Radicación</p>
                      <p class="text-sm font-bold text-slate-700 dark:text-slate-200">{{ process()!.processDate | date:'dd/MM/yyyy' }}</p>
                    </div>
                    <div>
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Última Actuación</p>
                      <p class="text-sm font-bold text-slate-700 dark:text-slate-200">{{ process()!.lastActionDate | date:'dd/MM/yyyy' }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Card: Datos Detallados (PREMIUM RESTORED) -->
              @if (procesoDatos(); as pd) {
                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                  
                  <!-- Section Header -->
                  <div class="px-6 py-4 bg-slate-100 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-700/60 flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 flex items-center justify-center shadow-sm">
                      <app-icon name="scale" [size]="16" [strokeWidth]="2"></app-icon>
                    </div>
                    <h2 class="text-base font-bold text-slate-800 dark:text-slate-100">Datos del Proceso</h2>
                    @if (isLoadingProceso()) {
                      <app-icon name="refresh-cw" [size]="14" class="animate-spin text-slate-400 ml-auto"></app-icon>
                    }
                  </div>

                  <div class="px-6 py-6 space-y-6">

                    <!-- Ponente — hero row -->
                    <div class="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/10 border border-indigo-100 dark:border-indigo-800/40">
                      <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-md text-sm font-bold">
                        {{ pd.ponente.charAt(0) || 'P' }}
                      </div>
                      <div class="min-w-0">
                        <p class="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-0.5">Ponente / Magistrado</p>
                        <p class="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug">{{ pd.ponente }}</p>
                      </div>
                      @if (pd.esPrivado) {
                        <span class="ml-auto flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 uppercase tracking-wider">
                          <app-icon name="lock" [size]="10" [strokeWidth]="2.5"></app-icon>Privado
                        </span>
                      } @else {
                        <span class="ml-auto flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 uppercase tracking-wider">
                          <app-icon name="check" [size]="10" [strokeWidth]="3"></app-icon>Público
                        </span>
                      }
                    </div>

                    <!-- Classification chips grid -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                      <!-- Tipo Proceso -->
                      <div class="space-y-1.5">
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <app-icon name="briefcase" [size]="11"></app-icon>Tipo de Proceso
                        </p>
                        <span class="inline-flex items-center px-3 py-1.5 rounded-lg bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-500/30 text-xs font-bold">
                          {{ pd.tipoProceso }}
                        </span>
                      </div>

                      <!-- Clase Proceso -->
                      <div class="space-y-1.5">
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <app-icon name="file-text" [size]="11"></app-icon>Clase de Proceso
                        </p>
                        <p class="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug">{{ pd.claseProceso }}</p>
                      </div>

                      <!-- Subclase Proceso -->
                      <div class="space-y-1.5">
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <app-icon name="chevron-right" [size]="11"></app-icon>Subclase
                        </p>
                        <p class="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug">{{ pd.subclaseProceso }}</p>
                      </div>

                      <!-- Recurso -->
                      <div class="space-y-1.5">
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <app-icon name="gavel" [size]="11"></app-icon>Recurso
                        </p>
                        <span class="inline-flex items-center px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 text-xs font-bold">
                          {{ pd.recurso }}
                        </span>
                      </div>

                      <!-- Ubicacion -->
                      <div class="space-y-1.5">
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <app-icon name="map-pin" [size]="11"></app-icon>Ubicación Actual
                        </p>
                        <span class="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 text-xs font-bold">
                          {{ pd.ubicacion }}
                        </span>
                      </div>

                      <!-- Cod Despacho -->
                      <div class="space-y-1.5">
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <app-icon name="hash" [size]="11"></app-icon>Cód. Despacho
                        </p>
                        <p class="text-sm font-mono font-bold text-slate-700 dark:text-slate-300">{{ pd.codDespachoCompleto }}</p>
                      </div>
                    </div>

                    <!-- Divider -->
                    <div class="border-t border-slate-100 dark:border-slate-800"></div>

                    <!-- Contenido de Radicación -->
                    <div class="space-y-2.5">
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <app-icon name="clipboard" [size]="11"></app-icon>Contenido de la Radicación
                      </p>
                      <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                        <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{{ pd.contenidoRadicacion }}</p>
                      </div>
                    </div>

                    <!-- Divider -->
                    <div class="border-t border-slate-100 dark:border-slate-800"></div>

                    <!-- Fechas de proceso y consulta -->
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div class="space-y-1">
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <app-icon name="calendar" [size]="11"></app-icon>Fecha del Proceso
                        </p>
                        <p class="text-sm font-bold text-slate-800 dark:text-slate-100">{{ pd.fechaProceso | date:'dd MMMM yyyy' }}</p>
                      </div>
                      <div class="space-y-1">
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <app-icon name="clock" [size]="11"></app-icon>Última Actualización
                        </p>
                        <p class="text-sm font-bold text-slate-800 dark:text-slate-100">{{ pd.ultimaActualizacion | date:'dd MMM yyyy, HH:mm' }}</p>
                      </div>
                      <div class="space-y-1">
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <app-icon name="search" [size]="11"></app-icon>Fecha de Consulta
                        </p>
                        <p class="text-sm font-bold text-slate-800 dark:text-slate-100">{{ pd.fechaConsulta | date:'dd MMM yyyy, HH:mm' }}</p>
                      </div>
                    </div>

                  </div>
                </div>
              } @else if (isLoadingProceso()) {
                <div class="h-64 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
              }

              <!-- Sujetos Procesales -->
              @if (process()!.sujetosProcesales) {
                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                  <div class="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <app-icon name="users" [size]="18" class="text-indigo-500"></app-icon>
                    <h2 class="font-bold text-slate-800 dark:text-slate-100">Sujetos Procesales</h2>
                  </div>
                  <div class="p-6">
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      @for (parte of parseSujetos(process()!.sujetosProcesales!); track $index) {
                        <div class="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:shadow-md transition-all duration-300">
                          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-500/10 dark:to-blue-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-sm flex-shrink-0 shadow-sm">
                             {{ parte.rol.charAt(0) }}
                          </div>
                          <div class="min-w-0 flex-1">
                            <p class="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-1">{{ parte.rol }}</p>
                            <p class="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug break-words">{{ parte.nombre }}</p>
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              }
            </div>
          }

          <!-- TAB: ACTUACIONES -->
          @if (selectedTab() === 'actuaciones') {
            <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm animate-fade-in">
              <div class="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h2 class="font-bold text-slate-800 dark:text-slate-100">Historial de Actuaciones</h2>
                <span class="text-xs text-slate-500 font-bold bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-md">{{ actions().length }} Actuaciones</span>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full text-left">
                  <thead>
                    <tr class="text-xs font-bold text-slate-400 uppercase border-b border-slate-100 dark:border-slate-800">
                      <th class="px-6 py-4">Fecha</th>
                      <th class="px-6 py-4">Actuación</th>
                      <th class="px-6 py-4">Descripción</th>
                      <th class="px-6 py-4 text-right">Estado</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
                    @for (action of actions(); track action.id) {
                      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <td class="px-6 py-4 text-sm font-bold text-slate-500">{{ action.date | date:'dd/MM/yyyy' }}</td>
                        <td class="px-6 py-4 text-sm font-black text-slate-900 dark:text-slate-100">{{ action.type }}</td>
                        <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 max-w-sm truncate">{{ action.description }}</td>
                        <td class="px-6 py-4 text-right">
                          <span class="px-2 py-1 rounded text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 border border-indigo-100">
                            {{ action.status }}
                          </span>
                        </td>
                      </tr>
                    }
                    @if (actions().length === 0) {
                      <tr>
                        <td colspan="4" class="py-20 text-center">
                          <app-icon name="inbox" [size]="40" class="mx-auto text-slate-200 mb-2"></app-icon>
                          <p class="text-slate-400 font-bold">Sin actuaciones registradas</p>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }

          <!-- TAB: DOCUMENTOS -->
          @if (selectedTab() === 'documentos') {
            <div class="space-y-6 animate-fade-in">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                @for (doc of documents(); track doc.id) {
                  <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:shadow-lg transition-all group pointer-cursor">
                    <div class="flex items-start justify-between mb-4">
                      <div class="p-3 bg-indigo-50 dark:bg-slate-800 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        @if (doc.type === 'pdf') { <app-icon name="file-text" [size]="24"></app-icon> }
                        @else { <app-icon name="clipboard" [size]="24"></app-icon> }
                      </div>
                      <button class="p-2 text-slate-400 hover:text-indigo-600">
                        <app-icon name="download" [size]="18"></app-icon>
                      </button>
                    </div>
                    <h3 class="font-bold text-slate-800 dark:text-slate-100 truncate mb-1">{{ doc.name }}</h3>
                    <p class="text-[10px] font-bold text-indigo-500 uppercase mb-4">{{ doc.category }}</p>
                    <div class="flex items-center justify-between text-[11px] font-bold text-slate-400 border-t border-slate-50 dark:border-slate-800 pt-3">
                      <span>{{ doc.date | date:'dd MMM yyyy' }}</span>
                      <span>{{ doc.size }}</span>
                    </div>
                  </div>
                }
              </div>

              @if (documents().length === 0) {
                <div class="py-20 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-300">
                  <app-icon name="folder-plus" [size]="48" class="mb-2 opacity-50"></app-icon>
                  <p class="font-black">No hay documentos cargados</p>
                </div>
              }
            </div>
          }
        </div>

      } @else {
        <!-- Not Found -->
        <div class="py-20 flex flex-col items-center justify-center gap-4 text-center">
          <app-icon name="alert-circle" [size]="48" class="text-rose-500"></app-icon>
          <div>
            <p class="text-lg font-bold text-slate-800 dark:text-slate-200">Expediente no encontrado</p>
            <p class="text-slate-500">El proceso no existe o ha sido eliminado del sistema.</p>
          </div>
          <button (click)="goBack()" class="mt-4 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20">
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

  // Datos del Proceso (sección detallada del proceso judicial)
  procesoDatos = signal<ProcesoDatosDto | null>(null);
  isLoadingProceso = signal(false);

  // Sistema de Tabs
  selectedTab = signal<'resumen' | 'actuaciones' | 'documentos'>('resumen');

  // Documentos Procesales
  documents = signal<ProcesoDocumento[]>([
    { id: '1', name: 'Demanda_Inicial.pdf', date: '2017-05-05T09:00:00', size: '2.4 MB', type: 'pdf', category: 'Radicación' },
    { id: '2', name: 'Auto_Admisorio.pdf', date: '2017-06-12T14:30:00', size: '1.1 MB', type: 'pdf', category: 'Notificación' },
    { id: '3', name: 'Contestacion_Demanda.docx', date: '2017-07-20T11:15:00', size: '850 KB', type: 'docx', category: 'Respuesta' },
    { id: '4', name: 'Poder_Especial.pdf', date: '2017-05-04T16:45:00', size: '450 KB', type: 'pdf', category: 'Legal' },
    { id: '5', name: 'Evidencias_Fotograficas.zip', date: '2017-08-05T10:00:00', size: '15.2 MB', type: 'image', category: 'Pruebas' }
  ]);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        // Check if data was passed via router navigation state
        const navState = this.router.getCurrentNavigation()?.extras?.state
          ?? (typeof history !== 'undefined' ? history.state : null);

        if (navState?.['process']) {
          const proc = navState['process'] as RadicadoDto;
          this.process.set(proc);
          this.isLoading.set(false);
          this.actions.set([]);
          this.loadProcesoDatos(proc.radicadoNumber);
        } else {
          this.loadProcessData(Number(id));
        }
      }
    });
  }

  goBack() { this.router.navigate(['/judiciales/mis-procesos']); }

  /** Parses "ROL: NOMBRE | ROL: NOMBRE" into structured parts */
  parseSujetos(raw: string): { rol: string; nombre: string }[] {
    if (!raw) return [];
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
        this.loadProcesoDatos(data.radicadoNumber);
      },
      error: () => {
        this.process.set(null);
        this.isLoading.set(false);
      }
    });
  }

  private loadProcesoDatos(llaveProceso: string) {
    this.isLoadingProceso.set(true);
    this.radicadoService.getProcesoDatos(llaveProceso).subscribe({
      next: (data) => {
        this.procesoDatos.set(data);
        this.isLoadingProceso.set(false);
      },
      error: () => {
        // Mock data for preview
        this.procesoDatos.set({
          idRegProceso: 4263073,
          llaveProceso,
          idConexion: 79,
          esPrivado: false,
          fechaProceso: '2017-05-05T00:00:00',
          codDespachoCompleto: '110010326000',
          despacho: 'DESPACHO 000 - CONSEJO DE ESTADO - SECCIÓN TERCERA - BOGOTÁ *',
          ponente: 'WILLIAM EDGARDO BARRERA MUÑOZ',
          tipoProceso: 'ORDINARIO',
          claseProceso: 'LEY 1437 CONTROVERSIAS CONTRACTUALES',
          subclaseProceso: 'Sin Subclase de Proceso',
          recurso: 'APELACION SENTENCIA',
          ubicacion: 'DESPACHO',
          contenidoRadicacion: '(59180) MP. ALVARO CRUZ RIAÑO. RECURSO DE APELACION EN CONTRA DE LA SENTENCIA DEL 20 DE AGOSTO DE 2015, PROFERIDA POR EL TRIBUNAL ADMINISTRATIVO DE ANTIQUIA.',
          fechaConsulta: new Date().toISOString(),
          ultimaActualizacion: '2026-03-13T19:23:18.94'
        });
        this.isLoadingProceso.set(false);
      }
    });
  }
}
