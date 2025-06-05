export interface User {
    id: number;
    name: string;
    email: string;
}

export interface Event {
    id: number;
    name: string;
    description: string;
    date: string;
    location: string;
    created_by: number;
    user_id: number; // Backend API returns this field
    created_at: string;
    creator_name?: string;
}

export interface Registration {
    id: number;
    user_id: number;
    event_id: number;
    reason: string;
    registration_date: string;
}

export interface Participant {
    registration_id: number;
    registration_date: string;
    reason: string;
    user_id: number;
    name: string;
    email: string;
}

export interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface CreateEventRequest {
    name: string;
    description: string;
    date: string;
    location: string;
}

export interface RegisterEventRequest {
    reason: string;
}
