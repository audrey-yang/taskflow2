import { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { Priority, priorityToString, Status, statusToString } from "@renderer/types";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const selectOptions = [0, 1, 2];
const prioritySelect = (curValue, changePriority) => (
  <Select
    value={curValue}
    label="Priority"
    onChange={(event: SelectChangeEvent) =>
      changePriority(event.target.value as unknown as Priority)
    }
  >
    {selectOptions.map((val) => (
      <MenuItem value={val}>{priorityToString(val as Priority)}</MenuItem>
    ))}
  </Select>
);
const statusSelect = (curValue, changeStatus) => (
  <Select
    value={curValue}
    label="Status"
    onChange={(event: SelectChangeEvent) => changeStatus(event.target.value as unknown as Status)}
  >
    {selectOptions.map((val) => (
      <MenuItem value={val}>{statusToString(val as Status)}</MenuItem>
    ))}
  </Select>
);

const Task = ({ _id, title, priority, status }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [taskTitle, setTaskTitle] = useState(title);
  const [taskPriority, setTaskPriority] = useState(priority);
  const [taskStatus, setTaskStatus] = useState(status);

  const changePriority = async (newPriority) => {
    await window.api.changeTaskPriority(_id, newPriority);
    setTaskPriority(newPriority);
  };
  const changeStatus = async (newStatus) => {
    await window.api.changeTaskStatus(_id, newStatus);
    setTaskStatus(newStatus);
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
          <div className="w-1/2 mx-0 my-auto">{title}</div>
          <div className="w-1/4">{prioritySelect(taskPriority, changePriority)}</div>
          <div className="w-1/4">{statusSelect(taskStatus, changeStatus)}</div>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <div className="ml-2">Notes</div>
      </AccordionDetails>
    </Accordion>
  );
};

export default Task;
