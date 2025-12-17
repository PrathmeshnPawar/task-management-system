import axios, { type AxiosResponse } from 'axios';
import type { Task, GoogleUser } from './types';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true
});

/* ============================
   TASK APIs
============================ */

export const getTasks = (): Promise<AxiosResponse<Task[]>> =>
  api.get<Task[]>('/tasks');

export const createTask = (task: Task): Promise<AxiosResponse<Task>> =>
  api.post<Task>('/tasks', task);

export const deleteTask = (id: number): Promise<AxiosResponse<void>> =>
  api.delete(`/tasks/${id}`);

export const toggleTaskStatus = (id: number): Promise<AxiosResponse<Task>> =>
  api.patch<Task>(`/tasks/${id}/toggle`);

/* ============================
   AUTH APIs
============================ */

export const getCurrentUser = (): Promise<AxiosResponse<GoogleUser>> =>
  api.get<GoogleUser>('/api/user/me');

/* ============================
   GLOBAL AUTH HANDLING
============================ */

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Redirect ONLY if unauthenticated
    if (status === 401) {
      window.location.href =
        '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
