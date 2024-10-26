const { Router } = require("express");
const {  loadDataFromDatabase } = require("../../mongo");
const router = Router();

router.get("/load/interpolation/all/:limit?", async (req, res) => {
  const limit = parseInt(req.params.limit || 1);
  const data = await loadDataFromDatabase("Interpolation", "All", limit);

  const newData = data.map((val) => ({
    matX: val.matX,
    matFX: val.matFX,
  }));

  return res.status(200).json({
    status: "pass",
    data: newData,
  });
});

module.exports = router;
