import { Task } from "../types/task";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white dark:bg-card p-3 sm:p-4 rounded-lg shadow-sm border border-border mb-2 cursor-grab active:cursor-grabbing touch-manipulation"
    >
      <h3 className="font-medium text-foreground mb-1 break-words">
        {task.title}
      </h3>
      {task.description && (
        <p className="text-sm text-muted-foreground break-words">
          {task.description}
        </p>
      )}
    </div>
  );
}
