import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TablePagination from "@mui/material/TablePagination";
import Task from "./Task";
import NewTask from "./NewTask";
import { DBTask, STATUS } from "../types";

const TaskList = ({
  parentId,
  parentIsCompleted,
  refreshHeader,
}: {
  parentId?: string;
  parentIsCompleted?: boolean;
  refreshHeader?: () => void;
}) => {
  parentIsCompleted = parentIsCompleted ?? false;
  const [incompleteTasks, setIncompleteTasks] = useState<DBTask[]>([]);
  const [completeTasks, setCompleteTasks] = useState<DBTask[]>([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [numCompleted, setNumCompletedTasks] = useState(0);

  const populateTasks = async (tries?: number) => {
    try {
      setIncompleteTasks(await window.api.getChildTasksIncomplete(parentId ?? ""));
      setCompleteTasks(await window.api.getChildTasksComplete(parentId ?? "", pageNumber));
      setNumCompletedTasks(
        await window.api.countChildTasksByStatus(parentId ?? "", STATUS.COMPLETED),
      );
      if (!parentId) {
        // Refresh the header only at the top level
        refreshHeader();
      }
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
  }, [pageNumber]);

  const handleChangePage = (_: any, newPage: number) => {
    setPageNumber(newPage);
  };

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
          {showCompleted ? (
            <div>
              {completeTasks.map((task) => (
                <Task key={task._id} {...task} refresh={populateTasks} />
              ))}
              <TablePagination
                component="div"
                page={pageNumber}
                count={numCompleted}
                className="mt-2"
                onPageChange={handleChangePage}
                rowsPerPage={10}
                rowsPerPageOptions={[10]}
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default TaskList;
