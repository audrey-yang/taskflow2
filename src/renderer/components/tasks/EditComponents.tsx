import { useState } from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { Priority, priorityToString, Status, statusToString } from "../../types";

const selectOptions = [0, 1, 2];
const customSelect = (
  curValue: any,
  label: string,
  changeHandler: (e: SelectChangeEvent) => Promise<void>,
  stringDisplay: (raw: any) => string,
) => (
  <Select value={curValue} label={label} onChange={changeHandler} fullWidth size="small">
    {selectOptions.map((val) => (
      <MenuItem key={stringDisplay(val)} value={val}>
        {stringDisplay(val)}
      </MenuItem>
    ))}
  </Select>
);

export const prioritySelect = (
  curValue: Priority,
  changePriority: (e: SelectChangeEvent) => Promise<void>,
) => customSelect(curValue, "Priority", changePriority, priorityToString);

export const statusSelect = (
  curValue: Status,
  changeStatus: (e: SelectChangeEvent) => Promise<void>,
) => customSelect(curValue, "Status", changeStatus, statusToString);

export const titleEditor = (
  newTitle: string,
  setNewTitle: (newTitle: string) => void,
  submitFunction: (newTitle: string) => Promise<void>,
) => (
  <TextField
    spellCheck={true}
    value={newTitle}
    onChange={(event) => setNewTitle(event.target.value)}
    onKeyDown={async (e) => {
      if (e.key === "Enter") {
        await submitFunction(newTitle);
        setNewTitle("");
      }
    }}
    className="w-10/12"
    size="small"
  />
);

export const notesEditor = (
  originalNote: string,
  changeNote: (newNote: string) => Promise<void>,
  disabled: boolean,
) => {
  const [note, setNote] = useState(originalNote);
  return (
    <TextField
      spellCheck={true}
      value={note}
      onChange={(event) => setNote(event.target.value)}
      onBlur={async () => {
        await changeNote(note);
      }}
      className="w-10/12"
      label={disabled ? "Note" : "Edit note"}
      multiline
      variant="filled"
      disabled={disabled}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === "Tab") {
          e.preventDefault();
          const cursorPosition = e.target.selectionStart;
          const cursorEndPosition = e.target.selectionEnd;
          e.target.value =
            note.substring(0, cursorPosition) + "\t" + note.substring(cursorEndPosition);
          e.target.selectionStart = cursorPosition + 1;
          e.target.selectionEnd = cursorPosition + 1;
          setNote(e.target.value);
        }
      }}
    />
  );
};
