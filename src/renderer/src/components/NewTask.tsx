import { useState } from "react";
import { Priority, priorityToString, PRIORITY } from "@renderer/types";
import TextField from "@mui/material/TextField";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import DoneIcon from "@mui/icons-material/Done";

const NewTask = ({ parentId, onTaskAdded }: { parentId: string; onTaskAdded: () => void }) => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState(0);
  const [titleHasError, setTitleHasError] = useState(false);

  const changePriority = (event: SelectChangeEvent) => {
    setPriority(event.target.value as unknown as Priority);
  };

  const submitTask = async () => {
    if (!title) {
      return;
    }
    await window.api.createTask({ title, priority });
    setTitle("");
    setPriority(0);
    onTaskAdded();
  };

  return (
    <div className="flex items-center space-x-2">
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
        helperText={titleHasError ? "Title cannot be empty" : ""}
      />
      <Select value={priority as any} onChange={changePriority}>
        <MenuItem value={PRIORITY.LOW}>{priorityToString(PRIORITY.LOW)}</MenuItem>
        <MenuItem value={PRIORITY.MEDIUM}>{priorityToString(PRIORITY.MEDIUM)}</MenuItem>
        <MenuItem value={PRIORITY.HIGH}>{priorityToString(PRIORITY.HIGH)}</MenuItem>
      </Select>
      <IconButton onClick={submitTask}>
        <DoneIcon />
      </IconButton>
    </div>
  );
};

export default NewTask;
