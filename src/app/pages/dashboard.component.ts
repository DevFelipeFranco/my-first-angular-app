import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../components/ui/icons.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="animate-fade-in">
      
      <!-- ====================== ADMIN VIEW ====================== -->
      @if (isAdmin()) {
        <div class="space-y-8">
          
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-100">Vista de Socio Director</h1>
              <p class="text-slate-500 dark:text-slate-400 mt-1">Monitoreo global de la firma y rendimiento del equipo.</p>
            </div>
            <button class="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20">
               <app-icon name="file-text" [size]="16"></app-icon>
               Generar Reporte Mensual
             </button>
          </div>

          <!-- Admin Stats -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl transition-colors duration-300 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/60">
              <div class="flex justify-between items-start">
                 <div>
                    <p class="text-slate-500 dark:text-slate-400 text-sm font-medium">Ingresos Totales (Mes)</p>
                    <h3 class="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">$145,200</h3>
                 </div>
                 <div class="p-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
                    <app-icon name="bar-chart" [size]="24"></app-icon>
                 </div>
              </div>
              <div class="mt-4 flex items-center text-sm">
                 <span class="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded mr-2">+12.5%</span>
                 <span class="text-slate-400">vs mes anterior</span>
              </div>
            </div>

            <div class="bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl transition-colors duration-300 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/60">
              <div class="flex justify-between items-start">
                 <div>
                    <p class="text-slate-500 dark:text-slate-400 text-sm font-medium">Expedientes Activos</p>
                    <h3 class="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">128</h3>
                 </div>
                 <div class="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg">
                    <app-icon name="briefcase" [size]="24"></app-icon>
                 </div>
              </div>
               <div class="mt-4 flex items-center text-sm">
                 <span class="text-slate-600 dark:text-slate-300 font-bold bg-slate-100 dark:bg-slate-700/60 px-1.5 py-0.5 rounded mr-2">8 Nuevos</span>
                 <span class="text-slate-400">esta semana</span>
              </div>
            </div>

             <div class="bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl transition-colors duration-300 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/60">
              <div class="flex justify-between items-start">
                 <div>
                    <p class="text-slate-500 dark:text-slate-400 text-sm font-medium">Tasa de Éxito</p>
                    <h3 class="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">94.2%</h3>
                 </div>
                 <div class="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg">
                    <app-icon name="target" [size]="24"></app-icon>
                 </div>
              </div>
               <div class="mt-4 flex items-center text-sm">
                 <span class="text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-500/10 px-1.5 py-0.5 rounded mr-2">+2.1%</span>
                 <span class="text-slate-400">vs trimestre anterior</span>
              </div>
            </div>

            <div class="bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl transition-colors duration-300 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/60">
              <div class="flex justify-between items-start">
                 <div>
                    <p class="text-slate-500 dark:text-slate-400 text-sm font-medium">Eficiencia del Equipo</p>
                    <h3 class="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">87%</h3>
                 </div>
                 <div class="p-2 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg">
                    <app-icon name="users" [size]="24"></app-icon>
                 </div>
              </div>
               <div class="mt-4 flex items-center text-sm">
                 <span class="text-slate-400">Basado en cumplimiento de KPIs</span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Team Monitoring Section -->
            <div class="lg:col-span-2">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">Estado del Equipo en Tiempo Real</h2>
                <button (click)="refreshTeamData()" class="text-sm font-medium text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors">
                  <app-icon name="activity" [size]="16"></app-icon>
                  Actualizar Datos
                </button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                @for (member of teamMembers(); track member.id) {
                  <div class="bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl transition-colors duration-300 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow">
                    <div class="flex justify-between items-start mb-4">
                      <div class="flex items-center gap-3">
                        <img [src]="member.avatar" class="w-10 h-10 rounded-full border-2 border-slate-100 dark:border-slate-700/80">
                        <div>
                          <h4 class="font-bold text-slate-800 dark:text-slate-100">{{ member.name }}</h4>
                          <p class="text-xs text-slate-400 dark:text-slate-500">{{ member.role }}</p>
                        </div>
                      </div>
                      <span class="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider"
                        [ngClass]="member.status === 'En Reunion'
                          ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400'
                          : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'">
                        {{ member.status }}
                      </span>
                    </div>

                    <div class="space-y-2">
                      <div class="flex justify-between text-xs">
                         <span class="text-slate-400 truncate max-w-[180px]">{{ member.currentTask }}</span>
                         <span class="font-bold text-slate-600 dark:text-slate-300">{{ member.progress }}%</span>
                      </div>
                      <div class="w-full bg-slate-100 dark:bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-indigo-500 dark:bg-indigo-400 h-1.5 rounded-full transition-all duration-1000" [style.width.%]="member.progress"></div>
                      </div>
                    </div>

                    <div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex justify-between items-center">
                       <span class="text-xs text-slate-400 flex items-center gap-1">
                         <app-icon name="clock" [size]="12"></app-icon> {{ member.lastActive }}
                       </span>
                       <button class="text-xs font-bold text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">Ver Carga de Trabajo</button>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Charts / Analytics Column -->
            <div class="space-y-6">
               <div class="bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl transition-colors duration-300 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm">
                  <h3 class="font-bold text-slate-800 dark:text-slate-100 mb-6">Distribución de Casos</h3>
                  <div class="space-y-4">
                     <div>
                        <div class="flex justify-between text-sm mb-1.5">
                           <span class="text-slate-500 dark:text-slate-400">Corporativo (45%)</span>
                           <span class="font-bold text-slate-700 dark:text-slate-200">58</span>
                        </div>
                        <div class="w-full bg-slate-100 dark:bg-slate-700/50 rounded-full h-1.5">
                           <div class="bg-indigo-500 dark:bg-indigo-400 h-1.5 rounded-full" style="width: 45%"></div>
                        </div>
                     </div>
                     <div>
                        <div class="flex justify-between text-sm mb-1.5">
                           <span class="text-slate-500 dark:text-slate-400">Laboral (25%)</span>
                           <span class="font-bold text-slate-700 dark:text-slate-200">32</span>
                        </div>
                        <div class="w-full bg-slate-100 dark:bg-slate-700/50 rounded-full h-1.5">
                           <div class="bg-blue-500 dark:bg-blue-400 h-1.5 rounded-full" style="width: 25%"></div>
                        </div>
                     </div>
                     <div>
                        <div class="flex justify-between text-sm mb-1.5">
                           <span class="text-slate-500 dark:text-slate-400">Penal (15%)</span>
                           <span class="font-bold text-slate-700 dark:text-slate-200">19</span>
                        </div>
                        <div class="w-full bg-slate-100 dark:bg-slate-700/50 rounded-full h-1.5">
                           <div class="bg-rose-500 dark:bg-rose-400 h-1.5 rounded-full" style="width: 15%"></div>
                        </div>
                     </div>
                     <div>
                        <div class="flex justify-between text-sm mb-1.5">
                           <span class="text-slate-500 dark:text-slate-400">Civil/Familiar (15%)</span>
                           <span class="font-bold text-slate-700 dark:text-slate-200">19</span>
                        </div>
                        <div class="w-full bg-slate-100 dark:bg-slate-700/50 rounded-full h-1.5">
                           <div class="bg-emerald-500 dark:bg-emerald-400 h-1.5 rounded-full" style="width: 15%"></div>
                        </div>
                     </div>
                  </div>
               </div>

               <!-- Meta Mensual — subtle dark gradient -->
               <div class="bg-gradient-to-br from-indigo-600 to-indigo-700 dark:from-indigo-950 dark:to-slate-900 dark:border dark:border-indigo-500/20 p-6 rounded-2xl shadow-lg dark:shadow-[0_8px_32px_-8px_rgba(99,102,241,0.25)] text-white relative overflow-hidden">
                  <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 dark:bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                   <h3 class="font-bold text-lg mb-1 relative z-10">Meta Mensual</h3>
                   <p class="text-indigo-200 dark:text-indigo-400/80 text-sm mb-6 relative z-10">Facturación proyectada vs real</p>
                   <div class="relative z-10">
                      <div class="flex justify-between items-end mb-2">
                         <span class="text-3xl font-bold">$145k</span>
                         <span class="text-sm text-indigo-200 dark:text-indigo-400/80">Meta: $160k</span>
                      </div>
                      <div class="w-full bg-white/15 dark:bg-indigo-950/80 rounded-full h-2 mb-1">
                         <div class="bg-gradient-to-r from-emerald-400 to-emerald-500 h-2 rounded-full" style="width: 90%"></div>
                      </div>
                      <p class="text-right text-xs text-emerald-300 dark:text-emerald-400 font-bold">90% Completado</p>
                   </div>
               </div>
            </div>
          </div>
        </div>

      } @else {
        <!-- ====================== LAWYER VIEW ====================== -->
        <div class="space-y-6">
          
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-100">Hola, {{ currentUser()?.name }}</h1>
            <p class="text-slate-500 dark:text-slate-400 mt-1">Aquí está el resumen de tus casos para hoy.</p>
          </div>

          <!-- Personal Stats -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            @for (stat of lawyerStats(); track stat.label) {
              <div class="bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl transition-colors duration-300 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/60 hover:shadow-md transition-shadow group">
                <div class="flex items-center justify-between mb-4">
                  <div class="p-3 rounded-xl transition-colors duration-300" [class]="stat.bgClass">
                    <app-icon [name]="stat.icon" [class]="stat.iconClass" [size]="24"></app-icon>
                  </div>
                  <span class="text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider" 
                        [ngClass]="stat.trendUp
                          ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20'
                          : 'bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-700/50'">
                    {{ stat.trend }}
                  </span>
                </div>
                <h3 class="text-slate-500 dark:text-slate-400 text-sm font-medium">{{ stat.label }}</h3>
                <p class="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">{{ stat.value }}</p>
              </div>
            }
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <!-- Upcoming Hearings -->
            <div class="lg:col-span-2 bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl transition-colors duration-300 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/60 p-6">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <app-icon name="gavel" [size]="20" class="text-slate-400 dark:text-slate-500"></app-icon>
                  Mi Agenda Judicial
                </h2>
                <button class="text-indigo-500 dark:text-indigo-400 text-sm font-bold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors uppercase tracking-wider">Ver todo</button>
              </div>
              
              <div class="space-y-4">
                @for (hearing of hearings(); track hearing.id) {
                  <div class="flex items-center p-4 rounded-xl border border-slate-100 dark:border-slate-800/60 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:bg-slate-50/50 dark:hover:bg-indigo-900/10 transition-all group cursor-pointer">
                    <!-- Date Box -->
                    <div class="flex-shrink-0 w-16 h-16 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700/50 group-hover:border-indigo-300 dark:group-hover:border-indigo-500/40 group-hover:bg-white dark:group-hover:bg-slate-800/80 transition-all">
                      <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{{ hearing.day }}</span>
                      <span class="text-xl font-bold text-indigo-500 dark:text-indigo-400">{{ hearing.date }}</span>
                    </div>
                    
                    <!-- Details -->
                    <div class="ml-5 flex-1">
                      <div class="flex justify-between items-start">
                        <h3 class="font-bold text-slate-800 dark:text-slate-100 text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{{ hearing.title }}</h3>
                        <span class="text-[10px] font-bold px-2 py-1 rounded bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/40">{{ hearing.time }}</span>
                      </div>
                      <p class="text-xs text-slate-500 mt-1 flex items-center gap-2 font-medium">
                        <span class="text-indigo-500 dark:text-indigo-400 font-bold">{{ hearing.caseId }}</span> • {{ hearing.client }}
                      </p>
                      <p class="text-xs text-slate-400 mt-1 flex items-center gap-2">
                         <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                         {{ hearing.court }}
                      </p>
                    </div>

                    <button class="ml-2 p-2 text-slate-300 dark:text-slate-600 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/80">
                      <app-icon name="chevron-right" [size]="18"></app-icon>
                    </button>
                  </div>
                }
              </div>
            </div>

            <!-- Deadlines -->
            <div class="bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl transition-colors duration-300 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/60 p-6 flex flex-col">
               <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                 <app-icon name="clock" [size]="20" class="text-slate-400 dark:text-slate-500"></app-icon>
                 Mis Vencimientos
               </h2>
               
               <div class="flex-1 space-y-4">
                 @for (deadline of deadlines(); track deadline.id) {
                   <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/40 relative overflow-hidden group hover:border-slate-200 dark:hover:border-slate-600/50 transition-colors">
                     <div class="absolute left-0 top-0 bottom-0 w-1.5" [class]="deadline.urgent ? 'bg-rose-500' : 'bg-orange-400'"></div>
                     <div class="pl-3">
                       <div class="flex justify-between items-start mb-2">
                          <p class="text-xs font-bold uppercase tracking-wider" [ngClass]="deadline.urgent ? 'text-rose-500 dark:text-rose-400' : 'text-orange-500 dark:text-orange-400'">{{ deadline.daysLeft }}</p>
                          <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50 px-1.5 py-0.5 rounded bg-white dark:bg-slate-800/80 uppercase">{{ deadline.type }}</span>
                       </div>
                       <p class="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">{{ deadline.title }}</p>
                       <p class="text-xs text-slate-400 mt-1 font-medium">Exp: {{ deadline.caseId }}</p>
                     </div>
                   </div>
                 }
               </div>

               <button class="w-full mt-6 py-3 text-sm text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider hover:text-slate-600 dark:hover:text-slate-300 border border-dashed border-slate-200 dark:border-slate-700/50 rounded-xl hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all">
                 + Añadir tarea personal
               </button>
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
export class DashboardComponent {
  private authService = inject(AuthService);
  currentUser = this.authService.currentUser;
  
  // Role determination
  isAdmin = computed(() => this.currentUser()?.role === 'admin');

  // ============= LAWYER DATA =============
  lawyerStats = signal([
    { 
      label: 'Mis Casos Activos', 
      value: '12', 
      trend: '+1 Nuevo', 
      trendUp: true, 
      icon: 'briefcase', 
      bgClass: 'bg-indigo-50 text-indigo-600', 
      iconClass: 'currentColor' 
    },
    { 
      label: 'Audiencias (Mes)', 
      value: '5', 
      trend: '2 Esta semana', 
      trendUp: false, 
      icon: 'gavel', 
      bgClass: 'bg-slate-100 text-slate-600', 
      iconClass: 'currentColor' 
    },
    { 
      label: 'Horas Registradas', 
      value: '38h', 
      trend: 'Meta: 40h', 
      trendUp: true, 
      icon: 'bar-chart', 
      bgClass: 'bg-emerald-50 text-emerald-600', 
      iconClass: 'currentColor' 
    },
    { 
      label: 'Eficiencia', 
      value: '92%', 
      trend: 'Top 3', 
      trendUp: true,
      icon: 'target', 
      bgClass: 'bg-blue-50 text-blue-600', 
      iconClass: 'currentColor' 
    },
  ]);

  hearings = signal([
    { id: 1, day: 'LUN', date: '21', title: 'Audiencia Preliminar', time: '09:00 AM', caseId: 'EXP-2024-001', client: 'TechCorp', court: 'Juzgado 4° Laboral' },
    { id: 2, day: 'MIE', date: '23', title: 'Lectura de Sentencia', time: '11:30 AM', caseId: 'EXP-2023-892', client: 'Grupo G&S', court: 'Tribunal Superior' },
    { id: 3, day: 'JUE', date: '24', title: 'Mediación Familiar', time: '03:00 PM', caseId: 'EXP-2024-045', client: 'Ana Martínez', court: 'Centro de Mediación' },
    { id: 4, day: 'VIE', date: '25', title: 'Presentación de Pruebas', time: '10:00 AM', caseId: 'EXP-2024-112', client: 'Carlos Ruiz', court: 'Juzgado 2° Penal' },
  ]);

  deadlines = signal([
    { id: 1, title: 'Contestación de Demanda', type: 'Escrito', daysLeft: 'Vence Hoy', urgent: true, caseId: 'EXP-2024-088' },
    { id: 2, title: 'Apelación Sentencia', type: 'Recurso', daysLeft: '2 días', urgent: true, caseId: 'EXP-2023-892' },
    { id: 3, title: 'Pago de Tasas Judiciales', type: 'Admin', daysLeft: '5 días', urgent: false, caseId: 'EXP-2024-001' },
  ]);

  // ============= ADMIN DATA =============
  teamMembers = signal([
    {
      id: 1,
      name: 'Ana García',
      role: 'Abogado Sr.',
      avatar: 'https://picsum.photos/seed/ana/100/100',
      status: 'Disponible',
      currentTask: 'Generando Reporte Mensual',
      progress: 100,
      lastActive: 'Hace 5 min'
    },
    {
      id: 2,
      name: 'Carlos López',
      role: 'Abogado Jr.',
      avatar: 'https://picsum.photos/seed/carlos/100/100',
      status: 'En Reunion',
      currentTask: 'Revisión Caso TechCorp',
      progress: 45,
      lastActive: 'Hace 1 hora'
    },
    {
      id: 3,
      name: 'María Rodríguez',
      role: 'Paralegal',
      avatar: 'https://picsum.photos/seed/maria/100/100',
      status: 'Disponible',
      currentTask: 'Subiendo Archivos Masivos',
      progress: 88,
      lastActive: 'Hace 10 min'
    },
    {
      id: 4,
      name: 'Roberto Diaz',
      role: 'Abogado Sr.',
      avatar: 'https://picsum.photos/seed/roberto/100/100',
      status: 'Disponible',
      currentTask: 'Análisis de Jurisprudencia',
      progress: 12,
      lastActive: 'Hace 2 min'
    }
  ]);

  refreshTeamData() {
    // Simulate refreshing data with slightly random progress values
    this.teamMembers.update(members => 
      members.map(m => ({
        ...m,
        progress: m.progress === 100 ? 0 : Math.min(100, m.progress + Math.floor(Math.random() * 20))
      }))
    );
  }
}