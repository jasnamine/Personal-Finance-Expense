export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegistrationResponse {
  userId: number;
}

export interface LoginResponse {
  data: {
    id: string;
    email: string;
    username: string;
    currency: string;
    createdAt: string;
    accessToken: string;
  };
}


