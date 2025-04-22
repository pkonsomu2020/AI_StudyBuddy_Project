
import { createContext, useContext, useState, useEffect } from "react";

export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "pending" | "in-progress" | "completed";
export type TaskSubject = "math" | "science" | "literature" | "history" | "language" | "art" | "other";

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: TaskPriority;
  status: TaskStatus;
  subject: TaskSubject;
  points: number;
  estimatedMinutes: number;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface UserStats {
  totalPoints: number;
  currentStreak: number;
  lastCompletionDate: Date | null;
  level: number;
  completedTasks: number;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  userStats: UserStats;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const calculateLevel = (points: number): number => {
  return Math.floor(Math.sqrt(points / 100)) + 1;
};

const calculateStreak = (lastCompletion: Date | null): number => {
  if (!lastCompletion) return 0;
  
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Reset dates to start of day for comparison
  yesterday.setHours(0, 0, 0, 0);
  const lastCompletionDate = new Date(lastCompletion);
  lastCompletionDate.setHours(0, 0, 0, 0);
  
  // If last completion was yesterday or today, streak continues
  if (
    lastCompletionDate.getTime() === yesterday.getTime() || 
    lastCompletionDate.getTime() > yesterday.getTime()
  ) {
    return 1; // Will be added to stored streak value
  }
  
  return 0; // Streak breaks
};

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize tasks from localStorage or empty array
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      try {
        // Convert string dates back to Date objects
        const parsedTasks = JSON.parse(savedTasks);
        return parsedTasks.map((task: any) => ({
          ...task,
          dueDate: new Date(task.dueDate),
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
        }));
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  
  const [userStats, setUserStats] = useState<UserStats>(() => {
    const savedStats = localStorage.getItem("userStats");
    if (savedStats) {
      try {
        const parsedStats = JSON.parse(savedStats);
        return {
          ...parsedStats,
          lastCompletionDate: parsedStats.lastCompletionDate 
            ? new Date(parsedStats.lastCompletionDate) 
            : null,
        };
      } catch (e) {
        return {
          totalPoints: 0,
          currentStreak: 0,
          lastCompletionDate: null,
          level: 1,
          completedTasks: 0
        };
      }
    }
    return {
      totalPoints: 0,
      currentStreak: 0,
      lastCompletionDate: null,
      level: 1,
      completedTasks: 0
    };
  });
  
  // Save tasks to localStorage when they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);
  
  // Save user stats to localStorage when they change
  useEffect(() => {
    localStorage.setItem("userStats", JSON.stringify(userStats));
  }, [userStats]);

  const addTask = (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const completeTask = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task || task.completed) return;
    
    // Update the task
    updateTask(id, { completed: true, status: "completed" });
    
    // Update user stats
    const now = new Date();
    const streakIncrement = calculateStreak(userStats.lastCompletionDate);
    
    setUserStats((prev) => {
      const newPoints = prev.totalPoints + task.points;
      const newStreak = streakIncrement === 0 ? 1 : prev.currentStreak + streakIncrement;
      const newLevel = calculateLevel(newPoints);
      
      return {
        totalPoints: newPoints,
        currentStreak: newStreak,
        lastCompletionDate: now,
        level: newLevel,
        completedTasks: prev.completedTasks + 1
      };
    });
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        completeTask,
        userStats,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};
