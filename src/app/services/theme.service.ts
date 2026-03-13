import { Injectable, Inject, PLATFORM_ID, signal, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private _isDarkMode = signal<boolean>(false);
  
  // Public computed signal for components to subscribe to
  isDarkMode = computed(() => this._isDarkMode());

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeTheme();
    }
  }

  private initializeTheme() {
    // 1. Check local storage
    const storedTheme = localStorage.getItem('dokqet_theme');
    
    // 2. Fallback to system preference if no stored theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldBeDark = storedTheme === 'dark' || (!storedTheme && prefersDark);
    
    this.setDarkMode(shouldBeDark);
  }

  toggleTheme() {
    this.setDarkMode(!this._isDarkMode());
  }

  setDarkMode(isDark: boolean) {
    this._isDarkMode.set(isDark);
    
    if (isPlatformBrowser(this.platformId)) {
      if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('dokqet_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('dokqet_theme', 'light');
      }
    }
  }
}
