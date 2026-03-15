const express = require("express");

function block_1_basicServer() {
  return new Promise((resolve) => {
    const app = express();

    app.use(express.json());

    app.get("/manu", (req, res) => {
      res.status(201).json({
        item: ["thali", "birayani", "Nothing"],
      });
    });

    app.get("/serach", (req, res) => {
      const query = req.query;
      res.json({
        query: query,
        limit: "No Limit as of now",
      });
    });

    app.get("/manu:id", (req, res) => {
      const { id } = req.params;

      res.status(201).json({
        item: id,
        price: 212,
      });
    });

    app.post("/order", (req, res) => {
      const data = req.body;
      return res.status(201).json({
        status: "Order received",
        order: data,
      });
    });

    const server = app.listen(0, async () => {
      const port = server.address().port;
      const base = `http://127.0.0.1:${port}`;

      try {
        let data = await fetch(`${base}/manu`);
        const manuData = data.json();
        console.log("Get /manu", JSON.stringify(manuData));
        console.log("\n-------------------------------------------------\n");

        data = await fetch(`${base}/serach?q=saurabh&limit=10&data=me`);
        const serachData = data.json();
        console.log("Get serach", JSON.stringify(serachData));
        console.log("\n-------------------------------------------------\n");

        data = await fetch(`${base}/manu/shahithali`);
        const manuId = data.json();
        console.log("Get manu/:id", JSON.stringify(manuId));
        console.log("\n-------------------------------------------------\n");

        data = await fetch(`${base}/order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            body: JSON.stringify({
              order: "panupur",
            }),
          },
        });
        const orderDa = data.json();
        console.log("Order", orderDa);
        console.log("\n-------------------------------------------------\n");
      } catch (error) {
        console.log(error);
      }

      server.close(() => {
        console.log("Block 1 served ...");
        resolve();
      });
    });
  });
}

function block_2_response() {
  return new Promise((resolve) => {
    const app = express();

    app.get("/json", (req, res) => {
      res.send({
        fremework: "express",
        version: "6.1.1",
      });
    });

    app.get("/not-found", (req, res) => {
      res.status(404).json({
        error: "Page Not Found",
      });
    });

    app.get("/health", (req, res) => {
      res.sendStatus(200);
    });

    app.get("/old-manu", (req, res) => {
      //add entry how many user visited my website
      res.redirect(301, "/new-manu");
    });

    app.get("/xml", (req, res) => {
      res.type("application/xml").send("<dish><name>Apple</name>/dish>");
    });

    app.get("/custom-headers", (req, res) => {
      res.set("x-power0-by", "ChaiCode");

      res.json({
        message: "Customer header set",
      });
    });

    app.get("/no-content", (req, res) => {
      res.status(204).end();
    });

    const server = app.listen(0, async () => {
      const port = server.address().port;
      const baseURL = `http://127.0.0.1:${port}`;

      try {
        //TODO
      } catch (error) {
        console.log(error);
      }
    });

    server.close(() => {
      console.log("server has been close for block 2");
      resolve();
    });
  });
}

async function main(params) {
  //   await block_1_basicServer();
  await block_2_response();
  //   process.exit(0);
}

main();
