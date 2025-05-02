import { useState, useEffect } from "react";
import { Task, COLUMNS, TaskStatus } from "../types/task";
import { TaskColumn } from "./TaskColumn";
import { TaskForm } from "./TaskForm";
import { taskService } from "../services/taskService";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { TaskCard } from "./TaskCard";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const fetchedTasks = await taskService.getTasks();
        setTasks(fetchedTasks);
        setError(null);
      } catch (err) {
        setError("Failed to fetch tasks. Please try again.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleAddTask = async (newTask: Omit<Task, "id" | "createdAt">) => {
    try {
      const createdTask = await taskService.createTask(newTask);
      setTasks((prevTasks) => [...prevTasks, createdTask]);
    } catch (err) {
      setError("Failed to add task. Please try again.");
      console.error(err);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const draggedTask = tasks.find((task) => task.id === active.id);

    if (draggedTask) {
      setActiveTask(draggedTask);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeTask = tasks.find((task) => task.id === activeId);

    if (!activeTask) return;

    if (COLUMNS.some((col) => col.id === overId)) {
      const newStatus = overId as TaskStatus;

      if (activeTask.status !== newStatus) {
        setTasks((tasks) =>
          tasks.map((task) =>
            task.id === activeId ? { ...task, status: newStatus } : task
          )
        );
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeTask = tasks.find((task) => task.id === activeId);

    if (!activeTask) return;

    if (COLUMNS.some((col) => col.id === overId)) {
      const newStatus = overId as TaskStatus;

      if (activeTask.status !== newStatus) {
        try {
          await taskService.updateTaskStatus(activeId as string, newStatus);
        } catch (err) {
          setError("Failed to update task status. Please try again.");
          console.error(err);

          // Revert the change in the UI
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === activeId
                ? { ...task, status: activeTask.status }
                : task
            )
          );
        }
      }
    }

    setActiveTask(null);
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <div className="p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Task Manager Kanban Board</h1>
        <Dialog>
          <DialogTrigger asChild>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
              Add Task
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
            <TaskForm onSubmit={handleAddTask} />
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading tasks...</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex space-x-4 overflow-x-auto pb-4">
            <SortableContext items={COLUMNS.map((col) => col.id)}>
              {COLUMNS.map((column) => (
                <TaskColumn
                  key={column.id}
                  column={column}
                  tasks={getTasksByStatus(column.id)}
                />
              ))}
            </SortableContext>
          </div>

          <DragOverlay>
            {activeTask ? <TaskCard task={activeTask} /> : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}
