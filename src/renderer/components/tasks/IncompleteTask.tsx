import { Draggable } from "@hello-pangea/dnd";
import Task from "./Task";
import { Priority, Status } from "../../types";

const IncompleteTask = ({
  _id,
  title,
  priority,
  status,
  note,
  refresh,
  index,
}: {
  _id: string;
  title: string;
  priority: Priority;
  status: Status;
  note: string;
  refresh: () => Promise<void>;
  index: number;
}) => {
  const task = (
    <Task
      _id={_id}
      title={title}
      priority={priority}
      status={status}
      note={note}
      refresh={refresh}
    />
  );
  return (
    <Draggable draggableId={_id} index={index}>
      {(provided) => (
        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
          {task}
        </div>
      )}
    </Draggable>
  );
};

export default IncompleteTask;
