export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: 'PATIENT';
  city?: string;
  gender?: 'MALE' | 'FEMALE';
}

export interface LoginPayload {
  email: string;
  password: string;
}