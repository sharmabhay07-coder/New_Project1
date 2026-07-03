import './PlatformFilter.css';

const PLATFORMS = [
  { id: 'facebook',  label: 'Facebook',  color: '#1877F2', letter: 'f' },
  { id: 'twitter',   label: 'Twitter',   color: '#1DA1F2', letter: '𝕏' },
  { id: 'snapchat',  label: 'Snapchat',  color: '#FFFC00', letter: 'S', dark: true },
  { id: 'pinterest', label: 'Pinterest', color: '#E60023', letter: 'P' },
  { id: 'linkedin',  label: 'LinkedIn',  color: '#0A66C2', letter: 'in' },
  { id: 'twitch',    label: 'Twitch',    color: '#9146FF', letter: '▲' },
  { id: 'reddit',    label: 'Reddit',    color: '#FF4500', letter: '●' },
  { id: 'youtube',   label: 'YouTube',   color: '#FF0000', letter: '▶' },
  { id: 'tiktok',    label: 'TikTok',    color: '#010101', letter: '♪' },
  { id: 'instagram', label: 'Instagram', color: '#E1306C', letter: 'IG' },
];

export default function PlatformFilter() {
  return (
    <div className="pf-wrap">
      <div className="pf-marquee">
        {/* duplicate for seamless loop */}
        {[...PLATFORMS, ...PLATFORMS].map((p, i) => (
          <div key={i} className="pf-item">
            <span
              className="pf-icon"
              style={{
                background: p.color,
                color: p.dark ? '#000' : '#fff',
              }}
            >
              {p.letter}
            </span>
            <span className="pf-label">{p.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}