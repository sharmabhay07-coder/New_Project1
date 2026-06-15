import React from "react";
import "./HeroCards.css";

import img1 from "./assets/image1.jpg";
import img2 from "./assets/image2.jpg";
import img3 from "./assets/image3.jpg";
import img4 from "./assets/image4.jpg";
import img5 from "./assets/image5.jpg";

const cards = [
  {
    image: img1,
    title: "Complete Surveys",
  },
  {
    image: img2,
    title: "Watch Videos",
  },
  {
    image: img3,
    title: "Install Apps",
  },
  {
    image: img4,
    title: "Refer Friends",
  },
  {
    image: img5,
    title: "Daily Rewards",
  },
];

function HeroCards() {
  return (
    <section className="cards-wrapper">
      {/* Left Content */}
      <div className="left-content">
        <span className="badge">🚀 Earn Hub</span>

        <h2>
          Turn Your Time Into
          <span> Real Rewards</span>
        </h2>

        <p>
          Join thousands of users earning money online by
          completing simple tasks, surveys, app installs,
          referrals, and daily challenges. Start earning
          from anywhere at any time.
        </p>

        <button className="start-btn">
          Start Earning Now
        </button>
      </div>

      {/* Right Slider */}
      <div className="cards-slider">
        <div className="cards-track">
          {[...cards, ...cards].map((card, index) => (
            <div className="card" key={index}>
              <img src={card.image} alt={card.title} />

              <div className="card-overlay">
                <h3>{card.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeroCards;