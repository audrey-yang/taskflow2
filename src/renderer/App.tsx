import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Typography } from "@mui/material";
import Header from "./components/Header";
import TaskList from "./components/TaskList";

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
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        <Typography variant="h3" className="my-2">
          Taskflow
        </Typography>
        <Header />
        <TaskList />
      </div>
    </ThemeProvider>
  );
};

export default App;
