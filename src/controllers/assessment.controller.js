import Assessment from "../models/assessment.model.js";

const sanitizeAssessment = (assessment, includeAnswers = false) => {
  const obj = assessment.toObject();

  if (!includeAnswers) {
    obj.questions = obj.questions.map(({ correctAnswer, ...rest }) => rest);
  }

  return obj;
};

export const createAssessment = async (req, res, next) => {
  try {
    const { title, description, durationMinutes, questions } = req.body;

    if (!title || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, message: "title and non-empty questions are required" });
    }

    const assessment = await Assessment.create({
      title,
      description: description || "",
      durationMinutes: durationMinutes || 30,
      questions,
      createdBy: req.user._id
    });

    return res.status(201).json({ success: true, data: sanitizeAssessment(assessment, true) });
  } catch (error) {
    return next(error);
  }
};

export const listAssessments = async (req, res, next) => {
  try {
    const assessments = await Assessment.find()
      .sort({ createdAt: -1 })
      .select("title description durationMinutes questions createdBy createdAt updatedAt")
      .populate("createdBy", "name email role");

    const data = assessments.map((a) => sanitizeAssessment(a, req.user.role === "admin"));
    return res.json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

export const getAssessmentById = async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id).populate("createdBy", "name email role");

    if (!assessment) {
      return res.status(404).json({ success: false, message: "Assessment not found" });
    }

    return res.json({ success: true, data: sanitizeAssessment(assessment, req.user.role === "admin") });
  } catch (error) {
    return next(error);
  }
};

export const updateAssessment = async (req, res, next) => {
  try {
    const { title, description, durationMinutes, questions } = req.body;

    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      return res.status(404).json({ success: false, message: "Assessment not found" });
    }

    if (title !== undefined) assessment.title = title;
    if (description !== undefined) assessment.description = description;
    if (durationMinutes !== undefined) assessment.durationMinutes = durationMinutes;
    if (Array.isArray(questions) && questions.length > 0) assessment.questions = questions;

    await assessment.save();
    return res.json({ success: true, data: sanitizeAssessment(assessment, true) });
  } catch (error) {
    return next(error);
  }
};

export const deleteAssessment = async (req, res, next) => {
  try {
    const assessment = await Assessment.findByIdAndDelete(req.params.id);
    if (!assessment) {
      return res.status(404).json({ success: false, message: "Assessment not found" });
    }

    return res.json({ success: true, data: { id: assessment._id } });
  } catch (error) {
    return next(error);
  }
};
