"use client";

import React, { useState, useEffect, useRef } from 'react';
import SignInModal from './SignInModal';

export default function Hero() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  // Refs for animation
  const pipelineRef = useRef<HTMLDivElement>(null);
  const nodeStackRef = useRef<HTMLDivElement>(null);
  const nodeXRef = useRef<HTMLDivElement>(null);
  const nodeShieldRef = useRef<HTMLDivElement>(null);
  const glowPathRef = useRef<SVGPathElement>(null);
  const corePathRef = useRef<SVGPathElement>(null);
  const gradientRef = useRef<SVGLinearGradientElement>(null);
  const splashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let reqId: number;
    let state = 'p1';
    let lastStateChange = performance.now();

    const updatePath = () => {
      if (!pipelineRef.current || !nodeStackRef.current || !nodeXRef.current || !nodeShieldRef.current) return;
      const pRect = pipelineRef.current.getBoundingClientRect();
      const sRect = nodeStackRef.current.getBoundingClientRect();
      const xRect = nodeXRef.current.getBoundingClientRect();
      const shRect = nodeShieldRef.current.getBoundingClientRect();

      const startX = sRect.left + sRect.width / 2 - pRect.left;
      const startY = sRect.top + sRect.height / 2 - pRect.top;
      const midX = xRect.left + xRect.width / 2 - pRect.left;
      const midY = xRect.top + xRect.height / 2 - pRect.top;
      const endX = shRect.left + shRect.width / 2 - pRect.left;
      const endY = shRect.top + shRect.height / 2 - pRect.top;

      const d = `M ${startX},${startY} L ${midX},${midY} L ${endX},${endY}`;
      if (glowPathRef.current) glowPathRef.current.setAttribute('d', d);
      if (corePathRef.current) corePathRef.current.setAttribute('d', d);
    };

    updatePath();
    window.addEventListener('resize', updatePath);

    const animate = (time: number) => {
      const elapsed = time - lastStateChange;
      
      if (!nodeStackRef.current || !nodeShieldRef.current || !splashRef.current || !gradientRef.current) {
        reqId = requestAnimationFrame(animate);
        return;
      }

      if (state === 'p1') {
        const percentage = Math.min(elapsed / 800, 1) * 0.5;
        const center = percentage * 100;
        gradientRef.current.setAttribute('x1', `${center - 5}%`);
        gradientRef.current.setAttribute('x2', `${center + 5}%`);
        
        if (percentage < 0.4) {
          nodeStackRef.current.classList.add('active');
        } else {
          nodeStackRef.current.classList.remove('active');
        }

        if (elapsed >= 800) {
          state = 'splash';
          lastStateChange = time;
          if (glowPathRef.current) glowPathRef.current.style.opacity = '0';
          if (corePathRef.current) corePathRef.current.style.opacity = '0';
          splashRef.current.classList.add('animate');
        }
      } else if (state === 'splash') {
        if (elapsed >= 800) {
          state = 'p2';
          lastStateChange = time;
          splashRef.current.classList.remove('animate');
          if (glowPathRef.current) glowPathRef.current.style.opacity = '0.6';
          if (corePathRef.current) corePathRef.current.style.opacity = '1';
        }
      } else if (state === 'p2') {
        const percentage = 0.5 + Math.min(elapsed / 800, 1) * 0.5;
        const center = percentage * 100;
        gradientRef.current.setAttribute('x1', `${center - 5}%`);
        gradientRef.current.setAttribute('x2', `${center + 5}%`);

        if (percentage > 0.6) {
          nodeShieldRef.current.classList.add('active');
        }

        if (elapsed >= 800) {
          state = 'idle';
          lastStateChange = time;
          nodeShieldRef.current.classList.remove('active');
        }
      } else if (state === 'idle') {
        if (elapsed >= 1000) {
          state = 'p1';
          lastStateChange = time;
        }
      }

      reqId = requestAnimationFrame(animate);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', updatePath);
      cancelAnimationFrame(reqId);
    };
  }, []);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : '';
  };

  return (
    <>
      <nav className="nav-xero">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Relay Logo" className="w-8 h-8 rounded-none border border-white/20 shadow-[2px_2px_0px_rgba(176,48,136,0.8)] object-cover" />
          <span className="nav-logo">Relay</span>
        </div>
        <ul className={`nav-links nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <a href="#">Method</a>
          <a href="#">Pricing</a>
          <a href="#">Docs</a>
          <div className="nav-actions md:hidden flex">
            <button className="btn-login" onClick={() => setIsSignInModalOpen(true)}>Log in</button>
            <button className="btn-signup" onClick={() => setIsSignInModalOpen(true)}>Sign up</button>
          </div>
        </ul>
        <div className="nav-actions hidden md:flex">
          <button className="btn-login" onClick={() => setIsSignInModalOpen(true)}>Log in</button>
          <button className="btn-signup" onClick={() => setIsSignInModalOpen(true)}>Sign up</button>
        </div>
        <button className={`menu-toggle ${isMobileMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
        </button>
      </nav>

      <section className="hero-card">
        <div className="hero-grid"></div>
        
        <div className="icon-pipeline" ref={pipelineRef}>
          <svg className="beam-svg">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <linearGradient id="beam-gradient" gradientUnits="userSpaceOnUse" y1="0%" y2="0%" ref={gradientRef}>
                <stop offset="0%" stopColor="#b04090" stopOpacity="0" />
                <stop offset="20%" stopColor="#b04090" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#fff" stopOpacity="1" />
                <stop offset="80%" stopColor="#c8a0e0" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#c8a0e0" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path ref={glowPathRef} stroke="url(#beam-gradient)" strokeWidth="2" filter="url(#glow)" opacity="0.6" fill="none" />
            <path ref={corePathRef} stroke="url(#beam-gradient)" strokeWidth="0.8" fill="none" />
          </svg>

          <div className="icon-node node-light-right" ref={nodeStackRef} id="node-stack">
            <svg viewBox="0 0 24 24">
              <polygon points="12 2 2 7 12 12 22 7 12 2"/>
              <polyline points="2 17 12 22 22 17"/>
              <polyline points="2 12 12 17 22 12"/>
            </svg>
          </div>

          <div className="pipeline-line"></div>

          <div className="center-wrapper">
            <div className="splash" ref={splashRef}></div>
            <div className="icon-node-center" ref={nodeXRef} id="node-x">
              <svg viewBox="0 0 40 40">
                <path d="M12 8 L28 32 M28 8 L12 32" stroke="white" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <div className="pipeline-line right"></div>

          <div className="icon-node node-light-left" ref={nodeShieldRef} id="node-shield">
            <svg viewBox="0 0 24 24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <polyline points="9 12 11 14 15 10"/>
            </svg>
          </div>
        </div>

        <div className="hero-content">
          <h1 className="hero-heading">
            The simple way
            <strong>to drop-in email templates</strong>
          </h1>
          <p className="hero-sub">
            Fully managed email rendering and queueing<br/>
            platform for teams of all industries.
          </p>
          <a href="#" className="btn-cta" onClick={(e) => { e.preventDefault(); setIsSignInModalOpen(true); }}>Get Started</a>
        </div>
      </section>

      <div className="brands">
        <div className="brand-item">
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="currentColor" />
            <path fill="var(--bg)" d="M8 9h8v2H8zm0 4h6v2H8z" />
          </svg>
          Expedia
        </div>
        <div className="brand-item">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="7" r="4" />
            <circle cx="5" cy="16" r="3.5" />
            <circle cx="19" cy="16" r="3.5" />
          </svg>
          asana
        </div>
        <div className="brand-item">
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
            <polyline points="4 8 20 8" />
            <polyline points="4 12 12 12" />
            <polyline points="4 16 20 16" />
          </svg>
          zenefits
        </div>
        <div className="brand-item">
          <svg viewBox="0 0 24 24" stroke="currentColor" fill="none">
            <circle cx="15.5" cy="8.5" r="2.5" fill="currentColor" stroke="none" />
            <circle cx="8.5" cy="8.5" r="2" />
            <path d="M8.5 10.5 L15.5 10.5" strokeWidth="1" />
          </svg>
          HubSp<span className="hubspot-dot"></span>t
        </div>
        <div className="brand-item">
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="9" />
            <line x1="12" y1="3" x2="12" y2="21" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="5.6" y1="5.6" x2="18.4" y2="18.4" />
            <line x1="18.4" y1="5.6" x2="5.6" y2="18.4" />
          </svg>
          loom
        </div>
      </div>

      <SignInModal isOpen={isSignInModalOpen} onClose={() => setIsSignInModalOpen(false)} />
    </>
  );
}
