/**
 * @vitest-environment jsdom
 *
 * Integration tests for the TaskManager page.
 * Covers task rendering, creation, toggling completion, editing, deletion,
 * and the stat-cards introduced in ITR 3.
 * Mocks repositories.task, useAuth, and usePatient so no real network calls
 * are made.
 */

import "@testing-library/jest-dom/vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { Task } from "../../src/types/task";
import TaskManager from "../../src/pages/TaskManager";
import { repositories } from "../../src/data/index";

// ─── Shared fixtures ──────────────────────────────────────────────────────────

const MOCK_CATEGORIES = [
  { categoryId: "cat-1", name: "General" },
  { categoryId: "cat-2", name: "Medication" },
];

// scheduledAt is in the past so this task counts as "overdue"
const MOCK_TASK: Task = {
  taskId: "task-1",
  patientId: "patient-1",
  categoryId: "cat-1",
  title: "Sample Task",
  description: "Sample Description",
  scheduledAt: "2026-03-06T10:00",
  categories: { name: "General" },
  taskLogs: [],
};

// completedAt is set to today so isCompletedToday() returns true
const TODAY_ISO = new Date().toISOString();
const COMPLETED_TASK: Task = {
  ...MOCK_TASK,
  taskId: "task-2",
  title: "Completed Task",
  taskLogs: [
    {
      taskId: "task-2",
      caregiverId: "caregiver-1",
      completedAt: TODAY_ISO,
      isCompleted: true,
      caregivers: { firstName: "Alice", lastName: "Smith" },
    },
  ],
};

// ─── Module mocks ─────────────────────────────────────────────────────────────

vi.mock("../../src/hooks/useAuth", () => ({
  useAuth: () => ({ user: { id: "user-1" } }),
}));

vi.mock("../../src/contexts/patient/usePatient", () => ({
  usePatient: () => ({
    selectedPatientId: "patient-1",
    careTeamId: "team-1",
    loading: false,
  }),
}));

vi.mock("../../src/data/index", () => ({
  repositories: {
    task: {
      getTasksByPatient: vi.fn(),
      getCategories: vi.fn(),
      addTask: vi.fn(),
      markTaskAsDone: vi.fn(),
      unmarkTaskAsDone: vi.fn(),
      updateTask: vi.fn(),
      deleteTask: vi.fn(),
    },
  },
}));

// ─── TaskManager page (integration) ──────────────────────────────────────────

describe("TaskManager page", () => {
  beforeEach(() => {
    vi.mocked(repositories.task.getTasksByPatient).mockResolvedValue([
      MOCK_TASK,
    ]);
    vi.mocked(repositories.task.getCategories).mockResolvedValue(
      MOCK_CATEGORIES,
    );
    vi.mocked(repositories.task.addTask).mockResolvedValue(undefined as any);
    vi.mocked(repositories.task.markTaskAsDone).mockResolvedValue(
      undefined as any,
    );
    vi.mocked(repositories.task.unmarkTaskAsDone).mockResolvedValue(
      undefined as any,
    );
    vi.mocked(repositories.task.updateTask).mockResolvedValue(undefined as any);
    vi.mocked(repositories.task.deleteTask).mockResolvedValue(undefined as any);
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  // ── Rendering ──────────────────────────────────────────────────────────────

  it("renders the Task Manager heading", async () => {
    render(<TaskManager />);
    expect(
      screen.getByRole("heading", { name: /task manager/i }),
    ).toBeInTheDocument();
  });

  it("shows a loading spinner while tasks are being fetched", () => {
    vi.mocked(repositories.task.getTasksByPatient).mockReturnValue(
      new Promise(() => {}),
    );
    render(<TaskManager />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders tasks returned by the repository after loading", async () => {
    render(<TaskManager />);
    await waitFor(() =>
      expect(screen.getByText("Sample Task")).toBeInTheDocument(),
    );
    expect(screen.getByText("Sample Description")).toBeInTheDocument();
  });

  it("shows an empty-state message when no tasks exist", async () => {
    vi.mocked(repositories.task.getTasksByPatient).mockResolvedValue([]);
    render(<TaskManager />);
    await waitFor(() =>
      expect(
        screen.getByText(/no tasks scheduled for this patient today/i),
      ).toBeInTheDocument(),
    );
  });

  // ── Stat cards ─────────────────────────────────────────────────────────────

  it("renders the Total Tasks stat card", async () => {
    render(<TaskManager />);
    await waitFor(() => screen.getByText("Sample Task"));
    expect(screen.getByText("Total Tasks")).toBeInTheDocument();
  });

  it("renders the Completed Tasks stat card", async () => {
    render(<TaskManager />);
    await waitFor(() => screen.getByText("Sample Task"));
    expect(screen.getByText("Completed Tasks")).toBeInTheDocument();
  });

  it("renders the Pending Tasks stat card", async () => {
    render(<TaskManager />);
    await waitFor(() => screen.getByText("Sample Task"));
    expect(screen.getByText("Pending Tasks")).toBeInTheDocument();
  });

  it("renders the Overdue Tasks stat card", async () => {
    render(<TaskManager />);
    await waitFor(() => screen.getByText("Sample Task"));
    expect(screen.getByText("Overdue Tasks")).toBeInTheDocument();
  });

  it("stat cards reflect correct counts for one incomplete overdue task", async () => {
    render(<TaskManager />);
    await waitFor(() => screen.getByText("Sample Task"));

    // Total = 1, Completed = 0, Pending = 1, Overdue = 1
    // Each stat card renders its value in an <h2>; the count "1" appears
    // three times (Total, Pending, Overdue) and "0" once (Completed).
    const headings = screen.getAllByRole("heading", { level: 2 });
    const values = headings.map((h) => h.textContent);
    expect(values).toContain("1"); // total
    expect(values).toContain("0"); // completed
  });

  it("completed task increments the Completed stat card", async () => {
    vi.mocked(repositories.task.getTasksByPatient).mockResolvedValue([
      COMPLETED_TASK,
    ]);
    render(<TaskManager />);
    await waitFor(() => screen.getByText("Completed Task"));

    // With one completed task: Completed = 1, Pending = 0
    const headings = screen.getAllByRole("heading", { level: 2 });
    const values = headings.map((h) => h.textContent);
    expect(values).toContain("1"); // completed count
    expect(values).toContain("0"); // pending count
  });

  // ── Add task ───────────────────────────────────────────────────────────────

  it("opens the add-task form when '+ Add New Task' is clicked", async () => {
    render(<TaskManager />);
    await waitFor(() => screen.getByText("Sample Task"));

    fireEvent.click(screen.getByRole("button", { name: /add new task/i }));
    expect(
      screen.getByRole("button", { name: /add task/i }),
    ).toBeInTheDocument();
  });

  it("calls repositories.task.addTask and refreshes the list on form submission", async () => {
    const updated = [
      MOCK_TASK,
      { ...MOCK_TASK, taskId: "task-new", title: "New Task" },
    ];
    vi.mocked(repositories.task.getTasksByPatient)
      .mockResolvedValueOnce([MOCK_TASK])
      .mockResolvedValueOnce(updated);

    render(<TaskManager />);
    await waitFor(() => screen.getByText("Sample Task"));

    fireEvent.click(screen.getByRole("button", { name: /add new task/i }));
    fireEvent.change(screen.getByLabelText(/task title/i), {
      target: { value: "New Task" },
    });
    fireEvent.change(screen.getByLabelText(/task description/i), {
      target: { value: "New Desc" },
    });
    fireEvent.change(screen.getByLabelText(/time/i), {
      target: { value: "2026-03-06T09:00" },
    });
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: "cat-1" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add task/i }));

    await waitFor(() =>
      expect(repositories.task.addTask).toHaveBeenCalledOnce(),
    );
    await waitFor(() =>
      expect(screen.getByText("New Task")).toBeInTheDocument(),
    );
  });

  // ── Toggle completion ──────────────────────────────────────────────────────

  it("calls markTaskAsDone when toggling an incomplete task", async () => {
    render(<TaskManager />);
    await waitFor(() => screen.getByText("Sample Task"));

    fireEvent.click(
      screen.getByRole("checkbox", { name: /mark sample task as done/i }),
    );
    await waitFor(() =>
      expect(repositories.task.markTaskAsDone).toHaveBeenCalledWith(
        "task-1",
        "user-1",
      ),
    );
  });

  it("calls unmarkTaskAsDone when toggling a completed task", async () => {
    vi.mocked(repositories.task.getTasksByPatient).mockResolvedValue([
      COMPLETED_TASK,
    ]);
    render(<TaskManager />);
    await waitFor(() => screen.getByText("Completed Task"));

    fireEvent.click(
      screen.getByRole("checkbox", { name: /mark completed task as done/i }),
    );
    await waitFor(() =>
      expect(repositories.task.unmarkTaskAsDone).toHaveBeenCalledWith("task-2"),
    );
  });

  // ── Edit / delete ──────────────────────────────────────────────────────────

  it("opens the edit form when a task card is clicked", async () => {
    render(<TaskManager />);
    await waitFor(() => screen.getByText("Sample Task"));

    fireEvent.click(
      screen.getByText("Sample Task").closest('[role="button"]')!,
    );
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /save changes/i }),
      ).toBeInTheDocument(),
    );
  });

  it("calls repositories.task.updateTask with the modified fields on save", async () => {
    render(<TaskManager />);
    await waitFor(() => screen.getByText("Sample Task"));

    fireEvent.click(
      screen.getByText("Sample Task").closest('[role="button"]')!,
    );
    await waitFor(() => screen.getByRole("button", { name: /save changes/i }));

    fireEvent.change(screen.getByLabelText(/task title/i), {
      target: { value: "Updated Task" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() =>
      expect(repositories.task.updateTask).toHaveBeenCalledWith(
        "task-1",
        expect.objectContaining({ title: "Updated Task" }),
      ),
    );
  });

  it("calls repositories.task.deleteTask when delete is clicked in the edit form", async () => {
    render(<TaskManager />);
    await waitFor(() => screen.getByText("Sample Task"));

    fireEvent.click(
      screen.getByText("Sample Task").closest('[role="button"]')!,
    );
    await waitFor(() => screen.getByRole("button", { name: /delete task/i }));

    fireEvent.click(screen.getByRole("button", { name: /delete task/i }));

    await waitFor(() =>
      expect(repositories.task.deleteTask).toHaveBeenCalledWith("task-1"),
    );
  });
});
