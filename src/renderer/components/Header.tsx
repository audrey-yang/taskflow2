import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import Chip from "@mui/material/Chip";
import PendingIcon from "@mui/icons-material/Pending";
import RunCircleIcon from "@mui/icons-material/RunCircle";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

const Header = ({
  numUnstartedTasks,
  numInProgressTasks,
  numCompletedTasks,
}: {
  numUnstartedTasks: number;
  numInProgressTasks: number;
  numCompletedTasks: number;
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row my-5">
        <Chip className="mx-2" label={`Not started: ${numUnstartedTasks}`} icon={<PendingIcon />} />
        <Chip
          className="mx-2"
          label={`In progress: ${numInProgressTasks}`}
          icon={<RunCircleIcon />}
        />
        <Chip className="mx-2" label={`Completed: ${numCompletedTasks}`} icon={<TaskAltIcon />} />
      </div>
      <div className="flex flex-row">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar sx={{ margin: 0 }} readOnly />
          <DateCalendar
            sx={{ margin: 0 }}
            readOnly
            referenceDate={dayjs().month(dayjs().month() + 1)}
          />
        </LocalizationProvider>
      </div>
    </div>
  );
};

export default Header;
