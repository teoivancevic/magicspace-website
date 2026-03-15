"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    await fetch("https://submit-form.com/Xvb4DX2w5", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email }),
    });
    setSubmitted(true);
  }

  if (submitted) {
    return <p className="text-sm text-neutral-700">You&apos;re on the list.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center bg-white border border-neutral-200 rounded-full p-1 shadow-sm">
      <Input
        type="email"
        placeholder="harry@hogwarts.edu"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="flex-1 h-9 text-sm border-none bg-transparent shadow-none focus-visible:ring-0 focus-visible:border-none px-3 rounded-full"
      />
      <Button type="submit" className="h-9 px-4 text-sm font-bold rounded-full shrink-0">
        join waitlist
      </Button>
    </form>
  );
}
