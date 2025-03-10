import { Link, useLocation, useNavigate } from "react-router-dom";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const TabBar = ({
  openTabs,
  removeTab,
}: {
  openTabs: { _id: string; title: string }[];
  removeTab: (_id: string) => void;
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === "/login") {
    return null;
  }

  return (
    <Tabs value={location.pathname} variant="scrollable" scrollButtons="auto" className="mb-4">
      <Tab key="tasks" label="Tasks" value="/" to="/" component={Link} />
      <Tab key="notes" label="Notes" value="/notes" to="/notes" component={Link} />
      {openTabs.map((tab) => (
        <Tab
          key={tab._id}
          label={
            <span className={"flex flex-row items-center justify-items-stretch"}>
              {tab.title}
              <IconButton
                onClick={async (event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  if (location.pathname === `/note/${tab._id}`) {
                    let redir = "/notes";
                    if (openTabs.length > 1 && tab._id !== openTabs[0]._id) {
                      const idx = openTabs.findIndex((it) => it._id === tab._id);
                      redir = `/note/${openTabs[idx - 1]._id}`;
                    }
                    navigate(redir);
                  }
                  removeTab(tab._id);
                }}
                sx={{ padding: 0 }}
              >
                <CloseIcon className="h-1 w-1" />
              </IconButton>
            </span>
          }
          value={`/note/${tab._id}`}
          to={`/note/${tab._id}`}
          component={Link}
        />
      ))}
    </Tabs>
  );
};

export default TabBar;
