/* 
  This component presents a task card, which can be used to display information about a task in a card format.
  
  Props:
  - title: the title of the task
  - description: a brief description of the task

  Syntax:
  <TaskCard title="Task Title" description="This is a description of the task." />
*/

interface TaskCardProps {
  title: string;
  description: string;
}

const TaskCard = ({ title, description }: TaskCardProps) => {
  return (
    <>
      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{description}</p>
        </div>
      </div>
    </>
  );
};

export default TaskCard;
