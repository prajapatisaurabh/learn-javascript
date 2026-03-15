const express = require("express");

function block_2_response() {
  return new Promise((resolve) => {
    const app = express();
    // app.use(express.json());
    app.use(express.json({ limit: "50k" }));

    app.use(express.urlencoded({ extended: true, limit: "500k" }));

    //TODO: explore more
    app.use(
      express.static(root, {
        dotfiles: "ignore",
        maxAge: "",
      }),
    );

    const logs = [];
    app.use((req, res, next) => {
      const logEntry = `${req.method} : ${req.url}`;
      logs.push(logEntry);
      console.log(`[LOG] -- ${logEntry}`);
      next();
    });

    app.use((req, res, next) => {
      req.startTime = Date.now();

      res.on("finish", () => {
        const duration = Date.now() - req.startTime;
        console.log(`[Timer] - ${duration}`);
      });

      next();
    });

    app.get("files/*filepath", (req, res) => {
      const filepath = req.params.filepath;
      res.json({ filepath, type: "windcard" });
    });

    function authMe(req, res, next) {
      const token = req.header("x-auth-token");
      if (!token) {
        return res.status(401).json({ error: "Not Token Found" });
      }

      if (token !== "secret-chaicide") {
        return res.status(403).json({ error: "Invalid token" });
      }

      // extract data from token

      req.user = { id: 1, name: "saurabh" };

      next();
    }

    function getRole(role) {
      return (req, res, next) => {
        if (!req.user || req.user.role !== role) {
          return res.status(403).json({ error: "Role is not work with this" });
        }
      };
      next();
    }

    function getRoles(roles) {
      //TODO: use roles as array
      // Factory Patter / Depedency Injection

      return (req, res, next) => {
        if (!req.user || req.user.role !== role) {
          return res.status(403).json({ error: "Role is not work with this" });
        }
        next();
      };
    }

    // app.use(authMe()); not proper way to write
    app.get("/profile", authMe, getRole("admin"), () => {
      //
    });

    function rateLimit(maxRequest) {
      let count = 0;
      return (req, res, next) => {
        count++;

        if (count > maxRequest) {
          return res
            .status(429)
            .json({ error: "Too many requirest, Please after some times" });
        }
        next();
      };
    }

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
