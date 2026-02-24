const TaskListGroup = () => {
  return (
    <>
      <div className="list-group mb-3">
        <div
          className="list-group-item d-flex align-items-center"
          style={{ cursor: "pointer" }}
          onClick={() => {}}
        >
          <div className="flex-grow-1">
            <h5>test</h5>
            <p className="card-text">This is a test description.</p>
          </div>

          <div className="text-end">
            <span className="">12:00 PM</span> <br />
            <span className={`badge text-bg-primary`}>test</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskListGroup;
