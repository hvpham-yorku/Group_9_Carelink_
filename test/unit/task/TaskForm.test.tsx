/**
 * @vitest-environment jsdom
 *
 * Unit tests for the TaskForm component.
 * Covers rendering, controlled inputs, form submission, reset after submit,
 * cancel button, and HTML5 required validation.
 */

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import TaskForm from "../../../src/components/task/TaskForm";

// ─── Shared fixtures ──────────────────────────────────────────────────────────

const CATEGORIES = [
  { categoryId: "cat-1", name: "General" },
  { categoryId: "cat-2", name: "Medication" },
];

afterEach(cleanup);

// ─── Rendering ────────────────────────────────────────────────────────────────

describe("TaskForm – rendering", () => {
  it("renders all form fields and the submit button", () => {
    render(<TaskForm categories={CATEGORIES} onAddTask={vi.fn()} />);

    expect(screen.getByLabelText(/task title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/task description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add task/i }),
    ).toBeInTheDocument();
  });

  it("renders all category options in the select", () => {
    render(<TaskForm categories={CATEGORIES} onAddTask={vi.fn()} />);

    expect(screen.getByRole("option", { name: "General" })).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Medication" }),
    ).toBeInTheDocument();
  });

  it("renders a disabled placeholder option in the select", () => {
    render(<TaskForm categories={CATEGORIES} onAddTask={vi.fn()} />);

    const placeholder = screen.getByRole("option", {
      name: /select a category/i,
    });
    expect(placeholder).toBeDisabled();
  });

  it("shows the Cancel button when onCancel is provided", () => {
    render(
      <TaskForm
        categories={CATEGORIES}
        onAddTask={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("does not show the Cancel button when onCancel is omitted", () => {
    render(<TaskForm categories={CATEGORIES} onAddTask={vi.fn()} />);

    expect(
      screen.queryByRole("button", { name: /cancel/i }),
    ).not.toBeInTheDocument();
  });

  it("renders an empty form on first render", () => {
    render(<TaskForm categories={CATEGORIES} onAddTask={vi.fn()} />);

    expect(screen.getByLabelText(/task title/i)).toHaveValue("");
    expect(screen.getByLabelText(/task description/i)).toHaveValue("");
    expect(screen.getByLabelText(/time/i)).toHaveValue("");
    expect(screen.getByLabelText(/category/i)).toHaveValue("");
  });
});

// ─── Controlled inputs ────────────────────────────────────────────────────────

describe("TaskForm – controlled inputs", () => {
  it("updates the title field as the user types", () => {
    render(<TaskForm categories={CATEGORIES} onAddTask={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/task title/i), {
      target: { value: "Walk the patient" },
    });

    expect(screen.getByLabelText(/task title/i)).toHaveValue(
      "Walk the patient",
    );
  });

  it("updates the description field as the user types", () => {
    render(<TaskForm categories={CATEGORIES} onAddTask={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/task description/i), {
      target: { value: "30 minute walk" },
    });

    expect(screen.getByLabelText(/task description/i)).toHaveValue(
      "30 minute walk",
    );
  });

  it("updates the time field as the user types", () => {
    render(<TaskForm categories={CATEGORIES} onAddTask={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/time/i), {
      target: { value: "2026-03-13T09:00" },
    });

    expect(screen.getByLabelText(/time/i)).toHaveValue("2026-03-13T09:00");
  });

  it("updates the category select when the user picks an option", () => {
    render(<TaskForm categories={CATEGORIES} onAddTask={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: "cat-2" },
    });

    expect(screen.getByLabelText(/category/i)).toHaveValue("cat-2");
  });
});

// ─── Form submission ──────────────────────────────────────────────────────────

describe("TaskForm – form submission", () => {
  function fillAndSubmit(onAddTask: ReturnType<typeof vi.fn>) {
    render(<TaskForm categories={CATEGORIES} onAddTask={onAddTask} />);

    fireEvent.change(screen.getByLabelText(/task title/i), {
      target: { value: "Give medication" },
    });
    fireEvent.change(screen.getByLabelText(/task description/i), {
      target: { value: "Administer pills" },
    });
    fireEvent.change(screen.getByLabelText(/time/i), {
      target: { value: "2026-03-13T08:00" },
    });
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: "cat-1" },
    });

    fireEvent.submit(
      screen.getByRole("button", { name: /add task/i }).closest("form")!,
    );
  }

  it("calls onAddTask with the correct arguments on submit", () => {
    const onAddTask = vi.fn();
    fillAndSubmit(onAddTask);

    expect(onAddTask).toHaveBeenCalledOnce();
    expect(onAddTask).toHaveBeenCalledWith(
      "Give medication",
      "Administer pills",
      "2026-03-13T08:00",
      "cat-1",
    );
  });

  it("resets all fields to empty after a successful submit", () => {
    const onAddTask = vi.fn();
    fillAndSubmit(onAddTask);

    expect(screen.getByLabelText(/task title/i)).toHaveValue("");
    expect(screen.getByLabelText(/task description/i)).toHaveValue("");
    expect(screen.getByLabelText(/time/i)).toHaveValue("");
    expect(screen.getByLabelText(/category/i)).toHaveValue("");
  });

  it("does not call onAddTask when the form is not submitted", () => {
    const onAddTask = vi.fn();
    render(<TaskForm categories={CATEGORIES} onAddTask={onAddTask} />);

    expect(onAddTask).not.toHaveBeenCalled();
  });
});

// ─── Cancel button ────────────────────────────────────────────────────────────

describe("TaskForm – cancel button", () => {
  it("calls onCancel when the Cancel button is clicked", () => {
    const onCancel = vi.fn();
    render(
      <TaskForm
        categories={CATEGORIES}
        onAddTask={vi.fn()}
        onCancel={onCancel}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("does not call onAddTask when Cancel is clicked", () => {
    const onAddTask = vi.fn();
    render(
      <TaskForm
        categories={CATEGORIES}
        onAddTask={onAddTask}
        onCancel={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(onAddTask).not.toHaveBeenCalled();
  });

  it("Cancel button is type='button' so it does not submit the form", () => {
    render(
      <TaskForm
        categories={CATEGORIES}
        onAddTask={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: /cancel/i })).toHaveAttribute(
      "type",
      "button",
    );
  });
});

// ─── HTML5 required attributes ────────────────────────────────────────────────

describe("TaskForm – required field attributes", () => {
  it("title input is marked required", () => {
    render(<TaskForm categories={CATEGORIES} onAddTask={vi.fn()} />);
    expect(screen.getByLabelText(/task title/i)).toBeRequired();
  });

  it("description textarea is marked required", () => {
    render(<TaskForm categories={CATEGORIES} onAddTask={vi.fn()} />);
    expect(screen.getByLabelText(/task description/i)).toBeRequired();
  });

  it("time input is marked required", () => {
    render(<TaskForm categories={CATEGORIES} onAddTask={vi.fn()} />);
    expect(screen.getByLabelText(/time/i)).toBeRequired();
  });

  it("category select is marked required", () => {
    render(<TaskForm categories={CATEGORIES} onAddTask={vi.fn()} />);
    expect(screen.getByLabelText(/category/i)).toBeRequired();
  });
});
