import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import Error from "./middlewares/Error.js";
import cors from "cors";

config({
  path: "./config/config.env",
});

const app = express();

// using middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// import routes
import user from "./routes/userRoutes.js";
import reportPerson from "./routes/reportPersonRoutes.js";
import foundPerson from "./routes/foundPersonRoutes.js";

// using routes
app.use("/api/v1", user);
app.use("/api/v1", reportPerson);
app.use("/api/v1", foundPerson);

export default app;

app.get("/", (req, res) =>
  res.send(
    `<h1>Its working. Click to visit <a href=${process.env.FRONTEND_URL}>Link</a></h1>`
  )
);

app.use(Error);
