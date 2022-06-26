import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./App.css";

function App() {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState("");

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await axios.get("/api/images");
      const imageList = [];
      res.data.map((data) => imageList.push(data.image));
      setImages(imageList);
      console.log("imagelist", imageList);
      console.log("res.data", res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      try {
        const res = await axios.post("/api/images", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Response object:", res);
        setImages([...images, res.data]);
      } catch (err) {
        alert("Error: Invalid file type");
      }
    }
  };

  return (
    <div>
      <h1>Image Upload</h1>
      <form method='post' encType='multipart/form-data' onSubmit={handleSubmit}>
        <label htmlFor='image'>
          <input
            type='file'
            name='image'
            accept='image/png, image/jpeg, image/jpg'
            onChange={handleFile}
          />
        </label>
        <button type='submit' name='upload'>
          Upload
        </button>
      </form>
      {images.map((image) => (
        <Link to={{ pathname: `/image/${image}` }} key={image}>
          <img src={`/api/image/${image}`} loading='lazy' />
        </Link>
      ))}
    </div>
  );
}

export default App;
