import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { Priority, priorityToString, Status, statusToString } from "../types";

const selectOptions = [0, 1, 2];
const customSelect = (curValue, label, changeHandler, stringDisplay) => (
  <Select value={curValue} label={label} onChange={changeHandler} fullWidth size="small">
    {selectOptions.map((val) => (
      <MenuItem key={stringDisplay(val)} value={val}>
        {stringDisplay(val)}
      </MenuItem>
    ))}
  </Select>
);

export const prioritySelect = (curValue: Priority, changePriority) =>
  customSelect(curValue, "Priority", changePriority, priorityToString);

export const statusSelect = (curValue: Status, changeStatus) =>
  customSelect(curValue, "Status", changeStatus, statusToString);

export const titleEditor = (newTitle, setNewTitle, submitFunction) => (
  <TextField
    spellCheck={true}
    value={newTitle}
    onChange={(event) => setNewTitle(event.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        submitFunction(newTitle);
        setNewTitle("");
      }
    }}
    className="w-10/12"
    size="small"
  />
);

export const notesEditor = (note, setNote, disabled) => (
  <TextField
    spellCheck={true}
    value={note}
    onChange={(event) => setNote(event.target.value)}
    className="w-10/12"
    label={disabled ? "Note" : "Edit note"}
    multiline
    variant="filled"
    disabled={disabled}
  />
);
