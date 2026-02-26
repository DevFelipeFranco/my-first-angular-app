import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../components/ui/icons.component';

interface Client {
  id: string;
  name: string;
  company?: string;
  avatar: string;
  status: 'Activo' | 'Inactivo' | 'Potencial';
  casesCount: number;
  lastContact: string;
  email: string;
  phone: string;
  // Progress & Task fields
  currentTask?: string;
  progress?: number;
  taskStatus?: 'Completado' | 'En Progreso' | 'Pendiente';
  startedTime?: string;
}

interface Activity {
  id: number;
  date: string;
  time: string;
  title: string;
  desc: string;
  type: 'document' | 'meeting' | 'legal' | 'communication';
}

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  template: `
    <div class="space-y-6 relative">
      
      <!-- Toolbar (Only visible in list view) -->
      @if (!selectedClient()) {
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div class="relative w-full sm:w-64">
            <app-icon name="search" [size]="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></app-icon>
            <input type="text" placeholder="Buscar cliente..." class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400">
          </div>
          <div class="flex gap-3">
             <button class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
               <app-icon name="activity" [size]="16"></app-icon>
               Reiniciar Simulación
             </button>
             <a 
                routerLink="/clients/new"
                class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
               <app-icon name="users" [size]="16"></app-icon>
               Nuevo Cliente
             </a>
          </div>
        </div>

        <!-- Client Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (client of clients(); track client.id) {
            <!-- Tailwind Styled Card with Progress -->
            <div 
              (click)="selectClient(client)"
              class="bg-white rounded-2xl border border-slate-100 p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group relative overflow-hidden flex flex-col justify-between h-full"
            >
              <!-- Top color bar -->
              <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div>
                <div class="flex items-start justify-between mb-4">
                  <div class="flex items-center gap-3">
                    <img [src]="client.avatar" class="w-12 h-12 rounded-full border-2 border-slate-50 object-cover shadow-sm">
                    <div>
                      <h3 class="font-bold text-slate-800 text-base leading-tight">{{ client.name }}</h3>
                       @if (client.currentTask) {
                        <p class="text-xs text-slate-500 font-medium truncate max-w-[150px]" [title]="client.currentTask">{{ client.currentTask }}</p>
                      } @else {
                        <p class="text-xs text-slate-500 font-medium">{{ client.company }}</p>
                      }
                    </div>
                  </div>
                  @if (client.taskStatus) {
                     <span class="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider" 
                      [class]="getTaskStatusClass(client.taskStatus!)">
                      {{ client.taskStatus }}
                    </span>
                  } @else {
                    <span class="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border" 
                      [class]="getStatusClass(client.status)">
                      {{ client.status }}
                    </span>
                  }
                </div>

                <!-- Progress Section -->
                @if (client.progress !== undefined) {
                  <div class="space-y-2 mb-6">
                     <div class="flex justify-between items-end">
                        <span class="text-xs font-semibold text-slate-700">Progreso</span>
                        <span class="text-xs font-bold text-slate-800">{{ client.progress }}%</span>
                     </div>
                     <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-indigo-600 h-1.5 rounded-full transition-all duration-1000 ease-out" [style.width.%]="client.progress"></div>
                     </div>
                  </div>
                } @else {
                  <!-- Standard Stats if no active task -->
                   <div class="space-y-3 mb-6">
                     <div class="flex items-center gap-3 text-sm text-slate-600">
                        <div class="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                          <app-icon name="briefcase" [size]="16"></app-icon>
                        </div>
                        <div>
                          <span class="block text-xs text-slate-400">Casos Activos</span>
                          <span class="font-semibold">{{ client.casesCount }} Expedientes</span>
                        </div>
                     </div>
                  </div>
                }
              </div>

              <!-- Footer Actions -->
              <div class="pt-4 border-t border-slate-50 flex justify-between items-center mt-auto">
                 @if (client.startedTime) {
                   <div class="flex items-center gap-1.5 text-xs text-slate-400">
                      <app-icon name="clock" [size]="12"></app-icon>
                      {{ client.startedTime }}
                   </div>
                 } @else {
                   <span class="text-xs text-slate-400 font-medium">Último contacto: {{ client.lastContact }}</span>
                 }

                 @if (client.progress === 100) {
                    <button class="text-indigo-600 text-xs font-bold hover:text-indigo-800 transition-colors uppercase tracking-wide">
                      Ver Reporte
                    </button>
                 } @else {
                    <span class="text-slate-400 hover:text-indigo-600 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors">
                      Ver Detalles <app-icon name="chevron-right" [size]="12"></app-icon>
                    </span>
                 }
              </div>
            </div>
          }
        </div>
      } @else {
        <!-- Client Detail View (Timeline) -->
        <div class="animate-fade-in">
          
          <!-- Back Navigation -->
          <button (click)="clearSelection()" class="mb-6 flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium">
            <app-icon name="chevron-right" class="rotate-180" [size]="20"></app-icon>
            Volver a la lista de clientes
          </button>

          <!-- Client Header -->
          <div class="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm mb-8 flex flex-col md:flex-row items-center md:items-start gap-6">
             <img [src]="selectedClient()!.avatar" class="w-24 h-24 rounded-full border-4 border-slate-50 shadow-md object-cover">
             <div class="flex-1 text-center md:text-left">
                <div class="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                   <h1 class="text-3xl font-bold text-slate-800">{{ selectedClient()!.name }}</h1>
                   <span class="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200 self-center md:self-auto">
                     CLIENTE VIP
                   </span>
                </div>
                <p class="text-slate-500 mb-4 text-lg">{{ selectedClient()!.company || 'Particular' }}</p>
                
                <div class="flex flex-wrap justify-center md:justify-start gap-4">
                   <a href="#" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors text-sm border border-slate-200">
                      <div class="w-2 h-2 rounded-full bg-slate-400"></div>
                      {{ selectedClient()!.email }}
                   </a>
                   <a href="#" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors text-sm border border-slate-200">
                      <div class="w-2 h-2 rounded-full bg-slate-400"></div>
                      {{ selectedClient()!.phone }}
                   </a>
                </div>
             </div>
             
             <div class="flex gap-3">
                <button class="p-3 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors">
                   <app-icon name="file-text" [size]="24"></app-icon>
                </button>
                <button class="p-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-colors">
                   <app-icon name="calendar" [size]="24"></app-icon>
                </button>
             </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <!-- Timeline Section -->
             <div class="lg:col-span-2">
                <h3 class="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                   <div class="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                      <app-icon name="activity" [size]="20"></app-icon>
                   </div>
                   Línea de Tiempo del Proceso
                </h3>

                <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                  <div class="relative border-l-2 border-slate-200 ml-3 space-y-12">
                     @for (group of clientHistory(); track group.date) {
                        <div class="relative">
                           <div class="absolute -left-[21px] top-0 bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded border border-slate-200">
                              {{ group.date }}
                           </div>
                           
                           <div class="pt-8 space-y-8">
                              @for (item of group.items; track item.id) {
                                 <div class="relative pl-8 group/item">
                                    <!-- Progress Dot -->
                                    <div class="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm transition-transform group-hover/item:scale-125"
                                       [class]="getDotColor(item.type)">
                                    </div>
                                    
                                    <div class="flex justify-between items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                       <div>
                                          <p class="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">{{ item.time }}</p>
                                          <h4 class="text-base font-bold text-slate-800">{{ item.title }}</h4>
                                          <p class="text-sm text-slate-600 mt-1 leading-relaxed">{{ item.desc }}</p>
                                       </div>
                                       
                                       <div class="text-slate-300">
                                          @switch (item.type) {
                                             @case ('document') { <app-icon name="file-text" [size]="20"></app-icon> }
                                             @case ('meeting') { <app-icon name="users" [size]="20"></app-icon> }
                                             @case ('legal') { <app-icon name="gavel" [size]="20"></app-icon> }
                                             @case ('communication') { <app-icon name="bell" [size]="20"></app-icon> }
                                          }
                                       </div>
                                    </div>
                                 </div>
                              }
                           </div>
                        </div>
                     }
                  </div>
                </div>
             </div>

             <!-- Side Stats for Client -->
             <div class="space-y-6">
                <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                   <h3 class="font-bold text-slate-800 mb-4">Resumen de Cuenta</h3>
                   <div class="space-y-4">
                      <div class="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                         <span class="text-sm text-slate-600">Total Facturado</span>
                         <span class="font-bold text-slate-800">$12,450.00</span>
                      </div>
                      <div class="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                         <span class="text-sm text-slate-600">Horas Invertidas</span>
                         <span class="font-bold text-slate-800">48 hrs</span>
                      </div>
                      <div class="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                         <span class="text-sm text-slate-600">Estado Legal</span>
                         <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">AL CORRIENTE</span>
                      </div>
                   </div>
                </div>

                <div class="bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 p-6 text-white relative overflow-hidden">
                   <!-- Decorative circles -->
                   <div class="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
                   <div class="absolute bottom-10 -left-10 w-24 h-24 bg-white/10 rounded-full"></div>

                   <h3 class="font-bold text-lg mb-2 relative z-10">Próxima Audiencia</h3>
                   <p class="text-indigo-100 text-sm mb-6 relative z-10">Juzgado 4° de lo Civil</p>
                   
                   <div class="flex items-end gap-2 relative z-10">
                      <span class="text-4xl font-bold">24</span>
                      <span class="text-lg font-medium mb-1 opacity-80">OCT</span>
                   </div>
                   <p class="text-sm text-indigo-100 mt-2 relative z-10">09:00 AM - Sala 3B</p>
                </div>
             </div>

          </div>

        </div>
      }
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
export class ClientsComponent {
  selectedClient = signal<Client | null>(null);

  clients = signal<Client[]>([
    {
      id: '1',
      name: 'TechCorp Solutions',
      company: 'Tecnología y Software',
      avatar: 'https://picsum.photos/seed/techcorp/200/200',
      status: 'Activo',
      casesCount: 3,
      lastContact: 'Hace 2 días',
      email: 'legal@techcorp.com',
      phone: '+52 55 1234 5678',
      currentTask: 'Revisión de Contrato Anual',
      progress: 100,
      taskStatus: 'Completado',
      startedTime: 'Iniciado hace 2 min'
    },
    {
      id: '2',
      name: 'Roberto Gómez',
      company: 'Particular',
      avatar: 'https://picsum.photos/seed/roberto/200/200',
      status: 'Activo',
      casesCount: 1,
      lastContact: 'Hoy 09:30 AM',
      email: 'roberto.g@gmail.com',
      phone: '+52 55 9876 5432',
      currentTask: 'Sincronizando Evidencia',
      progress: 53,
      taskStatus: 'En Progreso',
      startedTime: 'Iniciado hace 4 min'
    },
    {
      id: '3',
      name: 'Grupo Inmobiliario G&S',
      company: 'Bienes Raíces',
      avatar: 'https://picsum.photos/seed/group/200/200',
      status: 'Potencial',
      casesCount: 0,
      lastContact: 'Hace 1 semana',
      email: 'contacto@gys.mx',
      phone: '+52 33 1122 3344',
      currentTask: 'Subiendo Archivos Masivos',
      progress: 100,
      taskStatus: 'Completado',
      startedTime: 'Iniciado hace 6 min'
    },
    {
      id: '4',
      name: 'Ana Martínez',
      company: 'Particular',
      avatar: 'https://picsum.photos/seed/ana/200/200',
      status: 'Activo',
      casesCount: 2,
      lastContact: 'Ayer',
      email: 'ana.martinez@outlook.com',
      phone: '+52 81 2233 4455',
      currentTask: 'Exportando Expediente',
      progress: 47,
      taskStatus: 'En Progreso',
      startedTime: 'Iniciado hace 8 min'
    },
    {
      id: '5',
      name: 'Restaurantes Del Valle',
      company: 'Hospitalidad',
      avatar: 'https://picsum.photos/seed/rest/200/200',
      status: 'Inactivo',
      casesCount: 5,
      lastContact: 'Hace 1 mes',
      email: 'admin@delvalle.com',
      phone: '+52 55 7777 8888',
      currentTask: 'Compilación de Assets',
      progress: 100,
      taskStatus: 'Completado',
      startedTime: 'Iniciado hace 10 min'
    },
    {
      id: '6',
      name: 'Lucía Fernández',
      company: 'Consultoría',
      avatar: 'https://picsum.photos/seed/lucia/200/200',
      status: 'Activo',
      casesCount: 2,
      lastContact: 'Hace 3 días',
      email: 'lucia.f@consultoria.com',
      phone: '+52 55 5555 5555',
      currentTask: 'Análisis de IA',
      progress: 100,
      taskStatus: 'Completado',
      startedTime: 'Iniciado hace 12 min'
    }
  ]);

  // Mock data for history based on selection
  clientHistory = computed(() => {
    return [
      {
        date: 'Octubre 2024',
        items: [
          { id: 1, time: '21 OCT', title: 'Audiencia Preliminar', desc: 'Presentación de pruebas iniciales ante el juez.', type: 'legal' },
          { id: 2, time: '18 OCT', title: 'Reunión de Estrategia', desc: 'Definición de pasos a seguir con el consejo directivo.', type: 'meeting' },
        ] as Activity[]
      },
      {
        date: 'Septiembre 2024',
        items: [
          { id: 3, time: '28 SEP', title: 'Contrato Firmado', desc: 'Recepción del contrato de prestación de servicios firmado.', type: 'document' },
          { id: 4, time: '15 SEP', title: 'Notificación Enviada', desc: 'Correo de seguimiento sobre el estado de la demanda.', type: 'communication' },
          { id: 5, time: '02 SEP', title: 'Apertura de Expediente', desc: 'Registro inicial del caso en el sistema interno.', type: 'document' },
        ] as Activity[]
      }
    ];
  });

  selectClient(client: Client) {
    this.selectedClient.set(client);
  }

  clearSelection() {
    this.selectedClient.set(null);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Activo': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Inactivo': return 'bg-slate-50 text-slate-500 border-slate-200';
      case 'Potencial': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-slate-50 text-slate-700';
    }
  }

  getTaskStatusClass(status: string): string {
    switch (status) {
      case 'Completado': return 'text-emerald-600 bg-emerald-50';
      case 'En Progreso': return 'text-blue-600 bg-blue-50';
      case 'Pendiente': return 'text-slate-500 bg-slate-100';
      default: return 'text-slate-600 bg-slate-50';
    }
  }

  getDotColor(type: string): string {
    switch (type) {
      case 'legal': return 'bg-rose-500';
      case 'meeting': return 'bg-orange-500';
      case 'document': return 'bg-indigo-500';
      case 'communication': return 'bg-emerald-500';
      default: return 'bg-slate-400';
    }
  }
}