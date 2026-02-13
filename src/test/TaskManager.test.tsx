/**
 * @vitest-environment jsdom
 * This file contains integration tests for the TaskManager page and its components.
 * It tests the overall functionality of adding tasks, toggling completion, and localStorage persistence.
 * It also includes unit tests for TaskForm, TaskCard, and TaskList components to ensure they behave as expected in isolation.
 */

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import TaskManager from "../pages/TaskManager";
import TaskCard from "../components/task/TaskCard";
import TaskForm from "../components/task/TaskForm";
import TaskList from "../components/task/TaskList";

/*
    This tests the TaskManager page. It checks whether the header and sample task render, 
    whether adding a new task works, whether toggling completion works, and whether tasks are persisted to localStorage.
*/

describe("TaskManager page", () => {
  beforeEach(() => {
    window.localStorage.clear();
    cleanup();
  });

  it("renders the header and sample task", () => {
    render(<TaskManager />);

    expect(
      screen.getByRole("heading", { name: /task manager/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/sample task/i)[0]).toBeInTheDocument(); // edits here --------------------
    expect(
      screen.getAllByText(/sample task description/i)[0],
    ).toBeInTheDocument();
  });

  it("adds a new task from the form", () => {
    render(<TaskManager />);

    fireEvent.change(screen.getByLabelText(/task title/i), {
      target: { value: "My New Task" },
    });
    fireEvent.change(screen.getByLabelText(/task description/i), {
      target: { value: "My New Description" },
    });
    fireEvent.change(screen.getByLabelText(/time/i), {
      target: { value: "14:30" },
    });
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: "Personal" },
    });

    fireEvent.click(screen.getByRole("button", { name: /add task/i }));

    expect(screen.getByText("My New Task")).toBeInTheDocument();
    expect(screen.getByText("My New Description")).toBeInTheDocument();
    expect(
      (screen.getByLabelText(/task title/i) as HTMLInputElement).value,
    ).toBe("");
  });

  it("toggles completion on checkbox click", () => {
    render(<TaskManager />);

    const checkbox = screen.getByRole("checkbox");
    const title = screen.getAllByText(/sample task/i)[0]; // edits here --------------------

    fireEvent.click(checkbox);
    expect(title).toHaveClass("text-decoration-line-through");

    fireEvent.click(checkbox);
    expect(title).not.toHaveClass("text-decoration-line-through");
  });

  it("persists tasks to localStorage", () => {
    render(<TaskManager />);

    fireEvent.change(screen.getByLabelText(/task title/i), {
      target: { value: "Stored Task" },
    });
    fireEvent.change(screen.getByLabelText(/task description/i), {
      target: { value: "Stored Description" },
    });
    fireEvent.change(screen.getByLabelText(/time/i), {
      target: { value: "10:00" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add task/i }));

    const stored = JSON.parse(window.localStorage.getItem("tasks") ?? "[]");
    expect(stored).toHaveLength(2); // sample + new
    expect(stored[1].title).toBe("Stored Task");
  });
});

/*
    This tests the TaskForm component. 
    It checks whether the form calls the onAddTask callback with the correct values and whether it clears the form after submission.
*/

describe("TaskForm component", () => {
  it("calls onAddTask with form values", () => {
    const onAddTask = vi.fn();
    render(<TaskForm onAddTask={onAddTask} />);

    fireEvent.change(screen.getByLabelText(/task title/i), {
      target: { value: "Title" },
    });
    fireEvent.change(screen.getByLabelText(/task description/i), {
      target: { value: "Desc" },
    });
    fireEvent.change(screen.getByLabelText(/time/i), {
      target: { value: "09:15" },
    });
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: "Nutrition" },
    });

    fireEvent.click(screen.getByRole("button", { name: /add task/i }));

    expect(onAddTask).toHaveBeenCalledWith(
      "Title",
      "Desc",
      "09:15",
      "Nutrition",
    );
  });

  it("clears the form after submit", () => {
    const onAddTask = vi.fn();
    render(<TaskForm onAddTask={onAddTask} />);

    fireEvent.change(screen.getByLabelText(/task title/i), {
      target: { value: "Title" },
    });
    fireEvent.change(screen.getByLabelText(/task description/i), {
      target: { value: "Desc" },
    });
    fireEvent.change(screen.getByLabelText(/time/i), {
      target: { value: "09:15" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add task/i }));

    expect(
      (screen.getByLabelText(/task title/i) as HTMLInputElement).value,
    ).toBe("");
    expect(
      (screen.getByLabelText(/task description/i) as HTMLTextAreaElement).value,
    ).toBe("");
    expect((screen.getByLabelText(/time/i) as HTMLInputElement).value).toBe("");
  });
});

/*
    This tests the TaskCard component. 
    It checks whether the task details render correctly and whether the onToggle callback is fired when the checkbox is clicked.
*/

describe("TaskCard component", () => {
  it("renders task details", () => {
    render(
      <TaskCard
        title="Card Title"
        description="Card Desc"
        category="Medication"
        time="12:00"
        completed={false}
        onToggle={() => {}}
      />,
    );

    expect(screen.getByText("Card Title")).toBeInTheDocument();
    expect(screen.getByText("Card Desc")).toBeInTheDocument();
    expect(screen.getByText("Medication")).toBeInTheDocument();
    expect(screen.getByText("12:00")).toBeInTheDocument();
  });

  it("fires onToggle when checkbox is clicked", () => {
    const onToggle = vi.fn();
    render(
      <TaskCard
        title="Card Title"
        description="Card Desc"
        category="Medication"
        time="12:00"
        completed={false}
        onToggle={onToggle}
      />,
    );

    fireEvent.click(screen.getByRole("checkbox"));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});

/*
    This tests the TaskList component. 
    It checks whether each task renders and whether the onToggleTask callback is fired with the correct task ID when a checkbox is clicked.
*/

describe("TaskList component", () => {
  it("renders each task and wires toggle", () => {
    const tasks = [
      {
        id: 1,
        title: "Task 1",
        description: "Desc 1",
        category: "None",
        completed: false,
      },
      {
        id: 2,
        title: "Task 2",
        description: "Desc 2",
        category: "Vitals",
        completed: true,
      },
    ];
    const onToggleTask = vi.fn();

    render(<TaskList tasks={tasks} onToggleTask={onToggleTask} />);

    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("checkbox")[1]);
    expect(onToggleTask).toHaveBeenCalledWith(2);
  });
});
