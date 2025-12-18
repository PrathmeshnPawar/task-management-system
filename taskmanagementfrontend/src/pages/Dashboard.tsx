/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import * as api from '../api';
import type { Task } from '../types';
import '../App.css';

interface GoogleUser {
  name: string;
  picture: string;
}

const Dashboard = ({ user }: { user: GoogleUser }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [priority, setPriority] =
    useState<'High' | 'Medium' | 'Low'>('Medium');
  const [filter, setFilter] =
    useState<'all' | 'completed' | 'pending'>('all');

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  /* LOAD TASKS */
  useEffect(() => {
    const loadTasks = async () => {
      const res = await api.getTasks();
      setTasks(res.data);
    };

    loadTasks();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await api.createTask({
      title,
      priority,
      completed: false,
      description: '',
      category: 'General',
    });

    setTitle('');
    const res = await api.getTasks();
    setTasks(res.data);
  };

  return (
    <div className="container">
      <div className="card">
        <header className="app-header">
          <div className="user-info">
            <img
              src={user.picture}
              className="avatar"
              alt="profile"
              referrerPolicy="no-referrer"
            />
            <span className="user-name">{user.name}</span>
          </div>

          <button
            className="logout-btn"
            onClick={() =>
              (window.location.href = `${backendUrl}/logout`)
            }
          >
            Logout
          </button>
        </header>

        <h1 className="main-title">My Tasks</h1>

        <form onSubmit={handleAdd} className="task-form">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's next?"
            className="task-input"
          />

          <select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as any)
            }
            className="task-select"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <button type="submit" className="add-button">
            Add
          </button>
        </form>

        <div className="filters">
          {(['all', 'completed', 'pending'] as const).map((f) => (
            <button
              key={f}
              className={filter === f ? 'active' : ''}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="task-list">
          {tasks
            .filter((t) =>
              filter === 'all'
                ? true
                : filter === 'completed'
                ? t.completed
                : !t.completed
            )
            .map((task) => (
              <div key={task.id}>
                {task.title}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
