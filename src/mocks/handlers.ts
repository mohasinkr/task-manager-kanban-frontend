import { http, HttpResponse } from 'msw';
import { Task, TaskStatus } from '../types/task';

// smple mock data
let tasks: Task[] = [
  {
    id: '1',
    title: 'Research project requirements',
    description: 'Gather all necessary information for the upcoming project',
    status: 'todo',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Create project plan',
    description: 'Define milestones and deliverables',
    status: 'todo',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Design UI mockups',
    description: 'Create initial designs for the application interface',
    status: 'in-progress',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Implement authentication',
    description: 'Set up user login and registration',
    status: 'done',
    createdAt: new Date().toISOString()
  }
];

export const handlers = [
  // Get all tasks
  http.get('/api/tasks', () => {
    return HttpResponse.json(tasks);
  }),

  // Get task by ID
  http.get('/api/tasks/:id', ({ params }) => {
    const { id } = params;
    const task = tasks.find(task => task.id === id);
    
    if (!task) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(task);
  }),

  // Create a new task
  http.post('/api/tasks', async ({ request }) => {
    const newTask = await request.json() as Omit<Task, 'id' | 'createdAt'>;
    
    const task: Task = {
      ...newTask,
      id: String(Date.now()),
      createdAt: new Date().toISOString()
    };
    
    tasks.push(task);
    return HttpResponse.json(task, { status: 201 });
  }),

  // Update a task
  http.put('/api/tasks/:id', async ({ params, request }) => {
    const { id } = params;
    const updates = await request.json() as Partial<Task>;
    
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updates
    };
    
    return HttpResponse.json(tasks[taskIndex]);
  }),

  // Update task status
  http.patch('/api/tasks/:id/status', async ({ params, request }) => {
    const { id } = params;
    const { status } = await request.json() as { status: TaskStatus };
    
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    
    tasks[taskIndex].status = status;
    
    return HttpResponse.json(tasks[taskIndex]);
  }),

  // Delete a task
  http.delete('/api/tasks/:id', ({ params }) => {
    const { id } = params;
    
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    
    const deletedTask = tasks[taskIndex];
    tasks = tasks.filter(task => task.id !== id);
    
    return HttpResponse.json(deletedTask);
  })
];
