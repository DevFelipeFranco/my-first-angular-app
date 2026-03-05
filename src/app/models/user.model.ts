export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: 'admin' | 'lawyer';
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
