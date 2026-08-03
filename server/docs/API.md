# HireSense AI Backend API Documentation

## Base URL

```text
http://localhost:5000/api/v1
```

---

# Authentication

## Login

**POST** `/auth/login`

### Request Body

```json
{
  "email": "superadmin@hiresense.ai",
  "password": "Password@123"
}
```

### Response

```json
{
  "statusCode": 200,
  "data": {
    "user": {},
    "accessToken": "",
    "refreshToken": ""
  },
  "message": "Login successful"
}
```

---

## Logout

**POST** `/auth/logout`

### Headers

```text
Authorization: Bearer <access_token>
```

---

## Refresh Token

**POST** `/auth/refresh-token`

### Headers

```text
Cookie: refreshToken=<refresh_token>
```

---

## Current User

**GET** `/auth/me`

### Headers

```text
Authorization: Bearer <access_token>
```

---

# Super Admin APIs

---

## Dashboard

**GET** `/analytics/super-admin`

Role: **Super Admin**

---

## Create Admin

**POST** `/users/admins`

Role: **Super Admin**

### Body

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "admin@hiresense.ai",
  "password": "Password@123"
}
```

---

## Get All Admins

**GET** `/users/admins`

Role: **Super Admin**

---

## Get Admin

**GET** `/users/admins/:id`

Role: **Super Admin**

---

## Update Admin

**PATCH** `/users/admins/:id`

Role: **Super Admin**

---

## Update Admin Status

**PATCH** `/users/admins/:id/status`

### Body

```json
{
  "isActive": true
}
```

---

## Delete Admin

**DELETE** `/users/admins/:id`

---

# Admin APIs

---

## Dashboard

**GET** `/analytics/admin`

Role: **Admin**

---

## Create Recruiter

**POST** `/users/recruiters`

Role: **Admin**

### Body

```json
{
  "firstName": "Alice",
  "lastName": "Smith",
  "email": "recruiter@hiresense.ai",
  "password": "Password@123"
}
```

---

## Get Recruiters

**GET** `/users/recruiters`

---

## Get Recruiter

**GET** `/users/recruiters/:id`

---

## Update Recruiter

**PATCH** `/users/recruiters/:id`

---

## Update Recruiter Status

**PATCH** `/users/recruiters/:id/status`

---

## Delete Recruiter

**DELETE** `/users/recruiters/:id`

---

## Create Hiring Manager

**POST** `/users/hiring-managers`

### Body

```json
{
  "firstName": "David",
  "lastName": "Wilson",
  "email": "manager@hiresense.ai",
  "password": "Password@123"
}
```

---

## Get Hiring Managers

**GET** `/users/hiring-managers`

---

## Get Hiring Manager

**GET** `/users/hiring-managers/:id`

---

## Update Hiring Manager

**PATCH** `/users/hiring-managers/:id`

---

## Update Hiring Manager Status

**PATCH** `/users/hiring-managers/:id/status`

---

## Delete Hiring Manager

**DELETE** `/users/hiring-managers/:id`

---

# Recruiter APIs

---

## Dashboard

**GET** `/analytics/recruiter`

---

## Create Job

**POST** `/jobs`

### Body

```json
{
  "title": "Backend Developer",
  "company": "HireSense AI",
  "department": "Engineering",
  "description": "Hiring Backend Developers",
  "requiredSkills": ["Node.js", "Express", "MongoDB"],
  "preferredSkills": ["Docker", "AWS"],
  "preferredEducation": ["B.Tech", "MCA"],
  "keywords": ["REST", "JWT", "Docker"],
  "experience": {
    "min": 2,
    "max": 5
  },
  "salary": {
    "min": 600000,
    "max": 1200000,
    "currency": "INR"
  },
  "location": "Remote",
  "employmentType": "full_time"
}
```

---

## Get Jobs

**GET** `/jobs`

Supports:

```text
?page=1
&limit=10
&search=node
&status=open
&sort=-createdAt
```

---

## Get Job

**GET** `/jobs/:id`

---

## Update Job

**PATCH** `/jobs/:id`

---

## Update Job Status

**PATCH** `/jobs/:id/status`

### Body

```json
{
  "status": "closed"
}
```

---

## Delete Job

**DELETE** `/jobs/:id`

---

# Resume APIs

---

## Upload Resume

**POST**

```text
/resumes/upload/:jobId
```

Content-Type:

```text
multipart/form-data
```

Form Data

| Key    | Type |
| ------ | ---- |
| resume | File |

Supported Formats

- PDF
- DOCX

---

# Candidate APIs

---

## Get Candidates

**GET** `/candidates`

Supports

```text
?page=1
&limit=10
&search=react
&sort=-createdAt
```

---

## Get Candidate

**GET** `/candidates/:id`

---

## Update Candidate

**PATCH** `/candidates/:id`

---

## Delete Candidate

**DELETE** `/candidates/:id`

---

# Application APIs

---

## Get Applications by Job

**GET**

```text
/applications/job/:jobId
```

Supports

```text
?page=1
&limit=10
&status=shortlisted
&sort=-aiScore
```

---

## Get Application

**GET**

```text
/applications/:id
```

---

## Update Status

**PATCH**

```text
/applications/:id/status
```

### Body

```json
{
  "status": "shortlisted"
}
```

Allowed Status

- screening
- shortlisted
- interview
- hired
- rejected

---

## Assign Hiring Manager

**PATCH**

```text
/applications/:id/assign
```

### Body

```json
{
  "hiringManagerId": "USER_ID"
}
```

---

## Assigned Applications

**GET**

```text
/applications/assigned
```

Role

Hiring Manager

---

## Assigned Application Details

**GET**

```text
/applications/assigned/:id
```

---

## Add Interview Feedback

**PATCH**

```text
/applications/:id/interview-notes
```

### Body

```json
{
  "interviewNotes": "Excellent communication and backend skills.",
  "interviewRating": 5,
  "interviewRecommendation": "hire"
}
```

---

## Final Hiring Decision

**PATCH**

```text
/applications/:id/final-decision
```

### Body

```json
{
  "status": "hired"
}
```

or

```json
{
  "status": "rejected"
}
```

---

# Hiring Manager APIs

---

## Dashboard

**GET**

```text
/analytics/hiring-manager
```

---

# AI Scoring

The AI engine evaluates candidates using weighted scoring.

| Category       | Weight |
| -------------- | -----: |
| Skills         |    40% |
| Experience     |    25% |
| Education      |    10% |
| Projects       |    10% |
| Certifications |    10% |
| Keywords       |     5% |

The system returns:

- AI Score
- Matched Skills
- Missing Skills
- Recommendation
- AI Summary

---

# Authorization Matrix

| Module                 | Super Admin | Admin | Recruiter | Hiring Manager |
| ---------------------- | :---------: | :---: | :-------: | :------------: |
| Manage Admins          |     ✅      |  ❌   |    ❌     |       ❌       |
| Manage Recruiters      |     ❌      |  ✅   |    ❌     |       ❌       |
| Manage Hiring Managers |     ❌      |  ✅   |    ❌     |       ❌       |
| Create Jobs            |     ❌      |  ❌   |    ✅     |       ❌       |
| Upload Resume          |     ❌      |  ❌   |    ✅     |       ❌       |
| AI Screening           |     ❌      |  ❌   |    ✅     |       ❌       |
| Assign Hiring Manager  |     ❌      |  ❌   |    ✅     |       ❌       |
| Interview Feedback     |     ❌      |  ❌   |    ❌     |       ✅       |
| Final Decision         |     ❌      |  ❌   |    ❌     |       ✅       |
| Analytics              |     ✅      |  ✅   |    ✅     |       ✅       |

---

# HTTP Status Codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | Success               |
| 201  | Resource Created      |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 409  | Conflict              |
| 500  | Internal Server Error |

---

# Notes

- All protected endpoints require a valid JWT access token.
- Role-based authorization is enforced on all protected routes.
- Resume uploads support **PDF** and **DOCX** formats.
- Pagination, searching, filtering, and sorting are available on supported list endpoints.
- AI scores are calculated using the weighted rule-based engine implemented in the backend.
