// frontend/app/api/workflow/start-stream/route.ts

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:5000";
    const API_KEY = process.env.BACKEND_API_KEY;

    const backendRes = await fetch(`${BACKEND_URL}/api/workflow/start-stream`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
      body: formData,
    });

    if (!backendRes.body) {
      return new Response("No stream", { status: 500 });
    }

    // 🔥 STREAM PASSTHROUGH
    return new Response(backendRes.body, {
      headers: {
        "Content-Type": "text/event-stream",
      },
    });
  } catch (err: any) {
    console.error("Proxy Crash:", err.message);
    return new Response(err.message, { status: 500 });
  }
}