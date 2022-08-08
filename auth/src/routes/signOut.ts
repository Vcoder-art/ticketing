import express from "express";
const router = express.Router();

router.post("/api/signout", (req, res) => {
  // console.log(req.session)
  req.session = null;
  res.send({});
});

export { router as signOutRouter };
