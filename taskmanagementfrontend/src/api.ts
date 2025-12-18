import axios, { type AxiosResponse } from 'axios';
import type { Task, GoogleUser } from './types';


const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080',
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



    // Redirect ONLY if unauthenticated
// api.ts
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      // This confirms the user is logged out
      console.log("User is unauthenticated");
    }
    return Promise.reject(err);
  }
);





export default api;
