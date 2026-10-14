"use client";

import { useEffect, useRef, useState } from "react";
import { AtSign, Mail, Loader2, Check, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

type Status = "idle" | "loading" | "done" | "error";
type Check = "idle" | "typing" | "checking" | "available" | "taken";

const CHECK_DEBOUNCE_MS = 700; // wait after the last keystroke
const CHECK_DURATION_MS = 2500; // fake lookup time until the real check exists
const RESERVED = ["admin", "magicspace", "support", "help", "root", "teo"];

// placeholder availability rule until the backend exists
function fakeAvailability(name: string): Check {
  const n = name.trim().toLowerCase();
  if (n.length < 3 || RESERVED.includes(n)) return "taken";
  return "available";
}

const PAD = 6; // pill inner padding, px
const ROW = 40; // row / button height, px
const BUTTON_W = 118; // collapsed button width, px
const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

export function GlassWaitlist() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [check, setCheck] = useState<Check>("idle");
  const checkTimers = useRef<number[]>([]);

  const formRef = useRef<HTMLFormElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const hasUsername = username.trim().length > 0;
  const emailValid = isValidEmail(email);
  const busy = status === "loading";

  function expand() {
    setExpanded(true);
    // let the email row start growing before moving focus into it
    window.setTimeout(() => emailRef.current?.focus(), 120);
  }

  function collapse() {
    setExpanded(false);
    setEmail("");
    if (status === "error") setStatus("idle");
  }

  // Escape or a click outside the pill collapses it again (unless mid-request).
  useEffect(() => {
    if (!expanded) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !busy) collapse();
    }
    function onPointerDown(e: PointerEvent) {
      if (busy) return;
      if (formRef.current && !formRef.current.contains(e.target as Node)) collapse();
    }

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded, busy]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!expanded) {
      if (hasUsername) expand();
      else usernameRef.current?.focus();
      return;
    }

    if (!emailValid || busy || status === "done") return;

    setStatus("loading");
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), username: username.trim() }),
      });
      if (!response.ok) throw new Error("request failed");
      setStatus("done");
      setUsername("");
      setEmail("");
      setExpanded(false);
      clearCheckTimers();
      setCheck("idle");
    } catch {
      setStatus("error");
    }
  }

  function clearCheckTimers() {
    checkTimers.current.forEach((t) => window.clearTimeout(t));
    checkTimers.current = [];
  }

  function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.replace(/^@/, "");
    setUsername(value);
    if (status === "done" || status === "error") setStatus("idle");

    clearCheckTimers();
    if (value.trim().length === 0) {
      setCheck("idle");
      return;
    }
    setCheck("typing");
    const t1 = window.setTimeout(() => {
      setCheck("checking");
      const t2 = window.setTimeout(() => setCheck(fakeAvailability(value)), CHECK_DURATION_MS);
      checkTimers.current.push(t2);
    }, CHECK_DEBOUNCE_MS);
    checkTimers.current.push(t1);
  }

  useEffect(() => clearCheckTimers, []);

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
    if (status === "error") setStatus("idle");
  }

  const buttonDisabled = busy || (expanded && !emailValid);

  let buttonLabel: React.ReactNode = "join waitlist";
  if (expanded) buttonLabel = "submit";
  if (status === "loading") buttonLabel = <Loader2 className="animate-spin" size={16} />;
  if (status === "done") {
    buttonLabel = (
      <span className="flex items-center gap-1.5">
        <Check size={15} /> you&apos;re in
      </span>
    );
  }
  if (status === "error") buttonLabel = "try again";

  const rowTransition = `grid-template-rows 560ms ${EASE}, opacity 400ms ${EASE}`;

  return (
    <div className="relative w-[min(92vw,440px)]" style={{ height: ROW + PAD * 2 }}>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="glass absolute inset-x-0 bottom-0 text-neutral-900"
        style={{ padding: PAD, borderRadius: ROW / 2 + PAD }}
        data-expanded={expanded}
      >
        {/* username row */}
        <div
          className="flex items-center"
          style={{
            height: ROW,
            paddingRight: expanded ? 0 : BUTTON_W + 2,
            transition: `padding-right 560ms ${EASE}`,
          }}
        >
          <span
            className={cn(
              "flex w-8 shrink-0 items-center justify-center text-neutral-500 transition-colors",
              (usernameFocused || hasUsername) && "text-neutral-700"
            )}
            aria-hidden="true"
          >
            <AtSign size={16} />
          </span>
          <input
            ref={usernameRef}
            type="text"
            name="username"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="reserve your username"
            value={username}
            onChange={handleUsernameChange}
            onFocus={() => setUsernameFocused(true)}
            onBlur={() => setUsernameFocused(false)}
            className="h-full min-w-0 flex-1 bg-transparent pr-2 text-[15px] outline-none placeholder:text-neutral-500"
          />
          <span
            className={cn("live-dot mr-3 shrink-0", `live-dot-${check}`)}
            role="status"
            aria-label={
              check === "available"
                ? "username available"
                : check === "taken"
                  ? "username taken"
                  : check === "checking"
                    ? "checking username"
                    : "live"
            }
          />
        </div>

        {/* email row, collapsed to zero height until expanded */}
        <div
          className="grid"
          style={{
            gridTemplateRows: expanded ? "1fr" : "0fr",
            opacity: expanded ? 1 : 0,
            transition: rowTransition,
          }}
        >
          <div className="min-h-0 overflow-hidden">
            <div
              className="mt-1 flex items-center border-t border-white/50"
              style={{ height: ROW + 1 }}
            >
              <span className="flex w-8 shrink-0 items-center justify-center text-neutral-500" aria-hidden="true">
                <Mail size={16} />
              </span>
              <input
                ref={emailRef}
                type="email"
                name="email"
                autoComplete="email"
                placeholder="your email"
                value={email}
                onChange={handleEmailChange}
                tabIndex={expanded ? 0 : -1}
                className="h-full min-w-0 flex-1 bg-transparent pr-3 text-[15px] outline-none placeholder:text-neutral-500"
              />
            </div>
          </div>
        </div>

        {/* whatsapp community row */}
        <div
          className="grid"
          style={{
            gridTemplateRows: expanded ? "1fr" : "0fr",
            opacity: expanded ? 1 : 0,
            transition: rowTransition,
          }}
          aria-hidden={!expanded}
        >
          <div className="min-h-0 overflow-hidden">
            <a
              href="https://chat.whatsapp.com/EScmH37Zoxn1marbHxMlXY"
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={expanded ? 0 : -1}
              className="group mt-1 flex items-center justify-center gap-1 border-t border-white/50 text-[13px] font-medium text-neutral-500 transition-colors hover:text-neutral-900"
              style={{ height: 33 }}
            >
              <span>
                or join the <span className="text-neutral-700 group-hover:text-neutral-900">whatsapp community</span>
              </span>
              <ArrowUpRight
                size={13}
                className="text-neutral-500 transition-transform group-hover:translate-x-px group-hover:-translate-y-px group-hover:text-neutral-900"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>

        {/* spacer the full-width button sits in once expanded */}
        <div
          className="grid"
          style={{ gridTemplateRows: expanded ? "1fr" : "0fr", transition: rowTransition }}
          aria-hidden="true"
        >
          <div className="min-h-0 overflow-hidden">
            <div className="mt-1" style={{ height: ROW }} />
          </div>
        </div>

        <button
          type="submit"
          disabled={buttonDisabled}
          className={cn(
            "glass-button absolute flex items-center justify-center rounded-full text-sm font-semibold whitespace-nowrap select-none",
            "active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          )}
          style={{
            bottom: PAD,
            right: PAD,
            height: ROW,
            left: expanded ? PAD : `calc(100% - ${BUTTON_W + PAD}px)`,
            transition: `left 560ms ${EASE}, opacity 200ms ${EASE}, transform 120ms ${EASE}, background 150ms`,
          }}
        >
          {buttonLabel}
        </button>
      </form>
    </div>
  );
}
