const { Router } = require("express");
const {  loadDataFromDatabase } = require("../../mongo");
const router = Router();

router.get("/load/linearalgebra/all/:limit?", async (req, res) => {
  const limit = parseInt(req.params.limit || 1);
  const data = await loadDataFromDatabase("LinearAlgebra", "All", limit);
  
  console.log(data);
  const newData = data.map((val) => ({
    matA: val.equationA,
    matB: val.equationB,
  }));
  console.log(newData);
  return res.status(200).json({
    status: "pass",
    data: newData,
  });
});

module.exports = router;
