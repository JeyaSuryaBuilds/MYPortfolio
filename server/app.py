import os
import re
import smtplib
import time
from collections import defaultdict
from email.message import EmailMessage

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from knowledge import KNOWLEDGE


# =========================================================
# CONFIGURATION
# =========================================================

load_dotenv()

app = Flask(__name__)

app.config["MAX_CONTENT_LENGTH"] = 32 * 1024

FRONTEND_URL = os.getenv("FRONTEND_URL", "*")

if FRONTEND_URL == "*":
    CORS(app)
else:
    CORS(
        app,
        origins=[
            origin.strip()
            for origin in FRONTEND_URL.split(",")
            if origin.strip()
        ]
    )


# =========================================================
# RATE LIMITING
# =========================================================

_hits = defaultdict(list)

CHAT_LIMIT = 20
CONTACT_LIMIT = 5
RATE_WINDOW = 60


def client_ip():
    return request.headers.get(
        "X-Forwarded-For",
        request.remote_addr or "unknown"
    ).split(",")[0].strip()


def rate_limited(limit, window=RATE_WINDOW):
    ip = client_ip()
    now = time.time()

    _hits[ip] = [
        timestamp
        for timestamp in _hits[ip]
        if now - timestamp < window
    ]

    if len(_hits[ip]) >= limit:
        return True

    _hits[ip].append(now)
    return False


def error(message, status=400):
    return jsonify({
        "success": False,
        "error": message
    }), status


# =========================================================
# KNOWLEDGE BASE PROCESSING
# =========================================================

SECTION_PATTERN = re.compile(
    r"(?m)^(IDENTITY|EDUCATION|SKILLS|PROJECTS|"
    r"INTERNSHIPS|TRAINING AND PROFESSIONAL DEVELOPMENT|"
    r"CERTIFICATIONS|CONTACT INFORMATION|RESUME|"
    r"PORTFOLIO NAVIGATION|PROFESSIONAL INTERESTS)\s*$"
)


def get_sections():
    """
    Split KNOWLEDGE into its main sections.
    """

    matches = list(SECTION_PATTERN.finditer(KNOWLEDGE))

    sections = {}

    for index, match in enumerate(matches):

        section_name = match.group(1)

        start = match.end()

        if index + 1 < len(matches):
            end = matches[index + 1].start()
        else:
            end = len(KNOWLEDGE)

        content = KNOWLEDGE[start:end].strip()

        sections[section_name] = content

    return sections


SECTIONS = get_sections()


# =========================================================
# TEXT NORMALIZATION
# =========================================================

def normalize(text):
    text = text.lower().strip()

    text = text.replace("e commerce", "e-commerce")
    text = text.replace("ecommerce", "e-commerce")
    text = text.replace("syra", "syra ai")

    text = re.sub(r"[^\w\s-]", " ", text)

    text = re.sub(r"\s+", " ", text)

    return text


# =========================================================
# PROJECT DETECTION
# =========================================================

PROJECTS = {
    "syra ai": [
        "syra ai",
        "syra"
    ],

    "fleetpulse": [
        "fleetpulse",
        "fleet pulse"
    ],

    "sethu farm": [
        "sethu farm",
        "sethufarm"
    ],

    "smart expense tracker": [
        "smart expense tracker",
        "expense tracker"
    ],

    "e-commerce website": [
        "e-commerce",
        "ecommerce website",
        "shopping website",
        "online shopping"
    ]
}


def detect_project(query):

    normalized_query = normalize(query)

    for project_name, keywords in PROJECTS.items():

        for keyword in keywords:

            if keyword in normalized_query:
                return project_name

    return None


def get_project_information(project_name):
    """
    Return only the requested project's information.
    """

    projects_section = SECTIONS.get("PROJECTS", "")

    if not projects_section:
        return None

    lines = projects_section.splitlines()

    project_blocks = []
    current_block = []

    for line in lines:

        if re.match(r"^\s*\d+\.\s+", line):

            if current_block:
                project_blocks.append(
                    "\n".join(current_block).strip()
                )

            current_block = [line]

        else:

            if current_block:
                current_block.append(line)

    if current_block:
        project_blocks.append(
            "\n".join(current_block).strip()
        )

    for block in project_blocks:

        normalized_block = normalize(block)

        if project_name in normalized_block:

            return block

        if (
            project_name == "e-commerce website"
            and "e-commerce" in normalized_block
        ):
            return block

    return None


# =========================================================
# INTENT DETECTION
# =========================================================

INTENTS = {

    "IDENTITY": [
        "who are you",
        "who is jeya surya",
        "who is surya",
        "about yourself",
        "tell me about yourself",
        "introduce yourself",
        "your introduction",
        "your name",
        "your background",
        "surya introduction",
        "உன்னை பற்றி",
        "உங்களை பற்றி",
        "யார் நீ"
    ],

    "EDUCATION": [
        "education",
        "educational qualification",
        "qualification",
        "degree",
        "college",
        "university",
        "cgpa",
        "graduation",
        "graduate",
        "studied",
        "study",
        "படிப்பு",
        "கல்லூரி",
        "கல்வி"
    ],

    "SKILLS": [
        "skills",
        "skill",
        "technical skills",
        "programming languages",
        "technologies",
        "technology",
        "what can you do",
        "python",
        "java",
        "react",
        "flask",
        "fastapi",
        "database",
        "programming",
        "திறமைகள்",
        "தெரிந்த மொழிகள்"
    ],

    "PROJECTS": [
        "projects",
        "project",
        "your projects",
        "portfolio projects",
        "developed applications",
        "applications you developed",
        "what have you developed",
        "your work",
        "உன்னுடைய project",
        "உங்கள் project",
        "திட்டங்கள்"
    ],

    "INTERNSHIPS": [
        "internship",
        "internships",
        "intern",
        "work experience",
        "professional experience",
        "company experience",
        "experience",
        "வேலை அனுபவம்",
        "பயிற்சி அனுபவம்"
    ],

    "TRAINING AND PROFESSIONAL DEVELOPMENT": [
        "training",
        "trainings",
        "anudip",
        "advanced java",
        "java full stack training",
        "professional development",
        "பயிற்சி"
    ],

    "CERTIFICATIONS": [
        "certification",
        "certifications",
        "certificate",
        "certificates",
        "certified",
        "சான்றிதழ்"
    ],

    "CONTACT INFORMATION": [
        "contact",
        "contact details",
        "email",
        "email address",
        "phone",
        "phone number",
        "mobile number",
        "whatsapp",
        "linkedin",
        "github",
        "how to reach",
        "reach you",
        "உன் email",
        "தொடர்பு"
    ],

    "RESUME": [
        "resume",
        "cv",
        "download resume",
        "your resume",
        "view resume",
        "ரெஸ்யூம்"
    ],

    "PORTFOLIO NAVIGATION": [
        "portfolio sections",
        "portfolio navigation",
        "website sections",
        "what sections",
        "portfolio website"
    ],

    "PROFESSIONAL INTERESTS": [
        "professional interests",
        "career interests",
        "career goals",
        "interested in",
        "career objective",
        "future goals"
    ]
}


# =========================================================
# INTENT MATCHING
# =========================================================

def detect_intent(query):

    normalized_query = normalize(query)

    # Project names get priority.
    project = detect_project(normalized_query)

    if project:
        return "PROJECT:" + project

    # Questions specifically about projects.
    project_words = [
        "project",
        "projects",
        "developed",
        "application",
        "applications",
        "உருவாக்கிய"
    ]

    if any(word in normalized_query for word in project_words):

        # If a project question also mentions a technology,
        # prioritize PROJECTS instead of SKILLS.
        return "PROJECTS"

    # Match other categories.
    for intent, keywords in INTENTS.items():

        for keyword in keywords:

            if keyword in normalized_query:
                return intent

    return None


# =========================================================
# RESPONSE GENERATION
# =========================================================

def format_identity():

    identity = SECTIONS.get("IDENTITY", "")

    if not identity:
        return None

    lines = [
        line.strip()
        for line in identity.splitlines()
        if line.strip()
    ]

    return "\n".join(lines)


def search_knowledge(query):

    normalized_query = normalize(query)

    # Empty question
    if not normalized_query:
        return "Please enter a question."


    # Greetings
    greetings = [
        "hi",
        "hello",
        "hey",
        "good morning",
        "good afternoon",
        "good evening",
        "vanakkam",
        "வணக்கம்"
    ]

    if normalized_query in greetings:

        return (
            "Hello! I'm SURYA AI. "
            "I can help you learn about Jeya Surya's "
            "education, skills, projects, internships, "
            "certifications and contact information."
        )


    # Detect requested category
    intent = detect_intent(normalized_query)


    if not intent:

        return (
            "I don't have verified information about that "
            "at the moment. You can ask me about education, "
            "skills, projects, internships, training, "
            "certifications or contact details."
        )


    # Specific project information
    if intent.startswith("PROJECT:"):

        project_name = intent.replace("PROJECT:", "")

        result = get_project_information(project_name)

        if result:
            return result

        return "I couldn't find verified information about that project."


    # Identity
    if intent == "IDENTITY":

        result = format_identity()

        return result or "Identity information is not available."


    # Other sections
    result = SECTIONS.get(intent)

    if result:

        return result

    return "I don't have verified information about that at the moment."


# =========================================================
# EXTRACT LATEST USER MESSAGE
# =========================================================

def get_latest_user_message(data):

    if not isinstance(data, dict):
        return ""

    # Support simple message format
    if isinstance(data.get("message"), str):
        return data["message"].strip()

    # Support messages array
    messages = data.get("messages", [])

    if isinstance(messages, list):

        for message in reversed(messages):

            if not isinstance(message, dict):
                continue

            if message.get("role") == "user":

                # Your frontend uses "text"
                content = message.get("text", "")

                # Also support "content"
                if not content:
                    content = message.get("content", "")

                if isinstance(content, str):
                    return content.strip()

    return ""


# =========================================================
# HEALTH CHECK
# =========================================================

@app.route("/api/health", methods=["GET"])
def health():

    return jsonify({
        "success": True,
        "status": "online",
        "assistant": "SURYA AI",
        "mode": "local-knowledge",
        "knowledge_loaded": bool(KNOWLEDGE)
    })


# =========================================================
# CHAT API
# =========================================================

@app.route("/api/chat", methods=["POST"])
def chat():

    if rate_limited(CHAT_LIMIT):
        return error(
            "Too many requests. Please try again later.",
            429
        )

    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return error("Invalid request body.")

    user_message = get_latest_user_message(data)

    if not user_message:
        return error("Please enter a message.")

    if len(user_message) > 2000:
        return error("Message is too long.", 413)

    try:

        reply = search_knowledge(user_message)

        return jsonify({
            "success": True,
            "reply": reply
        })

    except Exception as exception:

        app.logger.exception(
            "Local knowledge response error: %s",
            exception
        )

        return error(
            "SURYA AI encountered an internal error.",
            500
        )


# =========================================================
# CONTACT FORM EMAIL CONFIGURATION
# =========================================================

SMTP_HOST = (
    os.getenv("SMTP_HOST")
    or os.getenv("MAIL_SERVER")
    or "smtp.gmail.com"
)

SMTP_PORT = int(
    os.getenv("SMTP_PORT")
    or os.getenv("MAIL_PORT")
    or "587"
)

SMTP_USER = (
    os.getenv("SMTP_USER")
    or os.getenv("MAIL_USERNAME")
    or ""
)

SMTP_PASSWORD = (
    os.getenv("SMTP_PASSWORD")
    or os.getenv("MAIL_PASSWORD")
    or ""
)

CONTACT_RECEIVER = (
    os.getenv("CONTACT_RECEIVER")
    or os.getenv("CONTACT_EMAIL")
    or SMTP_USER
)


# =========================================================
# CONTACT FORM API
# =========================================================

@app.route("/api/contact", methods=["POST"])
def contact():

    if rate_limited(CONTACT_LIMIT):
        return error(
            "Too many contact requests. Please try again later.",
            429
        )

    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return error("Invalid request body.")

    # Honeypot field
    if data.get("website"):
        return jsonify({
            "success": True,
            "message": "Message submitted successfully."
        })

    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip()
    subject = str(data.get("subject", "")).strip()
    message = str(data.get("message", "")).strip()

    # Required field validation
    if not name or not email or not message:
        return error(
            "Name, email and message are required."
        )

    if len(name) > 100:
        return error("Name is too long.")

    if len(email) > 254:
        return error("Email address is too long.")

    if len(subject) > 200:
        return error("Subject is too long.")

    if len(message) > 5000:
        return error("Message is too long.")

    # Email validation
    email_pattern = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"

    if not re.match(email_pattern, email):
        return error("Please enter a valid email address.")

    # SMTP configuration validation
    if not SMTP_USER or not SMTP_PASSWORD or not CONTACT_RECEIVER:

        app.logger.error(
            "Contact form SMTP configuration is missing."
        )

        return error(
            "Contact form email service is not configured.",
            503
        )

    try:

        email_message = EmailMessage()

        email_message["Subject"] = (
            subject if subject else "New Portfolio Contact Message"
        )

        email_message["From"] = SMTP_USER

        email_message["To"] = CONTACT_RECEIVER

        email_message["Reply-To"] = email

        email_message.set_content(
            f"""
New message received from your portfolio website.

Name: {name}

Email: {email}

Subject: {subject}

Message:
{message}
"""
        )

        with smtplib.SMTP(
            SMTP_HOST,
            SMTP_PORT,
            timeout=15
        ) as server:

            server.starttls()

            server.login(
                SMTP_USER,
                SMTP_PASSWORD
            )

            server.send_message(email_message)

        return jsonify({
            "success": True,
            "message": "Your message has been sent successfully."
        })

    except Exception as exception:

        app.logger.exception(
            "Contact form email error: %s",
            exception
        )

        return error(
            "Unable to send your message right now. Please try again later.",
            500
        )


# =========================================================
# ERROR HANDLERS
# =========================================================

@app.errorhandler(413)
def request_too_large(error_exception):

    return error(
        "Request payload is too large.",
        413
    )


@app.errorhandler(404)
def not_found(error_exception):

    return error(
        "API endpoint not found.",
        404
    )


@app.errorhandler(500)
def internal_server_error(error_exception):

    return error(
        "Internal server error.",
        500
    )


# =========================================================
# START SERVER
# =========================================================

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=int(os.getenv("PORT", 5000)),
        debug=os.getenv("FLASK_DEBUG", "false").lower() == "true"
    )