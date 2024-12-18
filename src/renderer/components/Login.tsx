import { useState } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import DoneIcon from "@mui/icons-material/Done";

const Login = ({ setIsLoggedIn }: { setIsLoggedIn: (isLoggedIn: boolean) => void }) => {
  const [password, setPassword] = useState("");
  const [hasError, setHasError] = useState(false);

  const submitPassword = async () => {
    if (await window.api.checkPassword(password)) {
      if (window.api.checkPassword(password)) {
        window.localStorage.setItem("version", "0.1.5");
        window.localStorage.setItem("loggedIn", "y");
        window.localStorage.setItem("username", password);
        setIsLoggedIn(true);
      } else {
        setHasError(true);
      }
      setIsLoggedIn(true);
    } else {
      setHasError(true);
    }
    setPassword("");
  };

  return (
    <div className="flex flex-row my-4">
      <TextField
        label={hasError ? "Try again" : "Enter password"}
        onChange={(event) => setPassword(event.target.value)}
        className="w-1/2"
        error={hasError}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            submitPassword();
          }
        }}
      />
      <IconButton onClick={submitPassword}>
        <DoneIcon />
      </IconButton>
    </div>
  );
};

export default Login;
