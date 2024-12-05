import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Task from "./Task";
import NewTask from "./NewTask";
import { DBTask } from "../types";

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

  const populateTasks = async (tries?: number) => {
    try {
      setIncompleteTasks(await window.api.getChildTasksIncomplete(parentId ?? ""));
      setCompleteTasks(await window.api.getChildTasksComplete(parentId ?? ""));
    } catch (err) {
      // Retry if PouchDB fails
      if (tries === undefined) {
        tries = 0;
      }

      if (tries > 3) {
        throw err;
      } else {
        await populateTasks(tries + 1);
      }
    }
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
