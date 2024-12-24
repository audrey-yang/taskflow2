import { useParams } from "react-router-dom";

const Note = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>{id}</h1>
    </div>
  );
};

export default Note;
