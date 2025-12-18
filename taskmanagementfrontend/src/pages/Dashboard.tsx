/* eslint-disable @typescript-eslint/no-unused-vars */
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
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // 1. Load tasks on mount
// 1. Move definition above useEffect
  const fetchTasks = async () => {
    try {
      const res = await api.getTasks();
      setTasks(res.data); // This is the setState the linter is worried about
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    }
  };

  // 2. Updated useEffect
  useEffect(() => {
    let isMounted = true; // Prevents state updates if component unmounts

    const loadData = async () => {
      await fetchTasks();
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array means "only run on mount"

  // 2. Add Task
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await api.createTask({
        title,
        priority,
        completed: false,
        description: '',
        category: 'General',
      });
      setTitle('');
      fetchTasks(); // Refresh list
    } catch (error) {
      console.error("Failed to add task", error);
    }
  };

  // 3. Toggle Completed Status
  const handleToggle = async (id: number) => {
    try {
      await api.toggleTaskStatus(id);
      fetchTasks(); // Refresh list
    } catch (error) {
      console.error("Failed to toggle task", error);
    }
  };

  // 4. Delete Task
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.deleteTask(id);
        fetchTasks(); // Refresh list
      } catch (error) {
        console.error("Failed to delete task", error);
      }
    }
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
            onClick={() => (window.location.href = `${backendUrl}/logout`)}
          >
            Logout
          </button>
        </header>

        <h1 className="main-title">My Tasks</h1>

        {/* Task Entry Form */}
        <form onSubmit={handleAdd} className="task-form">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
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

        {/* Filter Buttons */}
        <div className="filters">
          {(['all', 'completed', 'pending'] as const).map((f) => (
            <button
              key={f}
              className={filter === f ? 'active' : f}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Task List Rendering */}
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
              <div key={task.id} className={`task-item ${task.completed ? 'completed-row' : ''}`}>
                <div className="task-main">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggle(task.id!)}
                    className="task-checkbox"
                  />
                  <div className="task-text-group">
                    <span className={`task-title ${task.completed ? 'strikethrough' : ''}`}>
                      {task.title}
                    </span>
                    <span className={`priority-tag ${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>

                <button
                  className="delete-button"
                  onClick={() => handleDelete(task.id!)}
                  title="Delete Task"
                >
                  🗑️
                </button>
              </div>
            ))}

          {tasks.length === 0 && <p className="empty-msg">No tasks yet. Add one above!</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
