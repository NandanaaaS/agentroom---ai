import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";
    const API_KEY = process.env.BACKEND_API_KEY;

    const backendRes = await fetch(`${BACKEND_URL}/api/workflow/start`, {
      method: "POST",
      headers: {
        // We only set the Auth header. 
        // DO NOT set 'Content-Type'; fetch sets the multipart boundary automatically.
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: formData,
    });

    const contentType = backendRes.headers.get("content-type");

    // If backend failed or didn't send JSON, get the text to see the error
    if (!backendRes.ok || !contentType || !contentType.includes("application/json")) {
      const errorText = await backendRes.text();
      console.error("Backend Error:", errorText);
      return NextResponse.json({ error: "Backend failed. Check Node console." }, { status: backendRes.status });
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Proxy Crash:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}