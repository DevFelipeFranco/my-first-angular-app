import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
    id: string;
    type: ToastType;
    message: string;
    title?: string;
    durationMs: number;
}

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private _toasts = signal<Toast[]>([]);
    toasts = this._toasts.asReadonly();

    success(message: string, durationMs = 4000, title?: string) {
        this.show('success', message, durationMs, title);
    }

    error(message: string, durationMs = 5000, title?: string) {
        this.show('error', message, durationMs, title);
    }

    info(message: string, durationMs = 4000, title?: string) {
        this.show('info', message, durationMs, title);
    }

    warning(message: string, durationMs = 4000, title?: string) {
        this.show('warning', message, durationMs, title);
    }

    private show(type: ToastType, message: string, durationMs: number, title?: string) {
        const id = Math.random().toString(36).substr(2, 9);
        const toast: Toast = { id, type, message, title, durationMs };

        this._toasts.update(current => [...current, toast]);

        setTimeout(() => {
            this.remove(id);
        }, durationMs);
    }

    remove(id: string) {
        this._toasts.update(current => current.filter(t => t.id !== id));
    }
}
