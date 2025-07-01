
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import TaskList from '@/components/TaskList';
import TaskForm from '@/components/TaskForm';
import { Search, Filter, User } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  createdAt: string;
}

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Design new dashboard layout',
      description: 'Create wireframes and mockups for the updated dashboard interface',
      completed: false,
      priority: 'high',
      dueDate: '2025-01-02',
      createdAt: '2025-01-01',
    },
    {
      id: '2',
      title: 'Review team performance',
      description: 'Quarterly review with development team members',
      completed: true,
      priority: 'medium',
      dueDate: '2025-01-01',
      createdAt: '2024-12-30',
    },
    {
      id: '3',
      title: 'Update project documentation',
      description: 'Ensure all API endpoints are properly documented',
      completed: false,
      priority: 'low',
      dueDate: '2025-01-05',
      createdAt: '2025-01-01',
    },
  ]);
  
  const [activeFilter, setActiveFilter] = useState('all');
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddTask = (taskData: { title: string; description: string; priority: string; dueDate: string }) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title,
      description: taskData.description,
      completed: false,
      priority: taskData.priority as 'low' | 'medium' | 'high',
      dueDate: taskData.dueDate,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const handleEditTask = (taskData: { title: string; description: string; priority: string; dueDate: string }) => {
    if (editingTask) {
      setTasks(prev => prev.map(task => 
        task.id === editingTask.id 
          ? { ...task, ...taskData, priority: taskData.priority as 'low' | 'medium' | 'high' }
          : task
      ));
      setEditingTask(null);
    }
  };

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const openEditForm = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const closeTaskForm = () => {
    setIsTaskFormOpen(false);
    setEditingTask(null);
  };

  const getFilterTitle = () => {
    switch (activeFilter) {
      case 'today': return 'Today\'s Tasks';
      case 'important': return 'Important Tasks';
      case 'shared': return 'Shared Tasks';
      default: return 'All Tasks';
    }
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onAddTask={() => setIsTaskFormOpen(true)}
      />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{getFilterTitle()}</h1>
              <p className="text-sm text-gray-500 mt-1">
                {filteredTasks.filter(t => !t.completed).length} pending, {filteredTasks.filter(t => t.completed).length} completed
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors w-64"
                />
              </div>
              
              {/* User Profile */}
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">Guest User</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <TaskList
              tasks={filteredTasks}
              onToggleTask={handleToggleTask}
              onEditTask={openEditForm}
              onDeleteTask={handleDeleteTask}
              filter={activeFilter}
            />
          </div>
        </main>
      </div>

      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={closeTaskForm}
        onSubmit={editingTask ? handleEditTask : handleAddTask}
        editTask={editingTask}
      />
    </div>
  );
};

export default Index;
