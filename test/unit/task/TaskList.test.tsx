/**
 * @vitest-environment jsdom
 *
 * Unit tests for the TaskList component.
 * Covers rendering, empty state, task card delegation, and callbacks.
 */

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { Task } from "../../../src/types/task";
import TaskList from "../../../src/components/task/TaskList";

// ─── Shared fixtures ──────────────────────────────────────────────────────────

const makeTask = (id: string, title: string, completed = false): Task => ({
  taskId: id,
  patientId: "patient-1",
  categoryId: "cat-1",
  title,
  description: `Description for ${title}`,
  scheduledAt: "2026-03-13T09:00:00",
  categories: { name: "General" },
  taskLogs: completed
    ? [
        {
          taskId: id,
          caregiverId: "cg-1",
          completedAt: new Date().toISOString(),
          isCompleted: true,
          caregivers: { firstName: "Alice", lastName: "Smith" },
        },
      ]
    : [],
});

const TASK_A = makeTask("task-1", "Task Alpha");
const TASK_B = makeTask("task-2", "Task Beta");
const TASK_C = makeTask("task-3", "Task Gamma", true);

afterEach(cleanup);

// ─── Rendering ────────────────────────────────────────────────────────────────

describe("TaskList – rendering", () => {
  it("renders a card for every task in the list", () => {
    render(
      <TaskList
        tasks={[TASK_A, TASK_B, TASK_C]}
        onToggleTask={vi.fn()}
        onSelectTask={vi.fn()}
      />,
    );

    expect(screen.getByText("Task Alpha")).toBeInTheDocument();
    expect(screen.getByText("Task Beta")).toBeInTheDocument();
    expect(screen.getByText("Task Gamma")).toBeInTheDocument();
  });

  it("renders the correct number of list items", () => {
    render(
      <TaskList
        tasks={[TASK_A, TASK_B]}
        onToggleTask={vi.fn()}
        onSelectTask={vi.fn()}
      />,
    );

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("renders nothing when the tasks array is empty", () => {
    render(
      <TaskList tasks={[]} onToggleTask={vi.fn()} onSelectTask={vi.fn()} />,
    );

    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });

  it("renders a single task correctly", () => {
    render(
      <TaskList
        tasks={[TASK_A]}
        onToggleTask={vi.fn()}
        onSelectTask={vi.fn()}
      />,
    );

    expect(screen.getAllByRole("listitem")).toHaveLength(1);
    expect(screen.getByText("Task Alpha")).toBeInTheDocument();
  });

  it("renders completed tasks with a checked checkbox", () => {
    render(
      <TaskList
        tasks={[TASK_C]}
        onToggleTask={vi.fn()}
        onSelectTask={vi.fn()}
      />,
    );

    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("renders incomplete tasks with an unchecked checkbox", () => {
    render(
      <TaskList
        tasks={[TASK_A]}
        onToggleTask={vi.fn()}
        onSelectTask={vi.fn()}
      />,
    );

    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });
});

// ─── onToggleTask callback ────────────────────────────────────────────────────

describe("TaskList – onToggleTask", () => {
  it("calls onToggleTask with the correct task id when the checkbox is clicked", () => {
    const onToggleTask = vi.fn();
    render(
      <TaskList
        tasks={[TASK_A]}
        onToggleTask={onToggleTask}
        onSelectTask={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("checkbox"));

    expect(onToggleTask).toHaveBeenCalledOnce();
    expect(onToggleTask).toHaveBeenCalledWith("task-1");
  });

  it("calls onToggleTask with the correct id for the toggled task when multiple tasks are rendered", () => {
    const onToggleTask = vi.fn();
    render(
      <TaskList
        tasks={[TASK_A, TASK_B]}
        onToggleTask={onToggleTask}
        onSelectTask={vi.fn()}
      />,
    );

    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[1]); // click Task Beta's checkbox

    expect(onToggleTask).toHaveBeenCalledWith("task-2");
  });

  it("calls onToggleTask once per click", () => {
    const onToggleTask = vi.fn();
    render(
      <TaskList
        tasks={[TASK_A, TASK_B]}
        onToggleTask={onToggleTask}
        onSelectTask={vi.fn()}
      />,
    );

    const [first, second] = screen.getAllByRole("checkbox");
    fireEvent.click(first);
    fireEvent.click(second);

    expect(onToggleTask).toHaveBeenCalledTimes(2);
  });
});

// ─── onSelectTask callback ────────────────────────────────────────────────────

describe("TaskList – onSelectTask", () => {
  it("calls onSelectTask with the full task object when a card is clicked", () => {
    const onSelectTask = vi.fn();
    render(
      <TaskList
        tasks={[TASK_A]}
        onToggleTask={vi.fn()}
        onSelectTask={onSelectTask}
      />,
    );

    fireEvent.click(screen.getByRole("button"));

    expect(onSelectTask).toHaveBeenCalledOnce();
    expect(onSelectTask).toHaveBeenCalledWith(TASK_A);
  });

  it("calls onSelectTask with the correct task when one of several cards is clicked", () => {
    const onSelectTask = vi.fn();
    render(
      <TaskList
        tasks={[TASK_A, TASK_B]}
        onToggleTask={vi.fn()}
        onSelectTask={onSelectTask}
      />,
    );

    const cards = screen.getAllByRole("button");
    fireEvent.click(cards[1]); // click Task Beta's card

    expect(onSelectTask).toHaveBeenCalledWith(TASK_B);
  });

  it("does not call onSelectTask when a checkbox is clicked", () => {
    const onSelectTask = vi.fn();
    render(
      <TaskList
        tasks={[TASK_A]}
        onToggleTask={vi.fn()}
        onSelectTask={onSelectTask}
      />,
    );

    fireEvent.click(screen.getByRole("checkbox"));

    expect(onSelectTask).not.toHaveBeenCalled();
  });
});
