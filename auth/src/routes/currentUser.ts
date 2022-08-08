import express from "express";
import { currentUser } from "@vsticketing012/common";

// import { AuthRequire } from "../middleware/AuthRequire"

const router = express.Router();

router.get("/api/currentUser", currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
