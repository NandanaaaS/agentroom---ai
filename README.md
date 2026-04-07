# AgentRoom AI
#  Autonomous Content Generation System

## 🧩 The Problem

Creating high-quality marketing content from technical documents or product descriptions is time-consuming and involves multiple steps such as research, writing, and editing. This process is repetitive and inefficient for users who need quick, consistent outputs.

## 💡 The Solution

This project simulates an **autonomous multi-agent content generation system** that transforms raw product input into a complete marketing campaign.

It uses a pipeline of AI agents:

* 🔍 **Research Agent** – extracts structured insights
* ✍️ **Writer Agent** – generates content
* 🧠 **Editor Agent** – refines and finalizes output

Users can:

* View real-time agent activity (Agent Room)
* Generate Blog, Social Media posts, and Email content
* Regenerate individual sections
* Approve finalized content
* Preview content in mobile and desktop views

---

## 🛠 Tech Stack

### Languages

* TypeScript
* JavaScript

### Frontend

* Next.js (React)
* Tailwind CSS

### Backend

* Node.js
* Express

### AI / APIs

* OpenRouter API (LLM inference)

### Libraries / Tools

* react-markdown
* Streaming (ReadableStream)

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/NandanaaaS/agentroom---ai.git
cd agentroom---ai
```

### 2️⃣ Install Dependencies

#### Frontend

```bash
cd frontend
npm install
```

#### Backend

```bash
cd backend
npm install
```

---

## 🔐 Environment Variables

This project uses API keys which are not included in the repository for security reasons.

To run the project locally, create the following files:

### Backend (`backend/.env`)

```
BACKEND_API_KEY=your_backend_key
OPENROUTER_API_KEY=your_openrouter_key
```

### Frontend (`frontend/.env.local`)

```
NEXT_PUBLIC_BACKEND_API_KEY=your_backend_key
```

⚠️ Note: API keys are required to run the full pipeline. Without them, the UI will load but content generation will not work.

---

### 3️⃣ Run the Application

#### Start Backend

```bash
cd backend
npm run dev
```

#### Start Frontend

```bash
cd frontend
npm run dev
```

---

### 4️⃣ Open in Browser

```
http://localhost:3000
```

---

## ✨ Features

* 📄 Upload or enter product description
* 🤖 Multi-agent pipeline (Researcher → Writer → Editor)
* 🧠 Real-time Agent Room visualization
* 📊 Live logs showing execution steps
* 📝 Blog, Social Media, and Email generation
* 🔄 Regenerate individual sections
* ✅ Approve content workflow
* 📱 Mobile/Desktop preview toggle
* 📥 Copy & Download generated content

---

## 🎥 Demo

https://drive.google.com/file/d/1rxhqPuvsDOvERlR36SZ9lML1g-dmCmGW/view?usp=drive_link

---

## 🌐 Live Demo (Optional)

(Add your deployed link here)

---

## Conclusion

This project demonstrates a complete **end-to-end autonomous content generation pipeline**, combining AI agents, real-time UI updates, and human-in-the-loop review to streamline marketing content creation.
