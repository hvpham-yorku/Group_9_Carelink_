import { useState } from "react";
import type { CaregiverInfo, Category } from "../../types/teams";

interface EditTeamModalProps {
  modalId: string;
  currentName: string | null;
  caregivers: CaregiverInfo[];
  categories: Category[];
  onUpdateName: (newName: string) => void | Promise<void>;
  onUpdateRole: (caregiverId: string, newRole: string) => void | Promise<void>;
  onRemoveCaregiver: (caregiverId: string) => void | Promise<void>;
  onAddCategory: (name: string, color: string) => void | Promise<void>;
}

const EditTeamModal = ({
  modalId,
  currentName,
  caregivers,
  categories,
  onUpdateName,
  onUpdateRole,
  onRemoveCaregiver,
  onAddCategory,
}: EditTeamModalProps) => {
  const [name, setName] = useState(currentName ?? "");
  const [roles, setRoles] = useState<Record<string, string>>(
    Object.fromEntries(
      caregivers.map((c) => [c.caregiverId, c.teamRole ?? ""]),
    ),
  );
  const CATEGORY_COLORS = [
    { label: "Blue", value: "text-bg-primary" },
    { label: "Green", value: "text-bg-success" },
    { label: "Red", value: "text-bg-danger" },
    { label: "Yellow", value: "text-bg-warning" },
    { label: "Light Blue", value: "text-bg-info" },
  ];

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("text-bg-primary");

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    void onAddCategory(newCategoryName.trim(), newCategoryColor);
    setNewCategoryName("");
    setNewCategoryColor("text-bg-primary");
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void onUpdateName(name);
  };

  const handleRoleChange = (caregiverId: string, value: string) => {
    setRoles((prev) => ({ ...prev, [caregiverId]: value }));
  };

  const handleRoleSave = (caregiverId: string) => {
    void onUpdateRole(caregiverId, roles[caregiverId] ?? "");
  };

  return (
    <div className="modal fade" id={modalId}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id={`${modalId}Label`}>
              Edit Team
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            {/* Tabs */}
            <ul className="nav nav-tabs mb-3" id={`${modalId}Tabs`}>
              <li className="nav-item">
                <button
                  className="nav-link active"
                  data-bs-toggle="tab"
                  data-bs-target={`#${modalId}TabName`}
                  type="button"
                >
                  Team Name
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link"
                  data-bs-toggle="tab"
                  data-bs-target={`#${modalId}TabRoles`}
                  type="button"
                >
                  Edit Roles
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link"
                  data-bs-toggle="tab"
                  data-bs-target={`#${modalId}TabRemove`}
                  type="button"
                >
                  Remove Members
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link"
                  data-bs-toggle="tab"
                  data-bs-target={`#${modalId}TabCategories`}
                  type="button"
                >
                  Categories
                </button>
              </li>
            </ul>

            <div className="tab-content">
              {/* Tab 1 — Rename team */}
              <div
                className="tab-pane fade show active"
                id={`${modalId}TabName`}
              >
                <form onSubmit={handleNameSubmit}>
                  <label htmlFor={`${modalId}NameInput`} className="form-label">
                    Team Name:
                  </label>
                  <div className="input-group">
                    <input
                      id={`${modalId}NameInput`}
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter team name"
                      required
                    />
                    <button
                      type="submit"
                      className="btn btn-primary"
                      data-bs-dismiss="modal"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>

              {/* Tab 2 — Edit roles */}
              <div className="tab-pane fade" id={`${modalId}TabRoles`}>
                {caregivers.length === 0 ? (
                  <p className="text-muted">No team members to edit.</p>
                ) : (
                  <ul className="list-group list-group-flush">
                    {caregivers.map((c, index) => (
                      <li
                        key={c.caregiverId}
                        className="list-group-item px-0 py-2"
                      >
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                          <span className="flex-grow-1 fw-semibold">
                            {c.firstName} {c.lastName}
                            {index === 0 && (
                              <span className="badge text-bg-warning ms-2">
                                Leader
                              </span>
                            )}
                          </span>
                          {index !== 0 && (
                            <>
                              <select
                                className="form-select form-select-sm"
                                style={{ maxWidth: "220px" }}
                                value={roles[c.caregiverId] ?? ""}
                                onChange={(e) =>
                                  handleRoleChange(
                                    c.caregiverId,
                                    e.target.value,
                                  )
                                }
                              >
                                <option value="">Select role…</option>
                                <option value="Primary Caregiver">
                                  Primary Caregiver
                                </option>
                                <option value="Secondary Caregiver">
                                  Secondary Caregiver
                                </option>
                                <option value="Caregiver">Caregiver</option>
                              </select>
                              <button
                                type="button"
                                className="btn btn-sm btn-primary"
                                onClick={() => handleRoleSave(c.caregiverId)}
                              >
                                Save
                              </button>
                            </>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Tab 3 — Remove members */}
              <div className="tab-pane fade" id={`${modalId}TabRemove`}>
                {caregivers.length === 0 ? (
                  <p className="text-muted">No team members to remove.</p>
                ) : (
                  <ul className="list-group list-group-flush">
                    {caregivers.map((c, index) => (
                      <li
                        key={c.caregiverId}
                        className="list-group-item px-0 py-2 d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <div className="fw-semibold">
                            {c.firstName} {c.lastName}
                            {index === 0 && (
                              <span className="badge text-bg-warning ms-2">
                                Leader
                              </span>
                            )}
                          </div>
                          <small className="text-muted">
                            {c.teamRole} • {c.jobTitle}
                          </small>
                        </div>
                        {index !== 0 && (
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() =>
                              void onRemoveCaregiver(c.caregiverId)
                            }
                          >
                            Remove
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Tab 4 — Categories */}
              <div className="tab-pane fade" id={`${modalId}TabCategories`}>
                <form onSubmit={handleAddCategorySubmit} className="mb-3">
                  <label className="form-label">New Category</label>
                  <div className="d-flex gap-2 mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Category name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      required
                    />
                    <select
                      className="form-select"
                      style={{ maxWidth: 140 }}
                      value={newCategoryColor}
                      onChange={(e) => setNewCategoryColor(e.target.value)}
                    >
                      {CATEGORY_COLORS.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                    <button type="submit" className="btn btn-primary">
                      Add
                    </button>
                  </div>
                  {newCategoryName && (
                    <div className="mt-1">
                      <span className={`badge ${newCategoryColor}`}>
                        {newCategoryName}
                      </span>
                    </div>
                  )}
                </form>

                {categories.length === 0 ? (
                  <p className="text-muted">No categories yet.</p>
                ) : (
                  <div className="d-flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <span
                        key={cat.categoryId}
                        className={`badge ${cat.color ?? "text-bg-secondary"}`}
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-success"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTeamModal;
