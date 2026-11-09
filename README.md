## Local setup and tests

Use Python 3.10 or newer. From the project folder, create and activate a virtual environment, install dependencies, and copy the example environment file:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
```

Start the application locally with:

```powershell
python app.py
```

Open `http://127.0.0.1:5000`. The app uses `sqlite:///jobportal.db` by default; set `DATABASE_URL` to another SQLite URI if you need a separate local database. Other database engines have not been verified. Himalayas and Gemini API keys are optional; their related external-feed and AI features need their respective keys.

Run the automated application tests with:

```powershell
python -m unittest discover -s tests -v
```

Tests use an in-memory SQLite database and do not modify the local application database.

## Features

## Himalayas Jobs API

The jobs page uses the official Himalayas API. A key is optional; when configured, it is sent as a Bearer token to receive the account's higher rate limits.

1. Copy `.env.example` to `.env`.
2. Set `HIMALAYAS_API_KEY` in `.env` to your newly generated key.
3. Restart Flask and open `/jobs`.

Keep `.env` private. The API feed returns up to 20 jobs per request; use the page controls to browse the cursor-based feed or search results. Himalayas listings open their provided application link. Job seekers can save listings and manually track external applications from Saved Jobs.

## AI job assistant

All application pages, including the landing page, include the same multilingual AI assistant. It can help with Job Portal navigation on every page and recommend matches from listings shown on the jobs page. Create a Gemini API key in [Google AI Studio](https://aistudio.google.com/apikey), set `GEMINI_API_KEY` in the private `.env` file, and restart Flask. The key stays on the server. When someone sends a chat message, that message and, on the jobs page, the current job details are sent to Google Gemini; do not enter sensitive personal information in the chat.

Employers can create an employer account from the home-page hiring link or sign in to an existing employer account. After signing in, they complete a company profile with the company name, their position at the company, location, employee count, industry, logo, and company photo before posting jobs. Company photos and profile details are only available to the signed-in employer. A company logo is shown on public job cards while that employer has a posted job; the logo image is served through a separate read-only route, while the private company photo remains accessible only to its owner. Posts are stored locally and shown in the jobs list. Employers can open Manage jobs from their profile menu to review applicant counts and edit their own listings; editing preserves the existing job record and its applications. Candidates see a brief card through the experience level; "Apply on Job" opens the complete role details and an application form. Job-seeker applications and resumes appear on the employer's Candidate Applications page. New applications start with the "Submitted" status. Employers can accept or reject an application and provide a rejection reason; applicants can track application status and feedback from the My Applications link in their profile menu, where they can filter by job title, application date/time, and year. Company logos are also shown alongside applications when available. Status updates are emailed to the candidate when SMTP is configured. Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, and `SMTP_SENDER` in the private `.env` file to send employer application notifications; the recipient is the employer account email. The job-post form's "Use AI to write description" button drafts a description from the employer-provided role details using Gemini; review and edit it before publishing.

## Job applications

Applicants must sign in with a job-seeker account. The application form for locally posted jobs collects a name, email, phone number, resume (PDF, DOC, or DOCX), an optional cover letter, and optional profile and cover images (JPG, PNG, or WebP). When Gemini is configured, applicants can use "Use AI to enhance writing" to draft or improve a cover letter using the job details; review and edit the generated text before submitting. Each applicant can submit one application per listing. Applications to locally posted jobs are saved against the employer's listing and shown in that employer's candidate page, including the candidate's contact details, cover letter, resume download, and any submitted profile and cover images. When SMTP is configured, the employer notification email includes the application details and attaches the resume and any available profile and cover images. Uploaded files are size-limited and stored under the private `instance/application_uploads` directory; they are not served as public static files.

Job seekers can save local and Himalayas jobs from the listing cards. Saved Himalayas jobs also have a manual application tracker with Saved, Applied, Interviewing, Offer, and Rejected statuses. Himalayas does not report application submissions or status updates to Job Portal, so applicants update these statuses themselves.

Applications to locally posted jobs are saved in the local database. To email a submitted application and its attachments to the portal administrator, configure these environment variables in the private `.env` file:

```text
SMTP_HOST=
SMTP_PORT=587
SMTP_USERNAME=
SMTP_PASSWORD=
SMTP_SENDER=
APPLICATIONS_ADMIN_EMAIL=
```

Port 465 uses implicit TLS; other ports use STARTTLS. Himalayas does not provide an application-submission endpoint; its application links open on the job listing site. Applications to locally posted jobs use the employer email notification described above.

On startup, the app adds the application job key to older databases, backfills existing applications, and removes the legacy per-source URL uniqueness rule so a candidate can apply to multiple employer jobs that share the same application URL.

Applicant contact details, resume, profile image, and cover image are also saved to the applicant's account after an application. They are prefilled and reused for later applications; applicants can choose to keep the saved resume or upload a replacement. Profile images are served only to the signed-in account owner.

## Admin dashboard

Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in the private `.env` file to provision the administrator account on startup. The configured admin email is created as an admin account if it does not exist; its password is synchronized from the environment setting on startup. Admin accounts cannot be created through public registration. Sign in with the configured credentials to open `/admin`, which summarizes registered job seekers and employers, total applications, and employer-posted jobs with company and per-job application counts.
