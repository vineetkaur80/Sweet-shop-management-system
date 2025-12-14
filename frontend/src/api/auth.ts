import api from './axios';

export interface RegisterData {
  username: string;
  password: string;
}
export const registerUser = (data: RegisterData) => {
  return api.post('/auth/register', data);
};

export const loginUser = (data: RegisterData) => {
  return api.post('/auth/login', data);
};