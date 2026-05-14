import { NextResponse } from "next/server";

const RESEND_API_URL = "https://api.resend.com";
const DEFAULT_WAITLIST_SEGMENT_ID = "c6264c5a-d14c-4363-bfa0-89a85078b2a8";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function parseResendResponse(response: Response) {
  const text = await response.text();

  if (!text) return null;

  try {
    return JSON.parse(text) as { message?: string; name?: string };
  } catch {
    return { message: text };
  }
}

function isAlreadyExistsError(status: number, error: { message?: string; name?: string } | null) {
  const message = `${error?.name ?? ""} ${error?.message ?? ""}`.toLowerCase();

  return status === 409 || message.includes("already") || message.includes("exist");
}

async function resendRequest(path: string, apiKey: string, init: RequestInit = {}) {
  return fetch(`${RESEND_API_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const segmentId = process.env.RESEND_WAITLIST_SEGMENT_ID ?? DEFAULT_WAITLIST_SEGMENT_ID;

  if (!apiKey) {
    return NextResponse.json({ error: "Missing Resend API key." }, { status: 500 });
  }

  let email = "";

  try {
    const body = (await request.json()) as { email?: unknown };
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const createResponse = await resendRequest("/contacts", apiKey, {
    method: "POST",
    body: JSON.stringify({
      email,
      unsubscribed: false,
      segments: [{ id: segmentId }],
    }),
  });

  if (createResponse.ok) {
    return NextResponse.json({ ok: true });
  }

  const createError = await parseResendResponse(createResponse);

  if (isAlreadyExistsError(createResponse.status, createError)) {
    const addSegmentResponse = await resendRequest(
      `/contacts/${encodeURIComponent(email)}/segments/${segmentId}`,
      apiKey,
      { method: "POST" }
    );

    if (addSegmentResponse.ok) {
      return NextResponse.json({ ok: true });
    }

    const addSegmentError = await parseResendResponse(addSegmentResponse);

    if (isAlreadyExistsError(addSegmentResponse.status, addSegmentError)) {
      return NextResponse.json({ ok: true });
    }

    console.error("Failed to add Resend contact to segment", addSegmentError);
    return NextResponse.json({ error: "Could not join waitlist." }, { status: 502 });
  }

  console.error("Failed to create Resend contact", createError);
  return NextResponse.json({ error: "Could not join waitlist." }, { status: 502 });
}
