import { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import DuckClose from "./assets/duck-close.png";
import DuckOpen from "./assets/duck-open.png";
import Home from "./pages/Home";
import Login from "./pages/Login";

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
      window.localStorage.getItem("version") === "0.2.0",
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppBar position="static" className="p-1">
        <div className="flex flex-row items-center">
          <img src={isConnected ? DuckOpen : DuckClose} alt="connection status" className="h-16" />
          <Typography variant="h4" className="ml-5">
            Taskflow
          </Typography>
        </div>
      </AppBar>
      <div className="App">{isLoggedIn ? <Home /> : <Login setIsLoggedIn={setIsLoggedIn} />}</div>
    </ThemeProvider>
  );
};

export default App;
