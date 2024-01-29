import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";
import { insertDetails } from "./utils/emailVerification.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log("Server Running at port: ", process.env.PORT);
    });
    // insertDetails();
  })
  .catch((error) => {
    console.log("MongoDB connection failed ", error);
  });
