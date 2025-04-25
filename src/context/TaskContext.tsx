"use client";

import React, { createContext, useContext, useState } from "react";

export type Task = {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: "Completed" | "In Progress";
  priority: "High" | "Medium" | "Low";
};

type TaskContextType = {
  tasks: Task[];
  deleteTask: (id: number) => void;
  updateTaskPriority: (id: number, priority: string) => void;
  updateTask: (task: Task) => void;
  addTask: (task: Task) => void;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Lorem ipsum dolor sit consec",
    description:
      "Lorem ipsum dolor sit amet, consectetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna",
    dueDate: "2021-04-23",
    status: "Completed",
    priority: "Medium",
  },
  {
    id: 2,
    title: "Lorem ipsum dolor sit consec",
    description:
      "Lorem ipsum dolor sit amet, consectetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna",
    dueDate: "2027-04-23",
    status: "In Progress",
    priority: "High",
  },
  {
    id: 3,
    title: "Lorem ipsum dolor sit consec",
    description:
      "Lorem ipsum dolor sit amet, consectetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna",
    dueDate: "1990-04-19",
    status: "In Progress",
    priority: "Medium",
  },
  {
    id: 4,
    title: "Lorem ipsum dolor sit consec",
    description:
      "Lorem ipsum dolor sit amet, consectetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna",
    dueDate: "2000-07-23",
    status: "Completed",
    priority: "Low",
  },
  {
    id: 5,
    title: "Lorem ipsum dolor sit consec",
    description:
      "Lorem ipsum dolor sit amet, consectetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna",
    dueDate: "2024-12-12",
    status: "Completed",
    priority: "Low",
  },
  {
    id: 6,
    title: "Lorem ipsum dolor sit consec",
    description:
      "Lorem ipsum dolor sit amet, consectetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna",
    dueDate: "2024-01-01",
    status: "Completed",
    priority: "High",
  },
  {
    id: 7,
    title: "Lorem ipsum dolor sit consec",
    description:
      "Lorem ipsum dolor sit amet, consectetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna",
    dueDate: "2020-04-29",
    status: "In Progress",
    priority: "High",
  },
];

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const updateTaskPriority = (id: number, priority: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, priority: priority as Task["priority"] }
          : task
      )
    );
  };

  const updateTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const addTask = (task: Omit<Task, "id">) => {
    const newId =
      tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
    setTasks((prev) => [...prev, { ...task, id: newId }]);
  };

  return (
    <TaskContext.Provider
      value={{ tasks, deleteTask, updateTaskPriority, updateTask, addTask }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context)
    throw new Error("useTaskContext must be used within a TaskProvider");
  return context;
};
