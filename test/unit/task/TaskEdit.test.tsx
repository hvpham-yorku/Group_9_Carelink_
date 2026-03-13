/**
 * @vitest-environment jsdom
 *
 * Unit tests for the TaskEdit component.
 * Covers pre-population, controlled inputs, save, delete, cancel,
 * completion details panel, and required field attributes.
 */

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { Task } from "../../../src/types/Types";
import TaskEdit from "../../../src/components/task/TaskEdit";

// ─── Shared fixtures ──────────────────────────────────────────────────────────

const CATEGORIES = [
  { categoryId: "cat-1", name: "General" },
  { categoryId: "cat-2", name: "Medication" },
];

const BASE_TASK: Task = {
  taskId: "task-1",
  patientId: "patient-1",
  careTeamId: "team-1",
  categoryId: "cat-1",
  title: "Take Medication",
  description: "Administer morning pills",
  scheduledAt: "2026-03-13T09:00",
  categories: { name: "General" },
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

// ─── Pre-population ───────────────────────────────────────────────────────────

describe("TaskEdit – pre-population", () => {
  it("pre-fills the title field with the task's current title", () => {
    render(
      <TaskEdit
        task={BASE_TASK}
        categories={CATEGORIES}
        onUpdateTask={vi.fn()}
        onDeleteTask={vi.fn()}
      />,
    );

    expect(screen.getByLabelText(/task title/i)).toHaveValue("Take Medication");
  });

  it("pre-fills the description field", () => {
    render(
      <TaskEdit
        task={BASE_TASK}
        categories={CATEGORIES}
        onUpdateTask={vi.fn()}
        onDeleteTask={vi.fn()}
      />,
    );

    expect(screen.getByLabelText(/task description/i)).toHaveValue(
      "Administer morning pills",
    );
  });

  it("pre-fills the time field with scheduledAt", () => {
    render(
      <TaskEdit
        task={BASE_TASK}
        categories={CATEGORIES}
        onUpdateTask={vi.fn()}
        onDeleteTask={vi.fn()}
      />,
    );

    expect(screen.getByLabelText(/time/i)).toHaveValue("2026-03-13T09:00");
  });

  it("pre-selects the correct category", () => {
    render(
      <TaskEdit
        task={BASE_TASK}
        categories={CATEGORIES}
        onUpdateTask={vi.fn()}
        onDeleteTask={vi.fn()}
      />,
    );

    expect(screen.getByLabelText(/category/i)).toHaveValue("cat-1");
  });
});

// ─── Controlled inputs ────────────────────────────────────────────────────────

describe("TaskEdit – controlled inputs", () => {
  it("updates the title as the user types", () => {
    render(
      <TaskEdit
        task={BASE_TASK}
        categories={CATEGORIES}
        onUpdateTask={vi.fn()}
        onDeleteTask={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText(/task title/i), {
      target: { value: "New Title" },
    });

    expect(screen.getByLabelText(/task title/i)).toHaveValue("New Title");
  });

  it("updates the description as the user types", () => {
    render(
      <TaskEdit
        task={BASE_TASK}
        categories={CATEGORIES}
        onUpdateTask={vi.fn()}
        onDeleteTask={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText(/task description/i), {
      target: { value: "Updated description" },
    });

    expect(screen.getByLabelText(/task description/i)).toHaveValue(
      "Updated description",
    );
  });

  it("updates the time as the user changes it", () => {
    render(
      <TaskEdit
        task={BASE_TASK}
        categories={CATEGORIES}
        onUpdateTask={vi.fn()}
        onDeleteTask={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText(/time/i), {
      target: { value: "2026-03-14T11:00" },
    });

    expect(screen.getByLabelText(/time/i)).toHaveValue("2026-03-14T11:00");
  });

  it("updates the category when the user picks a new one", () => {
    render(
      <TaskEdit
        task={BASE_TASK}
        categories={CATEGORIES}
        onUpdateTask={vi.fn()}
        onDeleteTask={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: "cat-2" },
    });

    expect(screen.getByLabelText(/category/i)).toHaveValue("cat-2");
  });
});

// ─── Save (onUpdateTask) ──────────────────────────────────────────────────────

describe("TaskEdit – save", () => {
  it("calls onUpdateTask with the updated task on submit", () => {
    const onUpdateTask = vi.fn();
    render(
      <TaskEdit
        task={BASE_TASK}
        categories={CATEGORIES}
        onUpdateTask={onUpdateTask}
        onDeleteTask={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText(/task title/i), {
      target: { value: "Updated Title" },
    });
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: "cat-2" },
    });

    fireEvent.submit(
      screen.getByRole("button", { name: /save changes/i }).closest("form")!,
    );

    expect(onUpdateTask).toHaveBeenCalledOnce();
    const updated: Task = onUpdateTask.mock.calls[0][0];
    expect(updated.title).toBe("Updated Title");
    expect(updated.categoryId).toBe("cat-2");
    expect(updated.categories?.name).toBe("Medication");
  });

  it("preserves unchanged fields when saving", () => {
    const onUpdateTask = vi.fn();
    render(
      <TaskEdit
        task={BASE_TASK}
        categories={CATEGORIES}
        onUpdateTask={onUpdateTask}
        onDeleteTask={vi.fn()}
      />,
    );

    fireEvent.submit(
      screen.getByRole("button", { name: /save changes/i }).closest("form")!,
    );

    const updated: Task = onUpdateTask.mock.calls[0][0];
    expect(updated.description).toBe("Administer morning pills");
    expect(updated.scheduledAt).toBe("2026-03-13T09:00");
    expect(updated.taskId).toBe("task-1");
  });

  it("uses the original categories name when the selected category has no match", () => {
    const onUpdateTask = vi.fn();
    // categoryId set to something not in the categories list
    const task: Task = { ...BASE_TASK, categoryId: "cat-unknown" };
    render(
      <TaskEdit
        task={task}
        categories={CATEGORIES}
        onUpdateTask={onUpdateTask}
        onDeleteTask={vi.fn()}
      />,
    );

    fireEvent.submit(
      screen.getByRole("button", { name: /save changes/i }).closest("form")!,
    );

    const updated: Task = onUpdateTask.mock.calls[0][0];
    expect(updated.categories).toEqual(task.categories);
  });

  it("Save Changes button is type='submit'", () => {
    render(
      <TaskEdit
        task={BASE_TASK}
        categories={CATEGORIES}
        onUpdateTask={vi.fn()}
        onDeleteTask={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: /save changes/i }),
    ).toHaveAttribute("type", "submit");
  });
});

// ─── Delete (onDeleteTask) ────────────────────────────────────────────────────

describe("TaskEdit – delete", () => {
  it("calls onDeleteTask with the task id when Delete is clicked", () => {
    const onDeleteTask = vi.fn();
    render(
      <TaskEdit
        task={BASE_TASK}
        categories={CATEGORIES}
        onUpdateTask={vi.fn()}
        onDeleteTask={onDeleteTask}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /delete task/i }));

    expect(onDeleteTask).toHaveBeenCalledOnce();
    expect(onDeleteTask).toHaveBeenCalledWith("task-1");
  });

  it("does not call onUpdateTask when Delete is clicked", () => {
    const onUpdateTask = vi.fn();
    render(
      <TaskEdit
        task={BASE_TASK}
        categories={CATEGORIES}
        onUpdateTask={onUpdateTask}
        onDeleteTask={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /delete task/i }));

    expect(onUpdateTask).not.toHaveBeenCalled();
  });

  it("Delete Task button is type='button' so it does not submit the form", () => {
    render(
      <TaskEdit
        task={BASE_TASK}
        categories={CATEGORIES}
        onUpdateTask={vi.fn()}
        onDeleteTask={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: /delete task/i }),
    ).toHaveAttribute("type", "button");
  });
});

// ─── Cancel button ────────────────────────────────────────────────────────────

describe("TaskEdit – cancel button", () => {
  it("shows the Cancel button when onCancel is provided", () => {
    render(
      <TaskEdit
        task={BASE_TASK}
        categories={CATEGORIES}
        onUpdateTask={vi.fn()}
        onDeleteTask={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: /cancel/i }),
    ).toBeInTheDocument();
  });

  it("hides the Cancel button when onCancel is omitted", () => {
    render(
      <TaskEdit
        task={BASE_TASK}
        categories={CATEGORIES}
        onUpdateTask={vi.fn()}
        onDeleteTask={vi.fn()}
      />,
    );

    expect(
      screen.queryByRole("button", { name: /cancel/i }),
    ).not.toBeInTheDocument();
  });

  it("calls onCancel when Cancel is clicked", () => {
    const onCancel = vi.fn();
    render(
      <TaskEdit
        task={BASE_TASK}
        categories={CATEGORIES}
        onUpdateTask={vi.fn()}
        onDeleteTask={vi.fn()}
        onCancel={onCancel}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("Cancel button is type='button' so it does not submit the form", () => {
    render(
      <TaskEdit
        task={BASE_TASK}
        categories={CATEGORIES}
        onUpdateTask={vi.fn()}
        onDeleteTask={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: /cancel/i })).toHaveAttribute(
      "type",
      "button",
    );
  });
});

// ─── Completion details panel ─────────────────────────────────────────────────

describe("TaskEdit – completion details panel", () => {
  it("does not show the completion panel for an incomplete task", () => {
    render(
      <TaskEdit
        task={BASE_TASK}
        categories={CATEGORIES}
        onUpdateTask={vi.fn()}
        onDeleteTask={vi.fn()}
      />,
    );

    expect(
      screen.queryByText(/latest completion details/i),
    ).not.toBeInTheDocument();
  });

  it("shows the completion panel for a completed task", () => {
    render(
      <TaskEdit
        task={COMPLETED_TASK}
        categories={CATEGORIES}
        onUpdateTask={vi.fn()}
        onDeleteTask={vi.fn()}
      />,
    );

    expect(
      screen.getByText(/latest completion details/i),
    ).toBeInTheDocument();
  });

  it("displays the caregiver's first name in the completion panel", () => {
    render(
      <TaskEdit
        task={COMPLETED_TASK}
        categories={CATEGORIES}
        onUpdateTask={vi.fn()}
        onDeleteTask={vi.fn()}
      />,
    );

    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("shows 'Not specified' when the log has no caregiver name", () => {
    const task: Task = {
      ...BASE_TASK,
      taskLogs: [
        {
          taskId: "task-1",
          caregiverId: "cg-1",
          completedAt: "2026-03-13T10:00:00",
          isCompleted: true,
          caregivers: undefined,
        },
      ],
    };
    render(
      <TaskEdit
        task={task}
        categories={CATEGORIES}
        onUpdateTask={vi.fn()}
        onDeleteTask={vi.fn()}
      />,
    );

    expect(screen.getByText(/not specified/i)).toBeInTheDocument();
  });
});

// ─── Required field attributes ────────────────────────────────────────────────

describe("TaskEdit – required field attributes", () => {
  it("title input is marked required", () => {
    render(
      <TaskEdit
        task={BASE_TASK}
        categories={CATEGORIES}
        onUpdateTask={vi.fn()}
        onDeleteTask={vi.fn()}
      />,
    );
    expect(screen.getByLabelText(/task title/i)).toBeRequired();
  });

  it("description textarea is marked required", () => {
    render(
      <TaskEdit
        task={BASE_TASK}
        categories={CATEGORIES}
        onUpdateTask={vi.fn()}
        onDeleteTask={vi.fn()}
      />,
    );
    expect(screen.getByLabelText(/task description/i)).toBeRequired();
  });

  it("time input is marked required", () => {
    render(
      <TaskEdit
        task={BASE_TASK}
        categories={CATEGORIES}
        onUpdateTask={vi.fn()}
        onDeleteTask={vi.fn()}
      />,
    );
    expect(screen.getByLabelText(/time/i)).toBeRequired();
  });

  it("category select is marked required", () => {
    render(
      <TaskEdit
        task={BASE_TASK}
        categories={CATEGORIES}
        onUpdateTask={vi.fn()}
        onDeleteTask={vi.fn()}
      />,
    );
    expect(screen.getByLabelText(/category/i)).toBeRequired();
  });
});
