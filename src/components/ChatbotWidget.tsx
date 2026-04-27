import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Sparkles, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const STARTER_QUESTIONS = [
  "What tools do you offer?",
  "Which SEO tool should I pick?",
  "How do I install on Shopify?",
  "What's your refund policy?",
];

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi! 👋 I'm **ToolBot** — your assistant for ToolFixIt. Ask me about any tool, pricing, setup, or anything else about the site.",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Msg = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && last.content !== messages[messages.length - 1]?.content) {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (resp.status === 429) {
        toast.error("Too many requests. Please wait a moment.");
        setIsLoading(false);
        return;
      }
      if (resp.status === 402) {
        toast.error("AI service unavailable. Please try later.");
        setIsLoading(false);
        return;
      }
      if (!resp.ok || !resp.body) throw new Error("Failed to start stream");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full gradient-primary text-primary-foreground shadow-card-hover glow-purple transition-transform hover:scale-110"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!open && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-accent"></span>
          </span>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[min(600px,calc(100vh-7rem))] w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card-hover">
          {/* Header */}
          <div className="flex items-center gap-3 gradient-primary px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5 text-sm font-bold text-white">
                ToolBot
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-white/80">
                <span className="h-2 w-2 rounded-full bg-green-400" />
                Online — replies instantly
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-background/40 p-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-secondary text-foreground rounded-bl-sm border border-border"
                  }`}
                >
                  {m.role === "assistant" ? (
                    <div className="prose prose-sm prose-invert max-w-none [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_a]:text-accent">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  ) : (
                    m.content
                  )}
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm border border-border bg-secondary px-4 py-3">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-accent" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-accent" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-accent" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            {messages.length === 1 && !isLoading && (
              <div className="flex flex-wrap gap-2 pt-2">
                {STARTER_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => send(q)}
                    className="rounded-full border border-border bg-secondary/70 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-border bg-card p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              disabled={isLoading}
              className="flex-1 rounded-full border border-border bg-background/70 px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-10 w-10 items-center justify-center rounded-full gradient-primary text-primary-foreground transition-transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;