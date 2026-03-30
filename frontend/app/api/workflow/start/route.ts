import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Log this to your TERMINAL to see if it's hitting the right URL
    const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";
    const API_KEY = process.env.BACKEND_API_KEY;

    if (!API_KEY) {
      console.error("❌ FRONTEND ERROR: BACKEND_API_KEY is missing in .env.local");
    }

    const backendRes = await fetch(`${BACKEND_URL}/api/workflow/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Ensure there is exactly one space after Bearer
        "Authorization": `Bearer ${API_KEY}`, 
      },
      body: JSON.stringify(body),
    });

    if (!backendRes.ok) {
      const errorText = await backendRes.text();
      // This helps us see exactly what the backend is complaining about
      console.error(`❌ BACKEND REJECTED: ${backendRes.status} - ${errorText}`);
      return NextResponse.json(
        { error: `Backend Error ${backendRes.status}: ${errorText}` },
        { status: backendRes.status }
      );
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}