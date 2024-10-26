const { Router } = require("express");
const {  loadDataFromDatabase } = require("../../mongo");
const router = Router();

router.get("/load/linearalgebra/all/:limit?", async (req, res) => {
  const limit = parseInt(req.params.limit || 1);
  const data = await loadDataFromDatabase("LinearAlgebra", "All", limit);

  const newData = data.map((val) => ({
    matA: val.matA,
    matB: val.matB,
  }));

  return res.status(200).json({
    status: "pass",
    data: newData,
  });
});

module.exports = router;
