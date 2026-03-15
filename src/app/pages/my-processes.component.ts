import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IconComponent } from '../components/ui/icons.component';
import { SearchableSelectComponent, SelectOption } from '../components/ui/searchable-select.component';
import { RadicadoService, RadicadoDto } from '../services/radicado.service';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-my-processes',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, SearchableSelectComponent],
  template: `
    <div class="h-full flex flex-col p-6 space-y-6 max-w-7xl mx-auto">

      <!-- Page Header -->
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100 transition-colors duration-300 tracking-tight">Mis Procesos Judiciales</h1>
        <p class="text-slate-500 mt-1">Gestiona todos tus expedientes y requerimientos legales.</p>
      </div>

      <!-- Main Toolbar -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl transition-all duration-300 p-4 rounded-2xl border border-slate-200 dark:border-slate-800/60 shadow-sm">
        <!-- Left Tools -->
        <div class="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <button class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-lg transition-colors" title="Recargar" (click)="loadProcesses()">
            <app-icon name="refresh-cw" [size]="18" [strokeWidth]="2"></app-icon>
          </button>
          <button class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-lg transition-colors" title="Filtrar">
            <app-icon name="filter" [size]="18" [strokeWidth]="2"></app-icon>
          </button>
          <button class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-lg transition-colors" title="Exportar">
            <app-icon name="download" [size]="18" [strokeWidth]="2"></app-icon>
          </button>
          <div class="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1"></div>
          <!-- Search -->
          <div class="relative group hidden md:block">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <app-icon name="search" [size]="15" class="text-slate-400 group-focus-within:text-blue-500 transition-colors"></app-icon>
            </div>
            <input type="text" [(ngModel)]="searchQuery" placeholder="Buscar por radicado o despacho..."
              class="w-72 pl-9 pr-4 py-2 bg-slate-100 focus:bg-white dark:bg-slate-900/50 dark:focus:bg-slate-900 border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 rounded-xl text-sm outline-none text-slate-800 dark:text-slate-200 placeholder-slate-400 transition-all">
          </div>
        </div>
        <!-- New Process Button -->
        <button (click)="openModal()"
          class="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 transition-all outline-none">
          <app-icon name="plus" [size]="18" [strokeWidth]="2.5"></app-icon>
          <span>Nuevo Proceso</span>
        </button>
      </div>

      <!-- Content + Detail Panel -->
      <div class="flex gap-5 flex-1 min-h-0">

        <!-- Table Area -->
        <div class="flex-1 min-w-0 min-h-[400px]">

          <!-- Loading -->
          @if (isLoading()) {
            <div class="h-48 flex items-center justify-center bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800/60">
              <div class="flex flex-col items-center gap-3 text-slate-400">
                <app-icon name="refresh-cw" [size]="28" class="animate-spin text-blue-500"></app-icon>
                <p class="text-sm font-medium">Cargando procesos...</p>
              </div>
            </div>
          }

          <!-- Populated Table -->
          @else if (filteredProcesses().length > 0) {
            <div class="bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl border border-slate-200 dark:border-slate-800/60 rounded-2xl overflow-hidden shadow-sm dark:shadow-[0_4px_25px_-5px_rgba(0,0,0,0.5)]">

              <!-- Table Sub-header -->
              <div class="px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 flex items-center justify-between">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {{ filteredProcesses().length }} Expediente{{ filteredProcesses().length !== 1 ? 's' : '' }}
                </span>
                <span class="text-xs text-slate-400 font-medium hidden sm:block">Haz clic en un expediente para ver el detalle</span>
              </div>

              <!-- Rows -->
              <div class="divide-y divide-slate-100 dark:divide-slate-800/60">
                @for (proc of filteredProcesses(); track proc.id) {
                  <div (click)="selectProcess(proc)"
                    class="group flex items-start gap-4 px-5 py-4 cursor-pointer transition-all duration-200 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 relative"
                    [ngClass]="{
                      'bg-indigo-50 dark:bg-indigo-950/30 border-l-4 border-indigo-500': selectedProcess()?.id === proc.id,
                      'border-l-4 border-transparent': selectedProcess()?.id !== proc.id
                    }">

                    <!-- Status Indicator -->
                    <div class="mt-2 flex-shrink-0">
                      <div class="w-2.5 h-2.5 rounded-full shadow-sm transition-all duration-300"
                        [ngClass]="{
                          'bg-emerald-500 shadow-emerald-500/60': proc.status === 'COMPLETED' || proc.status === 'SUCCESS',
                          'bg-amber-500 shadow-amber-500/60': proc.status === 'PENDING',
                          'bg-blue-500 shadow-blue-500/60': proc.status === 'IN_PROGRESS',
                          'bg-rose-500 shadow-rose-500/60': proc.status === 'ERROR' || proc.status === 'FAILED',
                          'bg-slate-400': !['COMPLETED','SUCCESS','PENDING','IN_PROGRESS','ERROR','FAILED'].includes(proc.status)
                        }">
                      </div>
                    </div>

                    <!-- Content Block -->
                    <div class="flex-1 min-w-0 space-y-1.5">

                      <!-- Radicado Badge + Status Chip -->
                      <div class="flex items-center flex-wrap gap-2">
                        <span class="font-mono text-xs font-bold tracking-widest text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 px-2.5 py-1 rounded-lg">
                          {{ proc.radicadoNumber }}
                        </span>
                        <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border"
                          [ngClass]="{
                            'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20': proc.status === 'COMPLETED' || proc.status === 'SUCCESS',
                            'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20': proc.status === 'PENDING',
                            'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20': proc.status === 'IN_PROGRESS',
                            'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20': proc.status === 'ERROR' || proc.status === 'FAILED',
                            'bg-slate-100 text-slate-600 border-slate-200': !['COMPLETED','SUCCESS','PENDING','IN_PROGRESS','ERROR','FAILED'].includes(proc.status)
                          }">
                          {{ proc.status }}
                        </span>
                      </div>

                      <!-- Despacho -->
                      <p class="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug">{{ proc.despacho }}</p>

                      <!-- Meta info row -->
                      <div class="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 dark:text-slate-500 font-medium">
                        <span class="flex items-center gap-1">
                          <app-icon name="map-pin" [size]="12"></app-icon>{{ proc.departamento }}
                        </span>
                        <span class="flex items-center gap-1">
                          <app-icon name="calendar" [size]="12"></app-icon>Radicación: {{ proc.processDate | date:'dd/MM/yyyy' }}
                        </span>
                        @if (proc.lastActionDate) {
                          <span class="flex items-center gap-1">
                            <app-icon name="clock" [size]="12"></app-icon>Última acción: {{ proc.lastActionDate | date:'dd/MM/yyyy' }}
                          </span>
                        }
                      </div>

                      <!-- Sujetos preview -->
                      @if (proc.sujetosProcesales) {
                        <p class="text-xs text-slate-400 dark:text-slate-500 truncate max-w-xl leading-relaxed">
                          <span class="font-semibold text-slate-500 dark:text-slate-400">Partes: </span>{{ proc.sujetosProcesales }}
                        </p>
                      }
                    </div>

                    <!-- Arrow -->
                    <div class="flex-shrink-0 self-center text-slate-300 group-hover:text-indigo-400 transition-all duration-200 group-hover:translate-x-0.5">
                      <app-icon name="chevron-right" [size]="18" [strokeWidth]="2"></app-icon>
                    </div>
                  </div>
                }
              </div>
            </div>
          }

          <!-- Empty State -->
          @else {
            <div class="min-h-[500px] flex flex-col items-center justify-center text-center px-4 bg-white/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 border-dashed rounded-2xl relative overflow-hidden group">
              <div class="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/50 dark:from-indigo-900/5 dark:via-transparent dark:to-blue-900/5 pointer-events-none"></div>
              <div class="relative z-10">
                <div class="w-24 h-24 mx-auto mb-6 relative">
                  <div class="absolute inset-0 bg-blue-100 dark:bg-blue-900/40 rounded-full blur-xl scale-125 opacity-50"></div>
                  <div class="relative w-full h-full bg-white dark:bg-slate-800/80 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-700/50 flex items-center justify-center group-hover:-translate-y-2 transition-transform duration-500">
                    <app-icon name="inbox" [size]="40" class="text-blue-600 dark:text-blue-400" [strokeWidth]="1.5"></app-icon>
                  </div>
                </div>
                <h2 class="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mb-3 tracking-tight">Sin procesos registrados</h2>
                <p class="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-8 leading-relaxed">Empieza a digitalizar tus expedientes centralizando todo en un solo lugar.</p>
                <div class="flex flex-col sm:flex-row gap-3 justify-center">
                  <button (click)="openModal()" class="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-7 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 transition-all outline-none">
                    <app-icon name="plus" [size]="18" [strokeWidth]="2.5"></app-icon><span>Crear mi primer proceso</span>
                  </button>
                  <button (click)="toggleTestProcesses()" class="text-sm font-medium text-slate-400 hover:text-slate-600 hover:underline">Cargar datos de prueba</button>
                </div>
              </div>
            </div>
          }
        </div>

        <!-- ─── Slide-Over Detail Panel ─── -->
        @if (selectedProcess()) {
          <aside class="w-[380px] flex-shrink-0 animate-slide-in-right">
            <div class="bg-white dark:bg-slate-900/60 dark:backdrop-blur-xl border border-slate-200 dark:border-slate-800/60 rounded-2xl shadow-xl dark:shadow-[0_8px_40px_-8px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col" style="max-height: calc(100vh - 220px);">

              <!-- Panel Header -->
              <div class="px-5 py-4 bg-gradient-to-br from-indigo-600 via-indigo-600 to-blue-600 relative overflow-hidden flex-shrink-0">
                <div class="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none"></div>
                <div class="flex items-start justify-between gap-3 relative z-10">
                  <div class="flex-1 min-w-0">
                    <p class="text-indigo-200 text-[10px] font-bold uppercase tracking-widest mb-1.5">Número de Radicado</p>
                    <p class="font-mono text-white text-sm font-bold tracking-wider break-all leading-snug">{{ selectedProcess()!.radicadoNumber }}</p>
                  </div>
                  <button (click)="selectedProcess.set(null)" class="flex-shrink-0 p-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors">
                    <app-icon name="x" [size]="15" [strokeWidth]="2.5"></app-icon>
                  </button>
                </div>
              </div>

              <!-- Scrollable Body -->
              <div class="flex-1 overflow-y-auto p-5 space-y-5">

                <!-- Status pill -->
                <div class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                  <div class="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    [ngClass]="{
                      'bg-emerald-500': selectedProcess()!.status === 'COMPLETED' || selectedProcess()!.status === 'SUCCESS',
                      'bg-amber-500': selectedProcess()!.status === 'PENDING',
                      'bg-blue-500': selectedProcess()!.status === 'IN_PROGRESS',
                      'bg-rose-500': selectedProcess()!.status === 'ERROR' || selectedProcess()!.status === 'FAILED',
                      'bg-slate-400': !['COMPLETED','SUCCESS','PENDING','IN_PROGRESS','ERROR','FAILED'].includes(selectedProcess()!.status)
                    }">
                  </div>
                  <span class="text-sm font-bold text-slate-700 dark:text-slate-200 flex-1">{{ selectedProcess()!.status }}</span>
                  <span class="text-xs text-slate-400">{{ selectedProcess()!.updatedAt | date:'dd/MM/yyyy' }}</span>
                </div>

                <!-- Despacho -->
                <div class="space-y-1">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <app-icon name="landmark" [size]="11"></app-icon>Despacho Judicial
                  </p>
                  <p class="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug">{{ selectedProcess()!.despacho }}</p>
                </div>

                <!-- Departamento -->
                <div class="space-y-1">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <app-icon name="map-pin" [size]="11"></app-icon>Departamento
                  </p>
                  <p class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ selectedProcess()!.departamento }}</p>
                </div>

                <!-- Fechas -->
                <div class="grid grid-cols-2 gap-2.5">
                  <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/40">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Radicación</p>
                    <p class="text-sm font-bold text-slate-700 dark:text-slate-200">{{ selectedProcess()!.processDate | date:'dd MMM yyyy' }}</p>
                  </div>
                  <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/40">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Última Actuación</p>
                    <p class="text-sm font-bold text-slate-700 dark:text-slate-200">{{ selectedProcess()!.lastActionDate | date:'dd MMM yyyy' }}</p>
                  </div>
                </div>

                <!-- Sujetos Procesales -->
                @if (selectedProcess()!.sujetosProcesales) {
                  <div class="space-y-2.5">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <app-icon name="users" [size]="11"></app-icon>Sujetos Procesales
                    </p>
                    <div class="space-y-2">
                      @for (parte of parseSujetos(selectedProcess()!.sujetosProcesales!); track $index) {
                        <div class="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/40">
                          <div class="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-500/20 dark:to-blue-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <app-icon name="user" [size]="13"></app-icon>
                          </div>
                          <div class="min-w-0 flex-1">
                            <p class="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wide leading-tight">{{ parte.rol }}</p>
                            <p class="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-snug mt-0.5">{{ parte.nombre }}</p>
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                }
              </div>

              <!-- Panel Footer CTA -->
              <div class="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex-shrink-0">
                <button (click)="verDetalle(selectedProcess()!.id.toString())"
                  class="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-indigo-500/30 hover:-translate-y-0.5 transition-all outline-none">
                  <span>Ver Expediente Completo</span>
                  <app-icon name="arrow-right" [size]="16" [strokeWidth]="2.5"></app-icon>
                </button>
              </div>
            </div>
          </aside>
        }
      </div>

      <!-- ─── New Process Modal ─── -->
      @if (isModalOpen()) {
        <div class="fixed inset-0 z-[60] flex items-center justify-center">
          <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" (click)="closeModal()"></div>
          <div class="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl overflow-hidden animate-fade-in-up m-4 border border-slate-100 dark:border-slate-700">
            <div class="px-8 py-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/50">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                  <app-icon name="briefcase" [size]="20" [strokeWidth]="2"></app-icon>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-slate-800 dark:text-slate-200 tracking-tight">Nuevo Proceso Judicial</h3>
                  <p class="text-sm text-slate-500 font-medium">Completa los datos iniciales</p>
                </div>
              </div>
              <button (click)="closeModal()" class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <app-icon name="x" [size]="20" [strokeWidth]="2.5"></app-icon>
              </button>
            </div>
            <div class="p-8 space-y-5">
              <app-searchable-select label="Ciudad" placeholder="Ej. Bogotá D.C." [options]="ciudades" [value]="selectedCiudad()" (valueChange)="selectedCiudad.set($event)"></app-searchable-select>
              <app-searchable-select label="Especialidad" placeholder="Seleccione la rama de derecho" [options]="especialidades" [value]="selectedEspecialidad()" (valueChange)="selectedEspecialidad.set($event)"></app-searchable-select>
              <app-searchable-select label="Despacho Judicial" placeholder="Busque el juzgado o tribunal" [options]="despachos" [value]="selectedDespacho()" (valueChange)="selectedDespacho.set($event)"></app-searchable-select>

              <!-- Radicado Number Field -->
              <div class="space-y-1.5">
                <label class="block text-sm font-semibold text-slate-700 dark:text-slate-200">Número de Radicado</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <app-icon name="file-text" class="text-slate-400" [size]="18"></app-icon>
                  </div>
                  <input type="text" [ngModel]="radicadoNumber()" (ngModelChange)="radicadoNumber.set($event)"
                    [disabled]="isSyncing()"
                    class="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-4 outline-none transition-all shadow-sm font-mono text-slate-800 dark:text-slate-200 placeholder:text-slate-400 placeholder:font-sans disabled:opacity-60"
                    placeholder="Ej. 05001333300020130157701">
                </div>
              </div>

              <!-- ─── Sync Progress Steps ─── -->
              @if (syncStep() !== 'idle') {
                <div class="rounded-2xl border overflow-hidden transition-all"
                  [ngClass]="{
                    'border-blue-200 bg-blue-50/50 dark:border-blue-800/60 dark:bg-blue-900/10': syncStep() === 'posting' || syncStep() === 'tracking',
                    'border-emerald-200 bg-emerald-50/50 dark:border-emerald-800/60 dark:bg-emerald-900/10': syncStep() === 'done',
                    'border-rose-200 bg-rose-50/50 dark:border-rose-800/60 dark:bg-rose-900/10': syncStep() === 'error'
                  }">

                  <!-- Steps Row -->
                  <div class="flex items-center px-4 py-3 gap-0 border-b"
                    [ngClass]="{
                      'border-blue-100 dark:border-blue-800/40': syncStep() === 'posting' || syncStep() === 'tracking',
                      'border-emerald-100 dark:border-emerald-800/40': syncStep() === 'done',
                      'border-rose-100 dark:border-rose-800/40': syncStep() === 'error'
                    }">

                    <!-- Step 1: POST -->
                    <div class="flex items-center gap-2 flex-1">
                      <div class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                        [ngClass]="{
                          'bg-blue-500 text-white animate-pulse': syncStep() === 'posting',
                          'bg-emerald-500 text-white': syncStep() === 'tracking' || syncStep() === 'done',
                          'bg-rose-500 text-white': syncStep() === 'error'
                        }">
                        @if (syncStep() === 'posting') { <app-icon name="refresh-cw" [size]="12" class="animate-spin"></app-icon> }
                        @else if (syncStep() === 'error') { <app-icon name="x" [size]="12" [strokeWidth]="3"></app-icon> }
                        @else { <app-icon name="check" [size]="12" [strokeWidth]="3"></app-icon> }
                      </div>
                      <span class="text-xs font-semibold"
                        [ngClass]="syncStep() === 'posting' ? 'text-blue-700 dark:text-blue-400' : 'text-emerald-700 dark:text-emerald-400'">
                        Enviando
                      </span>
                    </div>

                    <!-- Connector -->
                    <div class="h-px flex-1 max-w-[32px]"
                      [ngClass]="syncStep() === 'tracking' || syncStep() === 'done' ? 'bg-emerald-300' : 'bg-slate-200 dark:bg-slate-700'">
                    </div>

                    <!-- Step 2: SSE -->
                    <div class="flex items-center gap-2 flex-1 justify-center">
                      <div class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                        [ngClass]="{
                          'bg-slate-200 dark:bg-slate-700 text-slate-400': syncStep() === 'posting' || syncStep() === 'error',
                          'bg-blue-500 text-white': syncStep() === 'tracking',
                          'bg-emerald-500 text-white': syncStep() === 'done'
                        }">
                        @if (syncStep() === 'tracking') { <app-icon name="refresh-cw" [size]="12" class="animate-spin"></app-icon> }
                        @else if (syncStep() === 'done') { <app-icon name="check" [size]="12" [strokeWidth]="3"></app-icon> }
                        @else { <span>2</span> }
                      </div>
                      <span class="text-xs font-semibold"
                        [ngClass]="{
                          'text-slate-400': syncStep() === 'posting' || syncStep() === 'error',
                          'text-blue-700 dark:text-blue-400': syncStep() === 'tracking',
                          'text-emerald-700 dark:text-emerald-400': syncStep() === 'done'
                        }">Monitoreando</span>
                    </div>

                    <!-- Connector -->
                    <div class="h-px flex-1 max-w-[32px]"
                      [ngClass]="syncStep() === 'done' ? 'bg-emerald-300' : 'bg-slate-200 dark:bg-slate-700'">
                    </div>

                    <!-- Step 3: Done -->
                    <div class="flex items-center gap-2 flex-1 justify-end">
                      <div class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                        [ngClass]="{
                          'bg-slate-200 dark:bg-slate-700 text-slate-400': syncStep() !== 'done',
                          'bg-emerald-500 text-white': syncStep() === 'done'
                        }">
                        @if (syncStep() === 'done') { <app-icon name="check" [size]="12" [strokeWidth]="3"></app-icon> }
                        @else { <span>3</span> }
                      </div>
                      <span class="text-xs font-semibold"
                        [ngClass]="syncStep() === 'done' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400'">
                        Completado
                      </span>
                    </div>
                  </div>

                  <!-- Status Message -->
                  <div class="px-4 py-3 flex items-start gap-2">
                    @if (isSyncing()) {
                      <app-icon name="refresh-cw" [size]="14" class="animate-spin mt-0.5 flex-shrink-0"
                        [ngClass]="syncStep() === 'tracking' ? 'text-blue-500' : 'text-blue-500'">
                      </app-icon>
                    } @else if (syncStep() === 'done') {
                      <app-icon name="check-circle" [size]="14" class="text-emerald-500 mt-0.5 flex-shrink-0"></app-icon>
                    } @else if (syncStep() === 'error') {
                      <app-icon name="alert-circle" [size]="14" class="text-rose-500 mt-0.5 flex-shrink-0"></app-icon>
                    }
                    <p class="text-xs font-semibold leading-relaxed"
                      [ngClass]="{
                        'text-blue-700 dark:text-blue-400': syncStep() === 'posting' || syncStep() === 'tracking',
                        'text-emerald-700 dark:text-emerald-400': syncStep() === 'done',
                        'text-rose-700 dark:text-rose-400': syncStep() === 'error'
                      }">
                      {{ syncMessage() }}
                    </p>
                  </div>
                </div>
              }
            </div>

            <!-- Footer -->
            <div class="px-8 py-5 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 flex items-center gap-3 justify-end">
              <button (click)="closeModal()" [disabled]="isSyncing()"
                class="px-5 py-2.5 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                Cancelar
              </button>
              @if (syncStep() === 'error') {
                <button (click)="registrarProceso()"
                  class="px-5 py-2.5 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md transition-all flex items-center gap-2">
                  <app-icon name="refresh-cw" [size]="16" [strokeWidth]="2.5"></app-icon>Reintentar
                </button>
              } @else {
                <button (click)="registrarProceso()" [disabled]="isSyncing()"
                  class="px-5 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 transition-all flex items-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none outline-none">
                  @if (isSyncing()) {
                    <app-icon name="refresh-cw" [size]="16" class="animate-spin"></app-icon>
                    <span>Procesando...</span>
                  } @else {
                    <app-icon name="plus" [size]="16" [strokeWidth]="2.5"></app-icon>
                    <span>Registrar Proceso</span>
                  }
                </button>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(16px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    .animate-slide-in-right { animation: slideInRight 0.22s cubic-bezier(0.16,1,0.3,1); }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up { animation: fadeInUp 0.3s ease-out; }
  `]
})
export class MyProcessesComponent implements OnInit {

  private router = inject(Router);
  private radicadoService = inject(RadicadoService);

  processes = signal<RadicadoDto[]>([]);
  selectedProcess = signal<RadicadoDto | null>(null);
  isLoading = signal(false);
  searchQuery = '';

  filteredProcesses() {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) return this.processes();
    return this.processes().filter(p =>
      p.radicadoNumber.toLowerCase().includes(q) ||
      p.despacho.toLowerCase().includes(q) ||
      p.departamento.toLowerCase().includes(q) ||
      (p.sujetosProcesales || '').toLowerCase().includes(q)
    );
  }

  // Modal state
  isModalOpen = signal(false);
  isSyncing = signal(false);
  syncStep = signal<'idle' | 'posting' | 'tracking' | 'done' | 'error'>('idle');
  syncMessage = signal<string>('');
  syncTrackingId = signal<string>('');
  radicadoNumber = signal<string>('');
  selectedCiudad = signal<string | null>(null);
  selectedEspecialidad = signal<string | null>(null);
  selectedDespacho = signal<string | null>(null);

  ciudades: SelectOption[] = [
    { value: 'BOG', label: 'Bogotá D.C.' }, { value: 'MED', label: 'Medellín' },
    { value: 'CAL', label: 'Cali' }, { value: 'BAQ', label: 'Barranquilla' },
    { value: 'CTG', label: 'Cartagena' }, { value: 'BUC', label: 'Bucaramanga' }
  ];
  especialidades: SelectOption[] = [
    { value: 'CIV', label: 'Civil' }, { value: 'LAB', label: 'Laboral' },
    { value: 'FAM', label: 'Familia' }, { value: 'PEN', label: 'Penal' },
    { value: 'ADM', label: 'Administrativo' }, { value: 'COM', label: 'Comercial' }
  ];
  despachos: SelectOption[] = [
    { value: 'J01CC', label: 'Juzgado 01 Civil del Circuito' },
    { value: 'J05LC', label: 'Juzgado 05 Laboral del Circuito' },
    { value: 'J01PM', label: 'Juzgado 01 Promiscuo Municipal' },
    { value: 'TASC',  label: 'Tribunal Administrativo - Sala Contenciosa' },
    { value: 'CSJCL', label: 'Corte Suprema de Justicia - Sala Casación Laboral' }
  ];

  ngOnInit() { this.loadProcesses(); }

  loadProcesses() {
    this.isLoading.set(true);
    this.selectedProcess.set(null);
    this.radicadoService.getAllRadicados().subscribe({
      next: (data) => { this.processes.set(data); this.isLoading.set(false); },
      error: (err) => { console.error('Failed to load radicados', err); this.isLoading.set(false); }
    });
  }

  selectProcess(proc: RadicadoDto) {
    this.selectedProcess.set(this.selectedProcess()?.id === proc.id ? null : proc);
  }

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

  openModal() { this.isModalOpen.set(true); }

  closeModal() {
    if (this.isSyncing()) return; // Prevent closing while sync is running
    this.isModalOpen.set(false);
    this.selectedCiudad.set(null);
    this.selectedEspecialidad.set(null);
    this.selectedDespacho.set(null);
    this.radicadoNumber.set('');
    this.syncStep.set('idle');
    this.syncMessage.set('');
    this.syncTrackingId.set('');
    this.isSyncing.set(false);
  }

  simularCreacion() {
    this.closeModal();
    this.processes.update(list => [{
      id: Math.floor(Math.random() * 1000),
      radicadoNumber: this.radicadoNumber() || '44001333300020130157700',
      title: 'Proceso Simulado',
      despacho: this.selectedDespacho() || 'Despacho Local',
      departamento: this.selectedCiudad() || 'BOGOTÁ',
      status: 'PENDING',
      processDate: new Date().toISOString(),
      lastActionDate: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, ...list]);
  }

  /**
   * Main sync flow: POST /sync → get trackingId → SSE poll → done
   */
  registrarProceso() {
    const rawRadicado = this.radicadoNumber()?.trim();
    if (!rawRadicado) {
      this.syncStep.set('error');
      this.syncMessage.set('Ingrese el número de radicado (CPN) antes de continuar.');
      return;
    }

    this.isSyncing.set(true);
    this.syncStep.set('posting');
    this.syncMessage.set('Enviando solicitud al servidor judicial...');

    this.radicadoService.syncRadicado({ radicadoNumber: rawRadicado }).subscribe({
      next: (res) => {
        this.syncTrackingId.set(res.trackingId);
        this.syncStep.set('tracking');
        this.syncMessage.set(`Radicado recibido. Monitoreando sincronización...`);
        this.listenSyncStream(res.trackingId);
      },
      error: (err) => {
        this.isSyncing.set(false);
        this.syncStep.set('error');
        const msg = err?.error?.message || err?.message || 'No se pudo contactar al servidor.';
        this.syncMessage.set(`Error: ${msg}`);
      }
    });
  }

  private listenSyncStream(trackingId: string) {
    this.radicadoService.getSyncStatusStream(trackingId).pipe(
      takeWhile(res => !['COMPLETED','FINISHED','SUCCESS','FAILED','ERROR'].includes(
        (res.status || '').toUpperCase()), true)
    ).subscribe({
      next: (res) => {
        const s = (res.status || '').toUpperCase();
        if (['COMPLETED', 'FINISHED', 'SUCCESS'].includes(s)) {
          this.isSyncing.set(false);
          this.syncStep.set('done');
          this.syncMessage.set('¡Proceso registrado exitosamente!');
          // Auto-refresh list and close modal after 1.8s
          setTimeout(() => {
            this.closeModal();
            this.loadProcesses();
          }, 1800);
        } else if (['FAILED', 'ERROR'].includes(s)) {
          this.isSyncing.set(false);
          this.syncStep.set('error');
          this.syncMessage.set(res.message || 'La sincronización finalizó con un error en el servidor.');
        } else {
          // Intermediate status update
          this.syncMessage.set(`Estado: ${res.status}${res.message ? ' — ' + res.message : ''}`);
        }
      },
      error: () => {
        this.isSyncing.set(false);
        this.syncStep.set('error');
        this.syncMessage.set('Se perdió la conexión con el servidor de sincronización.');
      }
    });
  }

  // Keep legacy method for potential future standalone test
  testSyncRadicado() { this.registrarProceso(); }

  verDetalle(id: string) {
    this.router.navigate(['/judiciales/mis-procesos', id], {
      state: { process: this.selectedProcess() }
    });
  }

  toggleTestProcesses() {
    if (this.processes().length === 0) {
      this.processes.set([
        {
          id: 1001, radicadoNumber: '11001310300120230012300',
          title: 'Demanda Laboral por Despido Injustificado', departamento: 'BOGOTÁ',
          despacho: 'Juzgado 05 Laboral del Circuito de Bogotá D.C.', status: 'IN_PROGRESS',
          processDate: '2023-03-15T00:00:00', lastActionDate: '2025-01-20T00:00:00',
          updatedAt: new Date().toISOString(),
          sujetosProcesales: 'Demandante: CARLOS ANDRÉS PÉREZ GÓMEZ | DEMANDADO: EMPRESA XYZ S.A.S | APODERADO: JUAN FERNANDO BETANCUR GONZALEZ'
        },
        {
          id: 1002, radicadoNumber: '05001333300020130157702',
          title: 'Sucesión Intestada Familia Rodríguez', departamento: 'MEDELLÍN',
          despacho: 'Juzgado 01 Promiscuo Municipal de Medellín', status: 'PENDING',
          processDate: '2024-06-01T00:00:00', lastActionDate: '2024-12-10T00:00:00',
          updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
        }
      ]);
    } else {
      this.processes.set([]);
      this.selectedProcess.set(null);
    }
  }
}
