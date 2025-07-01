
import React from 'react';
import { Calendar, Plus, Filter, Users, Star, CheckCircle } from 'lucide-react';

interface SidebarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onAddTask: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeFilter, onFilterChange, onAddTask }) => {
  const menuItems = [
    { id: 'all', label: 'All Tasks', icon: CheckCircle, count: 0 },
    { id: 'today', label: 'Today', icon: Calendar, count: 0 },
    { id: 'important', label: 'Important', icon: Star, count: 0 },
    { id: 'shared', label: 'Shared', icon: Users, count: 0 },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          FlowVerse
        </h1>
        <p className="text-sm text-gray-500 mt-1">Task Management</p>
      </div>

      <div className="p-4">
        <button
          onClick={onAddTask}
          className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add New Task
        </button>
      </div>

      <nav className="flex-1 px-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeFilter === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onFilterChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="flex-1">{item.label}</span>
                {item.count > 0 && (
                  <span className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded-full">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="text-xs text-gray-500 text-center">
          Built with ❤️ using Lovable
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
