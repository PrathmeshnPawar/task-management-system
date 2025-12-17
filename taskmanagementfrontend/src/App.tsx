/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import * as api from './api';
import type { Task } from './types';
import './App.css';

interface GoogleUser {
  name: string;
  picture: string;
}

const App: React.FC = () => {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [loading, setLoading] = useState(true);

  /* ============================
     INITIAL AUTH + DATA LOAD
  ============================ */
  useEffect(() => {
    const init = async () => {
      try {
        const userRes = await api.getCurrentUser();
        setUser(userRes.data);

        const taskRes = await api.getTasks();
        setTasks(taskRes.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  /* ============================
     CREATE TASK
  ============================ */
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

  /* ============================
     LOADING STATE
  ============================ */
  if (loading) {
    return <div className="loading-screen">Loading Workspace...</div>;
  }

  /* ============================
     NOT AUTHENTICATED → SIGN IN
  ============================ */
  if (!user) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-icon">✅</div>
          <h1 className="login-title">TaskFlow</h1>
          <p className="login-subtitle">
            Organize your work and life. Secure and synced with Google.
          </p>

          <a
            href="http://localhost:8080/oauth2/authorization/google"
            className="google-login-btn"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
            />
            <span>Sign in with Google</span>
          </a>
        </div>
      </div>
    );
  }

  /* ============================
     AUTHENTICATED → MAIN APP
  ============================ */
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
              onError={(e) =>
                (e.currentTarget.src =
                  `https://ui-avatars.com/api/?name=${user.name}`)
              }
            />
            <span className="user-name">{user.name}</span>
          </div>

          <button
            className="logout-btn"
            onClick={() =>
              (window.location.href = 'http://localhost:8080/logout')
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
            onChange={(e) => setPriority(e.target.value as any)}
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
              {f.charAt(0).toUpperCase() + f.slice(1)}
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
              <div
                key={task.id}
                className={`task-item ${task.completed ? 'done' : ''}`}
              >
                <div className="task-left">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={async () => {
                      await api.toggleTaskStatus(task.id!);
                      const res = await api.getTasks();
                      setTasks(res.data);
                    }}
                  />
                  <span className="task-title">{task.title}</span>
                </div>

                <div className="task-right">
                  <span
                    className={`priority-badge ${task.priority.toLowerCase()}`}
                  >
                    {task.priority}
                  </span>
                  <button
                    className="delete-btn"
                    onClick={async () => {
                      await api.deleteTask(task.id!);
                      const res = await api.getTasks();
                      setTasks(res.data);
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
        </div>

      </div>
    </div>
  );
};

export default App;
