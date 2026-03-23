import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, EMPTY, from, switchMap, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface SyncRadicadoRequest {
  radicadoNumber: string;
}

export interface SyncRadicadoResponse {
  trackingId: string;
  status: string;
  message: string;
  timestamp: string;
}

export interface SyncStatusResponse {
  trackingId: string;
  status: string; // e.g., 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'FAILED'
  message?: string;
  timestamp?: string;
  [key: string]: any; // Catch-all for possible extracted data
}

export interface RadicadoDto {
  id: number;
  radicadoNumber: string;
  title: string;
  status: string;
  despacho: string;
  departamento: string;
  processDate: string;
  lastActionDate: string;
  updatedAt: string;
  sujetosProcesales?: string;
}

/** Detailed judicial process data returned by the /procesos/:llaveProceso endpoint */
export interface ProcesoDatosDto {
  idRegProceso: number;
  llaveProceso: string;
  idConexion: number;
  esPrivado: boolean;
  fechaProceso: string;
  codDespachoCompleto: string;
  despacho: string;
  ponente: string;
  tipoProceso: string;
  claseProceso: string;
  subclaseProceso: string;
  recurso: string;
  ubicacion: string;
  contenidoRadicacion: string;
  fechaConsulta: string;
  ultimaActualizacion: string;
}

/** Sujeto Procesal as returned by GET /cases/{caseId}/sujetos */
export interface SujetoProcesalDto {
  idRegSujeto: number;
  tipoSujeto: string;
  esEmplazado: boolean;
  identificacion: string | null;
  nombreRazonSocial: string;
  cant: number;
}

@Injectable({
  providedIn: 'root'
})
export class RadicadoService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  // Using the absolute URL as given by the user, but we could eventually move it to environment
  private readonly baseUrl = 'http://localhost:8761/api/v1/radicados';
  private readonly casesBaseUrl = 'http://localhost:8761/api/v1/cases';

  /**
   * Starts the asynchronous synchronization process for a given radicado.
   * @param req The sync request containing the radicado number
   */
  syncRadicado(req: SyncRadicadoRequest): Observable<SyncRadicadoResponse> {
    // Note: The authInterceptor already adds the Authorization header automatically to HttpClient requests
    return this.http.post<SyncRadicadoResponse>(`${this.baseUrl}/sync`, req);
  }

  /**
   * Listens to the Server-Sent Events (SSE) stream for real-time synchronization status updates.
   * @param trackingId The UUID returned by syncRadicado
   */
  getSyncStatusStream(trackingId: string): Observable<SyncStatusResponse> {
    // EventSourcePolyfill uses btoa() internally which fails on Node.js (SSR).
    // We use a dynamic import() so the module is NEVER evaluated by Node.js
    // during SSR module loading — it only loads at runtime in the browser.
    if (!isPlatformBrowser(this.platformId)) {
      return EMPTY;
    }

    const token = localStorage.getItem('dokqet_token');
    const url = `${this.baseUrl}/sync/${trackingId}`;

    return from(import('event-source-polyfill')).pipe(
      switchMap(({ EventSourcePolyfill }) => {
        return new Observable<SyncStatusResponse>((observer) => {
          let receivedTerminal = false;
          const TERMINAL = ['COMPLETED', 'FINISHED', 'SUCCESS', 'FAILED', 'ERROR'];

          const eventSource = new EventSourcePolyfill(url, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          eventSource.onmessage = (event: any) => {
            try {
              const data: SyncStatusResponse = JSON.parse(event.data);
              if (TERMINAL.includes((data.status || '').toUpperCase())) {
                receivedTerminal = true;
              }
              observer.next(data);
            } catch (error) {
              observer.error('Error parsing SSE data: ' + error);
            }
          };

          eventSource.onerror = (error: any) => {
            eventSource.close();
            // When the server closes the SSE stream after a terminal event,
            // the browser fires onerror — that is NORMAL, not a failure.
            if (receivedTerminal) {
              observer.complete();
            } else {
              observer.error('SSE connection error or closed by server.');
            }
          };

          return () => {
            eventSource.close();
          };
        });
      })
    );
  }

  /**
   * Fetches all registered radicados from the backend.
   */
  getAllRadicados(): Observable<RadicadoDto[]> {
    return this.http.get<RadicadoDto[]>(this.baseUrl);
  }

  /**
   * Fetches a single radicado by its ID.
   */
  getRadicadoById(id: number): Observable<RadicadoDto> {
    return this.http.get<RadicadoDto>(`${this.baseUrl}/${id}`);
  }

  /**
   * Fetches the full judicial process details by llaveProceso (radicado number).
   * Endpoint to be confirmed: GET /api/v1/radicados/{llaveProceso}/proceso
   */
  getProcesoDatos(llaveProceso: string): Observable<ProcesoDatosDto> {
    return this.http.get<ProcesoDatosDto>(`${this.baseUrl}/${llaveProceso}/proceso`);
  }

  /**
   * Fetches the sujetos procesales for a given case.
   * Endpoint: GET /cases/{caseId}/sujetos
   * Returns an empty array on error so callers can gracefully degrade.
   */
  getSujetosProcesales(caseId: number): Observable<SujetoProcesalDto[]> {
    return this.http.get<SujetoProcesalDto[]>(`${this.casesBaseUrl}/${caseId}/sujetos`).pipe(
      catchError(() => of([]))
    );
  }
}
