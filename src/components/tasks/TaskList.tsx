
import { useState } from "react";
import { Task } from "@/services/taskService";
import TaskCard from "./TaskCard";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import TaskForm from "./TaskForm";
import { TaskInput } from "@/services/taskService";

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onCompleteTask: (id: number) => Promise<void>;
  onUpdateTask: (id: number, data: TaskInput) => Promise<void>;
  onDeleteTask: (id: number) => Promise<void>;
}

export default function TaskList({
  tasks,
  isLoading,
  onCompleteTask,
  onUpdateTask,
  onDeleteTask
}: TaskListProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleUpdateTask = async (data: TaskInput) => {
    if (editingTask) {
      await onUpdateTask(editingTask.id, data);
      setEditingTask(null);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i} 
            className="border rounded-lg p-4 h-48 animate-pulse bg-muted"
          />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">No tasks found</h3>
        <p className="text-muted-foreground">Add a task to get started with your study plan.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <TaskCard 
            key={task.id}
            task={task}
            onComplete={onCompleteTask}
            onEdit={handleEditTask}
            onDelete={onDeleteTask}
          />
        ))}
      </div>

      <Dialog open={!!editingTask} onOpenChange={(open) => !open && setEditingTask(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
          {editingTask && (
            <TaskForm
              defaultValues={{
                title: editingTask.title,
                description: editingTask.description,
                due_date: editingTask.due_date ? new Date(editingTask.due_date) : undefined,
                priority: editingTask.priority,
                category: editingTask.category,
                estimated_time: editingTask.estimated_time,
                status: editingTask.status
              }}
              onSubmit={handleUpdateTask}
              submitLabel="Update Task"
              onCancel={() => setEditingTask(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
