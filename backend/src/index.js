import dotenv from "dotenv";
import { httpServer } from "./app.js";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./.env",
});

const startServer = () => {
  httpServer.listen(process.env.PORT || 3000, () => {
    console.info(
      `📑 Visit the documentation at: http://localhost:${
        process.env.PORT || 3000
      }`
    );
    console.log("⚙️  Server is running on port: " + process.env.PORT);
  });
};

connectDB()
  .then(() => {
    startServer();
  })
  .catch((err) => {
    console.log("Mongo db connect error: ", err);
  });
