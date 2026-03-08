export interface FieldError {
    field: string;
    message: string;
}

export interface ApiErrorResponse {
    timestamp: string;
    status: number;
    error: string;
    message: string;
    path: string;
    fieldErrors?: FieldError[];
}
