import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../components/ui/icons.component';

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="space-y-6 animate-fade-in">
      
      <!-- Page Header -->
      <div class="flex items-center justify-between">
         <div>
            <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100 transition-colors duration-300">Historial de Actividad</h2>
            <p class="text-slate-500 dark:text-slate-400">Registro cronológico de movimientos y actualizaciones.</p>
         </div>
         <button class="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700/80 hover:dark:text-white transition-all duration-300 shadow-sm hover:shadow group">
            <app-icon name="calendar" [size]="16" class="text-slate-400 group-hover:text-indigo-500 transition-colors"></app-icon>
            Filtrar por Fecha
          </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Timeline Section (Vertical Line) -->
        <div class="lg:col-span-2 bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl transition-all duration-300 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)] p-8">
           
           <div class="relative border-l-2 border-slate-200 dark:border-slate-700/50 ml-3 space-y-12">
             @for (group of groupedActivities(); track group.date) {
               <div class="relative">
                  <!-- Date Marker -->
                  <div class="absolute -left-[21px] top-0 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                    {{ group.date }}
                  </div>
                  
                  <div class="pt-8 space-y-8">
                    @for (activity of group.items; track activity.id) {
                      <div class="relative pl-8 group cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/20 p-3 -ml-3 rounded-2xl transition-all">
                        <!-- Dot on Line -->
                        <div class="absolute -left-[5.5px] top-9 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 shadow-sm transition-all duration-300 group-hover:scale-125 group-hover:shadow-[0_0_12px_rgba(255,255,255,0.4)]" 
                             [class]="activity.dotClass"></div>
                        
                        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                           <div>
                              <p class="text-xs text-slate-400 dark:text-slate-500 font-medium mb-1 flex items-center gap-1.5"><app-icon name="clock" [size]="12"></app-icon> {{ activity.time }}</p>
                              <h4 class="text-base font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">{{ activity.title }}</h4>
                              <p class="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{{ activity.desc }}</p>
                              
                              <!-- Optional metadata badges -->
                              @if (activity.tags) {
                                <div class="flex flex-wrap gap-2 mt-3">
                                  @for (tag of activity.tags; track tag) {
                                    <span class="text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-md bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50 shadow-sm">{{ tag }}</span>
                                  }
                                </div>
                              }
                           </div>
                           
                           <!-- User Avatar -->
                           <div class="flex-shrink-0 mt-1">
                              <img [src]="activity.userAvatar" class="w-9 h-9 rounded-full border-2 border-white dark:border-slate-800 shadow-sm group-hover:scale-110 transition-transform duration-300" [title]="activity.userName">
                           </div>
                        </div>
                      </div>
                    }
                  </div>
               </div>
             }
           </div>

        </div>

        <!-- Side Panel: Stats & Filter -->
        <div class="space-y-6">
           <!-- Activity Summary -->
           <div class="bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl transition-all duration-300 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)] p-6">
              <h3 class="font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300 mb-5">Resumen Semanal</h3>
              <div class="space-y-5">
                 <div>
                   <div class="flex items-center justify-between mb-1.5">
                      <span class="text-sm font-medium text-slate-600 dark:text-slate-400">Documentos subidos</span>
                      <span class="font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300">24</span>
                   </div>
                   <div class="w-full bg-slate-100 dark:bg-slate-800/50 rounded-full h-2 overflow-hidden shadow-inner border border-slate-200/50 dark:border-slate-700/50">
                      <div class="bg-indigo-500 dark:bg-indigo-400 h-full rounded-full transition-all duration-700 ease-out" style="width: 70%"></div>
                   </div>
                 </div>

                 <div>
                   <div class="flex items-center justify-between mb-1.5">
                      <span class="text-sm font-medium text-slate-600 dark:text-slate-400">Audiencias completadas</span>
                      <span class="font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300">8</span>
                   </div>
                   <div class="w-full bg-slate-100 dark:bg-slate-800/50 rounded-full h-2 overflow-hidden shadow-inner border border-slate-200/50 dark:border-slate-700/50">
                      <div class="bg-emerald-500 dark:bg-emerald-400 h-full rounded-full transition-all duration-700 ease-out" style="width: 45%"></div>
                   </div>
                 </div>

                 <div>
                   <div class="flex items-center justify-between mb-1.5">
                      <span class="text-sm font-medium text-slate-600 dark:text-slate-400">Nuevos expedientes</span>
                      <span class="font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300">12</span>
                   </div>
                   <div class="w-full bg-slate-100 dark:bg-slate-800/50 rounded-full h-2 overflow-hidden shadow-inner border border-slate-200/50 dark:border-slate-700/50">
                      <div class="bg-blue-500 dark:bg-blue-400 h-full rounded-full transition-all duration-700 ease-out" style="width: 60%"></div>
                   </div>
                 </div>
              </div>
           </div>

           <!-- Quick Filters -->
           <div class="bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl transition-all duration-300 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)] p-6">
              <h3 class="font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300 mb-4">Filtrar por Tipo</h3>
              <div class="space-y-2">
                 <label class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700/50">
                    <input type="checkbox" checked class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-600">
                    <span class="w-2.5 h-2.5 rounded-full bg-indigo-500 dark:shadow-[0_0_8px_rgba(99,102,241,0.6)]"></span>
                    <span class="text-sm font-medium text-slate-600 dark:text-slate-300">Movimientos Judiciales</span>
                 </label>
                 <label class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700/50">
                    <input type="checkbox" checked class="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:bg-slate-800 dark:border-slate-600">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 dark:shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                    <span class="text-sm font-medium text-slate-600 dark:text-slate-300">Documentación</span>
                 </label>
                 <label class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700/50">
                    <input type="checkbox" checked class="rounded border-slate-300 text-orange-600 focus:ring-orange-500 dark:bg-slate-800 dark:border-slate-600">
                    <span class="w-2.5 h-2.5 rounded-full bg-orange-500 dark:shadow-[0_0_8px_rgba(249,115,22,0.6)]"></span>
                    <span class="text-sm font-medium text-slate-600 dark:text-slate-300">Reuniones</span>
                 </label>
                 <label class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700/50">
                    <input type="checkbox" checked class="rounded border-slate-300 text-rose-600 focus:ring-rose-500 dark:bg-slate-800 dark:border-slate-600">
                    <span class="w-2.5 h-2.5 rounded-full bg-rose-500 dark:shadow-[0_0_8px_rgba(244,63,94,0.6)]"></span>
                    <span class="text-sm font-medium text-slate-600 dark:text-slate-300">Sistema</span>
                 </label>
              </div>
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
export class ActivitiesComponent {
  groupedActivities = signal([
    {
      date: 'Hoy',
      items: [
        { 
          id: 1, 
          time: '14:30', 
          title: 'Auto de Admisión Recibido', 
          desc: 'Se ha recibido notificación del Juzgado 4° Laboral referente al caso TechCorp.', 
          tags: ['EXP-2024-001', 'Notificación'],
          dotClass: 'bg-indigo-500',
          userName: 'Maria Lopez',
          userAvatar: 'https://picsum.photos/seed/maria/50/50'
        },
        { 
          id: 2, 
          time: '11:15', 
          title: 'Documento Cargado', 
          desc: 'Contrato de Arrendamiento finalizado y subido al expediente.', 
          tags: ['EXP-2024-088', 'Contratos'],
          dotClass: 'bg-emerald-500',
          userName: 'Carlos Ruiz',
          userAvatar: 'https://picsum.photos/seed/carlos/50/50'
        },
        { 
          id: 3, 
          time: '09:00', 
          title: 'Reunión con Cliente', 
          desc: 'Sesión estratégica con Grupo G&S para definir términos de fusión.', 
          tags: ['EXP-2023-892', 'Reunión'],
          dotClass: 'bg-orange-500',
          userName: 'Ana Garcia',
          userAvatar: 'https://picsum.photos/seed/ana/50/50'
        }
      ]
    },
    {
      date: 'Ayer',
      items: [
        { 
          id: 4, 
          time: '16:45', 
          title: 'Intento de Acceso Bloqueado', 
          desc: 'El sistema detectó un intento de login sospechoso desde una IP desconocida.', 
          tags: ['Seguridad', 'Sistema'],
          dotClass: 'bg-rose-500',
          userName: 'Sistema',
          userAvatar: 'https://ui-avatars.com/api/?name=System&background=f43f5e&color=fff'
        },
        { 
          id: 5, 
          time: '10:30', 
          title: 'Escrito Presentado', 
          desc: 'Se presentó el escrito de contestación de demanda en oficialía de partes.', 
          tags: ['EXP-2024-112', 'Trámite'],
          dotClass: 'bg-indigo-500',
          userName: 'David Kim',
          userAvatar: 'https://picsum.photos/seed/david/50/50'
        }
      ]
    },
    {
      date: '20 Oct 2024',
      items: [
         { 
          id: 6, 
          time: '13:00', 
          title: 'Nuevo Expediente Creado', 
          desc: 'Apertura del caso: Defensa Penal - Caso Vial.', 
          tags: ['EXP-2024-112', 'Alta'],
          dotClass: 'bg-blue-500',
          userName: 'Maria Lopez',
          userAvatar: 'https://picsum.photos/seed/maria/50/50'
        }
      ]
    }
  ]);
}