import { useEffect, useState } from "react";
import Task from "./Task";
import { DBTask } from "@renderer/types";
import NewTask from "./NewTask";

const TaskList = () => {
  const [tasks, setTasks] = useState<DBTask[]>([]);

  const populateTasks = async () => {
    setTasks(await window.api.getChildTasks(""));
  };

  useEffect(() => {
    populateTasks();
  }, [tasks]);

  return (
    <div>
      <NewTask parentId="" onTaskAdded={populateTasks} />
      {tasks.map((task) => (
        <Task key={task._id} {...task} refresh={populateTasks} />
      ))}
    </div>
  );
};

export default TaskList;
