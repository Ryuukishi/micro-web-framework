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
      // console.log("imagelist", imageList);
      // console.log("res.data", res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFile = (e) => {
    console.log(e.target.files);

    // single file upload
    // therefore file will always be at index 0
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

  const handleDelete = async (e) => {
    e.preventDefault();
    const file = e.target.value;
    console.log(file);
    try {
      const { status, data } = await axios.delete(`/api/image/${file}`);
      if (status === 200) {
        setImages(images.filter((image) => image !== file));
      } else {
        console.log(status, data);
      }
    } catch (err) {
      console.error(err);
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
        <span key={image}>
          <Link to={{ pathname: `/image/${image}` }}>
            <img src={`/api/image/${image}`} loading='lazy' />
          </Link>
          <button value={image} onClick={handleDelete}>
            Delete
          </button>
        </span>
      ))}
    </div>
  );
}

export default App;
