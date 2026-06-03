import http from "node:http";
import express from "express";

async function main() {
  const app = express();
  const server = http.createServer(app);

  app.get("/", (req, res) => {
    res.send("Server is running!");
  });

  server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  });
}

main().catch((err) => {
  console.error("Error starting server:", err);
});
