import React, { useEffect, useRef, useState } from "react";
import "./process.css";

const Process = () => {
  const sectionRef = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShow(true);
      }
    });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={`process ${show ? "show" : ""}`}>
      <div className="container">

        <span className="section-tag">How It Works</span>

        <h2 className="section-title">
          Simple 3 Step Process
        </h2>

        <p className="section-subtitle">
          Follow these steps to complete your journey quickly and efficiently with a smooth workflow experience.
        </p>

        <div className="steps">

          <div className="step">
            <div className="step-number">1</div>
            <h3>Create Account</h3>
            <p>Sign up in seconds using email or social login and get started instantly.</p>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <h3>Complete Tasks</h3>
            <p>Choose tasks from dashboard and complete them easily with simple steps.</p>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <h3>Get Paid</h3>
            <p>Withdraw your earnings securely using multiple payment methods.</p>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Process;