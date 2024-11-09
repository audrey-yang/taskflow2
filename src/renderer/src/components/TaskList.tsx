import { useEffect, useState } from "react";
import Task from "./Task";
import { DBTask } from "@renderer/types";

const TaskList = () => {
  const [tasks, setTasks] = useState<DBTask[]>([]);

  useEffect(() => {
    const populateTasks = async () => {
      setTasks(await window.api.getTasks());
    };
    populateTasks();
  }, []);

  return (
    <div>
      {tasks.map((task) => (
        <Task key={task._id} {...task} />
      ))}
    </div>
  );
};

export default TaskList;
