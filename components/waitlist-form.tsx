"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Check } from "lucide-react";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

type Status = "idle" | "loading" | "done";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const valid = isValidEmail(email);

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
    if (status === "done") setStatus("idle");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || status !== "idle") return;
    setStatus("loading");
    await fetch("https://submit-form.com/Xvb4DX2w5", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email }),
    });
    setEmail("");
    setStatus("done");
  }

  return (
    <div className="flex flex-col gap-3">
      <form onSubmit={handleSubmit} className="flex items-center bg-white border border-neutral-200 rounded-full p-1 shadow-sm">
        <Input
          type="email"
          placeholder="harry@hogwarts.edu"
          value={email}
          onChange={handleEmailChange}
          required
          className="flex-1 h-9 text-base border-none bg-transparent shadow-none focus-visible:ring-0 focus-visible:border-none px-3 rounded-full"
        />
        <Button
          type="submit"
          disabled={!valid || status !== "idle"}
          className="h-9 px-4 text-base font-bold rounded-full shrink-0 w-[130px] transition-opacity"
        >
          {status === "loading" ? (
            <Loader2 className="animate-spin" size={16} />
          ) : status === "done" ? (
            <Check size={16} />
          ) : (
            "join waitlist"
          )}
        </Button>
      </form>
      <a
        href="https://chat.whatsapp.com/EScmH37Zoxn1marbHxMlXY"
        target="_blank"
        rel="noopener noreferrer"
        className="group text-base text-neutral-500 hover:text-neutral-900 transition-colors text-center"
      >
        and join the{" "}
        <span className="relative inline-block">
          whatsapp community
          <svg
            viewBox="0 0 200 8"
            preserveAspectRatio="none"
            className="absolute left-0 -bottom-1 w-full transition-opacity duration-200 opacity-50 group-hover:opacity-100"
            style={{ height: "6px" }}
            aria-hidden="true"
          >
            <path
              d="M2,5 C20,1 45,7 70,4 C95,1 115,6 140,3 C160,1 178,5 198,3"
              fill="none"
              stroke="#00BC7F"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </span>
        {" "}--&gt;
      </a>
    </div>
  );
}
