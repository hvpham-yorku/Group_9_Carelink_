/**
 * @vitest-environment jsdom
 *
 * Integration tests for the TaskManager page and unit tests for its child components.
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

import type { Task } from "../types/Types";
import TaskManager from "../pages/TaskManager";
import TaskCard from "../components/task/TaskCard";
import TaskEdit from "../components/task/TaskEdit";
import TaskForm from "../components/task/TaskForm";
import TaskList from "../components/task/TaskList";
import { taskService } from "../services/taskService";

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
  scheduledAt: "2026-03-06T10:00:00Z",
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
      caregivers: { firstName: "Alice" },
    },
  ],
};

// ─── Module mocks ─────────────────────────────────────────────────────────────

vi.mock("../hooks/useAuth", () => ({
  useAuth: () => ({ user: { id: "user-1" } }),
}));

vi.mock("../contexts/patient/usePatient", () => ({
  usePatient: () => ({
    selectedPatientId: "patient-1",
    careTeamId: "team-1",
    loading: false,
  }),
}));

vi.mock("../services/taskService", () => ({
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
    vi.mocked(taskService.addTask).mockResolvedValue(undefined as unknown);
    vi.mocked(taskService.markTaskAsDone).mockResolvedValue(
      undefined as unknown,
    );
    vi.mocked(taskService.unmarkTaskAsDone).mockResolvedValue(undefined as any);
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

    fireEvent.click(screen.getByRole("button")); // task card
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /save changes/i }),
      ).toBeInTheDocument(),
    );
  });
});

// ─── TaskForm component (unit) ────────────────────────────────────────────────

describe("TaskForm component", () => {
  it("renders category options from the categories prop", () => {
    render(<TaskForm categories={MOCK_CATEGORIES} onAddTask={vi.fn()} />);
    expect(screen.getByRole("option", { name: "General" })).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Medication" }),
    ).toBeInTheDocument();
  });

  it("calls onAddTask with title, description, time, and categoryId on submit", () => {
    const onAddTask = vi.fn();
    render(<TaskForm categories={MOCK_CATEGORIES} onAddTask={onAddTask} />);

    fireEvent.change(screen.getByLabelText(/task title/i), {
      target: { value: "Buy meds" },
    });
    fireEvent.change(screen.getByLabelText(/task description/i), {
      target: { value: "Pharmacy run" },
    });
    fireEvent.change(screen.getByLabelText(/time/i), {
      target: { value: "2026-03-06T09:15" },
    });
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: "cat-2" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add task/i }));

    expect(onAddTask).toHaveBeenCalledWith(
      "Buy meds",
      "Pharmacy run",
      "2026-03-06T09:15",
      "cat-2",
    );
  });

  it("clears all fields after submitting", () => {
    const onAddTask = vi.fn();
    render(<TaskForm categories={MOCK_CATEGORIES} onAddTask={onAddTask} />);

    fireEvent.change(screen.getByLabelText(/task title/i), {
      target: { value: "Buy meds" },
    });
    fireEvent.change(screen.getByLabelText(/task description/i), {
      target: { value: "Pharmacy run" },
    });
    fireEvent.change(screen.getByLabelText(/time/i), {
      target: { value: "2026-03-06T09:15" },
    });
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: "cat-2" },
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

  it("calls onCancel when the cancel button is clicked", () => {
    const onCancel = vi.fn();
    render(
      <TaskForm
        categories={MOCK_CATEGORIES}
        onAddTask={vi.fn()}
        onCancel={onCancel}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});

// ─── TaskCard component (unit) ────────────────────────────────────────────────

describe("TaskCard component", () => {
  it("renders task title, description, and category badge", () => {
    render(<TaskCard task={MOCK_TASK} onToggle={vi.fn()} />);
    expect(screen.getByText("Sample Task")).toBeInTheDocument();
    expect(screen.getByText("Sample Description")).toBeInTheDocument();
    expect(screen.getByText("General")).toBeInTheDocument();
  });

  it("fires onToggle when the checkbox is clicked", () => {
    const onToggle = vi.fn();
    render(<TaskCard task={MOCK_TASK} onToggle={onToggle} />);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("fires onSelect when the card area is clicked", () => {
    const onSelect = vi.fn();
    render(
      <TaskCard task={MOCK_TASK} onToggle={vi.fn()} onSelect={onSelect} />,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("applies strikethrough styling to the title of a completed task", () => {
    render(<TaskCard task={COMPLETED_TASK} onToggle={vi.fn()} />);
    expect(screen.getByText("Completed Task")).toHaveClass(
      "text-decoration-line-through",
    );
  });

  it("shows the name of the caregiver who completed the task", () => {
    render(<TaskCard task={COMPLETED_TASK} onToggle={vi.fn()} />);
    expect(screen.getByText(/alice/i)).toBeInTheDocument();
  });
});

// ─── TaskList component (unit) ────────────────────────────────────────────────

describe("TaskList component", () => {
  const TASKS: Task[] = [
    { ...MOCK_TASK, taskId: "tl-1", title: "Task A" },
    {
      ...MOCK_TASK,
      taskId: "tl-2",
      title: "Task B",
      taskLogs: [
        {
          taskId: "tl-2",
          caregiverId: "c1",
          completedAt: "2026-03-06T11:00:00Z",
          isCompleted: true,
        },
      ],
    },
  ];

  it("renders every task in the list", () => {
    render(
      <TaskList tasks={TASKS} onToggleTask={vi.fn()} onSelectTask={vi.fn()} />,
    );
    expect(screen.getByText("Task A")).toBeInTheDocument();
    expect(screen.getByText("Task B")).toBeInTheDocument();
  });

  it("calls onToggleTask with the correct taskId when a checkbox is toggled", () => {
    const onToggleTask = vi.fn();
    render(
      <TaskList
        tasks={TASKS}
        onToggleTask={onToggleTask}
        onSelectTask={vi.fn()}
      />,
    );
    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    expect(onToggleTask).toHaveBeenCalledWith("tl-1");
  });

  it("calls onSelectTask with the correct task when a card is clicked", () => {
    const onSelectTask = vi.fn();
    render(
      <TaskList
        tasks={TASKS}
        onToggleTask={vi.fn()}
        onSelectTask={onSelectTask}
      />,
    );
    fireEvent.click(screen.getAllByRole("button")[0]);
    expect(onSelectTask).toHaveBeenCalledWith(TASKS[0]);
  });
});

// ─── TaskEdit component (unit) ────────────────────────────────────────────────

describe("TaskEdit component", () => {
  beforeEach(() => vi.clearAllMocks());

  it("pre-fills the form with the task's current title and description", () => {
    render(
      <TaskEdit
        task={MOCK_TASK}
        categories={MOCK_CATEGORIES}
        onUpdateTask={vi.fn()}
        onDeleteTask={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    expect(
      (screen.getByLabelText(/task title/i) as HTMLInputElement).value,
    ).toBe("Sample Task");
    expect(
      (screen.getByLabelText(/task description/i) as HTMLTextAreaElement).value,
    ).toBe("Sample Description");
  });

  it("calls onUpdateTask with the modified task on save", () => {
    const onUpdateTask = vi.fn();
    render(
      <TaskEdit
        task={MOCK_TASK}
        categories={MOCK_CATEGORIES}
        onUpdateTask={onUpdateTask}
        onDeleteTask={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    fireEvent.change(screen.getByLabelText(/task title/i), {
      target: { value: "Updated Title" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));
    expect(onUpdateTask).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Updated Title", taskId: "task-1" }),
    );
  });

  it("calls onDeleteTask with the task id when delete is clicked", () => {
    const onDeleteTask = vi.fn();
    render(
      <TaskEdit
        task={MOCK_TASK}
        categories={MOCK_CATEGORIES}
        onUpdateTask={vi.fn()}
        onDeleteTask={onDeleteTask}
        onCancel={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /delete task/i }));
    expect(onDeleteTask).toHaveBeenCalledWith("task-1");
  });

  it("calls onCancel when the cancel button is clicked", () => {
    const onCancel = vi.fn();
    render(
      <TaskEdit
        task={MOCK_TASK}
        categories={MOCK_CATEGORIES}
        onUpdateTask={vi.fn()}
        onDeleteTask={vi.fn()}
        onCancel={onCancel}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
