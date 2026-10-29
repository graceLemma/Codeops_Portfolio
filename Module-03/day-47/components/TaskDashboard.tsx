'use client';

import { useState } from 'react';

interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'done';
}

export default function TaskDashboard() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Complete Verification Battery', status: 'in_progress' },
    { id: '2', title: 'Write README, AUTH, DATA, and PERF documentation', status: 'todo' }
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      status: 'todo'
    };
    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <form onSubmit={addTask} className="flex gap-4">
        <input 
          type="text" 
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Enter a new capstone task..."
          className="flex-1 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button type="submit" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
          Add Task
        </button>
      </form>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Active Tasks</h3>
        {tasks.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-500">
            <p className="font-medium">No tasks found.</p>
            <p className="text-xs text-gray-400 mt-1">Add a task above to populate your workspace.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {tasks.map(task => (
              <li key={task.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-sm font-medium text-gray-800">{task.title}</span>
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 rounded bg-red-50 hover:bg-red-100 transition"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}