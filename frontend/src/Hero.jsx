import React, { useEffect, useState } from "react";
import "./Hero.css";

import video1 from "./assets/computer.mp4";
import video2 from "./assets/video.mp4";
import video3 from "./assets/gamming.mp4";

const videos = [video1, video2, video3];

const Hero = () => {
  const [currentVideo, setCurrentVideo] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo((prev) => (prev + 1) % videos.length);
    }, 5000); // change video every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero">
      {/* Video Slider Background */}
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
          >
            <source src={video} type="video/mp4" />
          </video>
        ))}
      </div>

      <div className="grid-bg"></div>

      <div className="hero-content">
        <div className="top-badge">
          ● GET PAID FOR SIMPLE TASKS
        </div>

        <h3>
          Earn Daily.
          <br />
          <span className="green">Achieve Goals.</span>
          <br />
          <span className="blue">Real Rewards.</span>
        </h3>

        <p>
          Play games, watch videos, complete surveys &
          install apps — all from your phone or laptop.
          Real money, paid every day.
        </p>

        <div className="hero-buttons">
          <button className="btn-primary">
            Start Earning Free →
          </button>

          <button className="btn-secondary">
            Login to Account
          </button>
        </div>

      </div>
    </section>
  );
};

export default Hero;