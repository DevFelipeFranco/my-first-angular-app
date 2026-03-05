import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';

export interface DocumentType {
    id: string;
    name: string;
}

@Injectable({
    providedIn: 'root'
})
export class CommonsService {
    private http = inject(HttpClient);

    getDocumentTypes(): Observable<DocumentType[]> {
        // Attempt to call the local API
        return this.http.get<DocumentType[]>(`${environment.apiUrl}/commons/document-types`).pipe(
            // Fallback logic (Mock) if the API endpoint doesn't exist yet
            catchError(error => {
                console.warn('API /commons/document-types failed, returning mock data.', error.message);
                const mockData: DocumentType[] = [
                    { id: 'CC', name: 'Cédula de Ciudadanía' },
                    { id: 'CE', name: 'Cédula de Extranjería' },
                    { id: 'PA', name: 'Pasaporte' },
                    { id: 'NIT', name: 'NIT' }
                ];
                // Simulate network delay for the mock
                return of(mockData).pipe(delay(500));
            })
        );
    }
}
