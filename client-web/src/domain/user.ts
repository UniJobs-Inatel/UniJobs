export interface AuthResponse {
  exp: number;
  iat: number;
  status: UserStatus;
  id: number;
  type: UserType;
  email:string;
}

export enum UserType{
  STUDENT='student',
  COLLEGE='college',
  COMPANY='company',
}

export enum UserStatus{
  CREATED='created',
  CONFIRMED='confirmed',
  COMPLETE='complete',
}

export interface User {
  id: number
  email: string
  password: string
  status: string
  type: string
}

