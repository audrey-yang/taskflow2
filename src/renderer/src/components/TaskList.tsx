import { useEffect, useState } from "react";
import Task from "./Task";
import { DBTask } from "@renderer/types";
import NewTask from "./NewTask";
import Button from "@mui/material/Button";

const TaskList = ({
  parentId,
  parentIsCompleted,
}: {
  parentId?: string;
  parentIsCompleted?: boolean;
}) => {
  parentIsCompleted = parentIsCompleted ?? false;
  const [incompleteTasks, setIncompleteTasks] = useState<DBTask[]>([]);
  const [completeTasks, setCompleteTasks] = useState<DBTask[]>([]);
  const [showCompleted, setShowCompleted] = useState(false);

  const populateTasks = async () => {
    setIncompleteTasks(await window.api.getChildTasksIncomplete(parentId ?? ""));
    setCompleteTasks(await window.api.getChildTasksComplete(parentId ?? ""));
  };

  useEffect(() => {
    populateTasks();
  }, []);

  return (
    <div>
      {parentIsCompleted ? null : <NewTask parentId={parentId ?? ""} onTaskAdded={populateTasks} />}
      {incompleteTasks.map((task) => (
        <Task key={task._id} {...task} refresh={populateTasks} />
      ))}
      {completeTasks.length > 0 ? (
        <div>
          <Button
            onClick={() => setShowCompleted((prev) => !prev)}
            sx={{
              margin: "0.5rem auto",
            }}
          >
            {showCompleted ? "Hide completed tasks" : "Show completed tasks"}
          </Button>
          {showCompleted
            ? completeTasks.map((task) => <Task key={task._id} {...task} refresh={populateTasks} />)
            : null}
        </div>
      ) : null}
    </div>
  );
};

export default TaskList;
