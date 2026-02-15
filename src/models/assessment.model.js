import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    prompt: {
      type: String,
      required: true,
      trim: true
    },
    options: {
      type: [String],
      default: []
    },
    correctAnswer: {
      type: String,
      required: true
    }
  },
  { _id: true }
);

const assessmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    durationMinutes: {
      type: Number,
      default: 30
    },
    questions: {
      type: [questionSchema],
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: "At least one question is required"
      }
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Assessment = mongoose.model("Assessment", assessmentSchema);

export default Assessment;
