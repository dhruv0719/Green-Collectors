// frontend/src/types/user.ts

export interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    city?: string | null;
    country?: string | null;
}