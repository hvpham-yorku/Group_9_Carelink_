import { useState } from "react";

export interface NewCategoryFormData {
  name: string;
}

interface CategoryFormProps {
  modalId: string;
  onSubmit: (data: NewCategoryFormData) => void | Promise<void>;
}

const EMPTY_FORM: NewCategoryFormData = {
  name: "",
};

const CategoryForm = ({ modalId, onSubmit }: CategoryFormProps) => {
  const [form, setForm] = useState<NewCategoryFormData>(EMPTY_FORM);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void onSubmit(form);
    setForm(EMPTY_FORM);
  };

  return (
    <div className="modal fade" id={modalId}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id={`${modalId}Label`}>
              Add Category
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body d-flex flex-column gap-3">
              <div>
                <label htmlFor={`${modalId}Name`} className="form-label">
                  Category Name:
                </label>
                <input
                  id={`${modalId}Name`}
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Enter category name"
                  value={form.name}
                  onChange={(e) => setForm({ name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                data-bs-dismiss="modal"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;
