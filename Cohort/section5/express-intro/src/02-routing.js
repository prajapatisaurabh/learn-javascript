const express = require("express");

function block_1_basicServer() {
  return new Promise((resolve) => {
    const app = express();
    app.use(express.json());

    const routes = {
      1: {
        id: 1,
        name: "Ahmedabad-Patan local Demu",
        direction: "uppere side",
      },
      2: {
        id: 2,
        name: "Ahmedabad-Bandra express",
        direction: "wrong side",
      },
    };

    let nextId = 3;

    app.get("/routes", (req, res) => {
      res.json(200).json(Object.values(routes));
    });

    app.get("/route/:id", (req, res) => {
      const { id } = req.params;
      const route = routes[id];

      if (!route) {
        return res.status(404).json({
          error: "No train on this id",
        });
      } else {
        return res.status(200).json(route);
      }
    });

    app.post("/routes", (req, res) => {
      const body = req.body;
      const newRoutes = { id: nextId++, ...body };
      routes[newRoutes.id] = newRoutes;

      res.status(201).json({
        message: "data has been created sucecefully",
        data: newRoutes,
      });
    });

    app.put("/routes/:id", (req, res) => {
      const id = res.params.id;
      if (!routes[id]) {
        return res
          .status(404)
          .json({ error: "Something went wrong nahi bhej na hai" });
      }
      routes[id] = { id: Number(id), ...req.body };

      res.status(201).json({ message: "Data has ben updated sucessfully" });
    });

    app.patch("/routes/:id", (req, res) => {
      const id = res.params.id;
      if (!routes[id]) {
        return res
          .status(404)
          .json({ error: "Something went wrong nahi bhej na hai" });
      }
      routes[id] = { id: Number(id), ...req.body };

      //TODO: Your Self
    });

    app.delete("/routes/:id", (req, res) => {
      const id = res.params.id;
      if (!routes[id]) {
        return res
          .status(404)
          .json({ error: "Something went wrong nahi bhej na hai" });
      }
      delete routes[id];

      res.json({
        mesage: "Data has been deleted ",
        id,
      });

      //TODO: Your Self
    });

    const server = app.listen(0, async () => {
      const port = server.address().port;
      const base = `http://127.0.0.1:${port}`;

      try {
        let data = await fetch(`${base}/routes`);
        const manuData = data.json();
        console.log("Get /routes", JSON.stringify(manuData));
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

    app.get("files/*filepath", (req, res) => {
      const filepath = req.params.filepath;
      res.json({ filepath, type: "windcard" });
    });

    app
      .route("/schedule")
      .get((req, res) => {})
      .post((req, res) => {})
      .put((req, res) => {})
      .delete((req, res) => {});

    app.use("/api", (req, res) => {
      // its a prefetch match
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
