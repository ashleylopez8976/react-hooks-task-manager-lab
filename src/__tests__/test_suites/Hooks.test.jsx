import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import App from "../../components/App";
import { TaskProvider } from "../../context/TaskContext";

describe("Task Manager App", () => {
  test("renders initial tasks from the backend", async () => {
    global.setFetchResponse(global.baseTasks);

    render(
      <TaskProvider>
        <App />
      </TaskProvider>
    );

    expect(await screen.findByText("Buy groceries")).toBeInTheDocument();
    expect(screen.getByText("Finish React project")).toBeInTheDocument();
  });

  test("adds a new task when the form is submitted", async () => {
    global.setFetchResponse(global.baseTasks);

    render(
      <TaskProvider>
        <App />
      </TaskProvider>
    );

    await screen.findByText("Buy groceries");

    const input = screen.getByPlaceholderText("Add a new task...");
    const button = screen.getByRole("button", { name: "Add Task" });

    fireEvent.change(input, {
      target: { value: "Walk the dog" },
    });

    global.setFetchResponse({
      id: 3,
      title: "Walk the dog",
      completed: false,
    });

    fireEvent.click(button);

    expect(await screen.findByText("Walk the dog")).toBeInTheDocument();

    await waitFor(() => {
      expect(input).toHaveValue("");
    });
  });

  test("filters tasks based on search input", async () => {
    global.setFetchResponse(global.baseTasks);

    render(
      <TaskProvider>
        <App />
      </TaskProvider>
    );

    await screen.findByText("Buy groceries");

    fireEvent.change(screen.getByPlaceholderText("Search tasks..."), {
      target: { value: "groceries" },
    });

    expect(screen.getByText("Buy groceries")).toBeInTheDocument();
    expect(screen.queryByText("Finish React project")).not.toBeInTheDocument();
  });

  test("toggles task completion state", async () => {
    global.setFetchResponse(global.baseTasks);

    render(
      <TaskProvider>
        <App />
      </TaskProvider>
    );

    const button = await screen.findByTestId("1");

    global.setFetchResponse({
      id: 1,
      title: "Buy groceries",
      completed: true,
    });

    fireEvent.click(button);

    await waitFor(() => {
      expect(button).toHaveTextContent("Undo");
    });

    expect(screen.getByText("Buy groceries")).toHaveStyle({
      textDecoration: "line-through",
    });
  });
});