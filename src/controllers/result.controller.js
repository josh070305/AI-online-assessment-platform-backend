import mongoose from "mongoose";
import Assessment from "../models/assessment.model.js";
import Result from "../models/result.model.js";
import { generateAiFeedback } from "../services/ai.service.js";

export const submitAssessment = async (req, res, next) => {
  try {
    const { assessmentId, answers } = req.body;

    if (!assessmentId || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: "assessmentId and answers are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(assessmentId)) {
      return res.status(400).json({ success: false, message: "Invalid assessmentId" });
    }

    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({ success: false, message: "Assessment not found" });
    }

    let score = 0;
    const normalizedAnswers = answers
      .filter((a) => a.questionId && typeof a.answer === "string")
      .map((a) => ({
        questionId: new mongoose.Types.ObjectId(a.questionId),
        answer: a.answer
      }));

    assessment.questions.forEach((question) => {
      const userAnswer = normalizedAnswers.find((a) => String(a.questionId) === String(question._id));
      if (userAnswer && userAnswer.answer === question.correctAnswer) {
        score += 1;
      }
    });

    const total = assessment.questions.length;
    const feedback = await generateAiFeedback({ score, total, title: assessment.title });

    const result = await Result.create({
      assessmentId,
      userId: req.user._id,
      answers: normalizedAnswers,
      score,
      total,
      feedback
    });

    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
};

export const getMyResults = async (req, res, next) => {
  try {
    const results = await Result.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate("assessmentId", "title description");

    return res.json({ success: true, data: results });
  } catch (error) {
    return next(error);
  }
};

export const getLeaderboard = async (req, res, next) => {
  try {
    const rows = await Result.aggregate([
      {
        $group: {
          _id: "$userId",
          attempts: { $sum: 1 },
          score: { $sum: "$score" },
          total: { $sum: "$total" }
        }
      },
      {
        $addFields: {
          percentage: {
            $cond: [{ $eq: ["$total", 0] }, 0, { $multiply: [{ $divide: ["$score", "$total"] }, 100] }]
          }
        }
      },
      {
        $sort: { percentage: -1 }
      }
    ]);

    const populated = await Result.populate(rows, { path: "_id", model: "User", select: "name email" });

    const data = populated.map((row) => ({
      userId: row._id?._id || row._id,
      name: row._id?.name || "Unknown",
      attempts: row.attempts,
      score: row.score,
      total: row.total,
      percentage: Number(row.percentage.toFixed(2))
    }));

    return res.json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};
