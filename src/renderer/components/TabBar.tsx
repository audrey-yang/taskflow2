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

  return (
    <Tabs value={location.pathname} variant="scrollable" scrollButtons="auto" className="mb-4">
      <Tab key="tasks" label="Tasks" value="/home" to="/home" component={Link} />
      <Tab key="notes" label="Notes" value="/notes" to="/notes" component={Link} />
      {openTabs.map((tab) => (
        <Tab
          key={tab._id}
          label={
            <span className={"flex flex-row items-center justify-items-stretch"}>
              {tab.title}
              <IconButton
                onClick={(event) => {
                  event.stopPropagation();
                  removeTab(tab._id);
                  navigate("/notes");
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
