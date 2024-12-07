import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";

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
    <div className="flex flex-row">
      <div className="flex flex-col my-5 px-5">
        <Typography className="italic">At a glance</Typography>
        <Typography>Not started: {numUnstartedTasks}</Typography>
        <Typography>In progress: {numInProgressTasks}</Typography>
        <Typography>Completed: {numCompletedTasks}</Typography>
      </div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar sx={{ margin: 0 }} />
        <DateCalendar
          sx={{ margin: 0 }}
          readOnly
          referenceDate={dayjs().month(dayjs().month() + 1)}
        />
      </LocalizationProvider>
    </div>
  );
};

export default Header;
