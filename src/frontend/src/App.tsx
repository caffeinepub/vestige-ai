import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import {
  Brain,
  ChevronDown,
  Heart,
  Leaf,
  Loader2,
  Lock,
  MessageCircle,
  Mic,
  MicOff,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SiWhatsapp } from "react-icons/si";
import { toast } from "sonner";
import type { Inquiry } from "./backend";

const PRODUCTS = [
  {
    id: 1,
    name: "Glucosamine",
    tagline: "Joint Health & Flexibility",
    description:
      "Supports joint health and flexibility with advanced glucosamine complex. Ideal for active lifestyles and aging joints.",
    icon: <Heart className="w-4 h-4" />,
    image: "/assets/generated/product-glucosamine-v2.dim_400x400.jpg",
    badge: "Best Seller",
  },
  {
    id: 2,
    name: "Aloe Vera Juice",
    tagline: "Digestion & Detox",
    description:
      "Improves digestion and detoxification with pure aloe vera extract. Natural gut health support.",
    icon: <Leaf className="w-4 h-4" />,
    image: "/assets/generated/product-aloe-vera-v2.dim_400x400.jpg",
    badge: "Natural",
  },
  {
    id: 3,
    name: "Curcumin Plus",
    tagline: "Immunity & Inflammation",
    description:
      "Supports immunity and inflammation control with bioavailable curcumin. Backed by Ayurvedic tradition.",
    icon: <Brain className="w-4 h-4" />,
    image: "/assets/generated/product-curcumin-v2.dim_400x400.jpg",
    badge: "Ayurvedic",
  },
  {
    id: 4,
    name: "Hair Serum",
    tagline: "Reduce Hair Fall",
    description:
      "Helps reduce hair fall with nourishing botanical extracts. Promotes thicker, stronger hair growth.",
    icon: <Sparkles className="w-4 h-4" />,
    image: "/assets/generated/product-hair-serum-v2.dim_400x400.jpg",
    badge: "Popular",
  },
];

const HINT_CHIPS = [
  "Joint Pain",
  "Hair Fall",
  "Digestion",
  "Immunity",
  "Diabetes",
  "Blood Pressure",
  "Weight Loss",
  "Skin Care",
  "Stress",
  "Energy",
  "Cholesterol",
  "Bone Health",
];

function getAIReply(text: string): string {
  const lower = text.toLowerCase();

  if (lower.includes("joint pain") || lower.includes("joint")) {
    return "Vestige Glucosamine supports joint health. It strengthens cartilage and improves flexibility. I recommend taking it daily for best results.";
  }
  if (
    lower.includes("hair fall") ||
    lower.includes("hair loss") ||
    lower.includes("hair")
  ) {
    return "Vestige Hair Serum helps reduce hair fall significantly. It nourishes the scalp and strengthens hair follicles from root to tip.";
  }
  if (
    lower.includes("gas") ||
    lower.includes("digestion") ||
    lower.includes("stomach")
  ) {
    return "Vestige Aloe Vera Juice helps digestion and detoxification. It soothes the digestive tract and promotes healthy gut bacteria.";
  }
  if (
    lower.includes("immunity") ||
    lower.includes("immune") ||
    lower.includes("infection")
  ) {
    return "Curcumin Plus supports immunity and inflammation control. Its powerful antioxidants boost your immune system naturally.";
  }
  if (
    lower.includes("diabetes") ||
    lower.includes("blood sugar") ||
    lower.includes("sugar")
  ) {
    return "Vestige Noni Juice helps regulate blood sugar levels naturally. Combined with a balanced diet and our Spirulina supplement, it supports better glucose management.";
  }
  if (
    lower.includes("blood pressure") ||
    lower.includes(" bp ") ||
    lower.includes("hypertension")
  ) {
    return "Vestige Garlic Capsules and Omega 3 fish oil help support healthy blood pressure levels. They promote cardiovascular health naturally.";
  }
  if (
    lower.includes("weight loss") ||
    lower.includes("obesity") ||
    lower.includes("overweight") ||
    lower.includes(" fat ")
  ) {
    return "Vestige Flax Oil and Apple Cider Vinegar support healthy weight management. Combined with regular exercise, they boost metabolism effectively.";
  }
  if (
    lower.includes("skin") ||
    lower.includes("acne") ||
    lower.includes("pimple") ||
    lower.includes("glow") ||
    lower.includes("face")
  ) {
    return "Vestige Aloe Vera Gel and Vitamin C supplements help improve skin health and glow. They fight acne and promote clear, radiant skin.";
  }
  if (
    lower.includes("stress") ||
    lower.includes("anxiety") ||
    lower.includes("sleep") ||
    lower.includes("insomnia")
  ) {
    return "Vestige Ashwagandha helps reduce stress and improve sleep quality. It's a powerful adaptogen that balances your body naturally.";
  }
  if (
    lower.includes("energy") ||
    lower.includes("fatigue") ||
    lower.includes("tired") ||
    lower.includes("weakness")
  ) {
    return "Vestige Spirulina and B-Complex provide an energy boost and fight fatigue. They support cellular energy production.";
  }
  if (
    lower.includes("cholesterol") ||
    lower.includes("heart") ||
    lower.includes("cardiac")
  ) {
    return "Vestige Omega 3 and Garlic Capsules support healthy cholesterol and heart health. They protect your cardiovascular system.";
  }
  if (
    lower.includes("bone") ||
    lower.includes("calcium") ||
    lower.includes("osteoporosis")
  ) {
    return "Vestige Calcium supplement with Vitamin D3 supports strong bones and prevents osteoporosis. Essential for bone density.";
  }

  return "Please contact Prashanth Reddy for the best Vestige guidance. He can recommend the perfect product tailored to your specific health needs.";
}

function WaveVisualizer() {
  return (
    <div
      className="flex items-center gap-1 h-8"
      data-ocid="assistant.loading_state"
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="wave-bar w-1 rounded-full"
          style={{
            height: "100%",
            backgroundColor: "oklch(0.72 0.2 145)",
            animationDelay: `${(i - 1) * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
}

const G = "oklch(0.72 0.2 145)";
const DARK = "oklch(0.08 0.015 250)";
const CARD_BG = "oklch(0.11 0.02 250)";

export default function App() {
  const { actor, isFetching } = useActor();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    problem: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Admin state
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminDenied, setAdminDenied] = useState(false);
  const [inquiries, setInquiries] = useState<Inquiry[] | null>(null);

  const recognitionRef = useRef<any>(null);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const speakReply = (reply: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(reply);
    utterance.lang = "en-IN";
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition not supported. Please use Chrome.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognitionRef.current = recognition;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const question = event.results[0][0].transcript;
      setTranscript(question);
      setIsListening(false);
      const reply = getAIReply(question);
      setAiResponse(reply);
      speakReply(reply);
    };
    recognition.onerror = (event: any) => {
      setIsListening(false);
      toast.error(`Voice error: ${event.error}. Please try again.`);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.phone || !contactForm.problem) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (!actor || isFetching) {
      toast.error("Service unavailable. Please try again.");
      return;
    }
    setIsSubmitting(true);
    try {
      await actor.submitInquiry(
        contactForm.name,
        contactForm.phone,
        contactForm.problem,
      );
      toast.success("Message sent! Prashanth Reddy will contact you shortly.");
      setContactForm({ name: "", phone: "", problem: "" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewInquiries = async () => {
    if (!actor || isFetching) {
      toast.error("Service unavailable. Please try again.");
      return;
    }
    if (adminOpen && inquiries !== null) {
      setAdminOpen(false);
      return;
    }
    setAdminLoading(true);
    setAdminDenied(false);
    try {
      const isAdmin = await actor.isCallerAdmin();
      if (!isAdmin) {
        setAdminDenied(true);
        setAdminOpen(true);
        setAdminLoading(false);
        return;
      }
      const data = await actor.getInquiries();
      // Sort newest first
      const sorted = [...data].sort((a, b) =>
        Number(b.timestamp - a.timestamp),
      );
      setInquiries(sorted);
      setAdminOpen(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load inquiries.");
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      recognitionRef.current?.stop();
    };
  }, []);

  const containerV = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };
  const itemV = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: "easeOut" as const },
    },
  };

  const navLinks = [
    { id: "home", label: "Home", ocid: "nav.home_link" },
    { id: "assistant", label: "AI Assistant", ocid: "nav.assistant_link" },
    { id: "products", label: "Products", ocid: "nav.products_link" },
    { id: "contact", label: "Contact", ocid: "nav.contact_link" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: DARK }}>
      <Toaster position="top-right" />

      {/* HEADER */}
      <header
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl"
        style={{
          backgroundColor: "oklch(0.08 0.015 250 / 0.9)",
          borderBottom: "1px solid oklch(0.72 0.2 145 / 0.15)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: "oklch(0.72 0.2 145 / 0.15)",
                border: "1px solid oklch(0.72 0.2 145 / 0.4)",
              }}
            >
              <Heart className="w-5 h-5" style={{ color: G }} />
            </div>
            <div>
              <div
                className="font-display font-bold text-sm leading-tight"
                style={{ color: G }}
              >
                Vestige AI
              </div>
              <div className="text-xs" style={{ color: "oklch(0.6 0.04 145)" }}>
                Health Assistant
              </div>
            </div>
          </div>

          <nav className="hidden sm:flex items-center gap-1">
            {navLinks.map((item) => (
              <button
                type="button"
                key={item.id}
                data-ocid={item.ocid}
                onClick={() => scrollTo(item.id)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{ color: "oklch(0.7 0.06 145)" }}
                onMouseEnter={(e) => {
                  const b = e.currentTarget as HTMLButtonElement;
                  b.style.backgroundColor = "oklch(0.72 0.2 145 / 0.12)";
                  b.style.color = G;
                }}
                onMouseLeave={(e) => {
                  const b = e.currentTarget as HTMLButtonElement;
                  b.style.backgroundColor = "transparent";
                  b.style.color = "oklch(0.7 0.06 145)";
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex sm:hidden gap-1">
            {navLinks.map((item) => (
              <button
                type="button"
                key={item.id}
                data-ocid={item.ocid}
                onClick={() => scrollTo(item.id)}
                className="px-2 py-1.5 rounded-md text-xs font-medium"
                style={{ color: G }}
              >
                {item.label.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* HERO */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/assets/generated/vestige-hero-bg.dim_1920x1080.jpg')",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, oklch(0.08 0.015 250 / 0.65) 0%, oklch(0.08 0.015 250 / 0.85) 50%, oklch(0.08 0.015 250) 100%)",
          }}
        />

        <motion.div
          className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6"
          variants={containerV}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemV} className="mb-5">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
              style={{
                backgroundColor: "oklch(0.72 0.2 145 / 0.12)",
                border: "1px solid oklch(0.72 0.2 145 / 0.3)",
                color: G,
              }}
            >
              <Sparkles className="w-3 h-3" />
              AI-Powered Health Guidance
            </span>
          </motion.div>

          <motion.h1
            variants={itemV}
            className="font-display font-extrabold text-5xl sm:text-7xl leading-tight mb-6"
          >
            <span style={{ color: "oklch(0.96 0.02 145)" }}>Vestige </span>
            <span
              style={{
                background: `linear-gradient(135deg, ${G}, oklch(0.85 0.15 145))`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              AI Health
            </span>
            <br />
            <span style={{ color: "oklch(0.96 0.02 145)" }}>Assistant</span>
          </motion.h1>

          <motion.p
            variants={itemV}
            className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: "oklch(0.75 0.05 145)" }}
          >
            Smart Health Guidance for a Better Life — powered by voice AI and
            Vestige's trusted wellness products.
          </motion.p>

          <motion.div
            variants={itemV}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              type="button"
              onClick={() => scrollTo("assistant")}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-sm transition-all duration-300"
              style={{
                backgroundColor: G,
                color: DARK,
                boxShadow: "0 0 20px oklch(0.72 0.2 145 / 0.4)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "translateY(0)";
              }}
            >
              <Mic className="w-4 h-4" /> Try Voice AI
            </button>
            <button
              type="button"
              onClick={() => scrollTo("products")}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-sm transition-all duration-300"
              style={{
                backgroundColor: "transparent",
                color: "oklch(0.85 0.1 145)",
                border: "1px solid oklch(0.72 0.2 145 / 0.4)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "oklch(0.72 0.2 145 / 0.1)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "transparent";
              }}
            >
              View Products
            </button>
          </motion.div>

          <motion.div variants={itemV} className="mt-16">
            <button
              type="button"
              onClick={() => scrollTo("assistant")}
              className="flex flex-col items-center gap-2 mx-auto opacity-50 hover:opacity-90 transition-opacity"
              style={{ color: G }}
            >
              <span className="text-xs tracking-widest uppercase">Explore</span>
              <ChevronDown className="w-5 h-5 animate-bounce" />
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* AI ASSISTANT */}
      <section
        id="assistant"
        className="py-24 px-4 sm:px-6"
        style={{ backgroundColor: "oklch(0.09 0.018 250)" }}
      >
        <div className="max-w-3xl mx-auto">
          <motion.div
            variants={containerV}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div variants={itemV} className="text-center mb-14">
              <span
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-4"
                style={{
                  backgroundColor: "oklch(0.72 0.2 145 / 0.1)",
                  border: "1px solid oklch(0.72 0.2 145 / 0.25)",
                  color: G,
                }}
              >
                <Mic className="w-3 h-3" /> Voice AI
              </span>
              <h2
                className="font-display font-extrabold text-3xl sm:text-5xl mb-4"
                style={{ color: "oklch(0.96 0.02 145)" }}
              >
                Talk to Your Health{" "}
                <span
                  style={{
                    background: `linear-gradient(135deg, ${G}, oklch(0.85 0.15 145))`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Assistant
                </span>
              </h2>
              <p
                className="text-base sm:text-lg"
                style={{ color: "oklch(0.65 0.05 145)" }}
              >
                Describe your health concern and get instant, voice-guided
                product recommendations.
              </p>
            </motion.div>

            <motion.div
              variants={itemV}
              className="rounded-3xl p-8 sm:p-12"
              style={{
                backgroundColor: CARD_BG,
                border: "1px solid oklch(0.72 0.2 145 / 0.2)",
                boxShadow: "0 24px 80px oklch(0 0 0 / 0.4)",
              }}
            >
              <div className="flex flex-col items-center gap-8">
                {/* Mic Button */}
                <div className="relative">
                  {isListening && (
                    <div
                      className="absolute inset-0 rounded-full animate-ping"
                      style={{ backgroundColor: "oklch(0.72 0.2 145 / 0.3)" }}
                    />
                  )}
                  <motion.button
                    data-ocid="assistant.primary_button"
                    onClick={isListening ? stopListening : startListening}
                    className="relative w-28 h-28 rounded-full flex items-center justify-center transition-colors duration-300"
                    style={{
                      backgroundColor: isListening
                        ? G
                        : "oklch(0.72 0.2 145 / 0.15)",
                      border: `2px solid oklch(0.72 0.2 145 / ${isListening ? "1" : "0.5"})`,
                      boxShadow: isListening
                        ? "0 0 30px oklch(0.72 0.2 145 / 0.6)"
                        : "0 0 16px oklch(0.72 0.2 145 / 0.2)",
                    }}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    aria-label={
                      isListening ? "Stop listening" : "Start listening"
                    }
                  >
                    {isListening ? (
                      <MicOff className="w-10 h-10" style={{ color: DARK }} />
                    ) : (
                      <Mic className="w-10 h-10" style={{ color: G }} />
                    )}
                  </motion.button>
                </div>

                {/* Status */}
                <AnimatePresence mode="wait">
                  {isListening ? (
                    <motion.div
                      key="listening"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex flex-col items-center gap-3"
                    >
                      <WaveVisualizer />
                      <span
                        className="text-sm font-semibold tracking-widest uppercase"
                        style={{ color: G }}
                      >
                        Listening...
                      </span>
                    </motion.div>
                  ) : isSpeaking ? (
                    <motion.div
                      key="speaking"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex flex-col items-center gap-3"
                    >
                      <WaveVisualizer />
                      <span
                        className="text-sm font-semibold tracking-widest uppercase"
                        style={{ color: "oklch(0.8 0.18 145)" }}
                      >
                        Speaking...
                      </span>
                    </motion.div>
                  ) : (
                    <motion.p
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-center"
                      style={{ color: "oklch(0.55 0.04 145)" }}
                    >
                      Tap the mic and speak your health concern
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Transcript */}
                <AnimatePresence>
                  {transcript && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      className="w-full rounded-2xl p-5"
                      style={{
                        backgroundColor: "oklch(0.14 0.025 250)",
                        border: "1px solid oklch(0.72 0.2 145 / 0.15)",
                      }}
                    >
                      <p
                        className="text-xs font-semibold uppercase tracking-wider mb-2"
                        style={{ color: "oklch(0.55 0.04 145)" }}
                      >
                        You said
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: "oklch(0.88 0.05 145)" }}
                      >
                        "{transcript}"
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* AI Response */}
                <AnimatePresence>
                  {aiResponse && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      className="w-full rounded-2xl p-5"
                      style={{
                        backgroundColor: "oklch(0.72 0.2 145 / 0.08)",
                        border: "1px solid oklch(0.72 0.2 145 / 0.3)",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: G }}
                        >
                          <Heart className="w-3 h-3" style={{ color: DARK }} />
                        </div>
                        <p
                          className="text-xs font-semibold uppercase tracking-wider"
                          style={{ color: G }}
                        >
                          Vestige AI
                        </p>
                      </div>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "oklch(0.88 0.05 145)" }}
                      >
                        {aiResponse}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Quick hint chips — 12 topics in 3 rows of 4 */}
            <motion.div variants={itemV} className="mt-6 space-y-3">
              {(
                [
                  ["row-1", HINT_CHIPS.slice(0, 4)],
                  ["row-2", HINT_CHIPS.slice(4, 8)],
                  ["row-3", HINT_CHIPS.slice(8, 12)],
                ] as [string, string[]][]
              ).map(([rowKey, row]) => (
                <div
                  key={rowKey}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                >
                  {row.map((hint) => (
                    <button
                      type="button"
                      key={hint}
                      className="rounded-xl px-3 py-2.5 text-center text-xs font-medium transition-all duration-200"
                      style={{
                        backgroundColor: "oklch(0.72 0.2 145 / 0.08)",
                        border: "1px solid oklch(0.72 0.2 145 / 0.2)",
                        color: G,
                      }}
                      onClick={() => {
                        setTranscript(hint);
                        const reply = getAIReply(hint);
                        setAiResponse(reply);
                        speakReply(reply);
                      }}
                      onMouseEnter={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.backgroundColor = "oklch(0.72 0.2 145 / 0.2)";
                      }}
                      onMouseLeave={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.backgroundColor = "oklch(0.72 0.2 145 / 0.08)";
                      }}
                    >
                      &ldquo;{hint}&rdquo;
                    </button>
                  ))}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section
        id="products"
        className="py-24 px-4 sm:px-6"
        style={{ backgroundColor: DARK }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={containerV}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div variants={itemV} className="text-center mb-14">
              <span
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-4"
                style={{
                  backgroundColor: "oklch(0.72 0.2 145 / 0.1)",
                  border: "1px solid oklch(0.72 0.2 145 / 0.25)",
                  color: G,
                }}
              >
                <Leaf className="w-3 h-3" /> Wellness Products
              </span>
              <h2
                className="font-display font-extrabold text-3xl sm:text-5xl mb-4"
                style={{ color: "oklch(0.96 0.02 145)" }}
              >
                Our Featured{" "}
                <span
                  style={{
                    background: `linear-gradient(135deg, ${G}, oklch(0.85 0.15 145))`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Health Range
                </span>
              </h2>
              <p
                className="text-base"
                style={{ color: "oklch(0.65 0.05 145)" }}
              >
                Trusted Vestige products recommended by our AI health assistant.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PRODUCTS.map((product) => (
                <motion.div
                  key={product.id}
                  data-ocid={`products.item.${product.id}`}
                  variants={itemV}
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                  className="rounded-3xl overflow-hidden group cursor-pointer"
                  style={{
                    backgroundColor: CARD_BG,
                    border: "1px solid oklch(0.72 0.2 145 / 0.15)",
                  }}
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(to top, ${CARD_BG} 0%, transparent 60%)`,
                      }}
                    />
                    <div
                      className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold"
                      style={{ backgroundColor: G, color: DARK }}
                    >
                      {product.badge}
                    </div>
                    <div className="absolute top-3 left-3 flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className="w-3 h-3 fill-current"
                          style={{ color: "oklch(0.78 0.18 80)" }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="p-5">
                    <div
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-3"
                      style={{
                        backgroundColor: "oklch(0.72 0.2 145 / 0.12)",
                        color: G,
                      }}
                    >
                      {product.icon} {product.tagline}
                    </div>
                    <h3
                      className="font-display font-bold text-lg mb-2"
                      style={{ color: "oklch(0.96 0.02 145)" }}
                    >
                      {product.name}
                    </h3>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: "oklch(0.6 0.04 145)" }}
                    >
                      {product.description}
                    </p>
                    <button
                      type="button"
                      onClick={() => scrollTo("contact")}
                      className="mt-4 w-full py-2.5 rounded-xl text-xs font-semibold transition-all duration-200"
                      style={{
                        backgroundColor: "oklch(0.72 0.2 145 / 0.1)",
                        border: "1px solid oklch(0.72 0.2 145 / 0.3)",
                        color: G,
                      }}
                      onMouseEnter={(e) => {
                        const b = e.currentTarget as HTMLButtonElement;
                        b.style.backgroundColor = G;
                        b.style.color = DARK;
                      }}
                      onMouseLeave={(e) => {
                        const b = e.currentTarget as HTMLButtonElement;
                        b.style.backgroundColor = "oklch(0.72 0.2 145 / 0.1)";
                        b.style.color = G;
                      }}
                    >
                      Enquire Now
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="py-24 px-4 sm:px-6"
        style={{ backgroundColor: "oklch(0.09 0.018 250)" }}
      >
        <div className="max-w-2xl mx-auto">
          <motion.div
            variants={containerV}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div variants={itemV} className="text-center mb-12">
              <span
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-4"
                style={{
                  backgroundColor: "oklch(0.72 0.2 145 / 0.1)",
                  border: "1px solid oklch(0.72 0.2 145 / 0.25)",
                  color: G,
                }}
              >
                <Phone className="w-3 h-3" /> Get in Touch
              </span>
              <h2
                className="font-display font-extrabold text-3xl sm:text-5xl mb-4"
                style={{ color: "oklch(0.96 0.02 145)" }}
              >
                Contact{" "}
                <span
                  style={{
                    background: `linear-gradient(135deg, ${G}, oklch(0.85 0.15 145))`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Prashanth Reddy
                </span>
              </h2>
              <p
                className="text-base"
                style={{ color: "oklch(0.65 0.05 145)" }}
              >
                Get personalized Vestige health guidance from our expert.
              </p>
            </motion.div>

            <motion.div
              variants={itemV}
              className="rounded-3xl p-8 sm:p-10"
              style={{
                backgroundColor: CARD_BG,
                border: "1px solid oklch(0.72 0.2 145 / 0.2)",
                boxShadow: "0 24px 80px oklch(0 0 0 / 0.4)",
              }}
            >
              <form onSubmit={handleContactSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium"
                    style={{ color: "oklch(0.75 0.06 145)" }}
                  >
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    data-ocid="contact.input"
                    placeholder="Your full name"
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm((p) => ({ ...p, name: e.target.value }))
                    }
                    className="rounded-xl text-sm h-12 border-0"
                    style={{
                      backgroundColor: "oklch(0.14 0.025 250)",
                      color: "oklch(0.9 0.03 145)",
                      outline: "1px solid oklch(0.72 0.2 145 / 0.2)",
                    }}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="phone"
                    className="text-sm font-medium"
                    style={{ color: "oklch(0.75 0.06 145)" }}
                  >
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={contactForm.phone}
                    onChange={(e) =>
                      setContactForm((p) => ({ ...p, phone: e.target.value }))
                    }
                    className="rounded-xl text-sm h-12 border-0"
                    style={{
                      backgroundColor: "oklch(0.14 0.025 250)",
                      color: "oklch(0.9 0.03 145)",
                      outline: "1px solid oklch(0.72 0.2 145 / 0.2)",
                    }}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="problem"
                    className="text-sm font-medium"
                    style={{ color: "oklch(0.75 0.06 145)" }}
                  >
                    Health Problem
                  </Label>
                  <Textarea
                    id="problem"
                    placeholder="Describe your health concern in detail..."
                    rows={4}
                    value={contactForm.problem}
                    onChange={(e) =>
                      setContactForm((p) => ({ ...p, problem: e.target.value }))
                    }
                    className="rounded-xl text-sm resize-none border-0"
                    style={{
                      backgroundColor: "oklch(0.14 0.025 250)",
                      color: "oklch(0.9 0.03 145)",
                      outline: "1px solid oklch(0.72 0.2 145 / 0.2)",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  data-ocid="contact.submit_button"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: G,
                    color: DARK,
                    boxShadow: "0 0 16px oklch(0.72 0.2 145 / 0.35)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      const b = e.currentTarget as HTMLButtonElement;
                      b.style.transform = "translateY(-1px)";
                      b.style.boxShadow = "0 0 28px oklch(0.72 0.2 145 / 0.55)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    const b = e.currentTarget as HTMLButtonElement;
                    b.style.transform = "translateY(0)";
                    b.style.boxShadow = "0 0 16px oklch(0.72 0.2 145 / 0.35)";
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>

                <div className="relative flex items-center gap-3 py-1">
                  <div
                    className="flex-1 h-px"
                    style={{ backgroundColor: "oklch(0.72 0.2 145 / 0.15)" }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: "oklch(0.5 0.04 145)" }}
                  >
                    or
                  </span>
                  <div
                    className="flex-1 h-px"
                    style={{ backgroundColor: "oklch(0.72 0.2 145 / 0.15)" }}
                  />
                </div>

                <a
                  href="https://wa.me/918008400864"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="contact.whatsapp_button"
                  className="flex items-center justify-center gap-3 w-full h-12 rounded-xl font-semibold text-sm transition-all duration-300"
                  style={{
                    backgroundColor: "oklch(0.5 0.2 145)",
                    color: "oklch(0.97 0.01 145)",
                  }}
                  onMouseEnter={(e) => {
                    const a = e.currentTarget as HTMLAnchorElement;
                    a.style.backgroundColor = "oklch(0.55 0.22 145)";
                    a.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    const a = e.currentTarget as HTMLAnchorElement;
                    a.style.backgroundColor = "oklch(0.5 0.2 145)";
                    a.style.transform = "translateY(0)";
                  }}
                >
                  <SiWhatsapp className="w-5 h-5" /> Chat on WhatsApp
                </a>
              </form>
            </motion.div>

            <motion.div
              variants={itemV}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: "oklch(0.72 0.2 145 / 0.1)",
                    border: "1px solid oklch(0.72 0.2 145 / 0.2)",
                  }}
                >
                  <Phone className="w-4 h-4" style={{ color: G }} />
                </div>
                <div>
                  <p
                    className="text-xs"
                    style={{ color: "oklch(0.55 0.04 145)" }}
                  >
                    Phone
                  </p>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "oklch(0.9 0.04 145)" }}
                  >
                    +91 80084 00864
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: "oklch(0.5 0.2 145 / 0.1)",
                    border: "1px solid oklch(0.5 0.2 145 / 0.3)",
                  }}
                >
                  <MessageCircle
                    className="w-4 h-4"
                    style={{ color: "oklch(0.6 0.2 145)" }}
                  />
                </div>
                <div>
                  <p
                    className="text-xs"
                    style={{ color: "oklch(0.55 0.04 145)" }}
                  >
                    WhatsApp
                  </p>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "oklch(0.9 0.04 145)" }}
                  >
                    Available 24/7
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ADMIN SECTION */}
      <section
        id="admin"
        className="py-16 px-4 sm:px-6"
        style={{ backgroundColor: "oklch(0.075 0.014 250)" }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={containerV}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <motion.div variants={itemV} className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Lock
                  className="w-4 h-4"
                  style={{ color: "oklch(0.55 0.04 145)" }}
                />
                <span
                  className="text-xs font-semibold tracking-widest uppercase"
                  style={{ color: "oklch(0.45 0.03 145)" }}
                >
                  Admin Access
                </span>
              </div>

              <button
                type="button"
                data-ocid="admin.primary_button"
                onClick={handleViewInquiries}
                disabled={adminLoading}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  backgroundColor:
                    adminOpen && inquiries !== null
                      ? "oklch(0.72 0.2 145 / 0.15)"
                      : "oklch(0.72 0.2 145 / 0.08)",
                  border: "1px solid oklch(0.72 0.2 145 / 0.25)",
                  color: G,
                }}
                onMouseEnter={(e) => {
                  if (!adminLoading) {
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = "oklch(0.72 0.2 145 / 0.18)";
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    adminOpen && inquiries !== null
                      ? "oklch(0.72 0.2 145 / 0.15)"
                      : "oklch(0.72 0.2 145 / 0.08)";
                }}
              >
                {adminLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
                {adminLoading
                  ? "Checking access..."
                  : adminOpen && inquiries !== null
                    ? "Hide Inquiries"
                    : "View Inquiries (Admin)"}
              </button>
            </motion.div>

            <AnimatePresence>
              {adminOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  {adminDenied ? (
                    <div
                      className="rounded-2xl p-6 text-center"
                      data-ocid="admin.error_state"
                      style={{
                        backgroundColor: CARD_BG,
                        border: "1px solid oklch(0.72 0.2 145 / 0.15)",
                      }}
                    >
                      <Lock
                        className="w-8 h-8 mx-auto mb-3"
                        style={{ color: "oklch(0.55 0.04 145)" }}
                      />
                      <p
                        className="text-sm font-medium mb-1"
                        style={{ color: "oklch(0.85 0.04 145)" }}
                      >
                        Admin access required
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "oklch(0.55 0.04 145)" }}
                      >
                        Contact Prashanth Reddy to get admin access.
                      </p>
                    </div>
                  ) : inquiries !== null ? (
                    <div
                      className="rounded-2xl overflow-hidden"
                      data-ocid="admin.table"
                      style={{
                        backgroundColor: CARD_BG,
                        border: "1px solid oklch(0.72 0.2 145 / 0.2)",
                      }}
                    >
                      <div
                        className="flex items-center justify-between px-6 py-4"
                        style={{
                          borderBottom: "1px solid oklch(0.72 0.2 145 / 0.12)",
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <ShieldCheck
                            className="w-4 h-4"
                            style={{ color: G }}
                          />
                          <span
                            className="font-semibold text-sm"
                            style={{ color: "oklch(0.9 0.04 145)" }}
                          >
                            Contact Submissions
                          </span>
                        </div>
                        <span
                          className="text-xs px-2.5 py-1 rounded-full font-medium"
                          style={{
                            backgroundColor: "oklch(0.72 0.2 145 / 0.12)",
                            color: G,
                          }}
                        >
                          {inquiries.length} total
                        </span>
                      </div>

                      {inquiries.length === 0 ? (
                        <div
                          className="py-12 text-center"
                          data-ocid="admin.empty_state"
                        >
                          <p
                            className="text-sm"
                            style={{ color: "oklch(0.5 0.03 145)" }}
                          >
                            No inquiries yet.
                          </p>
                        </div>
                      ) : (
                        <div
                          className="divide-y"
                          style={{ borderColor: "oklch(0.72 0.2 145 / 0.08)" }}
                        >
                          {inquiries.map((inq, idx) => (
                            <div
                              key={String(inq.timestamp)}
                              data-ocid={`admin.row.${idx + 1}`}
                              className="px-6 py-4 grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4 items-start"
                            >
                              <div>
                                <p
                                  className="text-xs font-semibold uppercase tracking-wider mb-1"
                                  style={{ color: "oklch(0.45 0.03 145)" }}
                                >
                                  Name
                                </p>
                                <p
                                  className="text-sm font-medium"
                                  style={{ color: "oklch(0.9 0.04 145)" }}
                                >
                                  {inq.name}
                                </p>
                              </div>
                              <div>
                                <p
                                  className="text-xs font-semibold uppercase tracking-wider mb-1"
                                  style={{ color: "oklch(0.45 0.03 145)" }}
                                >
                                  Phone
                                </p>
                                <p
                                  className="text-sm"
                                  style={{ color: "oklch(0.8 0.05 145)" }}
                                >
                                  {inq.phone}
                                </p>
                              </div>
                              <div>
                                <p
                                  className="text-xs font-semibold uppercase tracking-wider mb-1"
                                  style={{ color: "oklch(0.45 0.03 145)" }}
                                >
                                  Health Problem
                                </p>
                                <p
                                  className="text-sm leading-relaxed"
                                  style={{ color: "oklch(0.8 0.05 145)" }}
                                >
                                  {inq.problem}
                                </p>
                              </div>
                              <div>
                                <p
                                  className="text-xs font-semibold uppercase tracking-wider mb-1"
                                  style={{ color: "oklch(0.45 0.03 145)" }}
                                >
                                  Date
                                </p>
                                <p
                                  className="text-xs"
                                  style={{ color: "oklch(0.6 0.04 145)" }}
                                >
                                  {new Date(
                                    Number(inq.timestamp / 1_000_000n),
                                  ).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : null}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="py-10 px-4 sm:px-6"
        style={{
          backgroundColor: "oklch(0.07 0.012 250)",
          borderTop: "1px solid oklch(0.72 0.2 145 / 0.1)",
        }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: "oklch(0.72 0.2 145 / 0.15)",
                border: "1px solid oklch(0.72 0.2 145 / 0.3)",
              }}
            >
              <Heart className="w-4 h-4" style={{ color: G }} />
            </div>
            <div>
              <p
                className="text-sm font-display font-bold"
                style={{ color: G }}
              >
                Vestige AI
              </p>
              <p className="text-xs" style={{ color: "oklch(0.45 0.03 145)" }}>
                Health Assistant
              </p>
            </div>
          </div>
          <p
            className="text-xs text-center"
            style={{ color: "oklch(0.45 0.03 145)" }}
          >
            &copy; {new Date().getFullYear()} Prashanth Reddy | Vestige AI
            Assistant
          </p>
          <p className="text-xs" style={{ color: "oklch(0.4 0.025 145)" }}>
            Built with &#10084;&#65039; using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "oklch(0.65 0.12 145)" }}
              className="hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
