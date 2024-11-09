import { createTheme, ThemeProvider } from "@mui/material/styles";
import TaskList from "./components/TaskList";
import { CssBaseline, Typography } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App(): JSX.Element {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        <Typography variant="h3" className="my-2">
          Taskflow
        </Typography>
        <TaskList />
      </div>
    </ThemeProvider>
  );
}

export default App;
