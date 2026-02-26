import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-placeholder',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="p-8 flex flex-col items-center justify-center h-full text-slate-500">
      <div class="bg-slate-100 p-4 rounded-full mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-slate-700 mb-2">Próximamente</h2>
      <p class="text-slate-500 text-center max-w-md">
        Esta funcionalidad está actualmente bajo desarrollo. Estamos trabajando para traerte la mejor experiencia legal.
      </p>
    </div>
  `,
    styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `]
})
export class PlaceholderComponent { }
