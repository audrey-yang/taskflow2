import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Link from "@mui/material/Link";

const NoteList = ({ addTab }: { addTab: (note: { _id: string; title: string }) => void }) => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const getNotes = async () => {
      const fetchedNotesList = await window.api.getAllNotes();
      setNotes(fetchedNotesList);
    };
    getNotes();
  }, []);

  return (
    <div className="p-4">
      {notes.map((note: { _id: string; title: string; creationDate: string }) => (
        <div key={note._id} className="px-8 my-2 w-full flex flex-row">
          <Link
            className="w-1/2"
            onClick={(_) => {
              addTab({ _id: note._id, title: note.title });
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
