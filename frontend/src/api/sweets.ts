import api from './axios';
import type { Sweet } from '../types';

export const getSweets = () => {
  return api.get<Sweet[]>('/sweets');
};

export const getSweetById = (id: string) => {
  return api.get<Sweet>(`/sweets/${id}`);
};

export const updateSweet = (id: string, data: Partial<Sweet>) => {
  return api.put(`/sweets/${id}`, data);
};

export const deleteSweet = (id: string) => {
  return api.delete(`/sweets/${id}`);
};

export const restockSweet = (id: string, quantity: number) => {
  return api.post(`/sweets/${id}/restock`, { quantity });
};

export const purchaseSweet = (id: string, quantity: number) => {
  console.log("Purchasing sweet:", id, "Quantity:", quantity);
  return api.post(`/sweets/${id}/purchase`, { quantity });
};

export const createSweet = (data: Omit<Sweet, '_id'>) => {
  return api.post('/sweets', data);
};

// 
export const getAdminStats = () => {
  return api.get('/sweets/admin/stats');
};