import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { soundSettings } from "@/lib/sfx";

/**
 * WelcomeVoice
 * Speaks a short, upbeat, motivating line on each route change using the
 * browser's built-in SpeechSynthesis (no API cost, no network). Respects the
 * "voice" toggle from soundSettings. Waits for a first user interaction to
 * comply with autoplay policies.
 */

const pickVoice = (): SpeechSynthesisVoice | null => {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  // Prefer a friendly English voice.
  const preferred = [
    "Google US English",
    "Samantha",
    "Microsoft Aria Online (Natural) - English (United States)",
    "Microsoft Jenny Online (Natural) - English (United States)",
    "Karen",
    "Victoria",
  ];
  for (const name of preferred) {
    const v = voices.find((vc) => vc.name === name);
    if (v) return v;
  }
  const en = voices.find((v) => v.lang?.toLowerCase().startsWith("en-us"));
  return en ?? voices.find((v) => v.lang?.toLowerCase().startsWith("en")) ?? voices[0];
};

const messageForPath = (path: string): string => {
  if (path === "/" || path === "") {
    return "Welcome to Toofix It! You are one step away from unlocking the premium Shopify tools top stores use to scale. Take a look around — your next win is waiting.";
  }
  if (path.startsWith("/tools/")) {
    return "Great pick! This tool has helped hundreds of Shopify stores grow faster. Add it to your cart and start winning today.";
  }
  if (path.startsWith("/tools")) {
    return "Browse our premium Shopify tools. Every one of them was built to boost your store's revenue. Grab a few and check out together.";
  }
  if (path.startsWith("/cart")) {
    return "You're almost there! Complete your checkout and we'll deliver every tool to your technician within one to two hours.";
  }
  if (path.startsWith("/blog/")) {
    return "Enjoy the read! When you're ready to grow, our premium tools are just a click away.";
  }
  if (path.startsWith("/blog")) {
    return "Welcome to the Toofix It blog — real strategies from the best Shopify tools marketplace.";
  }
  if (path.startsWith("/about")) {
    return "Meet the team behind the best premium Shopify tools marketplace. We're here to help your store win.";
  }
  if (path.startsWith("/contact")) {
    return "Have a question? Reach out — we usually reply within the hour.";
  }
  return "Welcome back to Toofix It — the best premium Shopify tools marketplace.";
};

const WelcomeVoice = () => {
  const location = useLocation();
  const armedRef = useRef(false);
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const speak = (text: string) => {
      if (!soundSettings.get("voice")) return;
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        const v = pickVoice();
        if (v) utter.voice = v;
        utter.rate = 1.02;
        utter.pitch = 1.05;
        utter.volume = 0.85;
        window.speechSynthesis.speak(utter);
      } catch {
        /* noop */
      }
    };

    const trySpeakForCurrentRoute = () => {
      if (lastPathRef.current === location.pathname) return;
      lastPathRef.current = location.pathname;
      speak(messageForPath(location.pathname));
    };

    // Browsers block speech until first user gesture; arm on first interaction.
    const armAndSpeak = () => {
      armedRef.current = true;
      trySpeakForCurrentRoute();
      window.removeEventListener("pointerdown", armAndSpeak);
      window.removeEventListener("keydown", armAndSpeak);
    };

    if (!armedRef.current) {
      window.addEventListener("pointerdown", armAndSpeak, { once: true });
      window.addEventListener("keydown", armAndSpeak, { once: true });
    } else {
      trySpeakForCurrentRoute();
    }

    // Voices load asynchronously in some browsers.
    const onVoicesChanged = () => {
      if (armedRef.current && lastPathRef.current !== location.pathname) {
        trySpeakForCurrentRoute();
      }
    };
    window.speechSynthesis.addEventListener?.("voiceschanged", onVoicesChanged);

    return () => {
      window.removeEventListener("pointerdown", armAndSpeak);
      window.removeEventListener("keydown", armAndSpeak);
      window.speechSynthesis.removeEventListener?.("voiceschanged", onVoicesChanged);
      try {
        window.speechSynthesis.cancel();
      } catch {
        /* noop */
      }
    };
  }, [location.pathname]);

  return null;
};

export default WelcomeVoice;