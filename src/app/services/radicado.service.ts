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
  ramaJudicialId?: number | null;
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

/** Datos del Proceso returned by GET /cases/{caseId}/detalle?idRegProceso=xxx */
export interface DetalleProcesoCasesDto {
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

/** Documento adjunto al proceso desde GET /cases/{caseId}/documentos */
export interface DocumentoProcesoDto {
  idRegDocumento: number;
  idConexion: number;
  consActuacion: number | null;
  guidDocumento: string | null;
  nombre: string;
  descripcion: string;
  tipo: string;
  fechaCarga: string;
}

/** Generic pagination wrapper for Cases API */
export interface Page<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

/** Actuación adjunta al proceso desde GET /cases/{caseId}/actuaciones */
export interface ActuacionProcesoDto {
  idRegActuacion: number;
  llaveProceso: string;
  consActuacion: number;
  fechaActuacion: string;
  actuacion: string;
  anotacion: string;
  fechaInicial: string | null;
  fechaFinal: string | null;
  fechaRegistro: string;
  codRegla: string;
  conDocumentos: boolean;
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
              let data: SyncStatusResponse;
              
              try {
                const parsed = JSON.parse(event.data);
                if (typeof parsed === 'string' && parsed.includes('NuevaActuacionEvent')) {
                  const matchCount = parsed.match(/newCount=(\d+)/);
                  const count = matchCount ? parseInt(matchCount[1], 10) : 0;
                  data = { trackingId: '', status: 'SUCCESS', message: count > 0 ? `${count} nuevas` : 'Actualizado', synchronized: count };
                } else {
                  data = parsed;
                }
              } catch (parseError) {
                if (typeof event.data === 'string' && event.data.includes('NuevaActuacionEvent')) {
                  const matchCount = event.data.match(/newCount=(\d+)/);
                  const count = matchCount ? parseInt(matchCount[1], 10) : 0;
                  data = { trackingId: '', status: 'SUCCESS', message: count > 0 ? `${count} nuevas` : 'Actualizado', synchronized: count };
                } else {
                  throw parseError;
                }
              }

              if (TERMINAL.includes((data.status || '').toUpperCase())) {
                receivedTerminal = true;
              }
              observer.next(data);
            } catch (error) {
              observer.error('Error parsing SSE data: ' + error + ' Data: ' + event.data);
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

  /**
   * Fetches full process details from the Cases API.
   * Endpoint: GET /cases/{caseId}/detalle
   * Returns null on error so callers can fall back to mock data.
   */
  getDetalleProceso(caseId: number): Observable<DetalleProcesoCasesDto | null> {
    return this.http
      .get<DetalleProcesoCasesDto>(`${this.casesBaseUrl}/${caseId}/detalle`)
      .pipe(catchError(() => of(null)));
  }

  /**
   * Fetches process documents from the Cases API.
   * Endpoint: GET /cases/{caseId}/documentos
   */
  getDocumentos(caseId: number): Observable<DocumentoProcesoDto[]> {
    return this.http.get<DocumentoProcesoDto[]>(`${this.casesBaseUrl}/${caseId}/documentos`).pipe(
      catchError(() => of([]))
    );
  }

  /**
   * Triggers the asynchronous synchronization of Actuaciones for a given case.
   * Endpoint: POST /cases/{caseId}/actuaciones/check
   */
  triggerActuacionesSync(caseId: number): Observable<string> {
    return this.http
      .post(`${this.casesBaseUrl}/${caseId}/actuaciones/check`, {}, { responseType: 'text' })
      .pipe(catchError((err) => { throw err; }));
  }

  /**
   * Listens to the Server-Sent Events (SSE) stream for Actuaciones synchronization status updates.
   * Endpoint: GET /cases/{caseId}/actuaciones/check
   */
  getActuacionesSyncStream(caseId: number): Observable<SyncStatusResponse> {
    if (!isPlatformBrowser(this.platformId)) {
      return EMPTY;
    }

    const token = localStorage.getItem('dokqet_token');
    const url = `${this.casesBaseUrl}/${caseId}/actuaciones/check`;

    return from(import('event-source-polyfill')).pipe(
      switchMap(({ EventSourcePolyfill }) => {
        return new Observable<SyncStatusResponse>((observer) => {
          let receivedTerminal = false;
          // We assume 'SUCCESS', 'COMPLETED', 'ERROR', etc are the terminal states.
          const TERMINAL = ['COMPLETED', 'FINISHED', 'SUCCESS', 'FAILED', 'ERROR'];

          const eventSource = new EventSourcePolyfill(url, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          const handleEvent = (event: any) => {
            try {
              let data: SyncStatusResponse;
              
              try {
                const parsed = JSON.parse(event.data);
                if (typeof parsed === 'string' && parsed.includes('NuevaActuacionEvent')) {
                  const matchCount = parsed.match(/newCount=(\d+)/);
                  const count = matchCount ? parseInt(matchCount[1], 10) : 0;
                  data = { trackingId: '', status: 'SUCCESS', message: count > 0 ? `${count} nuevas` : 'Actualizado', synchronized: count };
                } else if (typeof parsed === 'object' && parsed !== null && 'newCount' in parsed) {
                  const count = parsed.newCount || 0;
                  data = { trackingId: '', status: 'SUCCESS', message: count > 0 ? `${count} nuevas` : 'Actualizado', synchronized: count };
                } else {
                  data = parsed;
                }
              } catch (parseError) {
                if (typeof event.data === 'string' && event.data.includes('NuevaActuacionEvent')) {
                  const matchCount = event.data.match(/newCount=(\d+)/);
                  const count = matchCount ? parseInt(matchCount[1], 10) : 0;
                  data = { trackingId: '', status: 'SUCCESS', message: count > 0 ? `${count} nuevas` : 'Actualizado', synchronized: count };
                } else {
                  throw parseError;
                }
              }

              if (TERMINAL.includes((data.status || '').toUpperCase())) {
                receivedTerminal = true;
              }
              observer.next(data);
            } catch (error) {
              observer.error('Error parsing SSE data: ' + error + ' Data: ' + event.data);
            }
          };

          eventSource.onmessage = handleEvent;
          eventSource.addEventListener('NuevaActuacionEvent', handleEvent);
          eventSource.addEventListener('message', handleEvent);
          eventSource.addEventListener('sync-status', handleEvent);

          eventSource.onerror = (error: any) => {
            eventSource.close();
            if (receivedTerminal) {
              observer.complete();
            } else {
              // Extract error details if possible
              const errMsg = error && error.message ? error.message : 'Error desconocido de SSE. Revise consola y Network tab.';
              console.error('SSE onerror object:', error);
              observer.error('SSE connection error or closed by server. Detalle: ' + errMsg);
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
   * Fetches process actions/events (Actuaciones) from the Cases API paginated.
   * Endpoint: GET /cases/{caseId}/actuaciones?page=0&size=10
   */
  getActuaciones(caseId: number, page: number = 0, size: number = 10, sortBy: string = 'fechaActuacion', sortDir: 'asc' | 'desc' = 'desc'): Observable<Page<ActuacionProcesoDto> | null> {
    return this.http
      .get<Page<ActuacionProcesoDto>>(`${this.casesBaseUrl}/${caseId}/actuaciones`, {
        params: {
          page: page.toString(),
          size: size.toString(),
          sort: `${sortBy},${sortDir}`
        }
      })
      .pipe(catchError(() => of(null)));
  }
}
