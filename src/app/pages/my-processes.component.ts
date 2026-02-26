import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IconComponent } from '../components/ui/icons.component';
import { SearchableSelectComponent, SelectOption } from '../components/ui/searchable-select.component';

// Simulated Process Interface
interface LegalProcess {
  id: string;
  title: string;
  client: string;
  status: 'Activo' | 'Pausado' | 'Cerrado';
  date: Date;
}

@Component({
  selector: 'app-my-processes',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, SearchableSelectComponent],
  template: `
    <div class="h-full flex flex-col p-6 space-y-6 max-w-7xl mx-auto">
      
      <!-- Page Header -->
      <div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Mis Procesos Judiciales</h1>
        <p class="text-slate-500 mt-1">Gestiona todos tus expedientes y requerimientos legales.</p>
      </div>

      <!-- Main Toolbar -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        
        <!-- Left Side Tools -->
        <div class="flex items-center gap-2 text-slate-500">
          <button class="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Seleccionar">
             <app-icon name="square" [size]="20" [strokeWidth]="1.5"></app-icon>
          </button>
          
          <div class="w-px h-5 bg-slate-200 mx-1"></div>

          <button class="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Recargar">
             <app-icon name="refresh-cw" [size]="18" [strokeWidth]="2"></app-icon>
          </button>
          <button class="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Filtrar">
             <app-icon name="filter" [size]="18" [strokeWidth]="2"></app-icon>
          </button>
          <button class="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Exportar/Descargar">
             <app-icon name="download" [size]="18" [strokeWidth]="2"></app-icon>
          </button>
          <button class="p-2 hover:bg-red-50 text-slate-500 hover:text-red-500 rounded-lg transition-colors" title="Eliminar">
             <app-icon name="trash" [size]="18" [strokeWidth]="2"></app-icon>
          </button>

          <!-- Search Bar -->
          <div class="relative ml-2 w-full max-w-xs group hidden md:block">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <app-icon name="search" [size]="16" class="text-slate-400 group-focus-within:text-blue-500 transition-colors"></app-icon>
            </div>
            <input 
              type="text" 
              placeholder="Buscar proceso..." 
              class="w-full pl-9 pr-4 py-2 bg-slate-100 hover:bg-slate-200/50 focus:bg-white border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl text-sm transition-all outline-none"
            >
          </div>
        </div>

        <!-- Right Side Primary Button -->
        <button 
           (click)="openModal()"
           class="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
          <app-icon name="plus" [size]="18" [strokeWidth]="2.5"></app-icon>
          <span>Nuevo Proceso</span>
        </button>
      </div>

      <!-- Main Content Area -->
      <div class="flex-1 rounded-2xl overflow-hidden min-h-[400px]">
        
        <!-- Table View (If processes exist) -->
        @if (processes().length > 0) {
          <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                  <th class="p-4 font-semibold w-12 text-center">
                    <button class="hover:text-slate-700"><app-icon name="square" [size]="18"></app-icon></button>
                  </th>
                  <th class="p-4 font-semibold">Nº Expediente</th>
                  <th class="p-4 font-semibold">Descripción del Proceso</th>
                  <th class="p-4 font-semibold hidden md:table-cell">Cliente Relacionado</th>
                  <th class="p-4 font-semibold">Estado</th>
                  <th class="p-4 font-semibold hidden lg:table-cell">Última Modificación</th>
                  <th class="p-4 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (proc of processes(); track proc.id) {
                  <tr (click)="verDetalle(proc.id)" class="hover:bg-slate-50 transition-colors group cursor-pointer">
                    <td class="p-4 text-center text-slate-400 group-hover:text-slate-500">
                       <button (click)="$event.stopPropagation()"><app-icon name="square" [size]="18"></app-icon></button>
                    </td>
                    <td class="p-4">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                        {{proc.id}}
                      </span>
                    </td>
                    <td class="p-4 font-medium text-slate-900">{{proc.title}}</td>
                    <td class="p-4 text-slate-600 hidden md:table-cell">{{proc.client}}</td>
                    <td class="p-4">
                       <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border"
                             [ngClass]="{
                               'bg-emerald-50 text-emerald-700 border-emerald-200': proc.status === 'Activo',
                               'bg-amber-50 text-amber-700 border-amber-200': proc.status === 'Pausado',
                               'bg-slate-100 text-slate-700 border-slate-200': proc.status === 'Cerrado'
                             }">
                         <div class="w-1.5 h-1.5 rounded-full"
                              [ngClass]="{
                                'bg-emerald-500': proc.status === 'Activo',
                                'bg-amber-500': proc.status === 'Pausado',
                                'bg-slate-400': proc.status === 'Cerrado'
                              }"></div>
                         {{proc.status}}
                       </span>
                    </td>
                    <td class="p-4 text-slate-500 text-sm hidden lg:table-cell">{{proc.date | date:'mediumDate'}}</td>
                    <td class="p-4 text-right">
                       <button (click)="$event.stopPropagation()" class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                         <app-icon name="more-vertical" [size]="18"></app-icon>
                       </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        } 
        
        <!-- Empty State (No processes) -->
        @else {
          <div class="h-full min-h-[500px] flex flex-col items-center justify-center text-center px-4 bg-white border border-slate-200 border-dashed rounded-2xl relative overflow-hidden group">
            
            <!-- Decorative blur background -->
            <div class="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/50 pointer-events-none"></div>

            <div class="relative z-10 animate-fade-in-up">
              <!-- Illustrated Icon Container -->
              <div class="w-32 h-32 mx-auto mb-8 relative">
                <div class="absolute inset-0 bg-blue-100 rounded-full blur-xl scale-125 opacity-50 group-hover:opacity-70 transition-opacity duration-700"></div>
                <div class="relative w-full h-full bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-slate-100 flex items-center justify-center transform group-hover:-translate-y-2 transition-transform duration-500">
                  <div class="absolute inset-0 bg-gradient-to-tr from-blue-50 to-transparent rounded-[2rem] opacity-50"></div>
                  <app-icon name="inbox" [size]="56" class="text-blue-600 relative z-10" [strokeWidth]="1.5"></app-icon>
                </div>
                
                <!-- Floating mini elements -->
                <div class="absolute -top-2 -right-2 w-8 h-8 bg-indigo-500 rounded-xl shadow-lg flex items-center justify-center transform rotate-12 group-hover:rotate-45 group-hover:scale-110 transition-all duration-500 delay-100">
                  <app-icon name="file-text" [size]="14" class="text-white" [strokeWidth]="2"></app-icon>
                </div>
                <div class="absolute bottom-4 -left-4 w-6 h-6 bg-emerald-400 rounded-full shadow-md flex items-center justify-center transform -rotate-12 group-hover:-rotate-45 group-hover:scale-110 transition-all duration-500 delay-200">
                  <app-icon name="check" [size]="12" class="text-white" [strokeWidth]="3"></app-icon>
                </div>
              </div>

              <!-- Typography -->
              <h2 class="text-3xl font-extrabold text-slate-800 mb-3 tracking-tight">
                El inicio de un entorno organizado
              </h2>
              <p class="text-slate-500 max-w-md mx-auto mb-10 text-lg leading-relaxed">
                Aún no tienes procesos judiciales registrados. Empieza a digitalizar tus expedientes centralizando todo en un solo lugar.
              </p>

              <!-- Main Call to Action -->
              <div class="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <button (click)="openModal()" class="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3.5 rounded-2xl text-base font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all group/btn">
                  <app-icon name="plus" [size]="20" [strokeWidth]="2.5" class="transition-transform group-hover/btn:scale-110"></app-icon>
                  <span>Crear mi primer proceso</span>
                </button>
                <button (click)="toggleTestProcesses()" class="text-sm font-medium text-slate-400 hover:text-slate-600 hover:underline">
                   Cargar datos de prueba
                </button>
              </div>
              
              <p class="mt-8 text-xs text-slate-400 font-medium">
                Con la confianza de la tecnología dokqet
            </p>
            </div>
          </div>
        }

      </div>

      <!-- New Process Modal Backdrop -->
      @if (isModalOpen()) {
        <div class="fixed inset-0 z-[60] flex items-center justify-center">
          
          <!-- Blurry Dark Background -->
          <div 
            class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
            (click)="closeModal()">
          </div>

          <!-- Modal Content Panel -->
          <div class="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-fade-in-up m-4 border border-slate-100">
            
            <!-- Header -->
            <div class="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                  <app-icon name="briefcase" [size]="20" [strokeWidth]="2"></app-icon>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-slate-800 tracking-tight">Nuevo Proceso Judicial</h3>
                  <p class="text-sm text-slate-500 font-medium">Completa los datos iniciales</p>
                </div>
              </div>
              <button (click)="closeModal()" class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <app-icon name="plus" class="rotate-45" [size]="24"></app-icon>
              </button>
            </div>

            <!-- Body Form -->
            <div class="p-8 space-y-6">
              
              <app-searchable-select
                label="Ciudad"
                placeholder="Ej. Bogotá D.C."
                [options]="ciudades"
                [value]="selectedCiudad()"
                (valueChange)="selectedCiudad.set($event)"
              ></app-searchable-select>

              <app-searchable-select
                label="Especialidad"
                placeholder="Seleccione la rama de derecho"
                [options]="especialidades"
                [value]="selectedEspecialidad()"
                (valueChange)="selectedEspecialidad.set($event)"
              ></app-searchable-select>

              <app-searchable-select
                label="Despacho Judicial"
                placeholder="Busque el juzgado o tribunal"
                [options]="despachos"
                [value]="selectedDespacho()"
                (valueChange)="selectedDespacho.set($event)"
              ></app-searchable-select>

              <div class="space-y-1.5 text-left">
                <label class="block text-sm font-semibold text-slate-700">Número de Radicado</label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <app-icon name="file-text" class="text-slate-400 group-focus-within:text-blue-500 transition-colors" [size]="18"></app-icon>
                  </div>
                  <input 
                    type="text" 
                    class="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal"
                    placeholder="23 dígitos del CPN"
                  >
                </div>
                <p class="text-[11px] text-slate-500 font-medium pl-1 hidden sm:block">
                  Ej: 11001310300120230012300 (Código Único del Proceso)
                </p>
              </div>

            </div>

            <!-- Footer Actions -->
            <div class="px-8 py-5 border-t border-slate-100 bg-slate-50 flex items-center gap-3 justify-end">
              <button (click)="closeModal()" class="px-6 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-200 transition-colors">
                Cancelar
              </button>
              <button 
                (click)="simularCreacion()"
                class="px-6 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2">
                <span>Crear Proceso</span>
                <app-icon name="check" [size]="18" [strokeWidth]="3"></app-icon>
              </button>
            </div>

          </div>
        </div>
      }
    </div>
  `
})
export class MyProcessesComponent {

  private router = inject(Router);

  // Signal to hold our list of processes (initially empty to show the empty state)
  processes = signal<LegalProcess[]>([]);

  // Modal State handling
  isModalOpen = signal(false);

  // Selected values for the select fields
  selectedCiudad = signal<string | null>(null);
  selectedEspecialidad = signal<string | null>(null);
  selectedDespacho = signal<string | null>(null);

  // Mock Data for the Selects
  ciudades: SelectOption[] = [
    { value: 'BOG', label: 'Bogotá D.C.' },
    { value: 'MED', label: 'Medellín' },
    { value: 'CAL', label: 'Cali' },
    { value: 'BAQ', label: 'Barranquilla' },
    { value: 'CTG', label: 'Cartagena' },
    { value: 'BUC', label: 'Bucaramanga' }
  ];

  especialidades: SelectOption[] = [
    { value: 'CIV', label: 'Civil' },
    { value: 'LAB', label: 'Laboral' },
    { value: 'FAM', label: 'Familia' },
    { value: 'PEN', label: 'Penal' },
    { value: 'ADM', label: 'Administrativo' },
    { value: 'COM', label: 'Comercial' }
  ];

  despachos: SelectOption[] = [
    { value: 'J01CC', label: 'Juzgado 01 Civil del Circuito' },
    { value: 'J02CC', label: 'Juzgado 02 Civil del Circuito' },
    { value: 'J05LC', label: 'Juzgado 05 Laboral del Circuito' },
    { value: 'J01PM', label: 'Juzgado 01 Promiscuo Municipal' },
    { value: 'TASC', label: 'Tribunal Administrativo - Sala Contenciosa' },
    { value: 'CSJCL', label: 'Corte Suprema de Justicia - Sala Casación Laboral' }
  ];

  openModal() {
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    // Reset selections on close
    this.selectedCiudad.set(null);
    this.selectedEspecialidad.set(null);
    this.selectedDespacho.set(null);
  }

  simularCreacion() {
    // Add logic to save the new process...

    // Create new process object
    const newId = 'EXP-NUEVO-' + Math.floor(Math.random() * 1000);

    // For now we just close and add a fake entry to the table
    this.closeModal();
    this.processes.update(list => [
      {
        id: newId,
        title: 'Proceso de ' + (this.selectedEspecialidad() || 'Nueva Especialidad'),
        client: 'Cliente Nuevo',
        status: 'Activo',
        date: new Date()
      },
      ...list
    ]);
  }

  // Navigate to Process Detail
  verDetalle(id: string) {
    this.router.navigate(['/judiciales/mis-procesos', id]);
  }

  // Function to toggle fake data for demonstration purposes
  toggleTestProcesses() {
    if (this.processes().length === 0) {
      this.processes.set([
        { id: 'EXP-2024-001', title: 'Demanda Laboral por Despido Injustificado', client: 'Empresa Alpha S.A.', status: 'Activo', date: new Date() },
        { id: 'EXP-2024-002', title: 'Sucesión Intestada Familia Rodríguez', client: 'Carlos Rodríguez', status: 'Activo', date: new Date(Date.now() - 86400000 * 2) },
        { id: 'EXP-2024-003', title: 'Registro de Marca Comercial', client: 'Startup Innova', status: 'Pausado', date: new Date(Date.now() - 86400000 * 15) },
        { id: 'EXP-2023-145', title: 'Conciliación Extraprocesal de Deuda', client: 'Inversiones Beta', status: 'Cerrado', date: new Date(Date.now() - 86400000 * 45) },
      ]);
    } else {
      this.processes.set([]);
    }
  }
}
