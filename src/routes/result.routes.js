import express from "express";
import { submitAssessment, getMyResults, getLeaderboard } from "../controllers/result.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/submit", protect, submitAssessment);
router.get("/me", protect, getMyResults);
router.get("/leaderboard", protect, getLeaderboard);

export default router;
