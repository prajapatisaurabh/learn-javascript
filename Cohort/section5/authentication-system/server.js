import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/common/config/db.js";

const port = process.env.PORT | 3000;

const start = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log("Server is running on: ", port);
  });
};

start().catch((err) => {
  console.error("Failed to Start server", err);
  process.exit(1);
});
