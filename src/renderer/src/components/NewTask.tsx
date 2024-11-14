import { useState } from "react";
import { Priority, priorityToString, PRIORITY, STATUS } from "@renderer/types";
import TextField from "@mui/material/TextField";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import DoneIcon from "@mui/icons-material/Done";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

const NewTask = ({ parentId, onTaskAdded }: { parentId: string; onTaskAdded: () => void }) => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState(PRIORITY.LOW);
  const [titleHasError, setTitleHasError] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const toggleHidden = () => {
    setIsHidden((prev) => !prev);
  };

  const changePriority = (event: SelectChangeEvent) => {
    setPriority(event.target.value as unknown as Priority);
  };

  const submitTask = async () => {
    if (!title) {
      setTitleHasError(true);
      return;
    }
    await window.api.createTask({ title, priority, status: STATUS.NOT_STARTED, parentId });
    setTitle("");
    setPriority(PRIORITY.LOW);
    onTaskAdded();
  };

  return (
    <div className="flex items-center space-x-2 py-2">
      <IconButton onClick={toggleHidden}>
        {isHidden ? <AddCircleOutlineIcon /> : <RemoveCircleOutlineIcon />}
      </IconButton>
      {!isHidden ? (
        <>
          <TextField
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!e.target.value) {
                setTitleHasError(true);
              } else {
                setTitleHasError(false);
              }
            }}
            label="Title"
            error={titleHasError}
          />
          <Select value={priority as any} onChange={changePriority}>
            <MenuItem value={PRIORITY.LOW}>{priorityToString(PRIORITY.LOW)}</MenuItem>
            <MenuItem value={PRIORITY.MEDIUM}>{priorityToString(PRIORITY.MEDIUM)}</MenuItem>
            <MenuItem value={PRIORITY.HIGH}>{priorityToString(PRIORITY.HIGH)}</MenuItem>
          </Select>
          <IconButton onClick={submitTask}>
            <DoneIcon />
          </IconButton>
        </>
      ) : null}
    </div>
  );
};

export default NewTask;
