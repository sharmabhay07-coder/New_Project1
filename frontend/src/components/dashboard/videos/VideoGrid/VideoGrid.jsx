import { useState } from "react";
import "./VideoGrid.css";

const MORE_VIDEOS = [
  {
    id: 7,
    platform: "facebook",
    thumbnail:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&h=200&fit=crop",
    duration: "2:15",
    earn: "+$0.20",
    creator: "@techbytes_sara",
    title: "Top 5 Productivity Apps 2026",
    action: "Watch + Like",
  },
  {
    id: 8,
    platform: "instagram",
    thumbnail:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
    duration: "3:50",
    earn: "+$0.35",
    creator: "@fitlife_raj",
    title: "Morning Workout Routine",
    action: "Watch + Follow",
  },
  {
    id: 9,
    platform: "youtube",
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&h=200&fit=crop",
    duration: "7:20",
    earn: "+$0.60",
    creator: "@codemaster_dev",
    title: "Learn React in 7 Minutes",
    action: "Watch + Share",
  },
];

export default function VideoGrid() {
  const [visibleCount, setVisibleCount] = useState(6);

  return (
    <div className="vg-wrap">
      <div className="vg-head">
        <h2 className="vg-title">All Videos</h2>
        <span className="vg-count">
          {MORE_VIDEOS.length} videos available
        </span>
      </div>

      <div className="vg-grid">
        {MORE_VIDEOS.slice(0, visibleCount).map((video) => (
          <div className="video-card" key={video.id}>
            <img
              src={video.thumbnail}
              alt={video.title}
              className="video-thumb"
            />

            <div className="video-content">
              <span className="video-platform">
                {video.platform.toUpperCase()}
              </span>

              <h3>{video.title}</h3>

              <p>{video.creator}</p>

              <div className="video-meta">
                <span>{video.duration}</span>
                <span>{video.earn}</span>
              </div>

              <button className="video-btn">{video.action}</button>
            </div>
          </div>
        ))}
      </div>

      {visibleCount < MORE_VIDEOS.length && (
        <div className="vg-more">
          <button
            className="vg-more-btn"
            onClick={() => setVisibleCount((v) => v + 3)}
          >
            Load More Videos
          </button>
        </div>
      )}
    </div>
  );
}