import express from "express";
import {
  createAssessment,
  deleteAssessment,
  getAssessmentById,
  listAssessments,
  updateAssessment
} from "../controllers/assessment.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protect, listAssessments);
router.get("/:id", protect, getAssessmentById);
router.post("/", protect, authorize("admin"), createAssessment);
router.put("/:id", protect, authorize("admin"), updateAssessment);
router.delete("/:id", protect, authorize("admin"), deleteAssessment);

export default router;
