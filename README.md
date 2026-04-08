# 🚀 AgentRoom AI  
### Autonomous Multi-Agent Content Generation System

---

## 🧩 The Problem

Creating high-quality marketing content from technical documents or product descriptions is time-consuming and involves multiple steps such as research, writing, and editing. This process is repetitive and inefficient for users who need quick, consistent outputs.

---

## 💡 The Solution

AgentRoom AI simulates an autonomous multi-agent content generation system that transforms raw product input into a complete marketing campaign.

It uses a pipeline of AI agents:

- 🔍 Research Agent – extracts structured insights (factsheet)
- ✍️ Writer Agent – generates content (Blog, Social, Email)
- 🧠 Editor Agent – refines and finalizes output

Users can:

- View real-time agent activity (Agent Room)
- Generate Blog, Social Media posts, and Email content
- Regenerate individual sections
- Approve finalized content
- Preview content in mobile and desktop views

---

## 🏗 Architecture

The system follows a client-server architecture:

Frontend (Next.js)  
→ Sends user input (text/file) to backend  

Backend (Express)  
→ Executes multi-agent pipeline:
- Research Agent  
- Writer Agent  
- Editor Agent  

→ Streams logs + final output back to frontend  

All AI processing and API calls are handled securely on the backend.

---

## 🛠 Tech Stack

Languages:
- TypeScript
- JavaScript

Frontend:
- Next.js (React)
- Tailwind CSS

Backend:
- Node.js
- Express

AI / APIs:
- OpenRouter API (LLM inference)
- OCR API (for document/image extraction)

Libraries / Tools:
- react-markdown
- Streaming (ReadableStream)

---

## ⚙️ Setup Instructions

1. Clone the Repository
```
git clone https://github.com/NandanaaaS/agentroom---ai.git  
cd agentroom---ai
 ```


---

2. Install Dependencies

Frontend:
``` 
cd frontend  
npm install  
```
Backend:

cd backend  
npm install  

---

## 🔐 Environment Variables

This project uses API keys which are NOT included in the repository for security reasons.

Backend (backend/.env):

OPENROUTER_API_KEY=your_openrouter_key  
OCR_API_KEY=your_ocr_key  

Frontend (frontend/.env.local):

NEXT_PUBLIC_API_BASE_URL=http://localhost:5000  

Note:
- All sensitive API keys are stored only in the backend  
- The frontend does not expose any secret credentials  

---

3. Run the Application

Start Backend:

cd backend  
node server.js  

Start Frontend:

cd frontend  
npm run dev  

---

4. Open in Browser

http://localhost:3000  

---

## ✨ Features

- Upload or enter product description  
- Multi-agent pipeline (Researcher → Writer → Editor)  
- Real-time Agent Room visualization  
- Live logs showing execution steps  
- Blog, Social Media, and Email generation  
- Regenerate individual sections  
- Approve content workflow  
- Mobile/Desktop preview toggle  
- Copy & Download generated content  

---

## 🔐 Security

- API keys are stored only in backend environment variables  
- No sensitive credentials are exposed to the frontend  
- Frontend communicates with backend via secure endpoints  

---

## 🎥 Demo

https://drive.google.com/file/d/1rxhqPuvsDOvERlR36SZ9lML1g-dmCmGW/view?usp=drive_link  

---

## 🌐 Live Demo

https://agentroom-ai.vercel.app/  

---

## 🏁 Conclusion

This project demonstrates a complete end-to-end autonomous content generation pipeline combining:

- Multi-agent AI architecture  
- Real-time UI updates  
- Human-in-the-loop review  

to streamline and automate marketing content creation.
