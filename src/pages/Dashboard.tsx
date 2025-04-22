
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PageLayout from "@/components/layout/PageLayout";
import TaskForm from "@/components/tasks/TaskForm";
import TaskList from "@/components/tasks/TaskList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Calendar, List } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getTasks, createTask, updateTask, deleteTask, completeTask, TaskInput } from "@/services/taskService";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";

export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [view, setView] = useState<"list" | "calendar">("list");
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");

  // Task queries
  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
    enabled: isAuthenticated,
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setIsAddTaskOpen(false);
      toast({
        title: "Task created",
        description: "Your new task has been created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create task",
        variant: "destructive",
      });
    },
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: TaskInput }) => updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update task",
        variant: "destructive",
      });
    },
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Task deleted",
        description: "Your task has been deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete task",
        variant: "destructive",
      });
    },
  });

  // Complete task mutation
  const completeTaskMutation = useMutation({
    mutationFn: completeTask,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Task completed",
        description: `You earned ${data.pointsAwarded} points!`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to complete task",
        variant: "destructive",
      });
    },
  });

  // Handle task creation
  const handleCreateTask = async (data: TaskInput) => {
    await createTaskMutation.mutateAsync(data);
  };

  // Handle task update
  const handleUpdateTask = async (id: number, data: TaskInput) => {
    await updateTaskMutation.mutateAsync({ id, data });
  };

  // Handle task deletion
  const handleDeleteTask = async (id: number) => {
    await deleteTaskMutation.mutateAsync(id);
  };

  // Handle task completion
  const handleCompleteTask = async (id: number) => {
    await completeTaskMutation.mutateAsync(id);
  };

  // Filter tasks based on the selected filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "pending") return task.status !== "completed";
    if (filter === "completed") return task.status === "completed";
    return true;
  });

  // Show error if tasks fail to load
  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading tasks",
        description: "Failed to load your tasks. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  if (!isAuthenticated) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center h-96 text-center px-4">
          <h1 className="text-4xl font-bold mb-4">Welcome to StudyBuddy</h1>
          <p className="text-lg mb-8 text-muted-foreground max-w-md">
            Login or create an account to start organizing your study tasks and track your progress.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" onClick={() => document.dispatchEvent(new CustomEvent('open-auth-dialog', { detail: { view: 'signup' } }))}>
              Create Account
            </Button>
            <Button size="lg" variant="outline" onClick={() => document.dispatchEvent(new CustomEvent('open-auth-dialog', { detail: { view: 'login' } }))}>
              Login
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Study Planner</h1>
            <p className="text-muted-foreground">Organize your study tasks and track your progress</p>
          </div>
          <Button onClick={() => setIsAddTaskOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <Tabs 
                defaultValue="all" 
                value={filter} 
                onValueChange={(value) => setFilter(value as any)}
                className="w-full sm:w-auto"
              >
                <TabsList>
                  <TabsTrigger value="all">All Tasks</TabsTrigger>
                  <TabsTrigger value="pending">Active</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={view === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setView("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={view === "calendar" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setView("calendar")}
                >
                  <Calendar className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>

          {view === "list" ? (
            <TaskList 
              tasks={filteredTasks}
              isLoading={isLoading}
              onCompleteTask={handleCompleteTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
            />
          ) : (
            <div className="p-8 border rounded-lg bg-card text-center">
              <p className="text-muted-foreground">Calendar view coming soon!</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Create a new task for your study plan.
            </DialogDescription>
          </DialogHeader>
          <TaskForm 
            onSubmit={handleCreateTask} 
            onCancel={() => setIsAddTaskOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
