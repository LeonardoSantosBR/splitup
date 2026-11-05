"use client";

type FeedbackMessageProps = { feedback: string | null; error: string | null };

export function FeedbackMessage({ feedback, error }: FeedbackMessageProps) {
  if (!feedback && !error) return null;
  return (
    <p
      role="alert"
      className={`mb-6 rounded-xl px-4 py-3 text-sm font-medium ${error ? "bg-(--primary)/10 text-(--primary)" : "bg-(--teal)/20 text-foreground"}`}
    >
      {error ?? feedback}
    </p>
  );
}
