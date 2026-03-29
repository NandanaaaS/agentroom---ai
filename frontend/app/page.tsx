"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [content, setContent] = useState("");
  const [tone, setTone] = useState("professional");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5000/api/workflow/start", {
        content,
        tone,
      });

      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Error generating content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>AI Content Generator 🚀</h1>

      <textarea
        placeholder="Enter product or idea..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ width: "100%", height: "100px", marginTop: "20px" }}
      />

      <select
        value={tone}
        onChange={(e) => setTone(e.target.value)}
        style={{ marginTop: "10px" }}
      >
        <option value="professional">Professional</option>
        <option value="casual">Casual</option>
        <option value="funny">Funny</option>
      </select>

      <br />

      <button
        onClick={handleGenerate}
        style={{ marginTop: "20px", padding: "10px 20px" }}
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      {result && (
        <div style={{ marginTop: "40px" }}>
          <h2>Output</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {result.finalContent}
          </pre>
        </div>
      )}
    </div>
  );
}