import React from "react";
import "./CTA.css";

const CTA = () => {
  return (
    <section className="cta">
      <div className="cta-circle"></div>

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