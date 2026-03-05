import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { DocumentType } from '../models/document-type.model';
import { ToastService } from './toast.service';

@Injectable({
    providedIn: 'root'
})
export class CommonsService {
    private http = inject(HttpClient);
    private toastService = inject(ToastService);

    getDocumentTypes(): Observable<DocumentType[]> {
        // Attempt to call the local API
        return this.http.get<DocumentType[]>(`${environment.apiUrl}/commons/document-types`).pipe(
            // Fallback logic (Mock) if the API endpoint doesn't exist yet
            catchError(error => {
                console.warn('API /commons/document-types failed, returning mock data.', error.message);
                this.toastService.error('Error de conexión a internet o a las base de datos: Usando datos en memoria.', 6000);
                const mockData: DocumentType[] = [
                    { id: '1', code: 'CC', name: 'Cédula de Ciudadanía', active: true },
                    { id: '2', code: 'CE', name: 'Cédula de Extranjería', active: true },
                    { id: '3', code: 'PA', name: 'Pasaporte', active: true },
                    { id: '4', code: 'NIT', name: 'NIT', active: true }
                ];
                // Simulate network delay for the mock
                return of(mockData).pipe(delay(500));
            })
        );
    }
}
