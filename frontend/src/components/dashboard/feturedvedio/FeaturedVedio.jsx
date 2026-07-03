import { useState, useEffect, useRef } from "react";
import { Play, Plus } from "lucide-react";
import { featuredVideos } from "../../../data/dashboardData";
import "./FeaturedVedio.css";

const SLIDE_DURATION = 5000;

export default function FeaturedVideo() {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef(null);

  const startSlider = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveIndex((prevIndex) =>
        (prevIndex + 1) % featuredVideos.length
      );
    }, SLIDE_DURATION);
  };

  useEffect(() => {
    startSlider();
    return () => clearInterval(intervalRef.current);
  }, []);

  const handleThumbnailClick = (index) => {
    setActiveIndex(index);
    startSlider();
  };

  const v = featuredVideos[activeIndex];

  return (
    <section
      className="featured"
      style={{ backgroundImage: `url(${v.thumbnail})` }}
    >
      <div className="featured-overlay"></div>

      <div className="featured-content">
        <div className="featured-badge">
          <span className="featured-badge-dot"></span>
          {v.badge}
        </div>

        <h2 className="featured-title">
          {v.title}
          <span className="featured-title-accent">{v.titleAccent}</span>
        </h2>

        <div className="featured-meta">
          <span>{v.year}</span>
          <span className="featured-quality">{v.quality}</span>
          <span>{v.duration}</span>
          <span>•</span>
          <span>{v.platforms} Platforms</span>
        </div>

        <p className="featured-desc">{v.description}</p>

        <div className="featured-tags">
          {v.tags.map((tag) => (
            <span key={tag} className="featured-tag">{tag}</span>
          ))}
        </div>

        <div className="featured-actions">
          <button className="featured-btn-watch">
            <Play size={18} fill="white" />
            Watch Now
          </button>
          <button className="featured-btn-add">
            <Plus size={20} />
          </button>
          <button className="featured-btn-earn">
            Earn {v.earn}
          </button>
        </div>
      </div>

      {/* Right side block — thumbnails on top, progress bar below */}
      <div className="featured-right-block">
        <div className="featured-thumbs">
          {featuredVideos.map((video, index) => (
            <img
              key={video.id}
              src={video.thumbnail}
              alt={video.title}
              onClick={() => handleThumbnailClick(index)}
              className={`featured-thumb ${
                activeIndex === index ? "active" : ""
              }`}
            />
          ))}
        </div>

        <div className="featured-progress-row">
          {featuredVideos.map((video, index) => (
            <div className="featured-progress-track" key={video.id}>
              {index < activeIndex && (
                <div className="featured-progress-fill filled" />
              )}
              {index === activeIndex && (
                <div
                  key={activeIndex}
                  className="featured-progress-fill running"
                  style={{ animationDuration: `${SLIDE_DURATION}ms` }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}