import React, { createContext, useEffect, useState } from "react";

export const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  // Load the saved tasks when the provider mounts.
  useEffect(() => {
    fetch("http://localhost:6001/tasks")
      .then((response) => response.json())
      .then((data) => setTasks(data));
  }, []);

  // Save completion changes and update the displayed task.
  async function toggleComplete(id) {
    const task = tasks.find((task) => task.id === id);

    const response = await fetch(`http://localhost:6001/tasks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        completed: !task.completed,
      }),
    });

    const updatedTask = await response.json();

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? updatedTask : task
      )
    );
  }

    // Save a new task and add it to the displayed list.
  async function addTask(title) {
    const response = await fetch("http://localhost:6001/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        completed: false,
      }),
    });

    const newTask = await response.json();

    setTasks((currentTasks) => [...currentTasks, newTask]);
  }

  return (
    <TaskContext.Provider value={{ tasks, toggleComplete, addTask }}>
      {children}
    </TaskContext.Provider>
  );
}