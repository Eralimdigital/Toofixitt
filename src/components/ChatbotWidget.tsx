import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, X, Send, Sparkles, Bot, ArrowRight, Search, Tag, DollarSign } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { tools } from "@/data/tools";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

type QuickAction = {
  label: string;
  icon: typeof Search;
  to: string;
};

const QUICK_ACTIONS: QuickAction[] = [
  { label: "Browse SEO tools", icon: Search, to: "/tools?category=SEO" },
  { label: "Marketing tools", icon: Tag, to: "/tools?category=Marketing" },
  { label: "Best under $200", icon: DollarSign, to: "/tools?maxPrice=200" },
  { label: "All tools", icon: ArrowRight, to: "/tools" },
];

const STARTER_QUESTIONS = [
  "Which SEO tool do you recommend?",
  "Show me tools under $200",
  "What's the best email marketing tool?",
  "How do I install on Shopify?",
];

const INITIAL_GREETING =
  "Hey there! 👋 I'm **ToolBot** — your guide to **Toofixitt**.\n\nAsk me anything about our tools, pricing, setup, or use a quick action below to jump straight in.";

const ChatbotWidget = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: INITIAL_GREETING },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Compact catalog for the edge function (keep payload small)
  const toolCatalog = useMemo(
    () =>
      tools.map((t) => ({
        name: t.name,
        slug: t.slug,
        price: t.price,
        priceValue: t.priceValue,
        category: t.category,
        description: t.description,
      })),
    [],
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  const handleNavigate = (to: string) => {
    setOpen(false);
    navigate(to);
  };

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Msg = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    let assistantStarted = false;
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        if (!assistantStarted) {
          assistantStarted = true;
          return [...prev, { role: "assistant", content: assistantSoFar }];
        }
        return prev.map((m, i) =>
          i === prev.length - 1 ? { ...m, content: assistantSoFar } : m,
        );
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
          tools: toolCatalog,
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

  // Custom markdown link: internal links use react-router; external open in new tab
  const MdLink = ({ href, children }: { href?: string; children?: React.ReactNode }) => {
    if (!href) return <>{children}</>;
    const isInternal = href.startsWith("/");
    if (isInternal) {
      return (
        <button
          type="button"
          onClick={() => handleNavigate(href)}
          className="font-semibold text-accent underline-offset-2 hover:underline"
        >
          {children}
        </button>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className="font-semibold text-accent underline-offset-2 hover:underline"
      >
        {children}
      </a>
    );
  };

  return (
    <>
      {/* Floating launcher */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open ToolBot chat"}
        className="fixed bottom-5 right-5 z-50 group flex h-14 w-14 items-center justify-center rounded-full text-primary-foreground shadow-card-hover glow-purple transition-transform hover:scale-110"
        style={{
          background:
            "linear-gradient(135deg, hsl(268,100%,58%) 0%, hsl(285,100%,72%) 55%, hsl(28,100%,62%) 100%)",
        }}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!open && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[hsl(28,100%,62%)] opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-[hsl(28,100%,62%)]"></span>
          </span>
        )}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[min(620px,calc(100vh-7rem))] w-[min(390px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card-hover">
          {/* Header */}
          <div
            className="relative flex items-center gap-3 px-4 py-3.5"
            style={{
              background:
                "linear-gradient(135deg, hsl(268,100%,40%) 0%, hsl(282,100%,55%) 60%, hsl(28,100%,55%) 130%)",
            }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 ring-2 ring-white/30 backdrop-blur">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5 text-sm font-extrabold tracking-tight text-white">
                ToolBot
                <Sparkles className="h-3.5 w-3.5 text-[hsl(40,100%,80%)]" />
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-white/85">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-300 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
                </span>
                Online · Powered by Toofixitt
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1.5 text-white/85 transition-colors hover:bg-white/15 hover:text-white"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Quick actions */}
          <div className="flex gap-2 overflow-x-auto border-b border-border bg-card/60 px-3 py-2.5 scrollbar-none">
            {QUICK_ACTIONS.map((qa) => {
              const Icon = qa.icon;
              return (
                <button
                  key={qa.label}
                  type="button"
                  onClick={() => handleNavigate(qa.to)}
                  className="group flex flex-shrink-0 items-center gap-1.5 rounded-full border border-border bg-secondary/80 px-3 py-1.5 text-[11px] font-semibold text-foreground/90 transition-all hover:-translate-y-0.5 hover:border-accent/70 hover:text-accent"
                >
                  <Icon className="h-3 w-3" />
                  {qa.label}
                </button>
              );
            })}
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-background/50 p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex animate-in fade-in slide-in-from-bottom-1 duration-200 ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.role === "assistant" && (
                  <div className="mr-2 mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full gradient-primary">
                    <Bot className="h-3.5 w-3.5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-card ${
                    m.role === "user"
                      ? "rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm border border-border bg-secondary text-foreground"
                  }`}
                >
                  {m.role === "assistant" ? (
                    <div className="prose prose-sm prose-invert max-w-none [&_p]:my-1 [&_ul]:my-1 [&_ul]:pl-4 [&_ol]:my-1 [&_ol]:pl-4 [&_li]:my-0.5 [&_strong]:text-foreground">
                      <ReactMarkdown components={{ a: MdLink }}>{m.content}</ReactMarkdown>
                    </div>
                  ) : (
                    m.content
                  )}
                </div>
              </div>
            ))}

            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex animate-in fade-in justify-start">
                <div className="mr-2 mt-0.5 flex h-7 w-7 items-center justify-center rounded-full gradient-primary">
                  <Bot className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="rounded-2xl rounded-bl-sm border border-border bg-secondary px-4 py-3 shadow-card">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-accent" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-accent" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-accent" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            {messages.length === 1 && !isLoading && (
              <div className="space-y-2 pt-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Try asking
                </p>
                <div className="flex flex-wrap gap-2">
                  {STARTER_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => send(q)}
                      className="rounded-full border border-border bg-secondary/70 px-3 py-1.5 text-xs text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent"
                    >
                      {q}
                    </button>
                  ))}
                </div>
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
              placeholder="Ask ToolBot anything…"
              disabled={isLoading}
              className="flex-1 rounded-full border border-border bg-background/70 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
              className="flex h-10 w-10 items-center justify-center rounded-full text-primary-foreground shadow-card transition-transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
              style={{
                background:
                  "linear-gradient(135deg, hsl(268,100%,58%) 0%, hsl(285,100%,72%) 60%, hsl(28,100%,62%) 110%)",
              }}
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