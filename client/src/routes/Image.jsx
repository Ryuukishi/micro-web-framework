import { useParams } from "react-router-dom";

function Image() {
  const { filename } = useParams();

  return (
    <div>
      <img src={`/api/image/${filename}`}></img>
    </div>
  );
}

export default Image;
