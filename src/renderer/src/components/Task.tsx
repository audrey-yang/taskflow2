import { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { SelectChangeEvent } from "@mui/material/Select";
import ButtonGroup from "@mui/material/ButtonGroup";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";
import CircleIcon from "@mui/icons-material/Circle";
import DeleteIcon from "@mui/icons-material/Delete";
import { DBTask, Priority, priorityToColor, Status } from "@renderer/types";
import {
  notesEditor,
  prioritySelect,
  statusSelect,
  titleEditor,
} from "@renderer/components/EditComponents";
import NewTask from "./NewTask";

const Task = ({ _id, title, priority, status, note, refresh }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [taskTitle, setTaskTitle] = useState(title);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [taskPriority, setTaskPriority] = useState(priority);
  const [taskStatus, setTaskStatus] = useState(status);
  const [taskNote, setTaskNote] = useState(note);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [newNote, setNewNote] = useState(note);
  const [subtasks, setSubtasks] = useState<DBTask[]>([]);
  const populateSubtasks = async () => {
    setSubtasks(await window.api.getChildTasks(_id));
  };
  useEffect(() => {
    populateSubtasks();
  }, []);

  // Change handlers
  const changePriority = async (event: SelectChangeEvent) => {
    const newPriority = event.target.value as unknown as Priority;
    await window.api.changeTaskPriority(_id, newPriority);
    setTaskPriority(newPriority);
  };
  const changeStatus = async (event: SelectChangeEvent) => {
    const newStatus = event.target.value as unknown as Status;
    await window.api.changeTaskStatus(_id, newStatus);
    setTaskStatus(newStatus);
  };
  const changeTitle = async (newTitle: string) => {
    await window.api.changeTaskTitle(_id, newTitle);
    setTaskTitle(newTitle);
    setIsEditingTitle(false);
  };
  const changeNote = async (note: string) => {
    await window.api.changeTaskNote(_id, note);
    setTaskNote(note);
    setIsEditingNote(false);
  };
  const deleteTask = async () => {
    await window.api.deleteTask(_id);
    await refresh();
  };

  return (
    <Accordion
      expanded={isExpanded}
      disableGutters
      elevation={0}
      sx={{
        border: "none",
        "&::before": {
          display: "none",
        },
      }}
    >
      <AccordionSummary
        expandIcon={
          <ArrowForwardIosSharpIcon
            sx={{ fontSize: "0.9rem" }}
            className="mx-1"
            onClick={() => setIsExpanded((prev) => !prev)}
          />
        }
        sx={{
          flexDirection: "row-reverse",
          "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
            transform: "rotate(90deg)",
          },
          padding: 0,
        }}
      >
        <div className="flex flex-row items-center w-full px-1">
          <CircleIcon sx={{ color: priorityToColor(taskPriority) }} />
          <div className="w-1/2 px-2">
            {isEditingTitle ? (
              <div className="flex flex-row items-center ">
                {titleEditor(newTitle, setNewTitle, changeTitle)}
                <ButtonGroup size="small" aria-label="Submit or cancel">
                  <IconButton aria-label="done">
                    <DoneIcon onClick={() => changeTitle(newTitle)} />
                  </IconButton>
                  <IconButton aria-label="cancel">
                    <CancelIcon onClick={() => setIsEditingTitle(false)} />
                  </IconButton>
                </ButtonGroup>
              </div>
            ) : (
              <div className="flex flex-row items-center">
                <div className="w-10/12 font-semibold">{taskTitle}</div>
                <ButtonGroup size="small" aria-label="Submit or cancel">
                  <IconButton aria-label="edit">
                    <EditIcon onClick={() => setIsEditingTitle(true)} />
                  </IconButton>
                  <IconButton aria-label="delete">
                    <DeleteIcon onClick={deleteTask} />
                  </IconButton>
                </ButtonGroup>
              </div>
            )}
          </div>
          <div className="w-1/4 px-2">{prioritySelect(taskPriority, changePriority)}</div>
          <div className="w-1/4 px-2">{statusSelect(taskStatus, changeStatus)}</div>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <div className="ml-4">
          <div className="flex flex-row">
            {notesEditor(newNote, setNewNote, !isEditingNote)}
            {isEditingNote ? (
              <ButtonGroup size="small" aria-label="Submit or cancel">
                <IconButton aria-label="done">
                  <DoneIcon onClick={() => changeNote(newNote)} />
                </IconButton>
                <IconButton aria-label="cancel">
                  <CancelIcon
                    onClick={() => {
                      setNewNote(taskNote);
                      setIsEditingNote(false);
                    }}
                  />
                </IconButton>
              </ButtonGroup>
            ) : (
              <IconButton aria-label="edit">
                <EditIcon onClick={() => setIsEditingNote(true)} />
              </IconButton>
            )}
          </div>
          <div>
            <NewTask parentId={_id} onTaskAdded={populateSubtasks} />
            {subtasks.map((task) => (
              <Task key={task._id} {...task} />
            ))}
          </div>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export default Task;
