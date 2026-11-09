import { NextResponse } from "next/server";
import {
  isValidEmail,
  isValidUsername,
  normalizeEmail,
  normalizeUsername,
} from "@/lib/waitlist";

const RESEND_API_URL = "https://api.resend.com";
const DEFAULT_WAITLIST_SEGMENT_ID = "c6264c5a-d14c-4363-bfa0-89a85078b2a8";
// Custom contact property in Resend (Audience → Properties) that holds the username.
const USERNAME_PROPERTY = "username";

const REQUEST_TIMEOUT_MS = 8000;
const MAX_ATTEMPTS = 3;

type ResendError = { message?: string; name?: string } | null;

async function parseResendResponse(response: Response): Promise<ResendError> {
  const text = await response.text();

  if (!text) return null;

  try {
    return JSON.parse(text) as { message?: string; name?: string };
  } catch {
    return { message: text };
  }
}

function isAlreadyExistsError(status: number, error: ResendError) {
  return status === 409 || /already exists/i.test(error?.message ?? "");
}

function isRetryable(status: number) {
  return status === 429 || status >= 500;
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Calls Resend and retries rate limits (429), 5xx, and network errors so a
// signup isn't lost to a brief blip.
async function resendRequest(path: string, apiKey: string, init: RequestInit = {}) {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const response = await fetch(`${RESEND_API_URL}${path}`, {
        ...init,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          ...init.headers,
        },
      });

      if (!isRetryable(response.status) || attempt === MAX_ATTEMPTS) return response;

      const retryAfter = Number(response.headers.get("retry-after"));
      await wait(Number.isFinite(retryAfter) && retryAfter > 0 ? Math.min(retryAfter, 3) * 1000 : 500 * attempt);
    } catch (error) {
      lastError = error;
      if (attempt === MAX_ATTEMPTS) break;
      await wait(500 * attempt);
    }
  }

  throw lastError;
}

function failure(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const segmentId = process.env.RESEND_WAITLIST_SEGMENT_ID || DEFAULT_WAITLIST_SEGMENT_ID;

  if (!apiKey) {
    console.error("Waitlist: RESEND_API_KEY is not set");
    return failure("Waitlist is unavailable right now.", 500);
  }

  let email = "";
  let username = "";

  try {
    const body = (await request.json()) as { email?: unknown; username?: unknown };
    email = typeof body.email === "string" ? normalizeEmail(body.email) : "";
    username = typeof body.username === "string" ? normalizeUsername(body.username) : "";
  } catch {
    return failure("Invalid request body.", 400);
  }

  if (!isValidUsername(username)) {
    return failure("Pick a username with 3–30 letters, numbers, dots or underscores.", 400);
  }

  if (!isValidEmail(email)) {
    return failure("Enter a valid email address.", 400);
  }

  const properties = { [USERNAME_PROPERTY]: username };

  try {
    // Resend upserts here: an existing contact gets the username and segment too.
    const createResponse = await resendRequest("/contacts", apiKey, {
      method: "POST",
      body: JSON.stringify({
        email,
        unsubscribed: false,
        properties,
        segments: [{ id: segmentId }],
      }),
    });

    if (createResponse.ok) {
      return NextResponse.json({ ok: true });
    }

    const createError = await parseResendResponse(createResponse);

    if (!isAlreadyExistsError(createResponse.status, createError)) {
      console.error("Waitlist: failed to create Resend contact", createResponse.status, createError);
      return failure("Could not join waitlist.", 502);
    }

    // Fallback if Resend reports a duplicate instead of upserting:
    // update the username, then make sure the contact is in the segment.
    const updateResponse = await resendRequest(`/contacts/${encodeURIComponent(email)}`, apiKey, {
      method: "PATCH",
      body: JSON.stringify({ unsubscribed: false, properties }),
    });

    if (!updateResponse.ok) {
      const updateError = await parseResendResponse(updateResponse);
      console.error("Waitlist: failed to update Resend contact", updateResponse.status, updateError);
      return failure("Could not join waitlist.", 502);
    }

    const segmentResponse = await resendRequest(
      `/contacts/${encodeURIComponent(email)}/segments/${segmentId}`,
      apiKey,
      { method: "POST" }
    );

    if (segmentResponse.ok) {
      return NextResponse.json({ ok: true });
    }

    const segmentError = await parseResendResponse(segmentResponse);

    if (isAlreadyExistsError(segmentResponse.status, segmentError)) {
      return NextResponse.json({ ok: true });
    }

    console.error("Waitlist: failed to add Resend contact to segment", segmentResponse.status, segmentError);
    return failure("Could not join waitlist.", 502);
  } catch (error) {
    console.error("Waitlist: Resend request failed", error);
    return failure("Could not join waitlist.", 502);
  }
}
