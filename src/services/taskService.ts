
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

axios.defaults.withCredentials = true;

export type Task = {
  id: number;
  title: string;
  description?: string;
  due_date?: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  estimated_time?: number;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  completed_at?: string;
};

export type TaskInput = Omit<Task, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// Get all tasks for the logged-in user
export const getTasks = async (): Promise<Task[]> => {
  try {
    const response = await axios.get(`${API_URL}/tasks`);
    return response.data.tasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

// Create a new task
export const createTask = async (taskData: TaskInput): Promise<Task> => {
  try {
    const response = await axios.post(`${API_URL}/tasks`, taskData);
    return response.data.task;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

// Update an existing task
export const updateTask = async (taskId: number, taskData: Partial<TaskInput>): Promise<Task> => {
  try {
    const response = await axios.put(`${API_URL}/tasks/${taskId}`, taskData);
    return response.data.task;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (taskId: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/tasks/${taskId}`);
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

// Mark a task as completed
export const completeTask = async (taskId: number): Promise<{ task: Task; pointsAwarded: number }> => {
  try {
    const response = await axios.patch(`${API_URL}/tasks/${taskId}/complete`);
    return {
      task: response.data.task,
      pointsAwarded: response.data.pointsAwarded
    };
  } catch (error) {
    console.error('Error completing task:', error);
    throw error;
  }
};

// Get task categories
export const getTaskCategories = async (): Promise<string[]> => {
  try {
    const response = await axios.get(`${API_URL}/tasks/categories`);
    return response.data.categories;
  } catch (error) {
    console.error('Error fetching task categories:', error);
    throw error;
  }
};
