import { Task, Column } from "../types/task";
import { TaskCard } from "./TaskCard";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";

interface TaskColumnProps {
  column: Column;
  tasks: Task[];
}

export function TaskColumn({ column, tasks }: TaskColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div className="flex flex-col w-full md:w-80 bg-secondary/50 dark:bg-secondary/30 rounded-lg p-2">
      <div className="flex items-center justify-between mb-2 px-2">
        <h2 className="font-semibold text-foreground">{column.title}</h2>
        <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className="flex-1 overflow-y-auto p-2 min-h-[200px] md:min-h-[300px]"
      >
        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
