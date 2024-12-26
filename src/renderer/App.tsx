import { useState } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import DuckClose from "./assets/duck-close.png";
import DuckOpen from "./assets/duck-open.png";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NoteList from "./pages/NoteList";
import Note from "./pages/Note";
import TabBar from "./components/TabBar";

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
  const [activeTab, setActiveTab] = useState("/home");
  const [openTabs, setOpenTabs] = useState([] as { _id: string; title: string }[]);
  const addTab = (e: { _id: string; title: string }) => {
    setOpenTabs((prev) => {
      if (prev.find((it) => it._id === e._id)) {
        return prev;
      }
      return [...prev, e];
    });
  };

  const removeTab = (id: string) => {
    setOpenTabs((prev) => {
      const updated = prev.filter((it) => it._id !== id);
      return updated;
    });
  };

  // Connection status
  const [isConnected, setIsConnected] = useState(window.navigator.onLine);
  window.addEventListener("online", () => setIsConnected(true));
  window.addEventListener("offline", () => setIsConnected(false));

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
      <div className="App">
        <HashRouter>
          <TabBar
            openTabs={openTabs}
            removeTab={removeTab}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <Routes>
            <Route
              path="/"
              element={
                window.localStorage.getItem("loggedIn") === "y" &&
                window.localStorage.getItem("username") != null &&
                window.localStorage.getItem("version") === "0.1.7" ? (
                  <Home />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/notes"
              element={<NoteList addTab={addTab} setActiveTab={setActiveTab} />}
            />
            <Route path="/note/:id" element={<Note />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </HashRouter>
      </div>
    </ThemeProvider>
  );
};

export default App;
