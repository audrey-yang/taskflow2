import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import DoneIcon from "@mui/icons-material/Done";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import TextField from "@mui/material/TextField";

const NoteList = ({
  addTab,
  setActiveTab,
}: {
  addTab: (note: { _id: string; title: string }) => void;
  setActiveTab: (_id: string) => void;
}) => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [titleHasError, setTitleHasError] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const toggleHidden = () => {
    setIsHidden((prev) => !prev);
  };

  const getNotes = async () => {
    const fetchedNotesList = await window.api.getAllNotes();
    setNotes(fetchedNotesList);
  };

  useEffect(() => {
    getNotes();
  }, []);

  const submitNote = async () => {
    if (!newNoteTitle) {
      setTitleHasError(true);
      return;
    }
    await window.api.createNote({ title: newNoteTitle });
    setNewNoteTitle("");
    getNotes();
  };

  return (
    <div className="p-4">
      <div className="flex items-center py-2 ml-4">
        <IconButton onClick={toggleHidden}>
          {isHidden ? <AddCircleOutlineIcon /> : <RemoveCircleOutlineIcon />}
        </IconButton>
        {!isHidden ? (
          <>
            <TextField
              value={newNoteTitle}
              onChange={(e) => {
                setNewNoteTitle(e.target.value);
                if (!e.target.value) {
                  setTitleHasError(true);
                } else {
                  setTitleHasError(false);
                }
              }}
              label="Title"
              error={titleHasError}
              size="small"
            />
            <IconButton onClick={submitNote}>
              <DoneIcon />
            </IconButton>
          </>
        ) : null}
      </div>
      {notes.map((note: { _id: string; title: string; creationDate: string }) => (
        <div key={note._id} className="px-8 my-2 w-full flex flex-row">
          <Link
            className="w-1/2"
            onClick={() => {
              addTab({ _id: note._id, title: note.title });
              setActiveTab(`/note/${note._id}`);
              navigate(`/note/${note._id}`);
            }}
          >
            {note.title}
          </Link>
          <div className="w-1/2 flex flex-row justify-end">
            {new Date(note.creationDate).toLocaleString("en-US", { timeZone: "CST" })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NoteList;
