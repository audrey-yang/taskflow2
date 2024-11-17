import { useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import Typography from "@mui/material/Typography";
import { STATUS } from "@renderer/types";

const Header = () => {
  const [numUnstartedTasks, setNumUnstartedTasks] = useState(0);
  const [numInProgressTasks, setNumInProgressTasks] = useState(0);
  const [numCompletedTasks, setNumCompletedTasks] = useState(0);

  const getTaskCounts = async () => {
    setNumUnstartedTasks(await window.api.countChildTasksByStatus("", STATUS.NOT_STARTED));
    setNumInProgressTasks(await window.api.countChildTasksByStatus("", STATUS.IN_PROGRESS));
    setNumCompletedTasks(await window.api.countChildTasksByStatus("", STATUS.COMPLETED));
  };

  useEffect(() => {
    getTaskCounts();
  }, []);

  return (
    <div className="flex flex-row">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar sx={{ margin: 0 }} />
      </LocalizationProvider>
      <div className="flex flex-col my-3 px-5">
        <Typography variant="h6">Stats</Typography>
        <Typography>Not started: {numUnstartedTasks}</Typography>
        <Typography>In progress: {numInProgressTasks}</Typography>
        <Typography>Completed: {numCompletedTasks}</Typography>
      </div>
    </div>
  );
};

export default Header;
