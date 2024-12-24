import { lazy, useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import DuckClose from "./assets/duck-close.png";
import DuckOpen from "./assets/duck-open.png";
import Taskflow from "./pages/Taskflow";

const Login = lazy(() => import("./pages/Login"));

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

  useEffect(() => {
    const logIn = async () => {
      if (isLoggedIn) {
        await window.api.initDbs(window.localStorage.getItem("username"));
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
        {isLoggedIn ? <Taskflow /> : <Login setIsLoggedIn={setIsLoggedIn} />}
      </div>
    </ThemeProvider>
  );
};

export default App;
