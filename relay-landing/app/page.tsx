"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import LightRays from "../components/LightRays";
import ClickSpark from "../components/ClickSpark";
import { Footer } from "../components/ui/footer";
import { Button } from "../components/ui/button";

// --- Utility Components ---
const GridBackground = () => (
  <div style={{
    position: "absolute",
    inset: 0,
    zIndex: 0,
    pointerEvents: "none",
    backgroundImage: `
      linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
    `,
    backgroundSize: "60px 60px",
    maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
    WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
  }} />
);

// --- Navbar ---
function Navbar() {
  return (
    <nav style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "20px 48px",
      position: "sticky",
      top: 0,
      background: "rgba(9, 9, 11, 0.6)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
      zIndex: 100,
    }}>
      {/* Logo */}
      <a href="#" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
        <Image src="/relay-logo-text.png" alt="Relay" width={110} height={30} style={{ filter: "brightness(0) invert(1)", objectFit: "contain", height: "auto" }} />
      </a>

      {/* Links */}
      <div style={{ display: "none", gap: "32px" }} className="md-flex">
        {["Why Choose Us", "Features", "FAQ", "GitHub"].map((link) => (
          <a key={link} href={`#${link.toLowerCase().replace(/ /g, "-")}`}
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "15px",
              fontWeight: 500,
              color: "#a1a1aa",
              textDecoration: "none",
              transition: "color 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.color = "#fff"}
            onMouseLeave={e => e.currentTarget.style.color = "#a1a1aa"}
          >
            {link}
          </a>
        ))}
      </div>
      <style>{`
        @media (min-width: 768px) { .md-flex { display: flex !important; } }
      `}</style>

      {/* Button */}
      <Button text="Get Started" href="http://localhost:3000" />
    </nav>
  );
}

// --- Hero ---
function Hero() {
  return (
    <section style={{ position: "relative", paddingTop: "60px", paddingBottom: "100px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", overflow: "hidden" }}>
      <GridBackground />
      
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}>
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={1.5}
          lightSpread={1.2}
          rayLength={1.5}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.05}
          distortion={0.05}
        />
      </div>

      <div style={{ position: "relative", zIndex: 10, maxWidth: "800px", padding: "0 24px" }}>
        <p style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: "14px",
          fontWeight: 600,
          color: "#a1a1aa",
          letterSpacing: "0.5px",
          marginBottom: "24px"
        }} className="animate-fade-in-up">
          Automate Document Workflows, Faster
        </p>
        
        <h1 style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: "clamp(40px, 6vw, 72px)",
          fontWeight: 700,
          color: "#fff",
          lineHeight: 1.1,
          letterSpacing: "-1.5px",
          marginBottom: "24px"
        }} className="animate-fade-in-up delay-100">
          Send smarter, deliver faster with a local document engine
        </h1>
        
        <p style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: "18px",
          color: "#a1a1aa",
          lineHeight: 1.6,
          maxWidth: "600px",
          margin: "0 auto 40px",
          fontWeight: 400
        }} className="animate-fade-in-up delay-200">
          Generate personalized LaTeX PDFs from templates and CSV data, then automatically deliver them to your entire audience by email. Open-source, runs on your machine.
        </p>
        
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", alignItems: "center" }} className="animate-fade-in-up delay-300">
          <Button text="Get Started" href="http://localhost:3000" />
          
          <a href="https://github.com/PRODHOSH/relay" target="_blank" rel="noopener noreferrer" style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "14px",
            fontWeight: 600,
            color: "#fff",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.15)",
            textDecoration: "none",
            padding: "0 24px",
            height: "44px",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            borderRadius: "100px",
            transition: "all 0.2s"
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            <span>View GitHub</span>
          </a>
        </div>
      </div>
      
      {/* Dashboard Placeholder */}
      <div style={{
        position: "relative",
        zIndex: 10,
        marginTop: "100px",
        width: "90%",
        maxWidth: "1100px",
        background: "#09090b",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "24px",
        boxShadow: "0 20px 80px rgba(0,0,0,0.8)",
        overflow: "hidden"
      }} className="animate-fade-in-up delay-400">
        {/* Top Bar of Fake Dashboard */}
        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "16px 24px", display: "flex", gap: "8px", background: "rgba(255,255,255,0.02)" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ef4444" }} />
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#eab308" }} />
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#22c55e" }} />
        </div>
        <div style={{ position: "relative", width: "100%", display: "block" }}>
          <Image 
            src="/hero.png"
            alt="Relay Dashboard screenshot"
            width={1920}
            height={1080}
            style={{ width: "100%", height: "auto", display: "block" }}
            priority
          />
        </div>
      </div>
    </section>
  );
}

// --- Trusted By ---
function TrustedBy() {
  const logos = [
    { name: "Next.js", font: "'Inter', sans-serif", weight: 700 },
    { name: "React", font: "'Inter', sans-serif", weight: 600 },
    { name: "Prisma", font: "'Inter', sans-serif", weight: 700 },
    { name: "Node.js", font: "'Inter', sans-serif", weight: 600 },
    { name: "Docker", font: "'Inter', sans-serif", weight: 700 },
    { name: "Tailwind", font: "'Inter', sans-serif", weight: 500 },
    { name: "PostgreSQL", font: "'Inter', sans-serif", weight: 600 },
    { name: "TypeScript", font: "'Inter', sans-serif", weight: 600 },
    { name: "LaTeX", font: "Georgia, serif", weight: 600 },
    { name: "AWS SES", font: "'Inter', sans-serif", weight: 600 }
  ];
  
  return (
    <section style={{ padding: "80px 24px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", background: "#09090b", padding: "48px", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)" }}>
        <h3 style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: "24px",
          fontWeight: 600,
          color: "#fff",
          marginBottom: "48px",
          textAlign: "center"
        }}>
          Built with Modern Open-Source Technologies
        </h3>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(5, 1fr)", 
          border: "1px dashed rgba(255,255,255,0.15)",
          borderRadius: "16px",
          overflow: "hidden" 
        }}>
          {logos.map((logo, i) => {
            const isRightEdge = (i + 1) % 5 === 0;
            const isBottomEdge = i >= 5;
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                height: "100px",
                borderRight: isRightEdge ? "none" : "1px dashed rgba(255,255,255,0.15)",
                borderBottom: isBottomEdge ? "none" : "1px dashed rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.01)"
              }}>
                <span style={{
                  fontFamily: logo.font,
                  fontWeight: logo.weight,
                  fontSize: "20px",
                  color: "#e4e4e7"
                }}>
                  {logo.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// --- Features ---
function Features() {
  const features = [
    {
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: "Dynamic PDF Generation",
      desc: "Compile beautifully formatted LaTeX templates instantly. Just map your CSV data and generate unforgeable PDFs at scale."
    },
    {
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "Local First & Secure",
      desc: "Your data never leaves your machine. Connect your own AWS SES or SMTP server and retain 100% data sovereignty over your email lists."
    },
    {
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "Batch Email Dispatch",
      desc: "Our decoupled Node.js background worker flawlessly queues and dispatches thousands of emails while you monitor the progress in real-time."
    }
  ];

  return (
    <section id="features" style={{ padding: "120px 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", textAlign: "center" }}>
        <p style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: "15px",
          fontWeight: 600,
          color: "#a1a1aa",
          marginBottom: "20px"
        }}>Why Choose Us</p>
        
        <h2 style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: "clamp(32px, 4vw, 48px)",
          fontWeight: 700,
          color: "#fff",
          lineHeight: 1.2,
          letterSpacing: "-1px",
          marginBottom: "16px"
        }}>
          We are Leading in Document Automation<br />with High-Performance Tools
        </h2>
        
        <p style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: "18px",
          color: "#71717a",
          marginBottom: "80px"
        }}>We are constantly keeping pace with modern open-source standards.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
          {features.map((f, i) => (
            <div key={i} style={{
              background: "#09090b",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "24px",
              padding: "48px 32px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              transition: "transform 0.3s",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              <GridBackground />
              
              <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ color: "#fff", marginBottom: "24px" }}>
                  {f.icon}
                </div>
                
                <h3 style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: "22px",
                  fontWeight: 600,
                  color: "#fff",
                  marginBottom: "16px"
                }}>{f.title}</h3>
                
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "15px",
                  color: "#a1a1aa",
                  lineHeight: 1.6,
                  marginBottom: "36px"
                }}>{f.desc}</p>
                
                <a href="#learn-more" style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#09090b",
                  background: "#fff",
                  textDecoration: "none",
                  padding: "12px 24px",
                  borderRadius: "100px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px"
                }}>
                  Learn More
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16M14 6l6 6-6 6" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Comparison ---
function Comparison() {
  const rows = [
    { name: "Zero Monthly SaaS Fees", relay: true, cloud: false, manual: true },
    { name: "Complete Data Privacy", relay: true, cloud: false, manual: true },
    { name: "Dynamic PDF Generation", relay: true, cloud: false, manual: false },
    { name: "Visual Template Editor", relay: true, cloud: true, manual: false },
    { name: "Automated Dispatch Queue", relay: true, cloud: true, manual: false },
  ];

  const Check = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" style={{ margin: "0 auto" }}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;
  const Cross = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" style={{ margin: "0 auto" }}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;

  return (
    <section style={{ padding: "100px 24px", display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: "1000px", width: "100%", textAlign: "center" }}>
        <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "15px", fontWeight: 600, color: "#a1a1aa", marginBottom: "16px" }}>
          Our Features
        </p>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, color: "#fff", marginBottom: "16px", letterSpacing: "-1px" }}>
          Experience the Difference<br/>with Relay
        </h2>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", color: "#71717a", marginBottom: "64px" }}>
          We excel in delivering an open-source solution that matches enterprise needs.
        </p>

        <div style={{
          background: "#09090b",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "24px",
          overflow: "hidden"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <th style={{ padding: "24px", textAlign: "left", width: "40%", position: "relative", overflow: "hidden" }}>
                  <GridBackground/>
                </th>
                <th style={{ padding: "24px", fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "18px", color: "#fff", fontWeight: 600, borderLeft: "1px solid rgba(255,255,255,0.05)" }}>Relay</th>
                <th style={{ padding: "24px", fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "18px", color: "#a1a1aa", fontWeight: 500, borderLeft: "1px solid rgba(255,255,255,0.05)" }}>SaaS Platforms</th>
                <th style={{ padding: "24px", fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "18px", color: "#a1a1aa", fontWeight: 500, borderLeft: "1px solid rgba(255,255,255,0.05)" }}>Manual Scripts</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} style={{ borderBottom: i === rows.length - 1 ? "none" : "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "24px", textAlign: "left", fontFamily: "'Inter', sans-serif", fontSize: "15px", color: "#e4e4e7", fontWeight: 500 }}>
                    {row.name}
                  </td>
                  <td style={{ padding: "24px", borderLeft: "1px solid rgba(255,255,255,0.05)" }}>{row.relay ? <Check /> : <Cross />}</td>
                  <td style={{ padding: "24px", borderLeft: "1px solid rgba(255,255,255,0.05)" }}>{row.cloud ? <Check /> : <Cross />}</td>
                  <td style={{ padding: "24px", borderLeft: "1px solid rgba(255,255,255,0.05)" }}>{row.manual ? <Check /> : <Cross />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}


// --- FAQ ---
function FAQ() {
  const faqs = [
    { q: "What do I need to run Relay?", a: "Just Node.js and Docker (for LaTeX). Relay is fully self-hosted and incredibly lightweight." },
    { q: "Can I use my own SMTP server?", a: "Yes, Relay supports any standard SMTP server or direct integration with Resend/AWS SES." },
    { q: "Is it really free?", a: "Yes, Relay is 100% open-source and free to use forever. You only pay your email provider for the emails you send." },
    { q: "Are the PDFs customizable?", a: "Absolutely. Relay uses a robust LaTeX engine, allowing pixel-perfect precision and dynamic variables pulled straight from your CSV." }
  ];

  return (
    <section id="faq" style={{ padding: "100px 24px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(32px, 4vw, 44px)", fontWeight: 700, color: "#fff", marginBottom: "16px", letterSpacing: "-1px" }}>
            Frequently Asked Questions
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", color: "#71717a" }}>
            Find answers to common questions about setting up and using Relay.
          </p>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "32px" }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.02)", padding: "32px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "18px", fontWeight: 600, color: "#fff", marginBottom: "12px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="2" style={{ marginTop: "2px", flexShrink: 0 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {faq.q}
              </h3>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", color: "#a1a1aa", lineHeight: 1.6, marginLeft: "32px", margin: 0 }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
  );
}

export default function Home() {
  return (
    <ClickSpark sparkColor='#fff' sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <style>{`
        @media (min-width: 768px) { .md-flex { display: flex !important; } }
        @media (max-width: 1024px) { .masonry-grid-lg { column-count: 2 !important; } }
        @media (max-width: 768px) { .masonry-grid, .masonry-grid-lg { column-count: 1 !important; } }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
      `}</style>
      <Navbar />
      <Hero />
      <TrustedBy />
      <Features />
      <Comparison />
      <FAQ />
      <Footer />
      </div>
    </ClickSpark>
  );
}
