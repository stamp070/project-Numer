const { Router } = require("express");
const {  loadDataFromDatabase } = require("../../mongo");
const router = Router();

router.get("/load/rootequation/all/:limit?", async (req, res) => {
  const limit = parseInt(req.params.limit || 1);
  const equations = await loadDataFromDatabase("RootofEquation", "All", limit);
  const newEquations = equations.map((val) => ({
    equation: val.equation,
  }));

  console.log(newEquations);
  return res.status(200).json({
    status: "pass",
    equations: newEquations,
  });
});

module.exports = router;
