
# Joblytics Pro

Joblytics Pro is a full-stack, AI-augmented job application management platform that helps job seekers organize their job search, track applications, and improve their resume relevance using an ATS (Applicant Tracking System) compatibility checker.

Built to solve the problem of scattered job tracking and ineffective resume targeting, Joblytics Pro empowers users to log job applications, upload resumes, and receive feedback on how well their resume matches each job description.

---

## ✨ Features

- 🧾 Application Tracker: Add company, role, job URL, application status, and applied date
- 🔐 Secure Auth: Register/login with JWT-based authentication
- 📄 Resume Upload: PDF upload with server-side parsing and text extraction
- 📊 ATS Checker: Compares resume text with job descriptions and returns match score and missing keywords
- ✅ Zod Validation: Type-safe, schema-based validation on both frontend and backend
- 💡 Built with scalability and clean architecture in mind

---

## 🚀 Tech Stack

Frontend:

- React.js + TypeScript
- Tailwind CSS
- React Hook Form + Zod
- Axios & React Router

Backend:

- Node.js + Express
- Prisma ORM + PostgreSQL
- pdf-parse for resume text extraction
- Multer for file upload handling
- JWT for authentication
- Zod for server-side input validation
- dotenv for environment configuration

---

## 🧠 ATS Matching Logic

The ATS checker compares uploaded resumes against job descriptions using basic NLP:

- Extracts text from PDF resumes
- Tokenizes and normalizes both resume and job description
- Calculates a match percentage and identifies missing keywords
- Future versions can integrate semantic similarity using LLMs like OpenAI GPT

Example Output:

✅ Match Score: 78%  
❌ Missing Keywords: TypeScript, Backend Services, CI/CD

---

## 📦 Getting Started

Clone the repo:

```bash
git clone https://github.com/your-username/joblytics-pro.git
cd joblytics-pro
```

### Backend Setup

```bash
cd backend
cp .env.example .env # add DATABASE_URL and JWT_SECRET
npm install
npx prisma migrate dev
npm run dev
```

.env format:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/joblytics
JWT_SECRET=your_jwt_secret_here
```

### Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

Visit http://localhost:5173

---

## 📁 Folder Structure

joblytics-pro/  
├── backend/  
│   ├── src/  
│   │   ├── controllers/  
│   │   ├── routes/  
│   │   ├── middlewares/  
│   │   ├── utils/  
│   │   └── prisma/  
├── frontend/  
│   ├── src/  
│   │   ├── pages/  
│   │   ├── components/  
│   │   ├── validators/  
│   │   └── hooks/  

---

## 🛡 Security

- All API routes protected by JWT middleware
- Resume uploads validated and stored securely
- Input validation performed with Zod (on both frontend and backend)

---

## 📈 Roadmap

- [x] User auth and dashboard
- [x] Resume parsing and ATS matching
- [ ] Semantic resume scoring using LLM (OpenAI/GPT)
- [ ] Reminder system for follow-ups
- [ ] Resume keyword suggestions
- [ ] OAuth (Google/LinkedIn) login

---

## 🤝 Contributing

Contributions are welcome! Open an issue or submit a PR with your improvements or ideas.

---

## 📜 License

MIT License — use freely and build upon it.
