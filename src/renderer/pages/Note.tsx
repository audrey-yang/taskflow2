import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

const Note = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [creationDate, setCreationDate] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchNote = async () => {
      const note = await window.api.getNoteById(id);
      setTitle(note.title);
      setCreationDate(note.creationDate);
      setContent(note.content);
    };
    fetchNote();
  }, [id]);

  return (
    <div className="w-full">
      <div className="mb-6">
        <Typography variant="h3">{title ?? ""}</Typography>
        <Typography variant="body1">
          {new Date(creationDate ?? 0).toLocaleString("en-US", { timeZone: "CST" })}
        </Typography>
      </div>
      <TextField
        spellCheck={true}
        value={content}
        onChange={(event) => setContent(event.target.value)}
        onBlur={async () => {
          await window.api.changeNoteContent(id, content);
        }}
        className="w-full"
        multiline
        minRows={10}
        variant="filled"
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === "Tab") {
            e.preventDefault();
            setContent(content + "\t");
          }
        }}
      />
    </div>
  );
};

export default Note;
