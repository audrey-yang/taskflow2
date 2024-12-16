import { lazy, useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import { STATUS } from "./types";
import DuckClose from "./assets/duck-close.png";
import DuckOpen from "./assets/duck-open.png";

const Header = lazy(() => import("./components/Header"));
const TaskList = lazy(() => import("./components/TaskList"));
const Login = lazy(() => import("./components/Login"));

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
  // Connection status
  const [isConnected, setIsConnected] = useState(window.navigator.onLine);
  window.addEventListener("online", () => setIsConnected(true));
  window.addEventListener("offline", () => setIsConnected(false));

  const [isLoggedIn, setIsLoggedIn] = useState(
    window.localStorage.getItem("loggedIn") === "y" &&
      window.localStorage.getItem("username") != null &&
      window.localStorage.getItem("version") === "0.1.5",
  );

  // Lift state out of Header for refresh
  const [numUnstartedTasks, setNumUnstartedTasks] = useState(0);
  const [numInProgressTasks, setNumInProgressTasks] = useState(0);
  const [numCompletedTasks, setNumCompletedTasks] = useState(0);

  const getTaskCounts = async () => {
    setNumUnstartedTasks(await window.api.countChildTasksByStatus("", STATUS.NOT_STARTED));
    setNumInProgressTasks(await window.api.countChildTasksByStatus("", STATUS.IN_PROGRESS));
    setNumCompletedTasks(await window.api.countChildTasksByStatus("", STATUS.COMPLETED));
  };

  useEffect(() => {
    const logIn = async () => {
      if (isLoggedIn) {
        await window.api.initDb(window.localStorage.getItem("username"));
      }
    };
    logIn();
  }, [isLoggedIn]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      <div className="App">
        <div className="flex flex-row items-center">
          <Typography variant="h2">Taskflow</Typography>
          <img src={isConnected ? DuckOpen : DuckClose} alt="connection status" className="h-24" />
        </div>
        {isLoggedIn ? (
          <>
            <Header
              numUnstartedTasks={numUnstartedTasks}
              numInProgressTasks={numInProgressTasks}
              numCompletedTasks={numCompletedTasks}
            />
            <TaskList refreshHeader={getTaskCounts} />
          </>
        ) : (
          <Login setIsLoggedIn={setIsLoggedIn} />
        )}
      </div>
    </ThemeProvider>
  );
};

export default App;
