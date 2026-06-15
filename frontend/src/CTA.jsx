import React, { useEffect, useRef, useState } from "react";
import "./CTA.css";

const CTA = () => {
  const ctaRef = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          setShow(true);
          obs.unobserve(entry.target); // run only once
        }
      },
      { threshold: 0.3 }
    );

    if (ctaRef.current) {
      observer.observe(ctaRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ctaRef}
      className={`cta ${show ? "active" : ""}`}
    >
      <div className="cta-bg"></div>

      <div className="cta-content">
        <span className="cta-badge">
          JOIN FREE — NO CREDIT CARD
        </span>

        <h2 className="cta-title">
          Ready to start earning?
        </h2>

        <p className="cta-description">
          Join millions of members already making real money online.
          Completely free.
        </p>

        <form className="cta-form">
          <input
            type="email"
            placeholder="Enter your email address"
          />

          <button type="submit">
            Sign Up Free →
          </button>
        </form>

        <p className="cta-note">
          No approval · No credit card · Start in 30 seconds
        </p>
      </div>
    </section>
  );
};

export default CTA;