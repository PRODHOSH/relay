'use client';

import * as React from "react";
import Image from "next/image";
import { Globe, ArrowRight, CheckCircle2 } from "lucide-react";

export function Footer() {
  const [email, setEmail] = React.useState("");
  const [isSubscribed, setIsSubscribed] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer style={{ position: "relative", overflow: "hidden", background: "#09090b", borderTop: "1px solid rgba(255,255,255,0.1)", padding: "64px 24px 32px", marginTop: "80px" }}>
      {/* Background Embossed Logo */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 0, opacity: 0.03, pointerEvents: "none", width: "100%", display: "flex", justifyContent: "center" }}>
        <Image 
          src="/relay-logo-text.png" 
          alt="Relay Background" 
          width={1200} 
          height={336} 
          style={{ filter: "brightness(0) invert(1)", width: "80%", height: "auto", maxWidth: "1200px", objectFit: "contain" }} 
        />
      </div>

      <div style={{ position: "relative", zIndex: 10, maxWidth: "1200px", margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "48px" }}>
        
        {/* Left Side */}
        <div style={{ flex: "0 1 400px" }}>
          <Image 
            src="/relay-logo-text.png" 
            alt="Relay Logo" 
            width={100} 
            height={28} 
            style={{ filter: "brightness(0) invert(1)", marginBottom: "24px" }} 
          />
          <p style={{ color: "#a1a1aa", fontSize: "14px", lineHeight: "1.6", fontFamily: "'Inter', sans-serif", marginBottom: "24px" }}>
            Generate, personalize, and deliver LaTeX PDFs to any audience — automatically. Open-source, local document engine.
          </p>
          <div style={{ maxWidth: "320px" }}>
            <p style={{ fontSize: "12px", textTransform: "uppercase", fontWeight: 600, color: "#a1a1aa", marginBottom: "12px", fontFamily: "'Bricolage Grotesque', sans-serif" }}>Stay Updated</p>
            {isSubscribed ? (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", background: "rgba(255,255,255,0.05)", borderRadius: "12px", color: "#34d399", fontSize: "14px" }}>
                <CheckCircle2 size={16} /> Thank you for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px" }}>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Enter your email" 
                  required 
                  style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: "10px 16px", borderRadius: "12px", color: "#fff", fontSize: "14px", outline: "none" }} 
                />
                <button type="submit" style={{ background: "#fff", color: "#09090b", padding: "0 16px", borderRadius: "12px", fontWeight: 600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                  Subscribe <ArrowRight size={14} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Side */}
        <div style={{ flex: "0 1 350px", display: "flex", flexDirection: "column", alignItems: "flex-end", textAlign: "right" }}>
          <p style={{ fontSize: "12px", textTransform: "uppercase", fontWeight: 600, color: "#a1a1aa", marginBottom: "16px", fontFamily: "'Bricolage Grotesque', sans-serif" }}>Maker</p>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", marginBottom: "20px", transition: "all 0.3s cursor-pointer", cursor: "pointer" }} onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateY(0)"; }}>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: "#fff", fontSize: "14px", fontWeight: 600, margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif" }}>Prodhosh</p>
              <p style={{ color: "#a1a1aa", fontSize: "12px", margin: 0, fontFamily: "'Inter', sans-serif" }}>Creator of Relay</p>
            </div>
            <Image src="https://github.com/prodhosh.png" alt="Prodhosh" width={44} height={44} style={{ borderRadius: "50%", border: "2px solid rgba(255,255,255,0.1)" }} />
          </div>
          <div style={{ color: "#a1a1aa", fontSize: "13px", fontFamily: "'Inter', sans-serif", marginBottom: "16px", display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
            <span>Email: <a href="mailto:hello@prodhosh.me" style={{ color: "#fff", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#38bdf8"} onMouseLeave={e => e.currentTarget.style.color = "#fff"}>hello@prodhosh.me</a></span>
            <span>Portfolio: <a href="https://prodhosh.me" target="_blank" rel="noopener noreferrer" style={{ color: "#fff", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#38bdf8"} onMouseLeave={e => e.currentTarget.style.color = "#fff"}>prodhosh.me</a></span>
          </div>
          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <a href="https://github.com/prodhosh" target="_blank" rel="noopener noreferrer" style={{ color: "#a1a1aa", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#fff"} onMouseLeave={e => e.currentTarget.style.color = "#a1a1aa"}><Globe size={20} /></a>
          </div>
        </div>

      </div>

      <div style={{ maxWidth: "1200px", margin: "48px auto 0", paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", flexWrap: "wrap", justifyContent: "space-between", color: "#71717a", fontSize: "12px", fontFamily: "'Inter', sans-serif" }}>
        <p>© 2026 Relay. Built for local automation.</p>
        <p>Created by Prodhosh · Free & Open-source forever</p>
      </div>
    </footer>
  );
}
