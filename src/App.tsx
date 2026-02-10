// import { Route, Routes } from "react-router-dom";
import Button from "./components/ui/Button";
import TaskCard from "./components/ui/TaskCard";
import CustomSection from "./components/ui/CustomSection";

function App() {
  return (
    <>
      <div className="container mt-4">
        <h1>Im working</h1>
        <Button
          color="outline-primary"
          onClick={() => alert("Button clicked!")}
        >
          Click Me
        </Button>

        <TaskCard
          title="Task Title Example"
          description="This is an example task description."
        />

        <hr />

        <CustomSection title="Section Title" subheader="Section Subheader">
          <TaskCard
            title="Task Title Example"
            description="This is an example task description."
          />

          <TaskCard
            title="Task Title Example"
            description="This is an example task description."
          />
        </CustomSection>
      </div>
    </>
  );
}

export default App;
