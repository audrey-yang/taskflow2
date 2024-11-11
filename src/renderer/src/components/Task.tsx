import { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { SelectChangeEvent } from "@mui/material/Select";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";
import { Priority, Status } from "@renderer/types";
import { prioritySelect, statusSelect, titleEditor } from "@renderer/components/EditComponents";

const Task = ({ _id, title, priority, status }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [taskTitle, setTaskTitle] = useState(title);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [taskPriority, setTaskPriority] = useState(priority);
  const [taskStatus, setTaskStatus] = useState(status);

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
        <div className="flex flex-row w-full px-1">
          <div className="w-1/2 mx-0 my-auto px-2">
            {isEditingTitle ? (
              <div className="flex flex-row">
                {titleEditor(newTitle, setNewTitle, changeTitle)}
                <IconButton aria-label="edit">
                  <DoneIcon onClick={() => changeTitle(newTitle)} />
                </IconButton>
                <IconButton aria-label="edit">
                  <CancelIcon onClick={() => setIsEditingTitle(false)} />
                </IconButton>
              </div>
            ) : (
              <div className="flex flex-row">
                <div className="mx-0 my-auto w-10/12">{taskTitle}</div>
                <IconButton aria-label="edit">
                  <EditIcon onClick={() => setIsEditingTitle(true)} />
                </IconButton>
              </div>
            )}
          </div>
          <div className="w-1/4 px-2">{prioritySelect(taskPriority, changePriority)}</div>
          <div className="w-1/4 px-2">{statusSelect(taskStatus, changeStatus)}</div>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <div className="ml-4">Notes</div>
      </AccordionDetails>
    </Accordion>
  );
};

export default Task;
