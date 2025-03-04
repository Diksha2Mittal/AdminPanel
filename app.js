import express from "express"; //Allows you to use Express' functions to create a server, handle HTTP requests, and manage routes.
import mongoose from "mongoose"; //Allows you to connect to a MongoDB database and define data models for your application.
import bodyParser from "body-parser"; //It is used to parse incoming request bodies in a middleware before handling them. Specifically, body-parser.json() parses incoming JSON payloads.
import dotenv from "dotenv"; //It allows you to keep sensitive information like database credentials or API keys outside your source code, ensuring better security and flexibility across different environments.
import route from "./routes/userRoute.js"; //Allows you to define and use routes related to users (such as GET, POST, PUT, DELETE endpoints for user data).
import courseRoute from './routes/courseRoutes.js';
import cors from 'cors';
import fs from 'fs';


const app = express(); //The app object is your Express application that will handle HTTP requests and define routes.
app.use(bodyParser.json()); // Parse incoming JSON payloads

dotenv.config();
const PORT = process.env.PORT || 5000;
const MONGOURL = process.env.MONGO_URL;


app.use(express.json()); // Serve static files from 'public' folder
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use('/uploads', express.static('uploads')); // Serve static files from the 'uploads' folder


const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
app.use("/api/user", route);
app.use('/api/course', courseRoute);

mongoose
  .connect(MONGOURL)
  .then(() => {
    console.log("Database connected successfully.");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.log(error));
