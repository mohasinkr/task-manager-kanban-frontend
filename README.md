# Kanban Task Board

A modern Kanban task board application built with React, TypeScript, and Vite. This application allows you to manage tasks by dragging and dropping them between different status columns (To Do, In Progress, Done).

## Features

- **Task Management**: Create, view, and organize tasks
- **Drag & Drop**: Intuitive drag and drop interface for moving tasks between columns
- **Status Tracking**: Visual representation of task progress across three states
- **Responsive Design**: Fully responsive layout that works seamlessly on desktop, tablet, and mobile devices
- **Mock API**: Simulated backend with MSW for development and production

## Installation Instructions

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v8 or higher)

### Setup Steps

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd task-manager-frontend
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the development server:

   ```bash
   pnpm dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

### Production Build

To create a production build:

```bash
# Standard build (mocks disabled)
pnpm build

# Build with mock API enabled
pnpm build:with-mocks
```

To preview the production build:

```bash
pnpm preview
```

## Architecture & Approach

The application follows a component-based architecture with a focus on separation of concerns:

### Core Components

- **KanbanBoard**: Main container component that manages the overall state and data flow
- **TaskColumn**: Represents each status column (To Do, In Progress, Done)
- **TaskCard**: Individual task card with drag and drop capabilities
- **TaskForm**: Modal form for creating new tasks with shadcn UI components

### State Management

The application uses React's built-in state management with hooks:

- `useState` for local component state
- `useEffect` for side effects like API calls

### Data Flow

1. Tasks are fetched from the mock API on initial load
2. User interactions (adding tasks, drag and drop) trigger API calls
3. UI updates reflect the changes from the API responses

### Drag and Drop Implementation

The drag and drop functionality is implemented using @dnd-kit:

- Tasks can be dragged between columns
- When a task is dropped in a new column, its status is updated via the API
- The UI updates immediately for a responsive feel

### Responsive Design

The application is fully responsive and works well on all device sizes:

- **Mobile**: Columns stack vertically for easy scrolling on small screens
- **Tablet**: Adapts layout for medium-sized screens
- **Desktop**: Full horizontal layout with multiple columns visible
- **Touch-friendly**: Optimized for touch interactions on mobile devices

## Mock API Configuration

This project uses MSW (Mock Service Worker) to simulate a backend API:

### API Endpoints

- `GET /api/tasks` - Fetch all tasks
- `POST /api/tasks` - Create a new task
- `PATCH /api/tasks/:id/status` - Update task status
- `PUT /api/tasks/:id` - Update task details
- `DELETE /api/tasks/:id` - Delete a task

### Environment Control

The mock API can be enabled in both development and production:

```bash
# Enable mocks in production
pnpm build:with-mocks

# Disable mocks in production (default)
pnpm build:no-mocks
```

Environment variables in `.env` files control this behavior:

- `VITE_ENABLE_MOCKS=true` - Enable mock API
- `VITE_ENABLE_MOCKS=false` - Disable mock API
