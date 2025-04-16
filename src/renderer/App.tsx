import { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { HashRouter, Routes, Route } from "react-router-dom";
import DuckClose from "./assets/duck-close.png";
import DuckOpen from "./assets/duck-open.png";
import TabBar from "./components/TabBar";
import Home from "./pages/Home";
import NoteList from "./pages/NoteList";
import Note from "./pages/Note";

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

  // Tabs
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

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppBar position="static" className="p-1">
        <div className="flex flex-row place-content-between w-full">
          <div className="flex flex-row items-center">
            <img
              src={isConnected ? DuckOpen : DuckClose}
              alt="connection status"
              className="h-16"
            />
            <Typography variant="h4" className="ml-5">
              Taskflow
            </Typography>
          </div>
          <div className="flex">
            <Button
              onClick={async () => {
                await window.api.logOut();
              }}
            >
              Log out
            </Button>
          </div>
        </div>
      </AppBar>
      <div className="App">
        <HashRouter>
          <TabBar openTabs={openTabs} removeTab={removeTab} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/notes" element={<NoteList addTab={addTab} />} />
            <Route path="/note/:id" element={<Note />} />
          </Routes>
        </HashRouter>
      </div>
    </ThemeProvider>
  );
};

export default App;
