import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/254720044055?text=" +
  encodeURIComponent("Hi ReggyCodas! I'd like to chat about your solutions.");

const teasers = [
  "Hi there! Need help choosing a solution?",
  "Questions about Pointify POS? Let's chat.",
  "We reply fast — talk to a real person.",
  "Want a demo? Message us now.",
  "Building something? Let's talk about it.",
];

export default function ChatWidget() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // First bubble after a short delay
    const start = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(start);
  }, []);

  useEffect(() => {
    if (dismissed) return;
    // Rotate messages: show for 6s, hide briefly, show next
    let inner: ReturnType<typeof setTimeout> | undefined;
    const interval = setInterval(() => {
      setVisible(false);
      inner = setTimeout(() => {
        setIndex((i) => (i + 1) % teasers.length);
        setVisible(true);
      }, 600);
    }, 6600);
    return () => {
      clearInterval(interval);
      if (inner) clearTimeout(inner);
    };
  }, [dismissed]);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {!dismissed && (
        <div
          className={`relative max-w-[240px] rounded-xl rounded-br-none border border-border bg-white px-4 py-3 shadow-lg transition-all duration-500 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0 pointer-events-none"
          }`}
          aria-live="polite"
        >
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss chat message"
            className="absolute -left-3 -top-3 grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground shadow before:absolute before:-inset-2 before:content-['']"
          >
            <X size={13} />
          </button>
          <p className="text-sm leading-snug text-primary">{teasers[index]}</p>
        </div>
      )}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="group relative grid h-14 w-14 place-items-center rounded-full bg-accent text-accent-foreground shadow-xl transition-transform hover:scale-105"
      >
        <span className="absolute inset-0 rounded-full bg-accent opacity-40 animate-ping-slow" aria-hidden="true" />
        <MessageCircle size={26} className="relative" />
      </a>
    </div>
  );
}
