import { lazy, useState } from "react";
import { STATUS } from "../types";

const Header = lazy(() => import("../components/Header"));
const TaskList = lazy(() => import("../components/TaskList"));

const Taskflow: () => JSX.Element = () => {
  // Lift state out of Header for refresh
  const [numUnstartedTasks, setNumUnstartedTasks] = useState(0);
  const [numInProgressTasks, setNumInProgressTasks] = useState(0);
  const [numCompletedTasks, setNumCompletedTasks] = useState(0);

  const getTaskCounts = async () => {
    setNumUnstartedTasks(await window.api.countChildTasksByStatus("", STATUS.NOT_STARTED));
    setNumInProgressTasks(await window.api.countChildTasksByStatus("", STATUS.IN_PROGRESS));
    setNumCompletedTasks(await window.api.countChildTasksByStatus("", STATUS.COMPLETED));
  };

  return (
    <div>
      <Header
        numUnstartedTasks={numUnstartedTasks}
        numInProgressTasks={numInProgressTasks}
        numCompletedTasks={numCompletedTasks}
      />
      <TaskList refreshHeader={getTaskCounts} />
    </div>
  );
};

export default Taskflow;
