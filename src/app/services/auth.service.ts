import { Injectable, signal, computed, Inject, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User, RegisteredUser } from '../models/user.model';

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
      const stored = localStorage.getItem('dokqet_user');
      if (stored) {
        this._currentUser.set(JSON.parse(stored));
      }
    }
  }

  login(email: string, name: string, role: 'admin' | 'lawyer' = 'lawyer') {
    // In a real app, we would validate against _allUsers here.
    // For demo, we just create/set the session.

    // Check if user is blocked in our mock DB (simulate check)
    const existingUser = this._allUsers().find(u => u.email === email);
    if (existingUser && existingUser.isBlocked) {
      alert('Esta cuenta ha sido bloqueada por el administrador.');
      return false;
    }

    const user: User = existingUser || {
      id: Math.random().toString(36).substr(2, 9),
      name: name,
      email: email,
      avatar: `https://picsum.photos/seed/${name}/100/100`,
      role: role,
      lastConnection: 'En línea',
      isBlocked: false
    };

    this._currentUser.set(user);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('dokqet_user', JSON.stringify(user));
    }
    return true;
  }

  logout() {
    this._currentUser.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('dokqet_user');
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
  toggleUserBlock(userId: string) {
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