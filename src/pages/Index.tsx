
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import AuthPage from '@/components/AuthPage';
import Sidebar from '@/components/Sidebar';
import TaskList from '@/components/TaskList';
import TaskForm from '@/components/TaskForm';
import { Search, User, LogOut } from 'lucide-react';

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { tasks, loading: tasksLoading, addTask, updateTask, toggleTask, deleteTask } = useTasks(user?.id);
  
  const [activeFilter, setActiveFilter] = useState('all');
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Show loading spinner while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth page if user is not logged in
  if (!user) {
    return <AuthPage onAuthSuccess={() => {}} />;
  }

  const handleAddTask = async (taskData: { title: string; description: string; priority: string; dueDate: string }) => {
    await addTask(taskData);
    setIsTaskFormOpen(false);
  };

  const handleEditTask = async (taskData: { title: string; description: string; priority: string; dueDate: string }) => {
    if (editingTask) {
      await updateTask(editingTask.id, taskData);
      setEditingTask(null);
      setIsTaskFormOpen(false);
    }
  };

  const handleToggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      await toggleTask(id, task.completed);
    }
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
  };

  const openEditForm = (task: any) => {
    setEditingTask({
      ...task,
      dueDate: task.due_date,
    });
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

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    switch (activeFilter) {
      case 'today':
        const today = new Date().toDateString();
        return matchesSearch && task.due_date && new Date(task.due_date).toDateString() === today;
      case 'important':
        return matchesSearch && task.priority === 'high';
      case 'shared':
        return matchesSearch; // For now, all tasks are "shared" with yourself
      default:
        return matchesSearch;
    }
  });

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
                <span className="text-sm font-medium text-gray-700">
                  {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                </span>
                <button
                  onClick={signOut}
                  className="ml-2 p-1 text-gray-500 hover:text-red-600 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {tasksLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading tasks...</p>
              </div>
            ) : (
              <TaskList
                tasks={filteredTasks}
                onToggleTask={handleToggleTask}
                onEditTask={openEditForm}
                onDeleteTask={handleDeleteTask}
                filter={activeFilter}
              />
            )}
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
