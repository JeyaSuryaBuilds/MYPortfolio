# Jeyasurya B. Portfolio

React + Vite frontend (GSAP, Framer Motion, Lenis, React Three Fiber) with a small Flask backend for the SURYA AI chat (Gemini) and the contact form (SMTP).

## Run locally

Two terminals.

**Frontend**
```bash
npm install
npm run dev          # http://localhost:5173 (proxies /api to Flask)
```

**Backend**
```bash
cd server
python -m venv venv
venv\Scripts\activate          # Windows   (macOS/Linux: source venv/bin/activate)
pip install -r requirements.txt
copy .env.example .env         # macOS/Linux: cp .env.example .env  then fill in the values
python app.py                  # http://127.0.0.1:5000
```

## Production build
```bash
npm run build && npm run preview
```
Deploy the frontend (for example Vercel) and the backend (for example Render, start command `gunicorn app:app`).
Set `VITE_API_URL` to the backend URL and `ALLOWED_ORIGINS` on the backend to the frontend URL.

## Where to edit content
Everything lives in `src/data/portfolio.js`: project links and screenshots, certificates, skills, contact details.
Drop files in `public/assets/projects`, `public/assets/certificates` and `public/assets/resume`.
To replace the resume, overwrite `public/assets/resume/Jeya_Surya_Resume.pdf`.
Hero background: layered images in `public/assets/images/` (`hero-bg-back.webp`, `hero-subject.webp` and the `-sm` mobile versions). The subject is your portrait cut out with an alpha mask; replace the files, keeping the names, to change it.

## Environment variables
Frontend (`.env`): `VITE_API_URL`.
Backend (`server/.env`): `GEMINI_API_KEY`, `GEMINI_MODEL`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO`, `ALLOWED_ORIGINS`.