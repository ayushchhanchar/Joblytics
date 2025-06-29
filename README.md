# Joblytics Pro


Joblytics Pro is a full-stack, AI-augmented job application management platform that allows users to track job applications and analyze their resumes for ATS (Applicant Tracking System) compatibility.

It empowers job seekers to organize their job search process while improving resume relevance using automated matching against job descriptions.

Key Features

- Secure authentication with JWT
- Resume upload (PDF) and parsing
- Track job applications: company, role, URL, status, date
- ATS Checker: resume-job description matching with keyword analysis
- Real-time validation on both frontend and backend using Zod
- Built for performance, usability, and scale

Tech Stack

Frontend
- React + TypeScript
- Tailwind CSS for utility-first responsive UI
- React Hook Form + Zod for type-safe form validation
- Axios for HTTP requests
- React Router DOM for navigation

Backend
- Node.js + Express
- Prisma ORM + PostgreSQL
- Multer for file uploads
- pdf-parse for resume text extraction
- JWT-based authentication
- Zod for API validation
- dotenv for secure config

Getting Started

1. Clone the Repository

    git clone https://github.com/your-username/joblytics-pro.git
    cd joblytics-pro

2. Backend Setup

    cd backend
    cp .env.example .env   # Add your DATABASE_URL and JWT_SECRET
    npm install
    npx prisma migrate dev
    npm run dev

    .env Example:
    DATABASE_URL=postgresql://user:password@localhost:5432/joblytics
    JWT_SECRET=your_jwt_secret_here

3. Frontend Setup

    cd ../frontend
    npm install
    npm run dev

    Visit http://localhost:5173 to get started.

ATS Matching Logic (MVP)

Joblytics Pro compares uploaded resume text with a job description using a simple token-based keyword matching algorithm. It returns:
- Match Score (0–100%)
- Missing Keywords
- Suggestions for optimization

Project Structure

joblytics-pro/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── utils/
│   │   └── prisma/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── validators/
│   │   └── hooks/

Roadmap

- [x] User authentication
- [x] Resume upload + parsing
- [x] Job application tracking
- [x] ATS keyword matcher
- [ ] Admin dashboard
- [ ] Export to PDF/CSV
- [ ] AI-powered resume recommendations (GPT-based)
- [ ] OAuth login (Google/LinkedIn)

Contributing

Contributions are welcome! Feel free to open issues or submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

License

Licensed under the MIT License.

Contact

Made with ❤️ by Ayush Chhanchar
Feel free to reach out on LinkedIn or email: chhancharayush007@gmail.com
"""


