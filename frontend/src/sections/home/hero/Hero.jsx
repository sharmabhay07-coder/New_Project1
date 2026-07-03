import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Hero.css";

import video1 from "../../../assets/videos/computer.mp4";
import video2 from "../../../assets/videos/mony.mp4";
import video3 from "../../../assets/videos/game.mp4";

// Mobile Background Image
import heroMobile from "../../../assets/images/backgroundimage1.jpg";
const videos = [video1, video2, video3];

function Hero() {
  const [currentVideo, setCurrentVideo] = useState(0);

  useEffect(() => {
    // Don't rotate videos on mobile
    if (window.innerWidth <= 768) return;

    const interval = setInterval(() => {
      setCurrentVideo((prev) => (prev + 1) % videos.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero">

      {/* ================= Desktop Videos ================= */}
      <div className="video-slider">
        {videos.map((video, index) => (
          <video
            key={index}
            className={`hero-video ${
              index === currentVideo ? "active" : ""
            }`}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src={video} type="video/mp4" />
          </video>
        ))}
      </div>

      {/* ================= Mobile Background ================= */}
      <div
        className="hero-mobile-bg"
        style={{
          backgroundImage: `url(${heroMobile})`,
        }}
      />

      {/* ================= Overlay ================= */}
      <div className="hero-overlay"></div>

      {/* ================= Hero Content ================= */}
      <div className="hero-content">

        <div className="top-badge">
          ● GET PAID FOR SIMPLE TASKS
        </div>

        <h1 className="hero-title">
          Earn Daily.
          <br />
          <span className="green">
            Achieve Goals.
          </span>
          <br />
          <span className="blue">
            Real Rewards.
          </span>
        </h1>

        <p className="hero-description">
          Play games, watch videos,
          complete surveys and install
          apps — all from your phone or
          laptop. Real money, paid every
          single day.
        </p>

        <div className="hero-buttons">

          <Link
            to="/auth?tab=register"
            className="btn-primary"
          >
            Start Earning Free →
          </Link>

          <Link
            to="/auth"
            className="btn-secondary"
          >
            Login to Account
          </Link>

        </div>

      </div>

    </section>
  );
}

export default Hero;