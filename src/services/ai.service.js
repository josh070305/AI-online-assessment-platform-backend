import { env } from "../config/env.js";

const fallbackFeedback = ({ percentage, title }) => {
  if (percentage >= 80) {
    return `Excellent performance in ${title}. Keep strengthening advanced topics.`;
  }

  if (percentage >= 50) {
    return `Solid attempt in ${title}. Review incorrect areas and retry.`;
  }

  return `Foundational gaps detected in ${title}. Revise basics and take a follow-up test.`;
};

const buildPrompt = ({ score, total, title, percentage }) => {
  return [
    "You are an assessment coach.",
    "Write concise, actionable feedback in 2-3 sentences.",
    `Assessment: ${title}`,
    `Score: ${score}/${total}`,
    `Percentage: ${percentage}%`,
    "Include one strength and one improvement tip."
  ].join("\n");
};

const generateFromGemini = async ({ score, total, title, percentage }) => {
  const prompt = buildPrompt({ score, total, title, percentage });
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${env.geminiModel}:generateContent?key=${env.geminiApiKey}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini request failed with status ${response.status}`);
  }

  const data = await response.json();
  const text = (data?.candidates?.[0]?.content?.parts?.[0]?.text || "").trim();
  return text || fallbackFeedback({ percentage, title });
};

const generateFromOllama = async ({ score, total, title, percentage }) => {
  const prompt = buildPrompt({ score, total, title, percentage });

  const response = await fetch(`${env.ollamaBaseUrl}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: env.ollamaModel,
      prompt,
      stream: false
    })
  });

  if (!response.ok) {
    throw new Error(`Ollama request failed with status ${response.status}`);
  }

  const data = await response.json();
  const text = (data?.response || "").trim();
  return text || fallbackFeedback({ percentage, title });
};

export const generateAiFeedback = async ({ score, total, title }) => {
  const percentage = total ? Math.round((score / total) * 100) : 0;

  if (env.aiProvider === "none") {
    return fallbackFeedback({ percentage, title });
  }

  if (env.aiProvider === "gemini") {
    if (!env.geminiApiKey) {
      return fallbackFeedback({ percentage, title });
    }

    try {
      return await generateFromGemini({ score, total, title, percentage });
    } catch {
      return fallbackFeedback({ percentage, title });
    }
  }

  if (env.aiProvider === "openai") {
    if (!env.openaiApiKey) {
      return fallbackFeedback({ percentage, title });
    }

    return `OpenAI mode configured. Implement provider call with model ${env.openaiModel}. Current score: ${score}/${total}.`;
  }

  try {
    return await generateFromOllama({ score, total, title, percentage });
  } catch {
    return fallbackFeedback({ percentage, title });
  }
};
