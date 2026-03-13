/**
 * @vitest-environment jsdom
 *
 * Unit tests for the TaskCard component.
 * Covers rendering, completion state, callbacks, and keyboard accessibility.
 */

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { Task } from "../../../src/types/Types";
import TaskCard from "../../../src/components/task/TaskCard";

// ─── Shared fixtures ──────────────────────────────────────────────────────────

const BASE_TASK: Task = {
  taskId: "task-1",
  patientId: "patient-1",
  careTeamId: "team-1",
  categoryId: "cat-1",
  title: "Take Medication",
  description: "Administer morning pills",
  scheduledAt: "2026-03-13T09:00:00",
  categories: { name: "Medication" },
  taskLogs: [],
};

const COMPLETED_TASK: Task = {
  ...BASE_TASK,
  taskId: "task-2",
  taskLogs: [
    {
      taskId: "task-2",
      caregiverId: "cg-1",
      completedAt: "2026-03-13T10:30:00",
      isCompleted: true,
      caregivers: { firstName: "Alice", lastName: "Smith" },
    },
  ],
};

afterEach(cleanup);

// ─── Rendering ────────────────────────────────────────────────────────────────

describe("TaskCard – rendering", () => {
  it("renders the task title and description", () => {
    render(<TaskCard task={BASE_TASK} onToggle={vi.fn()} />);

    expect(screen.getByText("Take Medication")).toBeInTheDocument();
    expect(screen.getByText("Administer morning pills")).toBeInTheDocument();
  });

  it("renders the category badge", () => {
    render(<TaskCard task={BASE_TASK} onToggle={vi.fn()} />);

    expect(screen.getByText("Medication")).toBeInTheDocument();
  });

  it('falls back to "General" when no category is provided', () => {
    const task: Task = { ...BASE_TASK, categories: undefined };
    render(<TaskCard task={task} onToggle={vi.fn()} />);

    expect(screen.getByText("General")).toBeInTheDocument();
  });

  it("renders the scheduled time when scheduledAt is set", () => {
    render(<TaskCard task={BASE_TASK} onToggle={vi.fn()} />);

    // The formatted time should appear somewhere in the card
    const timeEl = screen.getByText(/\d+:\d{2}\s*(AM|PM)/i);
    expect(timeEl).toBeInTheDocument();
  });

  it("does not render a time when scheduledAt is empty", () => {
    const task: Task = { ...BASE_TASK, scheduledAt: "" };
    render(<TaskCard task={task} onToggle={vi.fn()} />);

    expect(screen.queryByText(/\d+:\d{2}\s*(AM|PM)/i)).not.toBeInTheDocument();
  });
});

// ─── Incomplete state ─────────────────────────────────────────────────────────

describe("TaskCard – incomplete task", () => {
  it("renders an unchecked checkbox", () => {
    render(<TaskCard task={BASE_TASK} onToggle={vi.fn()} />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  it("does not apply strikethrough to the title", () => {
    render(<TaskCard task={BASE_TASK} onToggle={vi.fn()} />);

    const title = screen.getByText("Take Medication");
    expect(title).not.toHaveClass("text-decoration-line-through");
  });

  it("does not apply the success card class", () => {
    const { container } = render(
      <TaskCard task={BASE_TASK} onToggle={vi.fn()} />,
    );

    const card = container.querySelector(".card");
    expect(card).not.toHaveClass("bg-success-subtle");
  });
});

// ─── Completed state ──────────────────────────────────────────────────────────

describe("TaskCard – completed task", () => {
  it("renders a checked checkbox", () => {
    render(<TaskCard task={COMPLETED_TASK} onToggle={vi.fn()} />);

    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("applies strikethrough to the title", () => {
    render(<TaskCard task={COMPLETED_TASK} onToggle={vi.fn()} />);

    expect(screen.getByText("Take Medication")).toHaveClass(
      "text-decoration-line-through",
    );
  });

  it("applies the success card class", () => {
    const { container } = render(
      <TaskCard task={COMPLETED_TASK} onToggle={vi.fn()} />,
    );

    expect(container.querySelector(".card")).toHaveClass("bg-success-subtle");
  });

  it("shows the completion timestamp", () => {
    render(<TaskCard task={COMPLETED_TASK} onToggle={vi.fn()} />);

    expect(screen.getByText(/Last Completed at/i)).toBeInTheDocument();
  });

  it("shows the caregiver's first name", () => {
    render(<TaskCard task={COMPLETED_TASK} onToggle={vi.fn()} />);

    expect(screen.getByText(/Alice/)).toBeInTheDocument();
  });

  it("hides completion details when no completedAt or completedBy on the log", () => {
    const task: Task = {
      ...BASE_TASK,
      taskLogs: [
        {
          taskId: "task-1",
          caregiverId: "cg-1",
          completedAt: "",
          isCompleted: true,
          caregivers: undefined,
        },
      ],
    };
    render(<TaskCard task={task} onToggle={vi.fn()} />);

    expect(screen.queryByText(/Last Completed at/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/By /i)).not.toBeInTheDocument();
  });
});

// ─── Callbacks ────────────────────────────────────────────────────────────────

describe("TaskCard – callbacks", () => {
  it("calls onToggle when the checkbox is changed", () => {
    const onToggle = vi.fn();
    render(<TaskCard task={BASE_TASK} onToggle={onToggle} />);

    fireEvent.click(screen.getByRole("checkbox"));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("does not call onSelect when the checkbox is clicked", () => {
    const onSelect = vi.fn();
    render(
      <TaskCard task={BASE_TASK} onToggle={vi.fn()} onSelect={onSelect} />,
    );

    fireEvent.click(screen.getByRole("checkbox"));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("calls onSelect when the card body is clicked", () => {
    const onSelect = vi.fn();
    render(
      <TaskCard task={BASE_TASK} onToggle={vi.fn()} onSelect={onSelect} />,
    );

    fireEvent.click(screen.getByRole("button"));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("does not throw when onSelect is not provided and the card is clicked", () => {
    render(<TaskCard task={BASE_TASK} onToggle={vi.fn()} />);

    expect(() => fireEvent.click(screen.getByRole("button"))).not.toThrow();
  });
});
