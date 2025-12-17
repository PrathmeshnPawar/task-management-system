export interface Task {
  id?: number;
  title: string;
  description: string;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
  category: string;
}

export interface GoogleUser {
  name: string;
  email: string;
  picture: string;
  sub: string; // The unique ID from Google
}
