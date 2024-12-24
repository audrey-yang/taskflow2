import { Link, useLocation, useNavigate } from "react-router-dom";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const TabBar = ({
  openTabs,
  removeTab,
  activeTab,
  setActiveTab,
}: {
  openTabs: { _id: string; title: string }[];
  removeTab: (_id: string) => void;
  activeTab: string;
  setActiveTab: (path: string) => void;
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Tabs
      value={location.pathname}
      onChange={(_, newVal) => {
        setActiveTab(newVal);
      }}
      variant="scrollable"
      scrollButtons="auto"
      className="mb-4"
    >
      <Tab key="tasks" label="Tasks" value="/home" to="/home" component={Link} />
      <Tab key="notes" label="Notes" value="/notes" to="/notes" component={Link} />
      {openTabs.map((tab) => (
        <Tab
          key={tab._id}
          label={
            <span className={"flex flex-row items-center justify-items-stretch"}>
              {tab.title}
              <IconButton
                onClick={async (event) => {
                  event.stopPropagation();
                  if (location.pathname === `/note/${tab._id}`) {
                    const redir = openTabs.length > 1 ? `/note/${openTabs[-1]._id}` : "/notes";
                    await navigate(redir, { replace: true });
                    setActiveTab(redir);
                  } else {
                    await navigate(activeTab, { replace: true });
                  }
                  await navigate(0);
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
