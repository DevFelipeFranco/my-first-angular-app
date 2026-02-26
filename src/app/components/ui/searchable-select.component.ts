import { Component, input, output, signal, computed, ElementRef, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from './icons.component';

export interface SelectOption {
    value: string;
    label: string;
}

@Component({
    selector: 'app-searchable-select',
    standalone: true,
    imports: [CommonModule, FormsModule, IconComponent],
    template: `
    <div class="relative w-full text-left">
      <!-- Label -->
      @if (label()) {
        <label class="block text-sm font-semibold text-slate-700 mb-1.5">{{ label() }}</label>
      }

      <!-- Trigger Button -->
      <button 
        type="button"
        (click)="toggleOpen()"
        class="relative w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-left focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all shadow-sm group"
        [class.ring-4]="isOpen()"
        [class.ring-blue-500/10]="isOpen()"
        [class.border-blue-500]="isOpen()"
        [class.bg-white]="isOpen()"
      >
        <span class="block truncate text-slate-900" [class.text-slate-400]="!selectedOption()">
          {{ selectedOption()?.label || placeholder() }}
        </span>
        <span class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <app-icon name="chevron-down" [size]="18" class="text-slate-400 group-hover:text-slate-600 transition-transform duration-300" [class.rotate-180]="isOpen()"></app-icon>
        </span>
      </button>

      <!-- Dropdown Panel -->
      @if (isOpen()) {
        <div class="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden origin-top animate-fade-in-up" style="animation-duration: 0.2s;">
          
          <!-- Search Input -->
          <div class="p-2 border-b border-slate-50 bg-slate-50/50">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <app-icon name="search" [size]="16" class="text-slate-400"></app-icon>
              </div>
              <input 
                type="text" 
                [(ngModel)]="searchTerm"
                (click)="$event.stopPropagation()"
                class="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                placeholder="Buscar..."
                autofocus
              >
            </div>
          </div>

          <!-- Options List -->
          <ul class="max-h-60 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            @if (filteredOptions().length === 0) {
              <li class="px-4 py-3 text-sm text-slate-500 text-center">
                No se encontraron resultados
              </li>
            }

            @for (option of filteredOptions(); track option.value) {
              <li 
                (click)="selectOption(option)"
                class="relative cursor-pointer select-none py-2.5 pl-4 pr-9 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                [class.bg-blue-50]="isSelected(option)"
                [class.text-blue-700]="isSelected(option)"
                [class.font-semibold]="isSelected(option)"
              >
                <span class="block truncate">{{ option.label }}</span>
                @if (isSelected(option)) {
                  <span class="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600">
                    <app-icon name="check" [size]="16" [strokeWidth]="3"></app-icon>
                  </span>
                }
              </li>
            }
          </ul>
        </div>
      }
    </div>
  `
})
export class SearchableSelectComponent {

    // Inputs
    options = input.required<SelectOption[]>();
    label = input<string>('');
    placeholder = input<string>('Seleccione una opción');
    value = input<string | null>(null);

    // Output
    valueChange = output<string>();

    // State
    isOpen = signal(false);
    searchTerm = signal('');

    private elRef = inject(ElementRef);

    // Computed: Get the currently selected option object based on the bound value
    selectedOption = computed(() => {
        return this.options().find(opt => opt.value === this.value()) || null;
    });

    // Computed: Filter options based on search term
    filteredOptions = computed(() => {
        const term = this.searchTerm().toLowerCase().trim();
        if (!term) return this.options();

        return this.options().filter(opt =>
            opt.label.toLowerCase().includes(term)
        );
    });

    toggleOpen() {
        this.isOpen.update(v => !v);
        if (this.isOpen()) {
            this.searchTerm.set(''); // Reset search when opening
        }
    }

    selectOption(option: SelectOption) {
        this.valueChange.emit(option.value);
        this.isOpen.set(false);
    }

    isSelected(option: SelectOption): boolean {
        return this.value() === option.value;
    }

    // Close dropdown when clicking outside
    @HostListener('document:click', ['$event'])
    onClickOutside(event: Event) {
        if (this.isOpen() && !this.elRef.nativeElement.contains(event.target)) {
            this.isOpen.set(false);
        }
    }
}
