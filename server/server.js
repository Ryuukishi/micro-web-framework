import express from "express";
import bp from "body-parser";
import cors from "cors";
import morgan from "morgan";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import { readdir, access, rm } from "node:fs/promises";
import { constants } from "fs";
const { urlencoded, json } = bp;

// mock database for the images

let db = [];

(async () => {
  try {
    const files = await readdir("./public");
    for (const file of files) {
      db.push({ image: file });
    }
  } catch (err) {
    console.error(err);
  }
  console.log("Current list of images:\n", db);
})();

const app = express();

app.use(urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(
  cors({
    origin: "*",
  })
);
app.use(json());

const PORT = 5000;

// get all images
app.get("/images", function (req, res) {
  res.send(db);
});

// config for multer
const mimetypeList = ["image/png", "image/jpeg", "image/png"];

// function to determine which files should be uploaded and which should be skipped
const fileFilter = (req, file, cb) => {
  if (mimetypeList.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
    // cb(new Error("Invalid filetype"), false);
    // cb(new Error("Invalid filetype"));
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    // universally unique identifier
    cb(null, uuidv4() + "." + ext);
  },
});

const upload = multer({ fileFilter, storage }).single("image");

// upload image
app.post("/images", function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      console.log("POST ERROR:", err);
      return res.status(415).send(err);
    } else {
      db.push({ image: req.file.filename });
      res.status(200).json(req.file.filename);
    }
  });
});

// get a single image
app.get("/image/:file", function (req, res) {
  const file = req.params.file;
  console.log(file);
  try {
    res.status(200).sendFile(file, { root: "./public/" });
  } catch (err) {
    console.error(err);
    res.status(404);
  }
});

// delete a single image
app.delete("/image/:file", async function (req, res) {
  const file = req.params.file;
  const path = "./public/" + file;
  console.log(file);
  try {
    await access(path, constants.F_OK);
    await rm(path);
    db = db.filter((image) => image.image !== file);
    console.log(db);
    res.status(200).send("File deleted");
  } catch (err) {
    console.error(err);
    res.status(404).send("File doesn't exist");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// try {
//   await access(file, constants.F_OK);
//   console.log("can access");
// } catch {
//   console.log("cant access");
//   // res.send("File doesn't exist")
// }
