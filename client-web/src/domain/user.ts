export interface AuthResponse {
  exp: number;
  iat: number;
  status: UserStatus;
  sub: number;
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

