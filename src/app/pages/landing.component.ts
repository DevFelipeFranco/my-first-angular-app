import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../components/ui/icons.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  template: `
    <div class="min-h-screen bg-slate-50 text-slate-800 transition-colors duration-300 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      
      <!-- Navbar -->
      <nav class="fixed w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10 transition-all duration-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-20">
            <div class="flex items-center gap-2.5 group cursor-pointer relative">
              <div class="w-10 h-10 flex items-center justify-center relative transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 z-10">
                <div class="absolute inset-0 bg-red-600/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] transition-all duration-700 group-hover:drop-shadow-[0_8px_16px_rgba(220,38,38,0.5)]">
                  <g class="origin-[45px_45px] transition-transform duration-[1.5s] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.12] group-hover:-rotate-3">
                    <polygon points="6,24 16,14 16,24" fill="#ef4444" class="transition-all duration-[1.2s] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:-translate-x-2 group-hover:-translate-y-1 group-hover:-rotate-3" />
                    <polygon points="18,12 36,12 36,38 18,38" fill="#ef4444" class="transition-all duration-[1.2s] ease-[cubic-bezier(0.2,0.8,0.2,1)] delay-[50ms] group-hover:-translate-x-1 group-hover:-translate-y-2 group-hover:-rotate-1 origin-[27px_25px]" />
                    <polygon points="38,38 58,18 58,38" fill="#ef4444" class="transition-all duration-[1.2s] ease-[cubic-bezier(0.2,0.8,0.2,1)] delay-[75ms] group-hover:-translate-y-2 group-hover:rotate-1 origin-[48px_28px]" />
                    <polygon points="60,4 90,4 60,34" fill="#ef4444" class="transition-all duration-[1.2s] ease-[cubic-bezier(0.2,0.8,0.2,1)] delay-[100ms] group-hover:translate-x-3 group-hover:-translate-y-3 group-hover:rotate-3 origin-[75px_19px]" />
                    <polygon points="76,20 94,8 72,24" fill="#ef4444" class="transition-all duration-[1.2s] ease-[cubic-bezier(0.2,0.8,0.2,1)] delay-[150ms] group-hover:translate-x-4 group-hover:-translate-y-4 group-hover:rotate-6 origin-[83px_14px]" />
                    <polygon points="20,40 56,40 44,76" fill="#ef4444" class="transition-all duration-[1.2s] ease-[cubic-bezier(0.2,0.8,0.2,1)] delay-[50ms] group-hover:translate-y-2 group-hover:scale-[1.03] origin-[40px_58px]" />
                    <polygon points="58,42 40,96 58,96" fill="#ef4444" class="transition-all duration-[1.2s] ease-[cubic-bezier(0.2,0.8,0.2,1)] delay-[125ms] group-hover:translate-x-2 group-hover:translate-y-3 group-hover:-rotate-2 origin-[49px_69px]" />
                  </g>
                </svg>
              </div>
              <span class="text-2xl font-black tracking-[-0.06em] translate-y-[2px] select-none relative z-10">
                <span class="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-200 transition-all duration-500 group-hover:to-white">dok</span><span class="text-transparent bg-clip-text bg-gradient-to-br from-red-500 to-red-600 transition-all duration-500 group-hover:from-red-400 group-hover:to-red-500 drop-shadow-[0_0_8px_rgba(220,38,38,0.4)] group-hover:drop-shadow-[0_0_16px_rgba(220,38,38,0.8)] relative z-20">q</span><span class="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-200 transition-all duration-500 group-hover:to-white">et</span>
              </span>
            </div>
            
            <div class="hidden md:flex space-x-8">
              <a href="#features" class="text-sm font-medium text-slate-300 hover:text-white transition-colors">Características</a>
              <a href="#pricing" class="text-sm font-medium text-slate-300 hover:text-white transition-colors">Precios</a>
            </div>

            <div class="flex items-center space-x-4">
              <a routerLink="/login" class="text-sm font-medium text-slate-300 hover:text-white transition-colors">Iniciar Sesión</a>
              <a routerLink="/register" class="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2.5 rounded-full shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all hover:-translate-y-0.5">
                Empezar Gratis
              </a>
            </div>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-900">
        <!-- Background decorative elements -->
        <div class="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <div class="absolute -top-[40%] text-white -right-[10%] w-[70%] h-[70%] rounded-full bg-indigo-600/20 blur-[120px]"></div>
          <div class="absolute -bottom-[40%] text-white -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-600/20 blur-[120px]"></div>
          <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')]"></div>
        </div>

        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div class="animate-fade-in-up opacity-0" style="animation-fill-mode: forwards;">
            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-sm font-medium border border-indigo-500/20 mb-8">
              <span class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              Plataforma para Firmas Legales
            </span>
            <h1 class="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8">
              Tu Firma Legal, <br/>
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
                al Siguiente Nivel
              </span>
            </h1>
            <p class="mt-4 max-w-2xl mx-auto text-xl text-slate-400 mb-10 leading-relaxed">
              Gestión eficiente de expedientes, clientes y agenda procesal en una única plataforma diseñada para abogados modernos.
            </p>
            <div class="flex flex-col sm:flex-row justify-center gap-4">
              <a routerLink="/register" class="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-indigo-600 rounded-full shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 hover:scale-105 hover:shadow-indigo-600/40 transition-all duration-300">
                Crear Cuenta Gratis
                <app-icon name="chevron-right" class="ml-2" [size]="18"></app-icon>
              </a>
              <a href="#features" class="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-slate-300 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:text-white transition-all duration-300 backdrop-blur-sm">
                Ver Funciones
              </a>
            </div>
            
            <!-- Dashboard Preview Image Placeholder -->
            <div class="mt-20 relative mx-auto max-w-5xl group">
              <div class="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div class="relative rounded-2xl bg-slate-900 border border-slate-800 p-2 shadow-2xl">
                <div class="aspect-[16/9] rounded-xl bg-slate-800 overflow-hidden relative flex flex-col">
                  <!-- Mock Header -->
                  <div class="h-12 w-full bg-slate-900 border-b border-slate-700 flex items-center justify-between px-4">
                    <div class="flex gap-1.5">
                      <div class="w-3 h-3 rounded-full bg-slate-700/50 hover:bg-red-500 transition-colors"></div>
                      <div class="w-3 h-3 rounded-full bg-slate-700/50 hover:bg-yellow-500 transition-colors"></div>
                      <div class="w-3 h-3 rounded-full bg-slate-700/50 hover:bg-green-500 transition-colors"></div>
                    </div>
                    <div class="h-4 w-32 bg-slate-800 rounded"></div>
                  </div>
                  <!-- Mock Body -->
                  <div class="flex-1 p-8 flex gap-6">
                    <div class="w-64 space-y-4">
                      <div class="h-8 bg-slate-700/50 rounded-md w-full animate-pulse"></div>
                      <div class="h-8 bg-slate-700/50 rounded-md w-3/4 animate-pulse" style="animation-delay: 150ms;"></div>
                      <div class="h-8 bg-slate-700/50 rounded-md w-5/6 animate-pulse" style="animation-delay: 300ms;"></div>
                    </div>
                    <div class="flex-1 space-y-6">
                      <div class="grid grid-cols-3 gap-4">
                        <div class="h-32 bg-slate-700/50 rounded-xl relative overflow-hidden group/card shadow-inner">
                          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/card:animate-[shimmer_1.5s_infinite]"></div>
                        </div>
                        <div class="h-32 bg-slate-700/50 rounded-xl relative overflow-hidden group/card shadow-inner">
                          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/card:animate-[shimmer_1.5s_infinite]"></div>
                        </div>
                        <div class="h-32 bg-slate-700/50 rounded-xl relative overflow-hidden group/card shadow-inner">
                          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/card:animate-[shimmer_1.5s_infinite]"></div>
                        </div>
                      </div>
                      <div class="h-64 bg-slate-700/50 rounded-xl relative overflow-hidden group/card shadow-inner">
                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/card:animate-[shimmer_1.5s_infinite]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section id="features" class="py-24 bg-white relative">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-3xl mx-auto mb-16">
            <h2 class="text-3xl font-bold text-slate-900 sm:text-4xl tracking-tight">Todo lo que necesitas para tu estudio jurídico</h2>
            <p class="mt-4 text-lg text-slate-600">Automatiza tareas rutinarias y enfócate en lo que realmente importa: ganar tus casos.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Feature 1 -->
            <div class="group p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-100 transition-all duration-300 transform hover:-translate-y-1">
              <div class="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-600 transition-all duration-300">
                <app-icon name="briefcase" class="text-indigo-600 group-hover:text-white transition-colors" [size]="28"></app-icon>
              </div>
              <h3 class="text-xl font-bold text-slate-900 mb-3">Expedientes Centralizados</h3>
              <p class="text-slate-600 leading-relaxed">Organiza todos tus casos legales en un solo lugar. Accede a documentos, actuaciones e historial de forma inmediata.</p>
            </div>

            <!-- Feature 2 -->
            <div class="group p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-100 transition-all duration-300 transform hover:-translate-y-1">
              <div class="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-600 transition-all duration-300">
                <app-icon name="users" class="text-indigo-600 group-hover:text-white transition-colors" [size]="28"></app-icon>
              </div>
              <h3 class="text-xl font-bold text-slate-900 mb-3">Gestión de Clientes</h3>
              <p class="text-slate-600 leading-relaxed">Mantén una base de datos detallada de tus clientes, historial de consultas y comunicación fluida en cada paso.</p>
            </div>

            <!-- Feature 3 -->
            <div class="group p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-100 transition-all duration-300 transform hover:-translate-y-1">
              <div class="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-600 transition-all duration-300">
                <app-icon name="calendar" class="text-indigo-600 group-hover:text-white transition-colors" [size]="28"></app-icon>
              </div>
              <h3 class="text-xl font-bold text-slate-900 mb-3">Agenda Judicial Inteligente</h3>
              <p class="text-slate-600 leading-relaxed">No pierdas ningún vencimiento. Recordatorios automáticos para audiencias, plazos procesales y reuniones.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Pricing Section -->
      <section id="pricing" class="py-24 bg-slate-50 relative overflow-hidden">
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wMikiLz48L3N2Zz4=')]"></div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div class="text-center max-w-3xl mx-auto mb-16">
            <h2 class="text-3xl font-bold text-slate-900 sm:text-4xl tracking-tight">Planes diseñados para tu crecimiento</h2>
            <p class="mt-4 text-lg text-slate-600">Escoge el plan que mejor se adapte al tamaño de tu firma legal.</p>
            
            <div class="mt-8 inline-flex bg-slate-200/60 p-1.5 rounded-full relative shadow-inner">
              <button class="relative w-32 rounded-full py-2.5 text-sm font-semibold text-slate-900 bg-white shadow-sm ring-1 ring-slate-900/5 transition-all">Mensual</button>
              <button class="relative w-32 rounded-full py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-all">Anual (-20%)</button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 max-w-6xl mx-auto items-center">
            
            <!-- Basic Plan -->
            <div class="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-300">
              <h3 class="text-xl font-semibold text-slate-900">Individual</h3>
              <p class="text-slate-500 text-sm mt-2">Para abogados independientes.</p>
              <div class="mt-6 flex items-baseline gap-2">
                <span class="text-4xl font-extrabold text-slate-900">$29</span>
                <span class="text-slate-500">/mes</span>
              </div>
              <ul class="mt-8 flex flex-col gap-4">
                <li class="flex items-center gap-3">
                  <div class="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center">
                    <app-icon name="check" class="text-indigo-600" [size]="12" [strokeWidth]="3"></app-icon>
                  </div>
                  <span class="text-slate-600 text-sm">Gestión de 50 Expedientes</span>
                </li>
                <li class="flex items-center gap-3">
                  <div class="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center">
                    <app-icon name="check" class="text-indigo-600" [size]="12" [strokeWidth]="3"></app-icon>
                  </div>
                  <span class="text-slate-600 text-sm">Clientes Ilimitados</span>
                </li>
                <li class="flex items-center gap-3">
                  <div class="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center">
                    <app-icon name="check" class="text-indigo-600" [size]="12" [strokeWidth]="3"></app-icon>
                  </div>
                  <span class="text-slate-600 text-sm">Agenda Básica</span>
                </li>
              </ul>
              <a [routerLink]="['/register']" [queryParams]="{plan: 'individual'}" class="mt-8 block w-full py-3.5 px-6 text-center rounded-xl font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:shadow-md transition-all">
                Comenzar Gratis 14 días
              </a>
            </div>

            <!-- Pro Plan -->
            <div class="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl shadow-indigo-900/30 transform md:-translate-y-4 md:scale-105 relative overflow-hidden z-10 hover:shadow-indigo-500/20 transition-all duration-300">
              <div class="absolute top-0 right-0 -mt-2 -mr-2 w-32 h-32 bg-indigo-500 rounded-full opacity-20 blur-3xl"></div>
              <div class="absolute bottom-0 left-0 -mb-2 -ml-2 w-24 h-24 bg-blue-500 rounded-full opacity-20 blur-2xl"></div>
              <div class="absolute top-0 right-0 mt-6 mr-6 bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                Popular
              </div>
              <h3 class="text-xl font-semibold text-white relative">Individual Profesional</h3>
              <p class="text-indigo-200/80 text-sm mt-2 relative">Para pequeños y medianos estudios.</p>
              <div class="mt-6 flex items-baseline gap-2 relative">
                <span class="text-5xl font-extrabold text-white">$79</span>
                <span class="text-indigo-200">/mes</span>
              </div>
              <ul class="mt-8 flex flex-col gap-4 relative">
                <li class="flex items-center gap-3">
                  <div class="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <app-icon name="check" class="text-indigo-400" [size]="12" [strokeWidth]="3"></app-icon>
                  </div>
                  <span class="text-slate-300 text-sm">Expedientes Ilimitados</span>
                </li>
                <li class="flex items-center gap-3">
                  <div class="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <app-icon name="check" class="text-indigo-400" [size]="12" [strokeWidth]="3"></app-icon>
                  </div>
                  <span class="text-slate-300 text-sm">Hasta 5 Abogados</span>
                </li>
                <li class="flex items-center gap-3">
                  <div class="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <app-icon name="check" class="text-indigo-400" [size]="12" [strokeWidth]="3"></app-icon>
                  </div>
                  <span class="text-slate-300 text-sm">Alertas Automáticas</span>
                </li>
                <li class="flex items-center gap-3">
                  <div class="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <app-icon name="check" class="text-indigo-400" [size]="12" [strokeWidth]="3"></app-icon>
                  </div>
                  <span class="text-slate-300 text-sm">Gestión Documental (50GB)</span>
                </li>
              </ul>
              <a [routerLink]="['/register']" [queryParams]="{plan: 'individual-profesional'}" class="mt-8 block w-full py-3.5 px-6 text-center rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 transition-all hover:-translate-y-1 relative">
                Iniciar Plan Pro
              </a>
            </div>

            <!-- Enterprise Plan -->
            <div class="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-300">
              <h3 class="text-xl font-semibold text-slate-900">Empresarial</h3>
              <p class="text-slate-500 text-sm mt-2">Para grandes firmas y corporativos.</p>
              <div class="mt-6 flex items-baseline gap-2">
                <span class="text-4xl font-extrabold text-slate-900">Personalizado</span>
              </div>
              <ul class="mt-8 flex flex-col gap-4">
                <li class="flex items-center gap-3">
                  <div class="flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                    <app-icon name="check" class="text-slate-600" [size]="12" [strokeWidth]="3"></app-icon>
                  </div>
                  <span class="text-slate-600 text-sm">Usuarios Ilimitados</span>
                </li>
                <li class="flex items-center gap-3">
                  <div class="flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                    <app-icon name="check" class="text-slate-600" [size]="12" [strokeWidth]="3"></app-icon>
                  </div>
                  <span class="text-slate-600 text-sm">Almacenamiento Ilimitado</span>
                </li>
                <li class="flex items-center gap-3">
                  <div class="flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                    <app-icon name="check" class="text-slate-600" [size]="12" [strokeWidth]="3"></app-icon>
                  </div>
                  <span class="text-slate-600 text-sm">Soporte Dedicado 24/7</span>
                </li>
                <li class="flex items-center gap-3">
                  <div class="flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                    <app-icon name="check" class="text-slate-600" [size]="12" [strokeWidth]="3"></app-icon>
                  </div>
                  <span class="text-slate-600 text-sm">Migración de Datos Incluida</span>
                </li>
              </ul>
              <a [routerLink]="['/register']" [queryParams]="{plan: 'empresarial'}" class="mt-8 block w-full py-3.5 px-6 text-center rounded-xl font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:shadow-md transition-all">
                Contactar Ventas
              </a>
            </div>

          </div>
        </div>
      </section>

      <!-- CTA / Footer -->
      <footer class="bg-slate-900 pt-24 pb-12 border-t border-slate-800 relative overflow-hidden">
        <div class="absolute inset-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-30"></div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 class="text-3xl font-bold text-white mb-6">¿Listo para transformar tu firma?</h2>
          <p class="text-slate-400 mb-10 max-w-2xl mx-auto text-lg">Únete a cientos de abogados que ya han digitalizado su práctica y mejorado su eficiencia.</p>
          <a routerLink="/register" class="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-indigo-600 rounded-full shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all duration-300 hover:scale-105">
            Comenzar Prueba Gratuita
          </a>
          
          <div class="mt-24 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <div class="flex items-center gap-2 mb-4 md:mb-0">
              <div class="w-6 h-6 flex items-center justify-center grayscale opacity-80">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-500">
                  <g class="origin-center">
                    <polygon points="6,24 16,14 16,24" fill="#ef4444" />
                    <polygon points="18,12 36,12 36,38 18,38" fill="#ef4444" />
                    <polygon points="38,38 58,18 58,38" fill="#ef4444" />
                    <polygon points="60,4 90,4 60,34" fill="#ef4444" />
                    <polygon points="76,20 94,8 72,24" fill="#ef4444" />
                    <polygon points="20,40 56,40 44,76" fill="#ef4444" />
                    <polygon points="58,42 40,96 58,96" fill="#ef4444" />
                  </g>
                </svg>
              </div>
              <p>&copy; 2026 dokqet. Todos los derechos reservados.</p>
            </div>
            <div class="flex space-x-8">
              <a href="#" class="hover:text-indigo-400 transition-colors">Privacidad</a>
              <a href="#" class="hover:text-indigo-400 transition-colors">Términos</a>
              <a href="#" class="hover:text-indigo-400 transition-colors">Soporte</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class LandingComponent { }
