class APIOneController {
  healthCheck(req, res) {
    return res.json("Server is up and running");
  }
}

export default APIOneController;
