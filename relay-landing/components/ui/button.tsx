import * as React from "react";
import { ArrowRight } from "lucide-react";

export function Button({ text = "Get Started", href, onClick }: { text?: string, href?: string, onClick?: () => void }) {
  const content = (
    <>
      <span>{text}</span>
      <ArrowRight size={16} />
    </>
  );

  const style = {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "#fff",
    color: "#09090b",
    padding: "12px 24px",
    borderRadius: "100px",
    fontSize: "14px",
    fontWeight: 600,
    fontFamily: "'Bricolage Grotesque', sans-serif",
    textDecoration: "none",
    cursor: "pointer",
    border: "none",
    transition: "transform 0.2s"
  };

  if (href) {
    return (
      <a href={href} style={style} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} style={style} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
      {content}
    </button>
  );
}
