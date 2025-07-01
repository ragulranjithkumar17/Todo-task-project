
import React from 'react';
import { Check, Calendar, Edit, Trash2 } from 'lucide-react';
import { Task } from '@/hooks/useTasks';
import { Button } from '@/components/ui/button';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onEdit, onDelete }) => {
  const priorityColors = {
    low: 'bg-green-50 text-green-700 border-green-200',
    medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    high: 'bg-red-50 text-red-700 border-red-200',
  };

  const priorityDots = {
    low: 'bg-green-400',
    medium: 'bg-yellow-400',
    high: 'bg-red-400',
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = () => {
    if (!task.due_date) return false;
    const today = new Date();
    const dueDate = new Date(task.due_date);
    return dueDate < today && !task.completed;
  };

  return (
    <div className={`card-elevated p-4 transition-all duration-200 group ${
      task.completed ? 'opacity-75' : ''
    } ${isOverdue() ? 'border-red-200 bg-red-50/50' : ''}`}>
      <div className="flex items-start gap-3">
        <Button
          onClick={() => onToggle(task.id)}
          variant="ghost"
          size="icon"
          className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 p-0 transition-all duration-200 ${
            task.completed
              ? 'bg-green-500 border-green-500 text-white hover:bg-green-600'
              : 'border-border hover:border-primary hover:bg-primary/10'
          }`}
        >
          {task.completed && <Check className="w-3 h-3" />}
        </Button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-medium ${
              task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
            }`}>
              {task.title}
            </h3>
            <div className={`w-2 h-2 rounded-full ${priorityDots[task.priority]}`} />
          </div>

          {task.description && (
            <p className={`text-sm mb-2 ${
              task.completed ? 'text-muted-foreground' : 'text-muted-foreground'
            }`}>
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-3 text-xs">
            <span className={`px-2 py-1 rounded-full border text-xs font-medium ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
            
            {task.due_date && (
              <div className={`flex items-center gap-1 ${
                isOverdue() ? 'text-red-600' : 'text-muted-foreground'
              }`}>
                <Calendar className="w-3 h-3" />
                <span>{formatDate(task.due_date)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            onClick={() => onEdit(task)}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => onDelete(task.id)}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
