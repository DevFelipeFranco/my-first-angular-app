import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IconComponent } from '../components/ui/icons.component';
import { 
  RadicadoService, 
  RadicadoDto, 
  DetalleProcesoCasesDto,
  DocumentoProcesoDto,
  ActuacionProcesoDto,
  Page
} from '../services/radicado.service';

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
        <div class="flex items-center gap-3 animate-fade-in">
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

              <!-- Card: Datos Detallados -->
              @if (procesoDatos(); as pd) {
                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm animate-fade-in">
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
                    <!-- Ponente -->
                    <div class="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/10 border border-indigo-100 dark:border-indigo-800/40">
                      <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-md text-sm font-bold">
                        {{ pd.ponente.charAt(0) || 'P' }}
                      </div>
                      <div class="min-w-0">
                        <p class="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-0.5">Ponente / Magistrado</p>
                        <p class="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug">{{ pd.ponente || 'No asignado' }}</p>
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

                    <!-- Details Grid -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <!-- Tipo Proceso -->
                      <div class="space-y-1.5">
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><app-icon name="briefcase" [size]="11"></app-icon>Tipo de Proceso</p>
                        <span class="inline-flex items-center px-3 py-1.5 rounded-lg bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-500/30 text-xs font-bold">{{ pd.tipoProceso }}</span>
                      </div>
                      <!-- Clase Proceso -->
                      <div class="space-y-1.5">
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><app-icon name="file-text" [size]="11"></app-icon>Clase de Proceso</p>
                        <p class="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug">{{ pd.claseProceso }}</p>
                      </div>
                      <!-- Subclase Proceso -->
                      <div class="space-y-1.5">
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><app-icon name="chevron-right" [size]="11"></app-icon>Subclase</p>
                        <p class="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug">{{ pd.subclaseProceso || 'Sin subclase' }}</p>
                      </div>
                      <!-- Recurso -->
                      <div class="space-y-1.5">
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><app-icon name="gavel" [size]="11"></app-icon>Recurso</p>
                        <span class="inline-flex items-center px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 text-xs font-bold">{{ pd.recurso || 'Ninguno' }}</span>
                      </div>
                      <!-- Ubicacion -->
                      <div class="space-y-1.5">
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><app-icon name="map-pin" [size]="11"></app-icon>Ubicación Actual</p>
                        <span class="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 text-xs font-bold">{{ pd.ubicacion }}</span>
                      </div>
                      <!-- Cod Despacho -->
                      <div class="space-y-1.5">
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><app-icon name="hash" [size]="11"></app-icon>Cód. Despacho</p>
                        <p class="text-sm font-mono font-bold text-slate-700 dark:text-slate-300">{{ pd.codDespachoCompleto }}</p>
                      </div>
                    </div>

                    <div class="border-t border-slate-100 dark:border-slate-800"></div>

                    <!-- Contenido -->
                    <div class="space-y-2.5">
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><app-icon name="clipboard" [size]="11"></app-icon>Contenido de la Radicación</p>
                      <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                        <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{{ pd.contenidoRadicacion }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              } @else if (isLoadingProceso()) {
                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm overflow-hidden relative">
                  <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 dark:via-slate-800/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                  <div class="flex items-center gap-3 mb-6">
                    <div class="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                    <div class="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                  </div>
                  <div class="h-20 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6 animate-pulse"></div>
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div class="space-y-2"><div class="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div><div class="h-6 w-full bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse"></div></div>
                    <div class="space-y-2"><div class="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div><div class="h-6 w-full bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse"></div></div>
                    <div class="space-y-2"><div class="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div><div class="h-6 w-full bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse"></div></div>
                  </div>
                </div>
              } @else if (procesoDetalleError()) {
                <div class="bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-700/60 rounded-3xl p-10 flex flex-col items-center justify-center text-center animate-fade-in">
                  <app-icon name="file-minus" [size]="56" class="text-slate-300 dark:text-slate-600 mb-4"></app-icon>
                  <h3 class="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Sin Detalle Registrado</h3>
                  <p class="text-slate-500 dark:text-slate-400 max-w-sm mb-6">{{ procesoDetalleError() }}</p>
                  <button (click)="loadDetalleMock()" class="px-5 py-2.5 rounded-xl border border-indigo-200 text-indigo-600 font-bold hover:bg-indigo-50 transition-colors">
                    Cargar Vista Previa
                  </button>
                </div>
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
            <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm animate-fade-in text-sm">
              <div class="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <h2 class="font-bold text-slate-800 dark:text-slate-100">Historial de Actuaciones</h2>
                  @if (actuacionesPage()) {
                    <span class="text-xs text-indigo-700 bg-indigo-50 font-bold px-2.5 py-1 rounded-lg border border-indigo-100">{{ actuacionesPage()!.totalElements }} Registros</span>
                  }
                </div>
                
                <div class="flex items-center gap-3">
                  <!-- Sync UI -->
                  @if (syncActuacionesState() !== 'idle') {
                    <span class="text-xs font-bold transition-colors"
                      [ngClass]="{
                        'text-blue-500': syncActuacionesState() === 'loading',
                        'text-emerald-500': syncActuacionesState() === 'success',
                        'text-rose-500': syncActuacionesState() === 'error'
                      }">
                      {{ syncActuacionesMessage() }}
                    </span>
                  }
                  
                  <button (click)="syncActuaciones()" [disabled]="isSyncingActuaciones() || isLoadingActuaciones()"
                    class="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-700/60 rounded-lg text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-800/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    <app-icon name="refresh-cw" [size]="14" [class.animate-spin]="isSyncingActuaciones()"></app-icon>
                    Sincronizar
                  </button>
                </div>
              </div>

              @if (isLoadingActuaciones()) {
                <div class="p-6 space-y-4">
                  @for (i of [1,2,3]; track i) {
                    <div class="flex flex-col gap-2 p-4 border border-slate-100 dark:border-slate-800 rounded-xl">
                      <div class="h-4 bg-slate-200 dark:bg-slate-800 w-1/4 rounded animate-pulse"></div>
                      <div class="h-3 bg-slate-100 dark:bg-slate-800/50 w-3/4 rounded animate-pulse"></div>
                    </div>
                  }
                </div>
              } @else if (actuaciones().length > 0) {
                <div class="overflow-x-auto">
                  <table class="w-full text-left">
                    <thead>
                      <tr class="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 select-none">
                        <th class="px-6 py-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group" (click)="toggleSort('fechaActuacion')">
                          <div class="flex items-center gap-1">
                            Fecha Actuación
                            @if (actuacionesSortBy() === 'fechaActuacion') {
                              <app-icon [name]="actuacionesSortDir() === 'asc' ? 'chevron-up' : 'chevron-down'" [size]="14" class="text-indigo-500"></app-icon>
                            } @else {
                              <app-icon name="chevrons-up-down" [size]="14" class="opacity-0 group-hover:opacity-50"></app-icon>
                            }
                          </div>
                        </th>
                        <th class="px-6 py-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group" (click)="toggleSort('actuacion')">
                          <div class="flex items-center gap-1">
                            Actuación
                            @if (actuacionesSortBy() === 'actuacion') {
                              <app-icon [name]="actuacionesSortDir() === 'asc' ? 'chevron-up' : 'chevron-down'" [size]="14" class="text-indigo-500"></app-icon>
                            } @else {
                              <app-icon name="chevrons-up-down" [size]="14" class="opacity-0 group-hover:opacity-50"></app-icon>
                            }
                          </div>
                        </th>
                        <th class="px-6 py-4">Anotación</th>
                        <th class="px-6 py-4 text-center">Documentos</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
                      @for (act of actuaciones(); track act.idRegActuacion) {
                        <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group">
                          <td class="px-6 py-4 whitespace-nowrap">
                            <span class="font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">{{ act.fechaActuacion | date:'dd MMM yyyy' }}</span>
                          </td>
                          <td class="px-6 py-4">
                            <p class="font-black text-slate-800 dark:text-slate-100 text-xs leading-snug">{{ act.actuacion }}</p>
                          </td>
                          <td class="px-6 py-4">
                            <p class="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 group-hover:line-clamp-none transition-all" title="{{ act.anotacion }}">{{ act.anotacion || 'Sin anotación' }}</p>
                          </td>
                          <td class="px-6 py-4 text-center">
                            @if (act.conDocumentos) {
                              <button class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors" title="Ver Documentos">
                                <app-icon name="paperclip" [size]="14" [strokeWidth]="2.5"></app-icon>
                              </button>
                            } @else {
                              <span class="text-slate-300 dark:text-slate-600">-</span>
                            }
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
                
                <!-- Paginación -->
                @if (actuacionesPage(); as page) {
                  <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-900/30">
                    <p class="text-xs font-bold text-slate-500">
                      Mostrando página <span class="text-slate-800 dark:text-slate-200">{{ page.pageNumber + 1 }}</span> de <span class="text-slate-800 dark:text-slate-200">{{ page.totalPages }}</span>
                    </p>
                    <div class="flex items-center gap-2">
                      <button [disabled]="page.pageNumber === 0" (click)="loadActuaciones(page.pageNumber - 1)" 
                        class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                        Anterior
                      </button>
                      <button [disabled]="page.pageNumber >= page.totalPages - 1" (click)="loadActuaciones(page.pageNumber + 1)"
                        class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                        Siguiente
                      </button>
                    </div>
                  </div>
                }
              } @else {
                <div class="py-24 flex flex-col items-center justify-center text-center">
                  <div class="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-slate-300 dark:text-slate-600">
                    <app-icon name="inbox" [size]="32" [strokeWidth]="1.5"></app-icon>
                  </div>
                  <h3 class="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">Sin actuaciones</h3>
                  <p class="text-slate-500 dark:text-slate-400 text-sm max-w-xs">No hay actuaciones registradas en este caso judicial en este momento.</p>
                </div>
              }
            </div>
          }

          <!-- TAB: DOCUMENTOS -->
          @if (selectedTab() === 'documentos') {
            <div class="space-y-6 animate-fade-in">
              @if (isLoadingDocumentos()) {
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  @for (i of [1,2,3]; track i) {
                    <div class="h-32 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 relative overflow-hidden">
                      <div class="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/50 dark:via-slate-800/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                      <div class="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4 animate-pulse"></div>
                      <div class="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4 mb-2 animate-pulse"></div>
                      <div class="h-3 bg-slate-50 dark:bg-slate-800/50 rounded w-1/2 animate-pulse"></div>
                    </div>
                  }
                </div>
              } @else if (documentos().length > 0) {
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  @for (doc of documentos(); track doc.idRegDocumento) {
                    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5 transition-all group cursor-pointer flex flex-col">
                      <div class="flex items-start justify-between mb-4">
                        <div class="p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                          @if (doc.descripcion.toLowerCase().includes('pdf') || doc.nombre.toLowerCase().includes('pdf')) { 
                            <app-icon name="file-text" [size]="22"></app-icon> 
                          }
                          @else if (doc.descripcion.toLowerCase().includes('doc') || doc.nombre.toLowerCase().includes('doc')) { 
                            <app-icon name="file" [size]="22"></app-icon> 
                          }
                          @else { 
                            <app-icon name="clipboard" [size]="22"></app-icon> 
                          }
                        </div>
                        <button class="p-2 text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" title="Descargar documento">
                          <app-icon name="download" [size]="18" [strokeWidth]="2.5"></app-icon>
                        </button>
                      </div>
                      <h3 class="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1 leading-snug line-clamp-2" title="{{ doc.nombre }}">{{ doc.nombre }}</h3>
                      <p class="text-xs font-medium text-slate-500 truncate mb-4">{{ doc.descripcion || 'Documento adjunto' }}</p>
                      
                      <div class="mt-auto pt-3 border-t border-slate-50 dark:border-slate-800/50 flex items-center justify-between text-[10px] font-bold text-slate-400">
                        <span class="flex items-center gap-1"><app-icon name="calendar" [size]="10"></app-icon>{{ doc.fechaCarga | date:'dd MMM yyyy' }}</span>
                        <span class="uppercase">{{ doc.tipo || 'ANEXO' }}</span>
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <div class="py-24 border-2 border-dashed border-slate-200 dark:border-slate-800/60 rounded-3xl flex flex-col items-center justify-center text-center">
                  <app-icon name="folder-minus" [size]="56" class="text-slate-200 dark:text-slate-700 mb-4"></app-icon>
                  <p class="font-bold text-slate-700 dark:text-slate-300 text-lg">No hay documentos cargados</p>
                  <p class="text-slate-400 text-sm max-w-sm mt-1">Este caso judicial no cuenta con anexos o archivos digitales en este momento.</p>
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
  isLoading = signal(true);

  // Datos del Proceso (Detalle)
  procesoDatos = signal<DetalleProcesoCasesDto | null>(null);
  isLoadingProceso = signal(false);
  procesoDetalleError = signal<string | null>(null);

  // Documentos
  documentos = signal<DocumentoProcesoDto[]>([]);
  isLoadingDocumentos = signal(false);
  documentosLoaded = signal(false);

  // Actuaciones
  actuaciones = signal<ActuacionProcesoDto[]>([]);
  actuacionesPage = signal<Page<ActuacionProcesoDto> | null>(null);
  isLoadingActuaciones = signal(false);
  actuacionesLoaded = signal(false);
  actuacionesSortBy = signal<'fechaActuacion' | 'actuacion'>('fechaActuacion');
  actuacionesSortDir = signal<'desc' | 'asc'>('desc');
  isSyncingActuaciones = signal(false);
  syncActuacionesState = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  syncActuacionesMessage = signal<string>('');

  // Sistema de Tabs
  selectedTab = signal<'resumen' | 'actuaciones' | 'documentos'>('resumen');

  constructor() {
    effect(() => {
      const tab = this.selectedTab();
      const processValue = this.process();
      
      if (!processValue) return;

      if (tab === 'documentos' && !this.documentosLoaded()) {
        this.loadDocumentos();
      } else if (tab === 'actuaciones' && !this.actuacionesLoaded()) {
        this.loadActuaciones(0);
      }
    });
  }

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
          this.loadDetalleProceso(proc.id);
        } else {
          this.loadProcessData(Number(id));
        }
      }
    });
  }

  goBack() { this.router.navigate(['/judiciales/mis-procesos']); }

  private loadProcessData(id: number) {
    this.isLoading.set(true);
    this.radicadoService.getRadicadoById(id).subscribe({
      next: (data) => {
        this.process.set(data);
        this.isLoading.set(false);
        this.loadDetalleProceso(id);
      },
      error: () => {
        this.process.set(null);
        this.isLoading.set(false);
      }
    });
  }

  private loadDetalleProceso(caseId: number) {
    this.isLoadingProceso.set(true);
    this.procesoDetalleError.set(null);
    this.procesoDatos.set(null);

    this.radicadoService.getDetalleProceso(caseId).subscribe({
      next: (data) => {
        if (data) {
          this.procesoDatos.set(data);
        } else {
          this.procesoDetalleError.set('No se encontraron detalles para este proceso en la rama judicial o hubo un error al consultar.');
        }
        this.isLoadingProceso.set(false);
      },
      error: () => {
        this.procesoDetalleError.set('El servicio de consulta de detalles no se encuentra disponible.');
        this.isLoadingProceso.set(false);
      }
    });
  }

  loadDetalleMock() {
    this.procesoDetalleError.set(null);
    this.procesoDatos.set({
      idRegProceso: 4263073,
      llaveProceso: this.process()?.radicadoNumber || '11001032600020130005700',
      idConexion: 79,
      esPrivado: false,
      fechaProceso: '2017-05-05T00:00:00',
      codDespachoCompleto: '110010326000',
      despacho: 'DESPACHO 000 - CONSEJO DE ESTADO - SECCIÓN TERCERA - BOGOTÁ',
      ponente: 'WILLIAM EDGARDO BARRERA MUÑOZ',
      tipoProceso: 'ORDINARIO',
      claseProceso: 'LEY 1437 CONTROVERSIAS CONTRACTUALES',
      subclaseProceso: 'Sin Subclase de Proceso',
      recurso: 'APELACION SENTENCIA',
      ubicacion: 'DESPACHO',
      contenidoRadicacion: '(59180) MP. ALVARO CRUZ RIAÑO. RECURSO DE APELACION EN CONTRA DE LA SENTENCIA',
      fechaConsulta: new Date().toISOString(),
      ultimaActualizacion: new Date().toISOString()
    });
  }

  private loadDocumentos() {
    const processValue = this.process();
    if (!processValue) return;

    this.isLoadingDocumentos.set(true);
    this.radicadoService.getDocumentos(processValue.id).subscribe({
      next: (data) => {
        this.documentos.set(data);
        this.isLoadingDocumentos.set(false);
        this.documentosLoaded.set(true);
      },
      error: () => {
        this.documentos.set([]);
        this.isLoadingDocumentos.set(false);
        // Marcamos como cargado para que no se reintente sin control
        this.documentosLoaded.set(true);
      }
    });
  }

  syncActuaciones() {
    const proc = this.process();
    if (!proc || this.isSyncingActuaciones()) return;

    this.isSyncingActuaciones.set(true);
    this.syncActuacionesState.set('loading');
    this.syncActuacionesMessage.set('Conectando y revisando Rama Judicial...');

    // 1. Open SSE Stream
    this.radicadoService.getActuacionesSyncStream(proc.id).subscribe({
      next: (res) => {
        const s = (res.status || '').toUpperCase();
        if (['COMPLETED', 'FINISHED', 'SUCCESS'].includes(s)) {
          this.isSyncingActuaciones.set(false);
          this.syncActuacionesState.set('success');
          const count = res['synchronized'] ?? 0;
          this.syncActuacionesMessage.set(
            count > 0 ? `${count} nuevas` : 'Actualizado'
          );
          
          if (count > 0) {
            this.loadActuaciones(0);
          }

          setTimeout(() => this.syncActuacionesState.set('idle'), 4000);
        } else if (['FAILED', 'ERROR'].includes(s)) {
          this.isSyncingActuaciones.set(false);
          this.syncActuacionesState.set('error');
          this.syncActuacionesMessage.set(res.message || 'Error en sincronización');
          setTimeout(() => this.syncActuacionesState.set('idle'), 5000);
        } else {
          this.syncActuacionesMessage.set(res.message || 'Procesando...');
        }
      },
      error: (err) => {
        console.error('El stream SSE ha arrojado un error en Angular:', err);
        // Solo mostramos error si el POST síncrono no ha terminado esto satisfactoriamente ya
        if (this.syncActuacionesState() !== 'success') {
          this.isSyncingActuaciones.set(false);
          this.syncActuacionesState.set('error');
          const msg = typeof err === 'string' ? err : (err && err.message ? err.message : 'Error SSE (Ver consola)');
          this.syncActuacionesMessage.set(msg);
          setTimeout(() => this.syncActuacionesState.set('idle'), 8000);
        }
      }
    });

    // 2. Trigger POST Request
    this.radicadoService.triggerActuacionesSync(proc.id).subscribe({
      next: (res) => {
        let isSuccess = false;
        let count = 0;
        
        if (typeof res === 'string') {
          if (res.includes('NuevaActuacionEvent')) {
            const matchCount = res.match(/newCount=(\d+)/);
            if (matchCount) { count = parseInt(matchCount[1], 10); isSuccess = true; }
          } else if (res.includes('newCount')) {
            try {
              const parsed = JSON.parse(res);
              if ('newCount' in parsed) { count = parsed.newCount || 0; isSuccess = true; }
            } catch(e) {}
          }
        }
        
        // El backend puede enviar el evento directo en la respuesta de este POST.
        if (isSuccess && this.syncActuacionesState() !== 'success') {
          this.isSyncingActuaciones.set(false);
          this.syncActuacionesState.set('success');
          this.syncActuacionesMessage.set(count > 0 ? `${count} nuevas` : 'Sincronización completada');
          if (count > 0) this.loadActuaciones(0);
          setTimeout(() => this.syncActuacionesState.set('idle'), 4000);
        }
      },
      error: (err) => {
        // Logging error silencioso para no sobreescribir la UI si SSE está corriendo perfecto
        console.warn('El trigger POST devolvió error:', err);
      }
    });
  }

  toggleSort(column: 'fechaActuacion' | 'actuacion') {
    if (this.actuacionesSortBy() === column) {
      this.actuacionesSortDir.set(this.actuacionesSortDir() === 'asc' ? 'desc' : 'asc');
    } else {
      this.actuacionesSortBy.set(column);
      this.actuacionesSortDir.set(column === 'fechaActuacion' ? 'desc' : 'asc');
    }
    this.loadActuaciones(0);
  }

  loadActuaciones(pageNumber: number) {
    const processValue = this.process();
    if (!processValue) return;

    this.isLoadingActuaciones.set(true);
    this.radicadoService.getActuaciones(processValue.id, pageNumber, 10, this.actuacionesSortBy(), this.actuacionesSortDir()).subscribe({
      next: (data) => {
        if (data) {
          const sortedContent = [...data.content].sort((a, b) => {
             const valA = this.actuacionesSortBy() === 'fechaActuacion' ? new Date(a.fechaActuacion).getTime() : a.actuacion.toLowerCase();
             const valB = this.actuacionesSortBy() === 'fechaActuacion' ? new Date(b.fechaActuacion).getTime() : b.actuacion.toLowerCase();
             
             if (valA < valB) return this.actuacionesSortDir() === 'asc' ? -1 : 1;
             if (valA > valB) return this.actuacionesSortDir() === 'asc' ? 1 : -1;
             return 0;
          });
          this.actuaciones.set(sortedContent);
          this.actuacionesPage.set(data);
        } else {
          this.actuaciones.set([]);
          this.actuacionesPage.set(null);
        }
        this.isLoadingActuaciones.set(false);
        this.actuacionesLoaded.set(true);
      },
      error: () => {
        this.actuaciones.set([]);
        this.actuacionesPage.set(null);
        this.isLoadingActuaciones.set(false);
        this.actuacionesLoaded.set(true);
      }
    });
  }

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
}
