/**
 * @vitest-environment jsdom
 *
 * Integration tests for the TaskManager page.
 * Covers task rendering, creation, toggling completion, editing, and deletion.
 * Mocks taskService, useAuth, and usePatient so no real network calls are made.
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

import type { Task } from "../../src/types/Types";
import TaskManager from "../../src/pages/TaskManager";
import { taskService } from "../../src/services/taskService";

// ─── Shared fixtures ──────────────────────────────────────────────────────────

const MOCK_CATEGORIES = [
  { categoryId: "cat-1", name: "General" },
  { categoryId: "cat-2", name: "Medication" },
];

const MOCK_TASK: Task = {
  taskId: "task-1",
  patientId: "patient-1",
  careTeamId: "team-1",
  categoryId: "cat-1",
  title: "Sample Task",
  description: "Sample Description",
  scheduledAt: "2026-03-06T10:00",
  categories: { name: "General" },
  taskLogs: [],
};

const COMPLETED_TASK: Task = {
  ...MOCK_TASK,
  taskId: "task-2",
  title: "Completed Task",
  taskLogs: [
    {
      taskId: "task-2",
      caregiverId: "caregiver-1",
      completedAt: "2026-03-06T11:00:00Z",
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

vi.mock("../../src/services/taskService", () => ({
  taskService: {
    getTasksByPatient: vi.fn(),
    getCategories: vi.fn(),
    addTask: vi.fn(),
    markTaskAsDone: vi.fn(),
    unmarkTaskAsDone: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
  },
}));

// ─── TaskManager page (integration) ──────────────────────────────────────────

describe("TaskManager page", () => {
  beforeEach(() => {
    vi.mocked(taskService.getTasksByPatient).mockResolvedValue([MOCK_TASK]);
    vi.mocked(taskService.getCategories).mockResolvedValue(MOCK_CATEGORIES);
    vi.mocked(taskService.addTask).mockResolvedValue(undefined as any);
    vi.mocked(taskService.markTaskAsDone).mockResolvedValue(undefined as any);
    vi.mocked(taskService.unmarkTaskAsDone).mockResolvedValue(undefined as any);
    vi.mocked(taskService.updateTask).mockResolvedValue(undefined as any);
    vi.mocked(taskService.deleteTask).mockResolvedValue(undefined as any);
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders the Task Manager heading", async () => {
    render(<TaskManager />);
    expect(
      screen.getByRole("heading", { name: /task manager/i }),
    ).toBeInTheDocument();
  });

  it("shows a loading spinner while tasks are being fetched", () => {
    vi.mocked(taskService.getTasksByPatient).mockReturnValue(
      new Promise(() => {}),
    );
    render(<TaskManager />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders tasks returned by the service after loading", async () => {
    render(<TaskManager />);
    await waitFor(() =>
      expect(screen.getByText("Sample Task")).toBeInTheDocument(),
    );
    expect(screen.getByText("Sample Description")).toBeInTheDocument();
  });

  it("shows an empty-state message when no tasks exist", async () => {
    vi.mocked(taskService.getTasksByPatient).mockResolvedValue([]);
    render(<TaskManager />);
    await waitFor(() =>
      expect(
        screen.getByText(/no tasks scheduled for this patient today/i),
      ).toBeInTheDocument(),
    );
  });

  it("opens the add-task form when '+ Add New Task' is clicked", async () => {
    render(<TaskManager />);
    await waitFor(() => screen.getByText("Sample Task"));

    fireEvent.click(screen.getByRole("button", { name: /add new task/i }));
    expect(
      screen.getByRole("button", { name: /add task/i }),
    ).toBeInTheDocument();
  });

  it("calls taskService.addTask and refreshes the list on form submission", async () => {
    const updated = [
      MOCK_TASK,
      { ...MOCK_TASK, taskId: "task-new", title: "New Task" },
    ];
    vi.mocked(taskService.getTasksByPatient)
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

    await waitFor(() => expect(taskService.addTask).toHaveBeenCalledOnce());
    await waitFor(() =>
      expect(screen.getByText("New Task")).toBeInTheDocument(),
    );
  });

  it("calls markTaskAsDone when toggling an incomplete task", async () => {
    render(<TaskManager />);
    await waitFor(() => screen.getByText("Sample Task"));

    fireEvent.click(screen.getByRole("checkbox"));
    await waitFor(() =>
      expect(taskService.markTaskAsDone).toHaveBeenCalledWith(
        "task-1",
        "user-1",
      ),
    );
  });

  it("calls unmarkTaskAsDone when toggling a completed task", async () => {
    vi.mocked(taskService.getTasksByPatient).mockResolvedValue([
      COMPLETED_TASK,
    ]);
    render(<TaskManager />);
    await waitFor(() => screen.getByText("Completed Task"));

    fireEvent.click(screen.getByRole("checkbox"));
    await waitFor(() =>
      expect(taskService.unmarkTaskAsDone).toHaveBeenCalledWith("task-2"),
    );
  });

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

  it("calls taskService.updateTask with the modified fields on save", async () => {
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
      expect(taskService.updateTask).toHaveBeenCalledWith(
        "task-1",
        expect.objectContaining({ title: "Updated Task" }),
      ),
    );
  });

  it("calls taskService.deleteTask when delete is clicked in the edit form", async () => {
    render(<TaskManager />);
    await waitFor(() => screen.getByText("Sample Task"));

    fireEvent.click(
      screen.getByText("Sample Task").closest('[role="button"]')!,
    );
    await waitFor(() => screen.getByRole("button", { name: /delete task/i }));

    fireEvent.click(screen.getByRole("button", { name: /delete task/i }));

    await waitFor(() =>
      expect(taskService.deleteTask).toHaveBeenCalledWith("task-1"),
    );
  });
});
