
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  due_date: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const useTasks = (userId: string | undefined) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, [userId]);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map and validate the data
      const mappedTasks: Task[] = (data || []).map(task => ({
        ...task,
        priority: (task.priority === 'low' || task.priority === 'medium' || task.priority === 'high') 
          ? task.priority as 'low' | 'medium' | 'high'
          : 'medium' as 'low' | 'medium' | 'high'
      }));
      
      setTasks(mappedTasks);
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error fetching tasks",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData: { title: string; description: string; priority: string; dueDate: string }) => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            title: taskData.title,
            description: taskData.description,
            priority: taskData.priority,
            due_date: taskData.dueDate || null,
            user_id: userId,
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      const mappedTask: Task = {
        ...data,
        priority: (data.priority === 'low' || data.priority === 'medium' || data.priority === 'high') 
          ? data.priority as 'low' | 'medium' | 'high'
          : 'medium' as 'low' | 'medium' | 'high'
      };
      
      setTasks(prev => [mappedTask, ...prev]);
      toast({
        title: "Task created",
        description: "Your task has been created successfully.",
      });
    } catch (error: any) {
      console.error('Error creating task:', error);
      toast({
        title: "Error creating task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateTask = async (id: string, taskData: { title: string; description: string; priority: string; dueDate: string }) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority,
          due_date: taskData.dueDate || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      const mappedTask: Task = {
        ...data,
        priority: (data.priority === 'low' || data.priority === 'medium' || data.priority === 'high') 
          ? data.priority as 'low' | 'medium' | 'high'
          : 'medium' as 'low' | 'medium' | 'high'
      };
      
      setTasks(prev => prev.map(task => task.id === id ? mappedTask : task));
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Error updating task:', error);
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleTask = async (id: string, completed: boolean) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({ 
          completed: !completed,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      const mappedTask: Task = {
        ...data,
        priority: (data.priority === 'low' || data.priority === 'medium' || data.priority === 'high') 
          ? data.priority as 'low' | 'medium' | 'high'
          : 'medium' as 'low' | 'medium' | 'high'
      };
      
      setTasks(prev => prev.map(task => task.id === id ? mappedTask : task));
    } catch (error: any) {
      console.error('Error toggling task:', error);
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setTasks(prev => prev.filter(task => task.id !== id));
      toast({
        title: "Task deleted",
        description: "Your task has been deleted successfully.",
      });
    } catch (error: any) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error deleting task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    refetch: fetchTasks,
  };
};
