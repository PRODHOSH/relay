"use client";

import Image from "next/image";
import { useState } from "react";

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, display: "flex", justifyContent: "center", padding: "24px 16px 0" }}>
      <nav style={{
        background: "rgba(255, 255, 255, 0.3)",
        backdropFilter: "blur(50px)",
        WebkitBackdropFilter: "blur(50px)",
        border: "1px solid rgba(0,0,0,0.1)",
        boxShadow: "inset 0px 4px 4px 0px rgba(255,255,255,0.25)",
        borderRadius: "16px",
        padding: "10px 24px",
        display: "flex",
        alignItems: "center",
        gap: "32px",
      }}>
        {/* Logo */}
        <a href="#" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", flexShrink: 0 }}>
          <Image src="/relay-icon.png" alt="Relay" width={26} height={26} style={{ objectFit: "contain" }} />
          <span style={{ fontFamily: "Fustat, sans-serif", fontWeight: 700, fontSize: "18px", color: "#0f172a" }}>
            Relay
          </span>
        </a>

        {/* Desktop links */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }} className="hidden-mobile">
          {["Features", "How it works", "GitHub", "Docs"].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              style={{ fontSize: "14px", fontWeight: 500, color: "#64748b", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#0084FF")}
              onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA */}
        <a href="https://github.com" target="_blank" rel="noopener noreferrer"
          style={{
            background: "rgba(0,132,255,0.85)",
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
            borderRadius: "12px",
            boxShadow: "inset 0px 4px 4px 0px rgba(255,255,255,0.35)",
            padding: "9px 20px",
            color: "white",
            fontSize: "14px",
            fontWeight: 600,
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "transform 0.2s, opacity 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
          className="hidden-mobile"
        >
          Get Started
          <span style={{
            width: "20px", height: "20px", borderRadius: "50%",
            background: "rgba(255,255,255,0.3)", display: "flex",
            alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 8L8 2M8 2H3M8 2V7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </a>

        {/* Mobile toggle */}
        <button onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#374151", marginLeft: "8px" }}
          className="show-mobile"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d={menuOpen ? "M4 4L18 18M4 18L18 4" : "M3 6h16M3 11h16M3 16h16"} stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </nav>
    </div>
  );
}

// ─── Star Rating Badge ────────────────────────────────────────────────────────
function StarBadge() {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: "10px",
      background: "rgba(255,255,255,0.6)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      border: "1px solid rgba(0,132,255,0.15)",
      boxShadow: "inset 0px 1px 2px rgba(255,255,255,0.6)",
      borderRadius: "100px",
      padding: "8px 16px",
    }}>
      <div style={{ display: "flex", gap: "2px" }}>
        {[...Array(5)].map((_, i) => (
          <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="#FF801E">
            <path d="M7 1L8.76 5.1H13.11L9.67 7.9L10.94 12.1L7 9.5L3.06 12.1L4.33 7.9L0.89 5.1H5.24L7 1Z"/>
          </svg>
        ))}
      </div>
      <span style={{ fontSize: "13px", fontWeight: 500, color: "#374151" }}>
        Rated <strong style={{ color: "#111827" }}>4.9/5</strong> by 2,700+ users
      </span>
    </div>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
      {/* Background glow */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div style={{
          position: "absolute", top: "-200px", left: "-150px",
          width: "700px", height: "700px",
          background: "radial-gradient(ellipse at center, #60B1FF 0%, transparent 70%)",
          filter: "blur(80px)", opacity: 0.45,
        }} />
        <div style={{
          position: "absolute", top: "-80px", left: "80px",
          width: "500px", height: "500px",
          background: "radial-gradient(ellipse at center, #319AFF 0%, transparent 70%)",
          filter: "blur(120px)", opacity: 0.3,
        }} />
      </div>

      <div style={{
        position: "relative", zIndex: 10, width: "100%",
        maxWidth: "1400px", margin: "0 auto",
        padding: "160px 64px 80px",
        display: "flex", flexDirection: "row", alignItems: "center",
        gap: "64px",
      }} className="hero-container">
        {/* Left */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "28px", maxWidth: "600px" }}>
          <StarBadge />

          <h1 style={{
            fontFamily: "Fustat, sans-serif", fontWeight: 800,
            fontSize: "clamp(42px, 5vw, 72px)", lineHeight: 1.05,
            letterSpacing: "-2px", color: "#0f172a", margin: 0,
          }}>
            Send smarter,{" "}
            <span style={{ color: "#0084FF" }}>deliver faster</span>
          </h1>

          <p style={{
            fontFamily: "Inter, sans-serif", fontSize: "18px",
            lineHeight: 1.7, letterSpacing: "-0.5px",
            color: "#64748b", margin: 0, maxWidth: "520px",
          }}>
            Generate personalized LaTeX PDFs from templates and CSV data, then
            automatically deliver them to your entire audience by email.
            Open-source, runs on your machine.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center" }}>
            <a href="#features"
              style={{
                display: "inline-flex", alignItems: "center", gap: "12px",
                background: "rgba(0,132,255,0.85)",
                backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)",
                borderRadius: "16px",
                boxShadow: "inset 0px 4px 4px 0px rgba(255,255,255,0.35)",
                padding: "14px 28px", color: "white",
                fontSize: "15px", fontWeight: 600,
                textDecoration: "none", transition: "transform 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              Get Started Now
              <span style={{
                width: "24px", height: "24px", borderRadius: "50%",
                background: "rgba(255,255,255,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M2 9L9 2M9 2H3.5M9 2V8" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </a>

            <a href="https://github.com" target="_blank" rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: "10px",
                padding: "14px 24px", borderRadius: "16px",
                border: "1.5px solid #e2e8f0",
                fontSize: "15px", fontWeight: 500, color: "#374151",
                textDecoration: "none", background: "rgba(255,255,255,0.7)",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#93c5fd"; e.currentTarget.style.color = "#0084FF"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#374151"; }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd"/>
              </svg>
              Star on GitHub
            </a>
          </div>

          {/* Tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", paddingTop: "8px" }}>
            {["100% Open Source", "Self-Hosted", "LaTeX Powered", "CSV → PDF → Email"].map((tag) => (
              <span key={tag} style={{
                padding: "6px 14px", borderRadius: "100px",
                fontSize: "12px", fontWeight: 600,
                color: "#2563eb", background: "#eff6ff",
                border: "1px solid #bfdbfe",
              }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Right: Orb */}
        <div style={{
          flex: 1, position: "relative", minHeight: "520px",
          display: "flex", alignItems: "flex-end", justifyContent: "center",
        }}>
          {/* Blue gradient blob behind the orb */}
          <div style={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            width: "500px", height: "500px",
            background: "radial-gradient(circle, #60B1FF 0%, transparent 70%)",
            filter: "blur(60px)", opacity: 0.3, zIndex: 0
          }} />
          
          <video
            autoPlay loop muted playsInline
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "contain", transform: "scale(1.25)", zIndex: 1,
              mixBlendMode: "multiply",
              filter: "invert(1) hue-rotate(180deg) saturate(300%) brightness(1.2) contrast(1.1)",
            }}
          >
            <source src="https://future.co/images/homepage/glassy-orb/orb-purple.webm" type="video/webm" />
          </video>
        </div>
      </div>
    </section>
  );
}

// ─── Trusted By ───────────────────────────────────────────────────────────────
function TrustedBy() {
  const logos = ["Interviewbuddy", "Unstop", "TruScholar", "OSEN", "BSPrep"];
  return (
    <section style={{ padding: "48px 64px", borderTop: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <p style={{ textAlign: "center", fontSize: "11px", fontWeight: 700, color: "#94a3b8", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "32px" }}>
          Trusted by top-tier product teams
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "60px" }}>
          {logos.map((name) => (
            <span key={name} style={{
              fontFamily: "Fustat, sans-serif", fontWeight: 800, fontSize: "20px",
              color: "#94a3b8", letterSpacing: "-0.5px",
              filter: "grayscale(1)", opacity: 0.5,
              transition: "all 0.3s", cursor: "default",
            }}
              onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.color = "#0084FF"; e.currentTarget.style.filter = "grayscale(0)"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "0.5"; e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.filter = "grayscale(1)"; }}
            >{name}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features ────────────────────────────────────────────────────────────────
const features = [
  { icon: "📄", title: "LaTeX Template Editor", desc: "Write and manage LaTeX templates with a full Monaco IDE. Use {{variable}} placeholders that get injected per-recipient from CSV data." },
  { icon: "📊", title: "CSV Batch Generation", desc: "Upload a CSV with one row per person. Relay injects each row into your template and generates a perfectly named PDF for every row automatically." },
  { icon: "📧", title: "Automated Email Delivery", desc: "Queue personalized emails with PDF attachments to your full audience list. Run the worker once to dispatch everything instantly." },
  { icon: "👥", title: "Audience Lists", desc: "Import and manage contact lists from CSV files. Segment your audience and send targeted campaigns to specific lists." },
  { icon: "📚", title: "PDF Library", desc: "Every generated PDF is saved and organized by batch in your local library. Browse, search, and download any file at any time." },
  { icon: "🔒", title: "Fully Self-Hosted", desc: "Your data never leaves your machine. Run Relay locally using Node.js + Prisma. No cloud subscriptions, no vendor lock-in." },
];

function Features() {
  return (
    <section id="features" style={{ padding: "96px 64px" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <span style={{
            display: "inline-block", padding: "6px 16px", borderRadius: "100px",
            fontSize: "13px", fontWeight: 700, color: "#2563eb",
            background: "#eff6ff", border: "1px solid #bfdbfe", marginBottom: "16px",
          }}>What Relay Does</span>
          <h2 style={{
            fontFamily: "Fustat, sans-serif", fontWeight: 800,
            fontSize: "clamp(32px, 3.5vw, 48px)", letterSpacing: "-1.5px",
            color: "#0f172a", marginBottom: "16px",
          }}>
            Everything you need to{" "}
            <span style={{ color: "#0084FF" }}>scale delivery</span>
          </h2>
          <p style={{ fontSize: "17px", color: "#64748b", maxWidth: "540px", margin: "0 auto", lineHeight: 1.7 }}>
            From template editing to mass PDF generation to email dispatch — Relay handles the entire workflow end-to-end.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }} className="features-grid">
          {features.map((f) => (
            <div key={f.title}
              style={{
                background: "rgba(255,255,255,0.8)",
                border: "1.5px solid #e2e8f0",
                borderRadius: "20px",
                padding: "32px",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                transition: "all 0.3s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "#93c5fd";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,132,255,0.08)";
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{
                width: "52px", height: "52px", borderRadius: "14px",
                background: "#eff6ff", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "24px", marginBottom: "20px",
              }}>{f.icon}</div>
              <h3 style={{ fontFamily: "Fustat, sans-serif", fontWeight: 700, fontSize: "18px", color: "#0f172a", marginBottom: "10px" }}>
                {f.title}
              </h3>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ────────────────────────────────────────────────────────────
const steps = [
  { num: "01", title: "Write your LaTeX template", desc: "Use the built-in Monaco editor. Add {{name}}, {{role}}, or any variable placeholders." },
  { num: "02", title: "Upload a CSV file", desc: "Each row becomes one PDF. CSV headers map to your template variables automatically." },
  { num: "03", title: "Run batch generation", desc: "Relay compiles every row into a perfectly personalized PDF, organized in a named folder." },
  { num: "04", title: "Queue & dispatch emails", desc: "Attach PDFs, pick your audience list, and run node worker.js --once to send everything." },
];

function HowItWorks() {
  return (
    <section id="how-it-works" style={{ padding: "96px 64px", background: "linear-gradient(180deg, #fff 0%, #f8faff 100%)" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <span style={{
            display: "inline-block", padding: "6px 16px", borderRadius: "100px",
            fontSize: "13px", fontWeight: 700, color: "#2563eb",
            background: "#eff6ff", border: "1px solid #bfdbfe", marginBottom: "16px",
          }}>Simple Workflow</span>
          <h2 style={{
            fontFamily: "Fustat, sans-serif", fontWeight: 800,
            fontSize: "clamp(32px, 3.5vw, 48px)", letterSpacing: "-1.5px", color: "#0f172a",
          }}>
            Four steps from template to inbox
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }} className="steps-grid">
          {steps.map((step) => (
            <div key={step.num} style={{
              background: "white", border: "1.5px solid #e2e8f0", borderRadius: "20px",
              padding: "28px", transition: "all 0.3s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#93c5fd"; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <span style={{
                fontFamily: "Fustat, sans-serif", fontWeight: 800,
                fontSize: "13px", color: "#93c5fd", display: "block", marginBottom: "16px",
              }}>{step.num}</span>
              <h3 style={{ fontFamily: "Fustat, sans-serif", fontWeight: 700, fontSize: "17px", color: "#0f172a", marginBottom: "10px" }}>
                {step.title}
              </h3>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.7, margin: 0 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Terminal Block ───────────────────────────────────────────────────────────
function QuickStart() {
  return (
    <section style={{ padding: "80px 64px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
        <h2 style={{
          fontFamily: "Fustat, sans-serif", fontWeight: 800,
          fontSize: "clamp(28px, 3vw, 40px)", letterSpacing: "-1.5px",
          color: "#0f172a", marginBottom: "40px",
        }}>
          Up and running in <span style={{ color: "#0084FF" }}>minutes</span>
        </h2>
        <div style={{
          background: "#0f172a", borderRadius: "20px",
          padding: "32px 36px", textAlign: "left",
          boxShadow: "0 24px 60px rgba(0,0,0,0.12)",
        }}>
          <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <div key={c} style={{ width: "12px", height: "12px", borderRadius: "50%", background: c }} />
            ))}
          </div>
          {[
            { prompt: "$", cmd: "git clone https://github.com/yourname/relay", comment: "" },
            { prompt: "$", cmd: "cd relay && npm install", comment: "" },
            { prompt: "$", cmd: "npx prisma db push", comment: "" },
            { prompt: "$", cmd: "npm run dev", comment: "# dashboard at localhost:3000" },
          ].map((line, i) => (
            <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "10px", fontFamily: "monospace", fontSize: "14px" }}>
              <span style={{ color: "#0084FF", userSelect: "none" }}>{line.prompt}</span>
              <span style={{ color: "#e2e8f0" }}>{line.cmd}</span>
              {line.comment && <span style={{ color: "#64748b" }}>{line.comment}</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ─────────────────────────────────────────────────────────────────────
function CTA() {
  return (
    <section style={{ padding: "80px 64px" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{
          background: "linear-gradient(135deg, #0055FF 0%, #0084FF 50%, #00AAFF 100%)",
          borderRadius: "28px", padding: "80px 64px", textAlign: "center",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: "-100px", right: "-100px", width: "400px", height: "400px",
            background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)",
            borderRadius: "50%",
          }} />
          <h2 style={{
            fontFamily: "Fustat, sans-serif", fontWeight: 800, color: "white",
            fontSize: "clamp(32px, 3.5vw, 50px)", letterSpacing: "-1.5px",
            marginBottom: "16px", position: "relative", zIndex: 1,
          }}>Ready to automate your delivery?</h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "17px", maxWidth: "500px", margin: "0 auto 36px", lineHeight: 1.7, position: "relative", zIndex: 1 }}>
            Clone the repo, run it locally, and start sending personalized PDFs in minutes.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center", position: "relative", zIndex: 1 }}>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: "10px",
                background: "white", color: "#0055FF", fontWeight: 700,
                fontSize: "15px", padding: "14px 28px", borderRadius: "14px",
                textDecoration: "none", transition: "all 0.2s",
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#eff6ff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "white"; }}
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd"/>
              </svg>
              Clone on GitHub
            </a>
            <a href="#docs"
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                color: "white", fontWeight: 600, fontSize: "15px",
                padding: "14px 28px", borderRadius: "14px", textDecoration: "none",
                border: "1.5px solid rgba(255,255,255,0.3)",
                background: "rgba(255,255,255,0.1)", transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
            >
              Read the Docs
            </a>
          </div>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", marginTop: "24px", position: "relative", zIndex: 1 }}>
            Free forever · Self-hosted · No account required
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ borderTop: "1px solid #f1f5f9", padding: "36px 64px" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Image src="/relay-icon.png" alt="Relay" width={22} height={22} style={{ objectFit: "contain" }} />
          <span style={{ fontFamily: "Fustat, sans-serif", fontWeight: 800, fontSize: "16px", color: "#0f172a" }}>Relay</span>
        </div>
        <p style={{ fontSize: "13px", color: "#94a3b8" }}>Open-source PDF & email relay · Built with Next.js, Prisma & LaTeX</p>
        <div style={{ display: "flex", gap: "24px" }}>
          {["GitHub", "Docs", "Issues"].map((l) => (
            <a key={l} href="https://github.com"
              style={{ fontSize: "13px", color: "#94a3b8", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#0084FF"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#94a3b8"; }}
            >{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .hero-container { flex-direction: column !important; padding: 120px 24px 60px !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr 1fr !important; }
          .hidden-mobile { display: none !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
      <main style={{ background: "white", overflowX: "hidden" }}>
        <Navbar />
        <Hero />
        <TrustedBy />
        <Features />
        <HowItWorks />
        <QuickStart />
        <CTA />
        <Footer />
      </main>
    </>
  );
}
