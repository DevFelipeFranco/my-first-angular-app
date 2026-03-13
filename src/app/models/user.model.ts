export interface User {
    id: string | number;
    name: string;
    email: string;
    avatar?: string;
    role: string | 'admin' | 'lawyer';
    isBlocked?: boolean;
    lastConnection?: string;
    department?: string;
}

export interface RegisteredUser {
    companyName: string;
    planType: 'INDIVIDUAL' | 'ENTERPRISE';
    documentTypeId: number;
    documentNumber: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    secondLastName?: string;
    email: string;
    password?: string;
}

export interface LoginRequest {
    email: string;
    password?: string;
}

export interface AuthUser {
    id: number;
    documentNumber: string;
    documentType: {
        id: number;
        code: string;
        name: string;
        active: boolean;
    };
    email: string;
    firstName: string;
    middleName: string | null;
    lastName: string;
    secondLastName: string | null;
    fullName: string;
    role: string;
    active: boolean;
    createdAt: string;
}

export interface AuthResponse {
    token: string;
    user: AuthUser;
}
