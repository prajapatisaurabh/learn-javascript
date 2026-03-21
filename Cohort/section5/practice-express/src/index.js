import express from "express";

import APIOneRouter from "./routes/APIOneRouter.js";
const app = express();

app.use(express.json());
app.use("/api1", APIOneRouter);

app.listen(3000, () => {
  console.log("Application is running in Port:3000");
});
