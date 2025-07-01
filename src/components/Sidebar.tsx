
import React from 'react';
import { Calendar, Plus, Star, Users, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <div className="w-64 bg-white border-r border-border h-screen flex flex-col shadow-sm">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold gradient-text">
          FlowVerse
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Task Management</p>
      </div>

      <div className="p-4">
        <Button
          onClick={onAddTask}
          className="w-full justify-start gap-3"
          size="lg"
        >
          <Plus className="w-5 h-5" />
          Add New Task
        </Button>
      </div>

      <nav className="flex-1 px-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeFilter === item.id;
            
            return (
              <Button
                key={item.id}
                onClick={() => onFilterChange(item.id)}
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 h-12 ${
                  isActive
                    ? 'bg-primary/10 text-primary border-r-2 border-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="flex-1 text-left">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          Built with ❤️ using Lovable
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
