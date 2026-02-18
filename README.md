# AI Assessment Platform - Backend

Node.js + Express + MongoDB backend for an AI-powered online assessment platform.

## Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt (password hashing)
- Morgan (request logging)
- Gemini API (AI feedback, optional)

## Project Structure

```bash
backend/
  src/
    config/
      db.js
      env.js
    controllers/
      auth.controller.js
      assessment.controller.js
      result.controller.js
    middlewares/
      auth.middleware.js
      error.middleware.js
    models/
      user.model.js
      assessment.model.js
      result.model.js
    routes/
      auth.routes.js
      assessment.routes.js
      result.routes.js
    services/
      ai.service.js
    utils/
      token.js
    app.js
    server.js
  .env.example
  package.json
Setup
Install dependencies
bash

npm install
Create env file
bash

copy .env.example .env
Update .env values (important)
env

PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ai_assessment_platform
JWT_SECRET=your_strong_secret
JWT_EXPIRES_IN=7d

# AI provider: gemini | ollama | openai | none
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_key
GEMINI_MODEL=gemini-1.5-flash
Run server
bash

npm run dev
Backend runs on:

http://localhost:5000
Health check:

GET /api/health
API Endpoints
Auth
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me (protected)
Assessments
GET /api/assessments (protected)
GET /api/assessments/:id (protected)
POST /api/assessments (protected, admin)
PUT /api/assessments/:id (protected, admin)
DELETE /api/assessments/:id (protected, admin)
Results
POST /api/results/submit (protected)
GET /api/results/me (protected)
GET /api/results/leaderboard (protected)
Authentication
JWT token is returned on register/login.
Send token in headers:
http

Authorization: Bearer <token>
Roles
student
admin
Admin-only routes are protected using role-based middleware.

Scoring Flow
Student submits answers to /api/results/submit
Backend compares answers with correct answers
Score and total are stored in DB
AI feedback is generated (based on configured provider)
Result appears in /api/results/me
Leaderboard is aggregated via /api/results/leaderboard
Scripts
npm run dev - Start with nodemon
npm start - Start with node
Notes
Keep .env private and never push it.
Only .env.example should be committed.
Ensure MongoDB is running before starting backend.
