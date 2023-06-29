// upload image  file using multer
import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const upload = multer({ storage }).single("file");

export default upload;
