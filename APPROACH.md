# 📄 Approach Document

## 🧠 Solution Design

The system is designed as a multi-agent pipeline that transforms raw product input into a structured marketing campaign.

The workflow consists of three main agents:

1. **Research Agent**

   * Extracts structured information from input
   * Generates a factsheet including features, audience, and value proposition

2. **Writer Agent**

   * Uses the factsheet to generate:

     * Blog content
     * Social media posts
     * Email campaign

3. **Editor Agent**

   * Refines and finalizes the generated content
   * Ensures consistency and quality

The frontend visualizes this pipeline using an **Agent Room** and **real-time logs**, allowing users to understand the system flow.

---

## 🛠 Tech Stack Decisions

* **Next.js + React**

  * Enables fast UI development and component-based structure

* **Tailwind CSS**

  * Used for rapid styling and responsive design

* **Node.js + Express**

  * Handles backend logic and API routing

* **OpenRouter API**

  * Used for LLM-based content generation

* **Streaming + Logs**

  * Provides real-time feedback for better user experience

---

## ⚙️ Key Features

* Multi-agent pipeline (Researcher → Writer → Editor)
* Structured factsheet generation
* Blog, Social, and Email content creation
* Section-wise regeneration
* Human-in-the-loop approval system
* Real-time execution logs
* Responsive preview (mobile/desktop)
* Support for file uploads and text input

---

## 🔮 Future Improvements

With more time, the following improvements can be implemented:

* More advanced agent coordination and parallel processing
* Better prompt engineering and output consistency
* User authentication and saved campaigns
* Deployment with scalable backend infrastructure
* Enhanced UI animations and agent visualization
* Integration with external platforms (e.g., social media schedulers)

---

## 🏁 Conclusion

This project demonstrates how multi-agent AI systems can automate complex content generation workflows while maintaining user control and transparency.
