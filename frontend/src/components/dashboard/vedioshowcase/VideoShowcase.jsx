
import { useRef } from "react";
import { Heart, MessageCircle, Play, ChevronRight } from "lucide-react";
import "./VideoShowcase.css";

const YouTubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="6" fill="#FF0000" />
    <path d="M10 8.5l6 3.5-6 3.5V8.5z" fill="white" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="6" fill="url(#ig-grad)" />
    <defs>
      <linearGradient id="ig-grad" x1="0" y1="24" x2="24" y2="0">
        <stop offset="0%" stopColor="#F58529" />
        <stop offset="50%" stopColor="#DD2A7B" />
        <stop offset="100%" stopColor="#8134AF" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="1.8" fill="none" />
    <circle cx="17" cy="7" r="1" fill="white" />
  </svg>
);

const VerifiedIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="#20C997" />
    <path d="M7 12l3.5 3.5L17 8" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const videos = [
  { id: 1, thumbnail: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=280&fit=crop", platform: "youtube", duration: "3:42", reward: "+$0.35", creator: "@socialwave_jen", title: "Morning Routine for Productivity", action: "Watch + Like", likes: "12.5K", comments: "245" },
  { id: 2, thumbnail: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=280&fit=crop", platform: "instagram", duration: "5:10", reward: "+$0.50", creator: "@techtalks_omar", title: "Best Budget Smartphones 2026", action: "Watch + Follow", likes: "18.7K", comments: "312" },
  { id: 3, thumbnail: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=280&fit=crop", platform: "youtube", duration: "2:58", reward: "+$0.25", creator: "@fashionista_priya", title: "Summer Outfit Ideas 2026", action: "Watch + Like", likes: "9.8K", comments: "186" },
  { id: 4, thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=280&fit=crop", platform: "youtube", duration: "1:20", reward: "+$0.40", creator: "@fitnessking_leo", title: "30-Day Abs Challenge Results", action: "Watch + Share", likes: "14.2K", comments: "278" },
  { id: 5, thumbnail: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=280&fit=crop", platform: "youtube", duration: "4:15", reward: "+$0.30", creator: "@cookwithcara", title: "5-Minute Healthy Breakfast Ideas", action: "Watch + Like", likes: "11.3K", comments: "201" },
  { id: 6, thumbnail: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=280&fit=crop", platform: "instagram", duration: "6:05", reward: "+$0.45", creator: "@studio.zeny", title: "Behind the Scenes", action: "Watch + Follow", likes: "7.4K", comments: "134" },
  { id: 7, thumbnail: "https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?w=400&h=280&fit=crop", platform: "youtube", duration: "3:30", reward: "+$0.55", creator: "@devwithriya", title: "How I Built My Portfolio", action: "Watch + Like", likes: "22.1K", comments: "389" },
  { id: 8, thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=280&fit=crop", platform: "instagram", duration: "2:15", reward: "+$0.20", creator: "@codevibes_nikhil", title: "React Tips in 2 Minutes", action: "Watch + Share", likes: "5.6K", comments: "98" },
];

function VideoCard({ video }) {
  return (
    <div className="video-card">
      <div className="video-thumbnail">
        <img src={video.thumbnail} alt={video.title} className="thumbnail-img" />
        <div className="platform-icon">
          {video.platform === "youtube" ? <YouTubeIcon /> : <InstagramIcon />}
        </div>
        <div className="duration-badge">{video.duration}</div>
        <div className="reward-badge">{video.reward}</div>
      </div>
      <div className="card-body">
        <div className="creator-row">
          <span className="creator-name">{video.creator}</span>
          <VerifiedIcon />
        </div>
        <p className="video-title">{video.title}</p>
        <button className="action-btn">
          <Play size={11} fill="#20C997" />
          {video.action}
        </button>
        <div className="stats-row">
          <span className="stat"><Heart size={13} /> {video.likes}</span>
          <span className="stat"><MessageCircle size={13} /> {video.comments}</span>
        </div>
      </div>
    </div>
  );
}

export default function VideoShowcase() {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 320, behavior: "smooth" });
    }
  };

  return (
    <section className="video-showcase">
      <div className="showcase-header">
        <h2 className="showcase-title">Video Showcase</h2>
        <a href="#" className="view-all-link">
          View All Videos <ChevronRight size={16} />
        </a>
      </div>

      <div className="scroll-wrapper">
        <button className="scroll-btn scroll-btn-left" onClick={() => scroll(-1)}>‹</button>
        <div className="scroll-row" ref={scrollRef}>
          {videos.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
        <button className="scroll-btn scroll-btn-right" onClick={() => scroll(1)}>›</button>
      </div>
    </section>
  );
}
