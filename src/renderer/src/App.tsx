import electronLogo from "./assets/electron.svg";
import { PRIORITY, STATUS } from "../../types";

function App(): JSX.Element {
  const ping = (): void => window.api.ping()
  const createTask = (): void => window.api.createTask(
    { title: "Task", priority: PRIORITY.LOW, status: STATUS.NOT_STARTED }
  );

  return (
    <>
      <img alt="logo" className="logo" src={electronLogo} />
      <div className="creator">Powered by electron-vite</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>
        &nbsp;and <span className="ts">TypeScript</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div className="actions">
      <div className="action">
          <a target="_blank" rel="noreferrer" onClick={createTask}>
            Create task
          </a>
        </div>
        <div className="action">
          <a target="_blank" rel="noreferrer" onClick={ping}>
            Send ping
          </a>
        </div>
      </div>
    </>
  );
}

export default App;
