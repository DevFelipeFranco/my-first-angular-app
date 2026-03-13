import { Injectable, signal, computed, Inject, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { User, RegisteredUser, LoginRequest, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _currentUser = signal<User | null>(null);
  private http = inject(HttpClient);

  // Mock database of users
  private _allUsers = signal<User[]>([
    {
      id: 'usr-1',
      name: 'Carlos Socio',
      email: 'carlos.socio@dokqet.com',
      avatar: 'https://picsum.photos/seed/carlos/100/100',
      role: 'admin',
      department: 'Dirección General',
      lastConnection: 'En línea',
      isBlocked: false
    },
    {
      id: 'usr-2',
      name: 'Ana García',
      email: 'ana.garcia@dokqet.com',
      avatar: 'https://picsum.photos/seed/ana/100/100',
      role: 'lawyer',
      department: 'Litigio Civil',
      lastConnection: 'Hace 5 min',
      isBlocked: false
    },
    {
      id: 'usr-3',
      name: 'Roberto Diaz',
      email: 'roberto.diaz@dokqet.com',
      avatar: 'https://picsum.photos/seed/roberto/100/100',
      role: 'lawyer',
      department: 'Corporativo',
      lastConnection: 'Hace 2 horas',
      isBlocked: false
    },
    {
      id: 'usr-4',
      name: 'Maria Rodríguez',
      email: 'm.rodriguez@dokqet.com',
      avatar: 'https://picsum.photos/seed/maria/100/100',
      role: 'lawyer',
      department: 'Propiedad Intelectual',
      lastConnection: 'Ayer',
      isBlocked: true
    },
    {
      id: 'usr-5',
      name: 'Lucía Fernández',
      email: 'lucia.f@dokqet.com',
      avatar: 'https://picsum.photos/seed/lucia/100/100',
      role: 'lawyer',
      department: 'Laboral',
      lastConnection: 'Hace 10 min',
      isBlocked: false
    }
  ]);

  currentUser = computed(() => this._currentUser());
  allUsers = computed(() => this._allUsers());

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Check local storage for persistence only if in browser
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('dokqet_user');
      const storedToken = localStorage.getItem('dokqet_token');
      
      if (storedUser && storedToken) {
        this._currentUser.set(JSON.parse(storedUser));
      } else {
        // Clear anything that might be partially stored
        this.logout();
      }
    }
  }

  login(credentials: LoginRequest): Observable<boolean> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      map(response => {
        const authUser = response.user;
        
        if (!authUser.active) {
          alert('Esta cuenta ha sido bloqueada por el administrador.');
          return false;
        }

        const user: User = {
          id: authUser.id,
          name: authUser.fullName,
          email: authUser.email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser.fullName)}&background=random`,
          role: authUser.role === 'LEAD_LAWYER' ? 'admin' : authUser.role, // Handle mapping if needed
          isBlocked: !authUser.active
        };

        this._currentUser.set(user);

        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('dokqet_user', JSON.stringify(user));
          localStorage.setItem('dokqet_token', response.token);
        }
        return true;
      }),
      catchError(error => {
        console.error('Error durante el inicio de sesión:', error);
        return of(false);
      })
    );
  }

  logout() {
    this._currentUser.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('dokqet_user');
      localStorage.removeItem('dokqet_token');
    }
  }

  register(user: RegisteredUser): Observable<any> {
    // Best practice: using HttpClient to consume the API
    return this.http.post(`${environment.apiUrl}/auth/signup`, user).pipe(
      tap((response: any) => {
        // Here you can handle the successful response
        // e.g. storing a JWT token, or automatically logging the user in
        console.log('Registration successful', response);
      })
    );
  }

  // Admin Methods
  toggleUserBlock(userId: string | number) {
    this._allUsers.update(users =>
      users.map(u => {
        if (u.id === userId && u.id !== this._currentUser()?.id) { // Prevent self-blocking
          return { ...u, isBlocked: !u.isBlocked };
        }
        return u;
      })
    );
  }
}