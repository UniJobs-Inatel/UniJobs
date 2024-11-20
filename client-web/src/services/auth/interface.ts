
export interface RegisterRequest {
    email: string;
    role: "student" | "company";
    password: string;
}
export interface RegisterResponse {
    message: string;
    verificationLink: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken:string,
    refreshToken:string, 
}

