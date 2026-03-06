/**
 * ModalForm.tsx
 * Component for adding a new patient via a modal form. Used in Teams.tsx.
 * Resets the form after submission
 */

import { useState } from "react";

export interface NewPatientFormData {
  firstName: string;
  lastName: string;
  dob: string;
  address: string;
  phoneNumber: string;
}

interface ModalFormProps {
  modalId: string;
  onSubmit: (data: NewPatientFormData) => void | Promise<void>;
}

const EMPTY_FORM: NewPatientFormData = {
  firstName: "",
  lastName: "",
  dob: "",
  address: "",
  phoneNumber: "",
};

const ModalForm = ({ modalId, onSubmit }: ModalFormProps) => {
  const [form, setForm] = useState<NewPatientFormData>(EMPTY_FORM);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void onSubmit(form);
    setForm(EMPTY_FORM);
  };

  return (
    <div
      className="modal fade"
      id={modalId}
      tabIndex={-1}
      aria-labelledby={`${modalId}Label`}
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id={`${modalId}Label`}>
              Add Patient
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
                <label htmlFor={`${modalId}FirstName`} className="form-label">
                  First Name:
                </label>
                <input
                  id={`${modalId}FirstName`}
                  name="firstName"
                  type="text"
                  className="form-control"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  required
                />
              </div>

              <div>
                <label htmlFor={`${modalId}LastName`} className="form-label">
                  Last Name:
                </label>
                <input
                  id={`${modalId}LastName`}
                  name="lastName"
                  type="text"
                  className="form-control"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  required
                />
              </div>

              <div>
                <label htmlFor={`${modalId}Dob`} className="form-label">
                  Date of Birth:
                </label>
                <input
                  id={`${modalId}Dob`}
                  name="dob"
                  type="date"
                  className="form-control"
                  value={form.dob}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor={`${modalId}Address`} className="form-label">
                  Address:
                </label>
                <input
                  id={`${modalId}Address`}
                  name="address"
                  type="text"
                  className="form-control"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                  required
                />
              </div>

              <div>
                <label htmlFor={`${modalId}Phone`} className="form-label">
                  Phone Number:
                </label>
                <input
                  id={`${modalId}Phone`}
                  name="phoneNumber"
                  type="tel"
                  className="form-control"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter phone number"
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
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalForm;
