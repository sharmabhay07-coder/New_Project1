import React from 'react'
import './Hero.css'
import vdo from './assets/computer.mp4'

const Hero = () => {
  return (
    <section className="hero">
      <div className="video-bg">
        <video
          className="video-bg"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={vdo} type="video/mp4" />
        </video>

      </div>
      <div className="grid-bg"></div>

      <div className="hero-content">

        <div className="top-badge">
          ● GET PAID FOR SIMPLE TASKS
        </div>

        <h1>
          Earn Daily.
          <br />
          <span className="green">Achieve Goals.</span>
          <br />
          <span className="blue">Real Rewards.</span>
        </h1>

        <p>
          Play games, watch videos, complete surveys & install apps —
          all from your phone or laptop. Real money, paid every day.
        </p>

        <div className="hero-buttons">
          <button className="btn-primary">
            Start Earning Free →
          </button>

          <button className="btn-secondary">
            Login to Account
          </button>
        </div>

        <div className="stats">
          <div className="stat-box">$12M+ paid to members</div>
          <div className="stat-box">4.8★ Trustpilot</div>
          <div className="stat-box">Daily payouts</div>
          <div className="stat-box">190+ countries</div>
        </div>

      </div>
    </section>
  )
}

export default Hero
