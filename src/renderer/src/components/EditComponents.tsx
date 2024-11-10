import { Priority, priorityToString, Status, statusToString } from "@renderer/types";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

const selectOptions = [0, 1, 2];
const customSelect = (curValue, label, changeHandler, stringDisplay) => (
  <Select value={curValue} label={label} onChange={changeHandler} fullWidth>
    {selectOptions.map((val) => (
      <MenuItem value={val}>{stringDisplay(val)}</MenuItem>
    ))}
  </Select>
);

export const prioritySelect = (curValue: Priority, changePriority) =>
  customSelect(curValue, "Priority", changePriority, priorityToString);

export const statusSelect = (curValue: Status, changeStatus) =>
  customSelect(curValue, "Status", changeStatus, statusToString);

export const titleEditor = (title: string, setTitle, submitFunction) => (
  <TextField
    value={title}
    onChange={(event) => setTitle(event.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        submitFunction(title);
      }
    }}
    className="w-10/12"
  />
);
