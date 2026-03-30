// frontend/utils/api.ts
export async function fetchCampaign(content: string, tone: string) {
  const res = await fetch("http://localhost:5000/api/workflow/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, tone }),
  });

  if (!res.ok) throw new Error("Failed to fetch campaign");

  return res.json(); // { factSheet, finalContent, logs }
}