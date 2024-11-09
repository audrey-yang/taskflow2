import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { priorityToString, statusToString } from "@renderer/types";

const Task = ({ title, priority, status }) => {
  return (
    <Accordion
      disableGutters
      elevation={0}
      square
      sx={{
        border: "none",
        "&::before": {
          display: "none",
        },
      }}
    >
      <AccordionSummary
        sx={{
          flexDirection: "row-reverse",
          "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
            transform: "rotate(90deg)",
          },
        }}
      >
        {title}, {priorityToString(priority)}, {statusToString(status)}
      </AccordionSummary>
      <AccordionDetails>{title}</AccordionDetails>
    </Accordion>
  );
};

export default Task;
