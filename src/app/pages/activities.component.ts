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
            <h2 class="text-2xl font-bold text-slate-800">Historial de Actividad</h2>
            <p class="text-slate-500">Registro cronológico de movimientos y actualizaciones.</p>
         </div>
         <button class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
            <app-icon name="calendar" [size]="16"></app-icon>
            Filtrar por Fecha
          </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Timeline Section (Vertical Line) -->
        <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
           
           <div class="relative border-l-2 border-slate-200 ml-3 space-y-12">
             @for (group of groupedActivities(); track group.date) {
               <div class="relative">
                  <!-- Date Marker -->
                  <div class="absolute -left-[21px] top-0 bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded border border-slate-200">
                    {{ group.date }}
                  </div>
                  
                  <div class="pt-8 space-y-8">
                    @for (activity of group.items; track activity.id) {
                      <div class="relative pl-8 group">
                        <!-- Dot on Line -->
                        <div class="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm transition-transform group-hover:scale-110" 
                             [class]="activity.dotClass"></div>
                        
                        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                           <div>
                              <p class="text-xs text-slate-400 font-medium mb-0.5">{{ activity.time }}</p>
                              <h4 class="text-base font-semibold text-slate-800">{{ activity.title }}</h4>
                              <p class="text-sm text-slate-600 mt-1">{{ activity.desc }}</p>
                              
                              <!-- Optional metadata badges -->
                              @if (activity.tags) {
                                <div class="flex gap-2 mt-2">
                                  @for (tag of activity.tags; track tag) {
                                    <span class="text-xs px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 border border-slate-200">{{ tag }}</span>
                                  }
                                </div>
                              }
                           </div>
                           
                           <!-- User Avatar -->
                           <div class="flex-shrink-0">
                              <img [src]="activity.userAvatar" class="w-8 h-8 rounded-full border border-slate-200" [title]="activity.userName">
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
           <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 class="font-bold text-slate-800 mb-4">Resumen Semanal</h3>
              <div class="space-y-4">
                 <div class="flex items-center justify-between">
                    <span class="text-sm text-slate-600">Documentos subidos</span>
                    <span class="font-bold text-slate-800">24</span>
                 </div>
                 <div class="w-full bg-slate-100 rounded-full h-2">
                    <div class="bg-indigo-500 h-2 rounded-full" style="width: 70%"></div>
                 </div>

                 <div class="flex items-center justify-between mt-2">
                    <span class="text-sm text-slate-600">Audiencias completadas</span>
                    <span class="font-bold text-slate-800">8</span>
                 </div>
                 <div class="w-full bg-slate-100 rounded-full h-2">
                    <div class="bg-emerald-500 h-2 rounded-full" style="width: 45%"></div>
                 </div>

                 <div class="flex items-center justify-between mt-2">
                    <span class="text-sm text-slate-600">Nuevos expedientes</span>
                    <span class="font-bold text-slate-800">12</span>
                 </div>
                 <div class="w-full bg-slate-100 rounded-full h-2">
                    <div class="bg-blue-500 h-2 rounded-full" style="width: 60%"></div>
                 </div>
              </div>
           </div>

           <!-- Quick Filters -->
           <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 class="font-bold text-slate-800 mb-4">Filtrar por Tipo</h3>
              <div class="space-y-2">
                 <label class="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                    <input type="checkbox" checked class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
                    <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
                    <span class="text-sm text-slate-600">Movimientos Judiciales</span>
                 </label>
                 <label class="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                    <input type="checkbox" checked class="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500">
                    <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span class="text-sm text-slate-600">Documentación</span>
                 </label>
                 <label class="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                    <input type="checkbox" checked class="rounded border-slate-300 text-orange-600 focus:ring-orange-500">
                    <span class="w-2 h-2 rounded-full bg-orange-500"></span>
                    <span class="text-sm text-slate-600">Reuniones</span>
                 </label>
                 <label class="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                    <input type="checkbox" checked class="rounded border-slate-300 text-rose-600 focus:ring-rose-500">
                    <span class="w-2 h-2 rounded-full bg-rose-500"></span>
                    <span class="text-sm text-slate-600">Sistema</span>
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