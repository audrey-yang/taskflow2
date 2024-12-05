import { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Typography } from "@mui/material";
import Header from "./components/Header";
import TaskList from "./components/TaskList";
import { STATUS } from "./types";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
  typography: {
    fontFamily: `"Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Oxygen", "sans-serif"`,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
});

const App: () => JSX.Element = () => {
  // Lift state out of Header for refresh
  const [numUnstartedTasks, setNumUnstartedTasks] = useState(0);
  const [numInProgressTasks, setNumInProgressTasks] = useState(0);
  const [numCompletedTasks, setNumCompletedTasks] = useState(0);

  const getTaskCounts = async () => {
    setNumUnstartedTasks(await window.api.countChildTasksByStatus("", STATUS.NOT_STARTED));
    setNumInProgressTasks(await window.api.countChildTasksByStatus("", STATUS.IN_PROGRESS));
    setNumCompletedTasks(await window.api.countChildTasksByStatus("", STATUS.COMPLETED));
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        <Typography variant="h3" className="my-2">
          Taskflow
        </Typography>
        <Header
          numUnstartedTasks={numUnstartedTasks}
          numInProgressTasks={numInProgressTasks}
          numCompletedTasks={numCompletedTasks}
        />
        <TaskList refreshHeader={getTaskCounts} />
      </div>
    </ThemeProvider>
  );
};

export default App;
