# HireSense AI - Backend

An enterprise-style **AI Resume Screening & Candidate Ranking System** built with **Node.js, Express.js, MongoDB, and JWT Authentication**.

HireSense AI helps recruiters automate resume screening, rank candidates using AI-based scoring, manage hiring workflows, and streamline recruitment through role-based dashboards.

---

# Features

## Authentication

- JWT Authentication
- Refresh Token Authentication
- Secure Password Hashing (bcrypt)
- Login
- Logout
- Current User
- Protected Routes
- Role-Based Authorization

---

## User Management

### Super Admin

- Create Admin
- View Admins
- Update Admin
- Activate/Deactivate Admin
- Delete Admin

### Admin

- Create Recruiters
- Create Hiring Managers
- Manage Recruiters
- Manage Hiring Managers

### Recruiter

- Manage Jobs
- Upload Resumes
- Screen Candidates
- Shortlist Candidates
- Assign Hiring Managers

### Hiring Manager

- View Assigned Candidates
- Add Interview Feedback
- Hire / Reject Candidates

---

# Job Management

- Create Job
- Update Job
- Delete Job
- Open / Close Job
- Search Jobs
- Filter Jobs
- Pagination
- Sorting

---

# Resume Management

Supports:

- PDF
- DOCX

Features:

- Resume Upload
- Cloudinary Storage
- Resume Parsing
- Candidate Creation
- Duplicate Detection

---

# Candidate Management

- Candidate Profile
- Skills
- Education
- Experience
- Projects
- Certifications
- Languages
- Resume URL

---

# AI Resume Screening

The AI engine evaluates candidates using weighted scoring.

| Category       | Weight |
| -------------- | -----: |
| Skills         |    40% |
| Experience     |    25% |
| Education      |    10% |
| Projects       |    10% |
| Certifications |    10% |
| Keywords       |     5% |

The system generates:

- AI Score
- Matched Skills
- Missing Skills
- Recommendation
- AI Summary

Recommendations include:

- Highly Recommended
- Recommended
- Consider
- Not Suitable

---

# Application Workflow

```text
Recruiter

↓

Create Job

↓

Upload Resume

↓

Resume Parsing

↓

Candidate Creation

↓

Application Creation

↓

AI Screening

↓

Candidate Ranking

↓

Shortlist

↓

Assign Hiring Manager

↓

Interview Feedback

↓

Hire / Reject
```

---

# Analytics

Separate dashboards for each role.

## Super Admin

- Total Admins
- Total Recruiters
- Total Hiring Managers
- Total Jobs
- Total Candidates
- Total Applications

## Admin

- Active Jobs
- Recruiters
- Hiring Managers
- Hiring Pipeline

## Recruiter

- My Jobs
- Applications
- Screening
- Shortlisted
- Interview
- Hired
- Rejected

## Hiring Manager

- Assigned Applications
- Screening
- Shortlisted
- Interview
- Hired
- Rejected

---

# Search, Filter & Pagination

Supported across multiple resources.

Examples:

```http
GET /jobs?search=react

GET /jobs?page=2&limit=10

GET /jobs?status=open

GET /jobs?sort=-createdAt
```

---

# Tech Stack

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

## Authentication

- JWT
- bcrypt

## File Upload

- Multer
- Cloudinary

## Resume Parsing

- pdf-parse
- Mammoth

## Utilities

- Streamifier
- dotenv
- cookie-parser
- cors

---

# Project Structure

```text
server
│
├── src
│   ├── config
│   ├── constants
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── utils
│   ├── app.js
│   └── index.js
│
├── .env.example
├── package.json
└── README.md
```

---

# API Modules

## Authentication

- Login
- Logout
- Refresh Token
- Current User

## Users

- Admin Management
- Recruiter Management
- Hiring Manager Management

## Jobs

- CRUD Operations
- Status Management

## Candidates

- CRUD Operations

## Applications

- Create Application
- AI Screening
- Candidate Ranking
- Status Updates
- Assign Hiring Manager
- Interview Feedback
- Final Hiring Decision

## Analytics

- Super Admin Dashboard
- Admin Dashboard
- Recruiter Dashboard
- Hiring Manager Dashboard

---

# Installation

Clone the repository.

```bash
git clone https://github.com/your-username/HireSense-AI.git
```

Navigate to the backend.

```bash
cd server
```

Install dependencies.

```bash
npm install
```

Create a `.env` file using `.env.example`.

Start the development server.

```bash
npm run dev
```

---

# Environment Variables

Create a `.env` file in the project root.

Required variables:

```env
PORT=

NODE_ENV=

MONGODB_URI=

ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=

REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

# AI Screening Process

```text
Resume

↓

Extract Text

↓

Parse Resume

↓

Create Candidate

↓

Compare with Job Description

↓

Skills Score

↓

Experience Score

↓

Education Score

↓

Projects Score

↓

Certification Score

↓

Keyword Score

↓

Weighted AI Score

↓

Recommendation

↓

Candidate Ranking
```

---

# User Role Hierarchy

```text
Super Admin
      │
      ▼
Admin
      │
      ▼
Recruiter
      │
      ▼
Hiring Manager
```

---

# Current Status

Backend development is complete for the core ATS workflow.

Implemented modules include:

- Authentication & Authorization
- User Management
- Job Management
- Candidate Management
- Resume Upload & Parsing
- AI Resume Screening
- Candidate Ranking
- Application Management
- Hiring Workflow
- Search, Filter & Pagination
- Analytics Dashboards

---

# Future Enhancements

- OpenAI Semantic Resume Matching
- AI Interview Question Generation
- Resume Improvement Suggestions
- Email Notifications
- Calendar Integration
- Docker Deployment
- API Documentation (Swagger)
- CI/CD Pipeline

---

# Author

**Naga Venkata Mahidhar Babu Boppana**

MERN Stack Developer

GitHub: https://github.com/MahidharBoppana
