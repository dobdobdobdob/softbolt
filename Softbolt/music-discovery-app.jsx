import { useState, useRef, useEffect } from "react";

// ── Mock Data ────────────────────────────────────────────────────────────────

const TRENDING = [
  { id: 1,  rank: 1,  title: "Neon Haze",           artist: "Astral Drift",    album: "Signal Lost",    genre: "Electronic", duration: "3:42", plays: "12.4M", cover: "https://picsum.photos/seed/neon/80/80" },
  { id: 2,  rank: 2,  title: "Golden Hour",          artist: "Mira Soleil",     album: "Late Bloom",     genre: "Indie Pop",  duration: "4:01", plays: "9.8M",  cover: "https://picsum.photos/seed/golden/80/80" },
  { id: 3,  rank: 3,  title: "Fade to Static",       artist: "The Voidwalkers", album: "Empty Canvas",   genre: "Alt Rock",   duration: "3:55", plays: "8.1M",  cover: "https://picsum.photos/seed/static/80/80" },
  { id: 4,  rank: 4,  title: "Echo Protocol",        artist: "Lumen Code",      album: "Echo Protocol",  genre: "Synthwave",  duration: "5:14", plays: "7.3M",  cover: "https://picsum.photos/seed/echo/80/80" },
  { id: 5,  rank: 5,  title: "Running Through Fire", artist: "Kai Santos",      album: "Wildfire",       genre: "Pop",        duration: "3:28", plays: "6.9M",  cover: "https://picsum.photos/seed/fire/80/80" },
  { id: 6,  rank: 6,  title: "Tidal Drift",          artist: "Océane",          album: "Deep Blue",      genre: "Ambient",    duration: "6:02", plays: "5.5M",  cover: "https://picsum.photos/seed/tidal/80/80" },
  { id: 7,  rank: 7,  title: "Midnight Circuit",     artist: "Astral Drift",    album: "Signal Lost",    genre: "Electronic", duration: "4:30", plays: "4.9M",  cover: "https://picsum.photos/seed/midnight/80/80" },
  { id: 8,  rank: 8,  title: "Glass Sky",            artist: "Mira Soleil",     album: "Late Bloom",     genre: "Indie Pop",  duration: "3:17", plays: "4.2M",  cover: "https://picsum.photos/seed/glass/80/80" },
  { id: 9,  rank: 9,  title: "Heavy Metal Rain",     artist: "Iron Veil",       album: "Rust & Ruin",    genre: "Metal",      duration: "4:44", plays: "3.8M",  cover: "https://picsum.photos/seed/metal/80/80" },
  { id: 10, rank: 10, title: "Soft Resistance",      artist: "Nola June",       album: "Quiet Storm",    genre: "R&B",        duration: "3:50", plays: "3.4M",  cover: "https://picsum.photos/seed/soft/80/80" },
];

const RECOMMENDATIONS = [
  { id: 11, title: "Parallax View",     artist: "Lumen Code",      album: "Parallax",     genre: "Synthwave",  duration: "4:12", cover: "https://picsum.photos/seed/parallax/200/200", match: 97, reason: "Based on your love of Electronic" },
  { id: 12, title: "Between the Lines", artist: "Nola June",       album: "Quiet Storm",  genre: "R&B",        duration: "3:38", cover: "https://picsum.photos/seed/lines/200/200",    match: 94, reason: "Fans of Mira Soleil also enjoy" },
  { id: 13, title: "Open Circuit",      artist: "Astral Drift",    album: "Signal Lost",  genre: "Electronic", duration: "5:01", cover: "https://picsum.photos/seed/circuit/200/200",  match: 91, reason: "Top pick in Electronic" },
  { id: 14, title: "Ember & Ash",       artist: "Kai Santos",      album: "Wildfire",     genre: "Pop",        duration: "3:22", cover: "https://picsum.photos/seed/ember/200/200",    match: 88, reason: "Trending in your region" },
  { id: 15, title: "Silver Tongue",     artist: "The Voidwalkers", album: "Empty Canvas", genre: "Alt Rock",   duration: "4:08", cover: "https://picsum.photos/seed/silver/200/200",   match: 85, reason: "Similar to Fade to Static" },
];

const ALBUMS = [
  { id: "a1", title: "Signal Lost",   artist: "Astral Drift",    cover: "https://picsum.photos/seed/signallost/200/200",  year: 2025 },
  { id: "a2", title: "Late Bloom",    artist: "Mira Soleil",     cover: "https://picsum.photos/seed/latebloom/200/200",   year: 2025 },
  { id: "a3", title: "Echo Protocol", artist: "Lumen Code",      cover: "https://picsum.photos/seed/echoalbum/200/200",   year: 2026 },
  { id: "a4", title: "Wildfire",      artist: "Kai Santos",      cover: "https://picsum.photos/seed/wildfire/200/200",    year: 2026 },
  { id: "a5", title: "Empty Canvas",  artist: "The Voidwalkers", cover: "https://picsum.photos/seed/emptycanvas/200/200", year: 2024 },
  { id: "a6", title: "Quiet Storm",   artist: "Nola June",       cover: "https://picsum.photos/seed/quietstorm/200/200",  year: 2025 },
];

const ALL_TRACKS = [...TRENDING, ...RECOMMENDATIONS];
const GENRES = ["All", "Electronic", "Indie Pop", "Synthwave", "Alt Rock", "R&B", "Ambient", "Pop", "Metal"];

// ── Utilities ────────────────────────────────────────────────────────────────

function formatTime(s) {
  const m = Math.floor(s / 60);
  return `${m}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
}
function parseDuration(str) {
  const [m, s] = str.split(":").map(Number);
  return m * 60 + s;
}

// ── Icons ────────────────────────────────────────────────────────────────────

const BoltLogo = () => (
  <svg width="14" height="19" viewBox="0 0 16 22" fill="none">
    <path d="M2 0 L14 0 L8 9 L13 9 L3 22 L6 12 L1 12 Z" fill="#CCFF00" />
  </svg>
);

const PlayIcon  = ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>;
const PauseIcon = ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>;
const HeartIcon = ({ filled, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const SkipBackIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" strokeWidth="2"/></svg>;
const SkipFwdIcon  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2"/></svg>;

// Tab bar icons
const ChartIcon  = ({ active }) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const AlbumIcon  = ({ active }) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>;
const ForYouIcon = ({ active }) => <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const SearchIcon = ({ active }) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const PlaylistIcon = ({ active }) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;

// ── Mini Player ──────────────────────────────────────────────────────────────

function MiniPlayer({ track, isPlaying, onPlayPause, progress, onExpand }) {
  if (!track) return null;
  return (
    <div className="sb-miniplayer" onClick={onExpand} style={{ position: "fixed", bottom: 57, left: 0, right: 0, zIndex: 40, background: "#fff", borderTop: "1px solid rgba(0,0,0,0.08)", padding: "10px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
      <img src={track.cover} alt={track.title} style={{ width: 38, height: 38, flexShrink: 0, filter: "grayscale(100%)", opacity: 0.8 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: "#111", letterSpacing: "0.02em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{track.title}</div>
        <div style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 2 }}><span style={{ color: "#000", background: "#CCFF00", padding: "1px 4px" }}>{track.artist}</span></div>
        {/* progress bar */}
        <div style={{ marginTop: 6, height: 1, background: "#eee", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, height: "100%", background: "#000", width: `${progress}%`, transition: "width 0.1s linear" }} />
        </div>
      </div>
      <button onClick={e => { e.stopPropagation(); onPlayPause(); }} style={{ width: 36, height: 36, border: "1px solid rgba(0,0,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#000", flexShrink: 0, background: "none", cursor: "pointer" }}>
        {isPlaying ? <PauseIcon size={14} /> : <PlayIcon size={14} />}
      </button>
    </div>
  );
}

// ── Full-screen Player ───────────────────────────────────────────────────────

function FullPlayer({ track, isPlaying, onPlayPause, progress, onSeek, onPrev, onNext, volume, onVolume, liked, onLike, onClose }) {
  if (!track) return null;
  const totalSec = parseDuration(track.duration);
  const currentSec = (progress / 100) * totalSec;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 60, background: "#fff", display: "flex", flexDirection: "column", fontFamily: "'Space Mono', 'Courier New', monospace" }}>
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
        <button onClick={onClose} style={{ fontSize: 22, color: "#000", background: "none", border: "none", cursor: "pointer", lineHeight: 1, padding: 4 }}>‹</button>
        <span style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#aaa" }}>Now Playing</span>
        <button onClick={onLike} style={{ color: liked ? "#000" : "#ccc", background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <HeartIcon filled={liked} size={20} />
        </button>
      </div>

      {/* Album art */}
      <div style={{ padding: "32px 40px 24px", flexShrink: 0 }}>
        <img src={track.cover} alt={track.title} style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", filter: "grayscale(100%)", opacity: 0.85, display: "block" }} />
      </div>

      {/* Track info */}
      <div style={{ padding: "0 24px 24px", flexShrink: 0 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#000", letterSpacing: "-0.01em" }}>{track.title}</div>
        <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 6 }}><span style={{ color: "#000", background: "#CCFF00", padding: "1px 4px" }}>{track.artist}</span><span style={{ color: "#aaa" }}> · {track.album}</span></div>
      </div>

      {/* Seek bar */}
      <div style={{ padding: "0 24px", flexShrink: 0 }}>
        <div style={{ height: 1, background: "#e8e8e8", cursor: "pointer", position: "relative" }} onClick={e => { const r = e.currentTarget.getBoundingClientRect(); onSeek(((e.clientX - r.left) / r.width) * 100); }}>
          <div style={{ position: "absolute", top: 0, left: 0, height: "100%", background: "#000", width: `${progress}%` }} />
          <div style={{ position: "absolute", top: "50%", left: `${progress}%`, transform: "translate(-50%,-50%)", width: 10, height: 10, background: "#000", borderRadius: "50%" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <span style={{ fontSize: 9, color: "#bbb", letterSpacing: "0.05em" }}>{formatTime(currentSec)}</span>
          <span style={{ fontSize: 9, color: "#bbb", letterSpacing: "0.05em" }}>{track.duration}</span>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 36, padding: "24px 24px", flexShrink: 0 }}>
        <button onClick={onPrev} style={{ color: "#bbb", background: "none", border: "none", cursor: "pointer", padding: 8 }}><SkipBackIcon /></button>
        <button onClick={onPlayPause} style={{ width: 56, height: 56, border: "1px solid rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#000", background: "none", cursor: "pointer", flexShrink: 0 }}>
          {isPlaying ? <PauseIcon size={22} /> : <PlayIcon size={22} />}
        </button>
        <button onClick={onNext} style={{ color: "#bbb", background: "none", border: "none", cursor: "pointer", padding: 8 }}><SkipFwdIcon /></button>
      </div>

      {/* Volume */}
      <div style={{ padding: "0 24px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <span style={{ fontSize: 9, color: "#ccc", letterSpacing: "0.08em" }}>VOL</span>
        <div style={{ flex: 1, height: 1, background: "#e8e8e8", cursor: "pointer" }} onClick={e => { const r = e.currentTarget.getBoundingClientRect(); onVolume(((e.clientX - r.left) / r.width) * 100); }}>
          <div style={{ height: "100%", background: "#000", width: `${volume}%` }} />
        </div>
        <span style={{ fontSize: 9, color: "#ccc", width: 24, textAlign: "right" }}>{Math.round(volume)}%</span>
      </div>

      {/* Genre tag */}
      <div style={{ padding: "20px 24px 0", flexShrink: 0 }}>
        <span style={{ fontSize: 9, color: "#bbb", letterSpacing: "0.12em", textTransform: "uppercase", border: "1px solid rgba(0,0,0,0.1)", padding: "4px 10px" }}>{track.genre}</span>
      </div>
    </div>
  );
}

// ── Track Row ────────────────────────────────────────────────────────────────

function TrackRow({ track, index, isActive, isPlaying, onPlay, liked, onLike, onArtistTap }) {
  return (
    <div
      onClick={onPlay}
      style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: "1px solid rgba(0,0,0,0.05)", background: isActive ? "rgba(0,0,0,0.02)" : "transparent", borderLeft: isActive ? "2px solid #000" : "2px solid transparent", cursor: "pointer" }}
    >
      <span style={{ fontSize: 10, color: "#ccc", width: 18, flexShrink: 0, textAlign: "center", letterSpacing: "0.04em" }}>
        {isActive && isPlaying ? <PauseIcon size={10} /> : String(track.rank ?? index + 1).padStart(2, "0")}
      </span>
      <img src={track.cover} alt={track.title} style={{ width: 44, height: 44, flexShrink: 0, filter: "grayscale(100%)", opacity: isActive ? 0.9 : 0.6 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: isActive ? "#000" : "#222", letterSpacing: "0.02em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{track.title}</div>
        <div
          onClick={e => { e.stopPropagation(); onArtistTap && onArtistTap(track.artist); }}
          style={{ fontSize: 10, color: "#000", background: "#CCFF00", padding: "1px 4px", letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 3, cursor: onArtistTap ? "pointer" : "default", display: "inline-block" }}
        >
          {track.artist}
        </div>
      </div>
      <button onClick={e => { e.stopPropagation(); onLike(track.id); }} style={{ color: liked ? "#000" : "#ddd", background: "none", border: "none", cursor: "pointer", padding: "8px 4px", flexShrink: 0 }}>
        <HeartIcon filled={liked} size={16} />
      </button>
      <span style={{ fontSize: 10, color: "#ccc", flexShrink: 0, letterSpacing: "0.04em" }}>{track.duration}</span>
    </div>
  );
}

// ── Recommend Card ───────────────────────────────────────────────────────────

function RecommendCard({ track, isActive, isPlaying, onPlay, liked, onLike }) {
  return (
    <div style={{ border: "1px solid", borderColor: isActive ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.07)" }}>
      <div style={{ position: "relative", aspectRatio: "1/1", overflow: "hidden", cursor: "pointer" }} onClick={onPlay}>
        <img src={track.cover} alt={track.title} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%)", opacity: 0.7, display: "block" }} />
        <div style={{ position: "absolute", top: 6, right: 6, fontSize: 9, color: "#fff", background: "rgba(0,0,0,0.6)", padding: "2px 5px", letterSpacing: "0.06em" }}>{track.match}%</div>
        {isActive && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.5)" }}>
            <div style={{ border: "1px solid rgba(0,0,0,0.4)", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.9)" }}>
              {isPlaying ? <PauseIcon size={11} /> : <PlayIcon size={11} />}
            </div>
          </div>
        )}
      </div>
      <div style={{ padding: "8px 10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 11, color: "#111", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{track.title}</div>
            <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}><span style={{ color: "#000", background: "#CCFF00", padding: "1px 3px" }}>{track.artist}</span></div>
          </div>
          <button onClick={e => { e.stopPropagation(); onLike(track.id); }} style={{ color: liked ? "#000" : "#ddd", background: "none", border: "none", cursor: "pointer", padding: "2px 0 0 6px", flexShrink: 0 }}>
            <HeartIcon filled={liked} size={13} />
          </button>
        </div>
        <div style={{ fontSize: 9, color: "#bbb", marginTop: 5, letterSpacing: "0.04em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{track.reason}</div>
      </div>
    </div>
  );
}

// ── Album Card ───────────────────────────────────────────────────────────────

function AlbumCard({ album, onPlay, onArtistTap }) {
  return (
    <div onClick={onPlay} style={{ cursor: "pointer" }}>
      <div style={{ position: "relative", aspectRatio: "1/1", overflow: "hidden", marginBottom: 8 }}>
        <img src={album.cover} alt={album.title} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%)", opacity: 0.75, display: "block" }} />
      </div>
      <div style={{ fontSize: 11, color: "#222", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{album.title}</div>
      <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.07em", marginTop: 2 }}>
        <span
          onClick={e => { e.stopPropagation(); onArtistTap && onArtistTap(album.artist); }}
          style={{ color: "#000", background: "#CCFF00", padding: "1px 3px", cursor: "pointer" }}
        >{album.artist}</span>
        <span style={{ color: "#aaa" }}> — {album.year}</span>
      </div>
    </div>
  );
}

// ── Section Header ───────────────────────────────────────────────────────────

function SectionHead({ label, title }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <span style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaa" }}>{label}</span>
      <div style={{ fontSize: 22, fontWeight: 700, color: "#000", letterSpacing: "-0.01em", marginTop: 6, lineHeight: 1.1 }}>{title}</div>
      <div style={{ width: 24, height: 1, background: "rgba(0,0,0,0.12)", marginTop: 12 }} />
    </div>
  );
}

// ── Artist Sign-up Flow ──────────────────────────────────────────────────────

const SIGNUP_GENRES = ["Electronic", "Indie Pop", "Synthwave", "Alt Rock", "R&B", "Ambient", "Pop", "Metal", "Hip-Hop", "Jazz", "Classical", "Folk"];

const SUPPORT_TIERS = [
  { id: "free",      label: "Free",       price: null,  period: null,   perks: ["Public artist profile", "Appear in search & charts"] },
  { id: "supporter", label: "Supporter",  price: "2.99", period: "year", perks: ["Everything in Free", "Early access to new tracks", "Exclusive releases"] },
  { id: "superfan",  label: "Superfan",   price: "9.99", period: "year", perks: ["Everything in Supporter", "Monthly live Q&A", "Merch discounts", "Direct messaging"] },
];

function ArtistSignup({ onClose, onOpenDashboard }) {
  const [step, setStep] = useState(0); // 0=welcome, 1=account, 2=profile, 3=upload, 4=pricing, 5=done
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", artistName: "", genres: [], bio: "", instagram: "", facebook: "", tiktok: "", spotify: "", trackTitle: "", trackDate: "", trackDesc: "", supportTier: "supporter" });
  const [photoLabel,  setPhotoLabel]  = useState(null);
  const [trackUploaded, setTrackUploaded] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleGenre = (g) => set("genres", form.genres.includes(g) ? form.genres.filter(x => x !== g) : [...form.genres, g]);

  const TOTAL_STEPS = 5; // steps 1-5; 0 is welcome

  const canProceed = () => {
    if (step === 1) return form.firstName && form.email && form.password.length >= 6;
    if (step === 2) return form.artistName && form.genres.length > 0;
    return true; // steps 3 and 4 are skippable / always valid
  };

  const inputStyle = (focused) => ({
    width: "100%", background: "transparent", border: "1px solid",
    borderColor: focused ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.12)",
    color: "#111", fontSize: 13, letterSpacing: "0.03em",
    padding: "13px 14px", outline: "none", fontFamily: "inherit",
  });

  const [focused, setFocused] = useState({});
  const focusProps = (key) => ({
    onFocus: () => setFocused(f => ({ ...f, [key]: true })),
    onBlur:  () => setFocused(f => ({ ...f, [key]: false })),
    style: inputStyle(focused[key]),
  });

  return (
    <div className="sb-overlay" style={{ position: "fixed", inset: 0, zIndex: 80, background: "#fff", display: "flex", flexDirection: "column", fontFamily: "'Space Mono','Courier New',monospace" }}>

      {/* ── Top bar ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid rgba(0,0,0,0.07)", flexShrink: 0 }}>
        <button onClick={step === 0 ? onClose : () => setStep(s => s - 1)} style={{ fontSize: 22, color: "#000", lineHeight: 1, padding: 4, width: 32 }}>
          {step === 0 ? "×" : "‹"}
        </button>

        {/* Step dots — only show on steps 1-5 */}
        {step > 0 && step < 5 && (
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            {[1,2,3,4,5].map(n => (
              <div key={n} style={{ width: n < step ? 14 : n === step ? 18 : 5, height: 5, background: n <= step ? "#000" : "#e0e0e0", transition: "all 0.2s" }} />
            ))}
          </div>
        )}

        <div style={{ width: 32 }} /> {/* spacer */}
      </div>

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "32px 24px 40px" }}>

        {/* ── STEP 0: Welcome ── */}
        {step === 0 && (
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ flex: 1 }}>
              {/* Big bolt */}
              <div style={{ marginBottom: 32 }}>
                <svg width="48" height="65" viewBox="0 0 16 22" fill="none">
                  <path d="M2 0 L14 0 L8 9 L13 9 L3 22 L6 12 L1 12 Z" fill="#CCFF00" />
                </svg>
              </div>

              <div style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#aaa", marginBottom: 10 }}>For Artists</div>
              <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 16 }}>Share your music<br/>with the world.</h1>
              <div style={{ width: 28, height: 1, background: "rgba(0,0,0,0.12)", marginBottom: 28 }} />

              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}>
                {[
                  ["Get discovered", "Reach listeners who care about your genre."],
                  ["Track your plays", "See who's listening and where."],
                  ["Own your profile", "Full control over how you appear on Softbolt."],
                ].map(([title, desc]) => (
                  <div key={title} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ width: 1, background: "#CCFF00", alignSelf: "stretch", flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#000", letterSpacing: "0.02em" }}>{title}</div>
                      <div style={{ fontSize: 11, color: "#aaa", marginTop: 3, letterSpacing: "0.02em", lineHeight: 1.5 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button onClick={() => setStep(1)} style={{ width: "100%", padding: "15px", background: "#000", color: "#fff", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "inherit", cursor: "pointer", border: "none" }}>
                Get Started
              </button>
              <button onClick={onClose} style={{ width: "100%", padding: "13px", background: "transparent", color: "#aaa", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "inherit", cursor: "pointer", border: "1px solid rgba(0,0,0,0.1)" }}>
                Maybe Later
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 1: Account Creation ── */}
        {step === 1 && (
          <div>
            <div style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#aaa", marginBottom: 10 }}>Step 1 of 5</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.1, marginBottom: 8 }}>Create your account</h2>
            <div style={{ width: 24, height: 1, background: "rgba(0,0,0,0.12)", marginBottom: 32 }} />

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "#aaa", display: "block", marginBottom: 6 }}>First Name</label>
                  <input value={form.firstName} onChange={e => set("firstName", e.target.value)} placeholder="Jane" {...focusProps("firstName")} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "#aaa", display: "block", marginBottom: 6 }}>Last Name</label>
                  <input value={form.lastName} onChange={e => set("lastName", e.target.value)} placeholder="Doe" {...focusProps("lastName")} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "#aaa", display: "block", marginBottom: 6 }}>Email</label>
                <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@example.com" {...focusProps("email")} />
              </div>

              <div>
                <label style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "#aaa", display: "block", marginBottom: 6 }}>Password</label>
                <input type="password" value={form.password} onChange={e => set("password", e.target.value)} placeholder="Min. 6 characters" {...focusProps("password")} />
                {form.password.length > 0 && form.password.length < 6 && (
                  <div style={{ fontSize: 9, color: "#bbb", marginTop: 5, letterSpacing: "0.04em" }}>At least 6 characters required</div>
                )}
              </div>
            </div>

            <div style={{ fontSize: 9, color: "#ccc", letterSpacing: "0.05em", lineHeight: 1.6, marginTop: 24 }}>
              By continuing you agree to Softbolt's Terms of Service and Privacy Policy.
            </div>

            <button
              onClick={() => canProceed() && setStep(2)}
              style={{ width: "100%", padding: "15px", background: canProceed() ? "#000" : "#eee", color: canProceed() ? "#fff" : "#bbb", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "inherit", cursor: canProceed() ? "pointer" : "default", border: "none", marginTop: 28, transition: "all 0.15s" }}
            >
              Continue →
            </button>
          </div>
        )}

        {/* ── STEP 2: Artist Profile ── */}
        {step === 2 && (
          <div>
            <div style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#aaa", marginBottom: 10 }}>Step 2 of 5</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.1, marginBottom: 8 }}>Set up your profile</h2>
            <div style={{ width: 24, height: 1, background: "rgba(0,0,0,0.12)", marginBottom: 32 }} />

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Photo upload */}
              <div>
                <label style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "#aaa", display: "block", marginBottom: 8 }}>Artist Photo</label>
                <div
                  onClick={() => setPhotoLabel("photo_uploaded.jpg")}
                  style={{ width: 80, height: 80, border: "1px dashed rgba(0,0,0,0.2)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", gap: 6, background: photoLabel ? "rgba(204,255,0,0.08)" : "transparent" }}
                >
                  {photoLabel ? (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5"><polyline points="20 6 9 17 4 12"/></svg>
                      <span style={{ fontSize: 8, color: "#aaa", letterSpacing: "0.06em" }}>Uploaded</span>
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      <span style={{ fontSize: 8, color: "#ccc", letterSpacing: "0.06em" }}>Add photo</span>
                    </>
                  )}
                </div>
              </div>

              {/* Artist name */}
              <div>
                <label style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "#aaa", display: "block", marginBottom: 6 }}>Artist / Band Name</label>
                <input value={form.artistName} onChange={e => set("artistName", e.target.value)} placeholder="Your stage name" {...focusProps("artistName")} />
              </div>

              {/* Genre selection */}
              <div>
                <label style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "#aaa", display: "block", marginBottom: 8 }}>Genres <span style={{ color: "#ccc" }}>(pick at least one)</span></label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {SIGNUP_GENRES.map(g => {
                    const sel = form.genres.includes(g);
                    return (
                      <button key={g} onClick={() => toggleGenre(g)} style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", padding: "6px 12px", border: "1px solid", borderColor: sel ? "#000" : "rgba(0,0,0,0.1)", color: sel ? "#fff" : "#bbb", background: sel ? "#000" : "transparent", fontFamily: "inherit", cursor: "pointer", transition: "all 0.12s" }}>
                        {g}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bio */}
              <div>
                <label style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "#aaa", display: "block", marginBottom: 6 }}>Bio <span style={{ color: "#ccc" }}>(optional)</span></label>
                <textarea
                  value={form.bio}
                  onChange={e => set("bio", e.target.value)}
                  placeholder="Tell listeners about yourself..."
                  rows={4}
                  onFocus={() => setFocused(f => ({ ...f, bio: true }))}
                  onBlur={() => setFocused(f => ({ ...f, bio: false }))}
                  style={{ ...inputStyle(focused.bio), resize: "none", lineHeight: 1.6 }}
                />
                <div style={{ fontSize: 9, color: "#ccc", textAlign: "right", marginTop: 4, letterSpacing: "0.04em" }}>{form.bio.length}/280</div>
              </div>

              {/* Social Links */}
              <div>
                <label style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "#aaa", display: "block", marginBottom: 14 }}>Social Links <span style={{ color: "#ccc" }}>(optional)</span></label>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { key: "instagram", label: "Instagram", placeholder: "instagram.com/yourname",  icon: "IG" },
                    { key: "facebook",  label: "Facebook",  placeholder: "facebook.com/yourpage",   icon: "FB" },
                    { key: "tiktok",    label: "TikTok",    placeholder: "tiktok.com/@yourhandle",  icon: "TT" },
                    { key: "spotify",   label: "Spotify",   placeholder: "open.spotify.com/artist/…",icon: "SP" },
                  ].map(({ key, label, placeholder, icon }) => (
                    <div key={key} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, background: focused[key] ? "#CCFF00" : "#f5f5f5", border: `1px solid ${focused[key] ? "#000" : "rgba(0,0,0,0.1)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                        <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.06em", color: focused[key] ? "#000" : "#bbb" }}>{icon}</span>
                      </div>
                      <div style={{ flex: 1, position: "relative" }}>
                        <input
                          value={form[key]}
                          onChange={e => set(key, e.target.value)}
                          placeholder={placeholder}
                          {...focusProps(key)}
                          style={{ ...inputStyle(focused[key]), paddingLeft: 10, fontSize: 11 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => canProceed() && setStep(3)}
              style={{ width: "100%", padding: "15px", background: canProceed() ? "#000" : "#eee", color: canProceed() ? "#fff" : "#bbb", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "inherit", cursor: canProceed() ? "pointer" : "default", border: "none", marginTop: 32, transition: "all 0.15s" }}
            >
              Continue →
            </button>
          </div>
        )}

        {/* ── STEP 3: Music Upload ── */}
        {step === 3 && (
          <div>
            <div style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#aaa", marginBottom: 10 }}>Step 3 of 5</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.1, marginBottom: 4 }}>Upload your first track</h2>
            <p style={{ fontSize: 10, color: "#aaa", letterSpacing: "0.04em", lineHeight: 1.6, marginBottom: 8 }}>Optional — you can always add music later.</p>
            <div style={{ width: 24, height: 1, background: "rgba(0,0,0,0.12)", marginBottom: 28 }} />

            {/* Drop zone */}
            <div
              onClick={() => setTrackUploaded(true)}
              style={{ border: `1px dashed ${trackUploaded ? "#000" : "rgba(0,0,0,0.18)"}`, padding: "28px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, cursor: "pointer", marginBottom: 24, background: trackUploaded ? "rgba(204,255,0,0.05)" : "transparent", transition: "all 0.15s" }}
            >
              {trackUploaded ? (
                <>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <div style={{ fontSize: 12, color: "#000", letterSpacing: "0.04em" }}>track_01.mp3</div>
                  <div style={{ fontSize: 9, color: "#aaa", letterSpacing: "0.06em" }}>4.2 MB — ready to publish</div>
                </>
              ) : (
                <>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
                  <div style={{ fontSize: 11, color: "#aaa", letterSpacing: "0.06em" }}>Tap to upload MP3 or WAV</div>
                  <div style={{ fontSize: 9, color: "#ccc", letterSpacing: "0.05em" }}>Up to 50 MB</div>
                </>
              )}
            </div>

            {/* Track details — show once uploaded */}
            {trackUploaded && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "#aaa", display: "block", marginBottom: 6 }}>Track Title</label>
                  <input value={form.trackTitle} onChange={e => set("trackTitle", e.target.value)} placeholder="e.g. Neon Haze" onFocus={() => setFocused(f => ({...f, trackTitle: true}))} onBlur={() => setFocused(f => ({...f, trackTitle: false}))} style={inputStyle(focused.trackTitle)} />
                </div>
                <div>
                  <label style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "#aaa", display: "block", marginBottom: 6 }}>Release Date <span style={{ color: "#ccc" }}>(optional)</span></label>
                  <input type="date" value={form.trackDate} onChange={e => set("trackDate", e.target.value)} onFocus={() => setFocused(f => ({...f, trackDate: true}))} onBlur={() => setFocused(f => ({...f, trackDate: false}))} style={inputStyle(focused.trackDate)} />
                </div>
                <div>
                  <label style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "#aaa", display: "block", marginBottom: 6 }}>Description <span style={{ color: "#ccc" }}>(optional)</span></label>
                  <textarea value={form.trackDesc} onChange={e => set("trackDesc", e.target.value)} placeholder="What's this track about?" rows={3} onFocus={() => setFocused(f => ({...f, trackDesc: true}))} onBlur={() => setFocused(f => ({...f, trackDesc: false}))} style={{ ...inputStyle(focused.trackDesc), resize: "none", lineHeight: 1.6 }} />
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
              <button onClick={() => setStep(4)} style={{ flex: 1, padding: "14px", background: "#000", color: "#fff", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "inherit", cursor: "pointer", border: "none" }}>
                {trackUploaded ? "Continue →" : "Skip for now →"}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: Artist Plan ── */}
        {step === 4 && (
          <div>
            <div style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#aaa", marginBottom: 10 }}>Step 4 of 5</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.1, marginBottom: 4 }}>Your Softbolt plan</h2>
            <p style={{ fontSize: 10, color: "#aaa", letterSpacing: "0.04em", lineHeight: 1.6, marginBottom: 8 }}>Host your artist profile, distribute your music, and get discovered — free for 7 days.</p>
            <div style={{ width: 24, height: 1, background: "rgba(0,0,0,0.12)", marginBottom: 28 }} />

            {/* Plan card */}
            <div style={{ border: "1px solid #000", padding: "24px 20px", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 8, background: "#CCFF00", color: "#000", padding: "3px 8px", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, display: "inline-block", marginBottom: 10 }}>7-day free trial</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#000", letterSpacing: "-0.01em" }}>Artist</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: "#000", lineHeight: 1 }}>$2.99</div>
                  <div style={{ fontSize: 9, color: "#aaa", letterSpacing: "0.08em", marginTop: 3 }}>/ year after trial</div>
                </div>
              </div>
              <div style={{ width: "100%", height: 1, background: "rgba(0,0,0,0.07)", marginBottom: 16 }} />
              {[
                "Public artist profile & bio",
                "Appear in search, charts & recommendations",
                "Upload & host unlimited tracks",
                "Fan support tiers (keep 95% of revenue)",
                "Artist dashboard & analytics",
              ].map(perk => (
                <div key={perk} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
                  <span style={{ fontSize: 10, color: "#000", marginTop: 1, flexShrink: 0 }}>—</span>
                  <span style={{ fontSize: 10, color: "#444", letterSpacing: "0.03em", lineHeight: 1.5 }}>{perk}</span>
                </div>
              ))}
            </div>

            {/* Fine print */}
            <div style={{ padding: "10px 14px", background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)", marginBottom: 24 }}>
              <div style={{ fontSize: 9, color: "#aaa", letterSpacing: "0.05em", lineHeight: 1.7 }}>
                Your 7-day free trial starts today. No charge until day 8. Cancel anytime before then and you won't be billed. After the trial, $2.99/year is charged annually.
              </div>
            </div>

            <button onClick={() => setStep(5)} style={{ width: "100%", padding: "15px", background: "#000", color: "#fff", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "inherit", cursor: "pointer", border: "none" }}>
              Start Free Trial →
            </button>
          </div>
        )}

        {/* ── STEP 5: Confirmation ── */}
        {step === 5 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", paddingTop: 32 }}>
            {/* Animated bolt */}
            <div style={{ marginBottom: 28 }}>
              <svg width="64" height="87" viewBox="0 0 16 22" fill="none">
                <path d="M2 0 L14 0 L8 9 L13 9 L3 22 L6 12 L1 12 Z" fill="#CCFF00" />
              </svg>
            </div>

            <div style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#aaa", marginBottom: 12 }}>Step 5 of 5 — Complete</div>
            <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 12 }}>You're in.</h2>
            <div style={{ width: 24, height: 1, background: "#CCFF00", margin: "0 auto 24px" }} />

            <p style={{ fontSize: 13, color: "#555", letterSpacing: "0.03em", lineHeight: 1.7, marginBottom: 12 }}>
              Welcome to Softbolt,<br/>
              <strong style={{ color: "#000" }}>{form.artistName || form.firstName}</strong>.
            </p>
            <p style={{ fontSize: 11, color: "#aaa", letterSpacing: "0.04em", lineHeight: 1.7, marginBottom: 40 }}>
              Your artist profile is live.<br/>Start uploading music to get discovered.
            </p>

            {/* Profile preview card */}
            <div style={{ width: "100%", border: "1px solid rgba(0,0,0,0.08)", padding: "16px", display: "flex", gap: 14, alignItems: "center", marginBottom: 40, textAlign: "left" }}>
              <div style={{ width: 48, height: 48, background: "#f5f5f5", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(0,0,0,0.07)", fontSize: 18, color: "#ccc" }}>
                {photoLabel ? "✓" : "♪"}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#000", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{form.artistName || "Your Artist Name"}</div>
                <div style={{ fontSize: 9, color: "#aaa", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 3 }}>{form.genres.slice(0,2).join(" · ") || "No genres yet"}</div>
              </div>
              <div style={{ marginLeft: "auto", fontSize: 9, color: "#000", border: "1px solid rgba(0,0,0,0.15)", padding: "4px 8px", letterSpacing: "0.08em", flexShrink: 0, background: "rgba(204,255,0,0.15)" }}>LIVE</div>
            </div>

            {/* Plan + track summary */}
            <div style={{ width: "100%", marginBottom: 28, display: "flex", flexDirection: "column", gap: 8 }}>
              {/* Artist hosting plan */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", border: "1px solid #000", background: "rgba(204,255,0,0.06)" }}>
                <div>
                  <div style={{ fontSize: 9, color: "#aaa", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>Softbolt Plan</div>
                  <div style={{ fontSize: 12, color: "#000" }}>Artist — 7-day free trial, then $2.99/yr</div>
                </div>
                <span style={{ fontSize: 8, background: "#CCFF00", color: "#000", padding: "2px 6px", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>Trial</span>
              </div>
              {(() => {
                const tier = SUPPORT_TIERS.find(t => t.id === form.supportTier);
                return (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", border: "1px solid rgba(0,0,0,0.07)" }}>
                    <div>
                      <div style={{ fontSize: 9, color: "#aaa", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>Fan Support</div>
                      <div style={{ fontSize: 12, color: "#000" }}>{tier.label} tier{tier.price ? ` — $${tier.price}/${tier.period}` : " — Free"}</div>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                );
              })()}
              {trackUploaded && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", border: "1px solid rgba(0,0,0,0.07)" }}>
                  <div>
                    <div style={{ fontSize: 9, color: "#aaa", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>First Track</div>
                    <div style={{ fontSize: 12, color: "#000" }}>{form.trackTitle || "track_01.mp3"}</div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              )}
            </div>

            <button onClick={onOpenDashboard || onClose} style={{ width: "100%", padding: "15px", background: "#000", color: "#fff", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "inherit", cursor: "pointer", border: "none" }}>
              Go to Dashboard →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Artist Page ──────────────────────────────────────────────────────────────

const ARTISTS = {
  "Astral Drift": {
    hero:    "https://picsum.photos/seed/astraldrift/800/600",
    genre:   "Electronic · Synthwave",
    location:"Berlin, DE",
    bio:     "Astral Drift is the solo project of producer and sound designer Elias Vorn. Born out of late-night sessions in a repurposed warehouse studio, the project explores the tension between organic texture and machine precision. Drawing on influences from early Detroit techno, kosmische Musik, and contemporary ambient, Astral Drift has carved out a singular voice in the electronic underground.\n\nThree studio albums and relentless touring across Europe and Japan have earned the project a devoted international following. A fourth album is expected later this year.",
    monthlyListeners: "284k",
    tracks: [1, 7, 13],
  },
  "Mira Soleil": {
    hero:    "https://picsum.photos/seed/mirasoleil/800/600",
    genre:   "Indie Pop · Dream Pop",
    location:"Montréal, CA",
    bio:     "Mira Soleil writes songs the way other people keep journals — obsessively and without apology. Her music sits at the intersection of hazy bedroom pop and lush orchestral production, guided by her background as a classically trained violinist.\n\nAfter years of self-releasing music to a quietly growing audience, her 2024 debut Late Bloom broke through on streaming playlists and hasn't looked back. Critics have described her as 'effortlessly timeless' and 'the best thing to happen to sad music in a decade'.",
    monthlyListeners: "197k",
    tracks: [2, 8, 12],
  },
  "The Voidwalkers": {
    hero:    "https://picsum.photos/seed/voidwalkers/800/600",
    genre:   "Alt Rock · Post-Rock",
    location:"Bristol, UK",
    bio:     "Four-piece from the south-west of England. The Voidwalkers formed in a university rehearsal room in 2019 and have spent every year since making that room smaller and the sound bigger. Their debut LP Empty Canvas arrived in 2024 to widespread critical praise for its dynamic range — from whisper-quiet verses to walls of distortion that rearrange furniture.\n\nLive, they are a different animal entirely. Book early.",
    monthlyListeners: "142k",
    tracks: [3, 15],
  },
  "Lumen Code": {
    hero:    "https://picsum.photos/seed/lumencode/800/600",
    genre:   "Synthwave · Electro",
    location:"Los Angeles, CA",
    bio:     "Lumen Code is the project of producer Dante Reyes, who spent years writing music for film and advertising before deciding he'd rather make something entirely his own. The result is a body of work that sounds like a thriller movie without the movie — propulsive, cinematic, and slightly dangerous.\n\nHis 2026 album Echo Protocol debuted in the top 5 of the electronic charts and has since become a cult favourite in DJ circles worldwide.",
    monthlyListeners: "221k",
    tracks: [4, 11],
  },
  "Nola June": {
    hero:    "https://picsum.photos/seed/nolajune/800/600",
    genre:   "R&B · Soul",
    location:"New Orleans, LA",
    bio:     "There is nothing effortless about Nola June's music, even when it sounds that way. Every note on Quiet Storm was obsessed over, dismantled, and rebuilt. The result is R&B that feels both inevitable and completely unexpected, grounded in the soul tradition of her home city but never beholden to it.\n\nShe also makes the best gumbo in the business, by her own account.",
    monthlyListeners: "168k",
    tracks: [10, 12],
  },
  "Kai Santos": {
    hero:    "https://picsum.photos/seed/kaisantos/800/600",
    genre:   "Pop · Singer-Songwriter",
    location:"São Paulo, BR",
    bio:     "Kai Santos makes the kind of pop music that sneaks up on you — melodically simple on first listen, then impossible to shake loose. His breakthrough single Running Through Fire spent six weeks in the global top 50 and introduced millions of listeners to his precise, emotionally direct songwriting.\n\nOriginally a session guitarist, he pivoted to writing his own material after a chance encounter with a broken four-track recorder and too much time on his hands during a long tour layover.",
    monthlyListeners: "309k",
    tracks: [5, 14],
  },
};

function ArtistPage({ artistName, onClose, onPlay, currentTrack, isPlaying, liked, onLike, supported, onSupport, likedArtists, onLikeArtist }) {
  const artist     = ARTISTS[artistName];
  const allTracks  = [...TRENDING, ...RECOMMENDATIONS];
  const tracks     = artist ? artist.tracks.map(id => allTracks.find(t => t.id === id)).filter(Boolean) : [];
  const subscribed   = supported?.has(artistName) ?? false;
  const artistLiked  = likedArtists?.has(artistName) ?? false;
  const [bioExpanded,  setBioExpanded]  = useState(false);

  if (!artist) return null;

  const bioParas = artist.bio.split("\n\n");

  return (
    <div className="sb-overlay" style={{ position: "fixed", inset: 0, zIndex: 70, background: "#fff", display: "flex", flexDirection: "column", fontFamily: "'Space Mono','Courier New',monospace", overflowY: "auto" }}>

      {/* ── Hero ── */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <img
          src={artist.hero}
          alt={artistName}
          style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", filter: "grayscale(100%)", opacity: 0.88, display: "block" }}
        />
        {/* Fade to white at bottom */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, transparent 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,1) 100%)" }} />

        {/* Back button */}
        <button
          onClick={onClose}
          style={{ position: "absolute", top: 14, left: 14, width: 34, height: 34, background: "rgba(255,255,255,0.88)", border: "1px solid rgba(0,0,0,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#000", cursor: "pointer" }}
        >‹</button>

        {/* Name + genre at bottom of hero */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 16px 18px" }}>
          <div style={{ fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(0,0,0,0.4)", marginBottom: 4 }}>{artist.location}</div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#000", letterSpacing: "-0.01em", lineHeight: 1.05 }}>{artistName}</h1>
          <div style={{ fontSize: 9, color: "#888", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 4 }}>{artist.genre}</div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: "0 16px 100px" }}>

        {/* Stats + Like + Support row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0 16px", borderBottom: "1px solid rgba(0,0,0,0.07)", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#000", letterSpacing: "-0.01em" }}>{artist.monthlyListeners}</div>
            <div style={{ fontSize: 8, color: "#aaa", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 2 }}>Monthly Listeners</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Heart Like button */}
            <button
              onClick={() => onLikeArtist && onLikeArtist(artistName)}
              style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", background: artistLiked ? "#CCFF00" : "transparent", border: "1px solid", borderColor: artistLiked ? "#CCFF00" : "rgba(0,0,0,0.15)", cursor: "pointer", transition: "all 0.15s", flexShrink: 0 }}
              title={artistLiked ? "Unlike" : "Like"}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={artistLiked ? "#000" : "none"} stroke={artistLiked ? "#000" : "#000"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
            {/* Support button */}
            <button
              onClick={() => onSupport && onSupport(artistName)}
              style={{ padding: "10px 16px", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "inherit", cursor: "pointer", border: "1px solid", borderColor: subscribed ? "#000" : "rgba(0,0,0,0.15)", background: subscribed ? "#000" : "transparent", color: subscribed ? "#fff" : "#000", transition: "all 0.15s", whiteSpace: "nowrap" }}
            >
              {subscribed ? "✓ Supporting" : "Support — $2.99 / yr"}
            </button>
          </div>
        </div>

        {/* ── Biography ── */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaa", marginBottom: 14 }}>Biography</div>
          <div style={{ fontSize: 12, color: "#333", letterSpacing: "0.02em", lineHeight: 1.85 }}>
            <p>{bioParas[0]}</p>
            {bioExpanded && bioParas.slice(1).map((p, i) => <p key={i} style={{ marginTop: 14 }}>{p}</p>)}
          </div>
          {bioParas.length > 1 && (
            <button
              onClick={() => setBioExpanded(e => !e)}
              style={{ fontSize: 9, color: "#999", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 12, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0, textDecoration: "underline", textUnderlineOffset: 3 }}
            >
              {bioExpanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>

        {/* ── Tracks ── */}
        <div>
          <div style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaa", marginBottom: 12 }}>Tracks</div>
          <div style={{ border: "1px solid rgba(0,0,0,0.07)", marginLeft: -16, marginRight: -16 }}>
            {tracks.map((track, i) => (
              <div
                key={track.id}
                onClick={() => onPlay(track)}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", borderBottom: i < tracks.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none", background: currentTrack?.id === track.id ? "rgba(0,0,0,0.02)" : "transparent", borderLeft: currentTrack?.id === track.id ? "2px solid #000" : "2px solid transparent", cursor: "pointer" }}
              >
                <div style={{ width: 20, textAlign: "center", flexShrink: 0 }}>
                  {currentTrack?.id === track.id && isPlaying
                    ? <PauseIcon size={12} />
                    : <span style={{ fontSize: 10, color: "#ccc" }}>{String(i + 1).padStart(2, "0")}</span>
                  }
                </div>
                <img src={track.cover} alt={track.title} style={{ width: 44, height: 44, filter: "grayscale(100%)", opacity: currentTrack?.id === track.id ? 0.9 : 0.6, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: currentTrack?.id === track.id ? "#000" : "#222", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{track.title}</div>
                  <div style={{ fontSize: 9, color: "#aaa", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 3 }}>{track.album}</div>
                </div>
                <button onClick={e => { e.stopPropagation(); onLike(track.id); }} style={{ color: liked.has(track.id) ? "#000" : "#ddd", background: "none", border: "none", cursor: "pointer", padding: "8px 4px", flexShrink: 0 }}>
                  <HeartIcon filled={liked.has(track.id)} size={16} />
                </button>
                <span style={{ fontSize: 10, color: "#ccc", flexShrink: 0, letterSpacing: "0.04em" }}>{track.duration}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Artist Dashboard ─────────────────────────────────────────────────────────

const DASH_DATA = {
  artist:      "Astral Drift",
  genre:       "Electronic · Synthwave",
  subscribers: { free: 1847, supporter: 342, superfan: 89 },
  revenue:     { mtd: 312.40, ytd: 2847.15, mtdPrev: 289.10, ytdPrev: 2201.80 },
  topTracks: [
    { title: "Neon Haze",          plays: 124832, trend: +12 },
    { title: "Echo Protocol",      plays:  98441, trend:  +8 },
    { title: "Midnight Circuit",   plays:  87209, trend:  -3 },
    { title: "Open Circuit",       plays:  71334, trend: +21 },
    { title: "Fade to Static",     plays:  58821, trend:  +5 },
    { title: "Golden Hour",        plays:  44102, trend:  -1 },
    { title: "Parallax View",      plays:  38774, trend: +14 },
    { title: "Glass Sky",          plays:  29443, trend:  +2 },
    { title: "Tidal Drift",        plays:  22187, trend:  -6 },
    { title: "Soft Resistance",    plays:  18920, trend:  +9 },
  ],
};

function fmt(n) { return n >= 1000 ? (n / 1000).toFixed(1) + "k" : n.toString(); }
function fmtRevenue(n) { return "$" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
function pctChange(curr, prev) {
  const p = ((curr - prev) / prev * 100);
  return (p > 0 ? "+" : "") + p.toFixed(1) + "%";
}

function ArtistDashboard({ onClose }) {
  const d = DASH_DATA;
  const totalSubs   = d.subscribers.free + d.subscribers.supporter + d.subscribers.superfan;
  const maxPlays    = d.topTracks[0].plays;
  const [section, setSection] = useState("overview"); // overview | tracks | tour
  const [tourDates, setTourDates] = useState([]);
  const [tourForm, setTourForm] = useState({ date: "", venue: "", city: "", tickets: "" });
  const [addingTour, setAddingTour] = useState(false);
  const setTF = (k, v) => setTourForm(f => ({ ...f, [k]: v }));
  const canAddTour = tourForm.date && tourForm.venue && tourForm.city;
  const saveTourDate = () => {
    if (!canAddTour) return;
    setTourDates(prev => [...prev, { id: Date.now(), ...tourForm }].sort((a, b) => a.date.localeCompare(b.date)));
    setTourForm({ date: "", venue: "", city: "", tickets: "" });
    setAddingTour(false);
  };
  const removeTourDate = (id) => setTourDates(prev => prev.filter(d => d.id !== id));

  const profileSlug = d.artist.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const profileUrl  = `https://softbolt.app/artist/${profileSlug}`;
  const [copied, setCopied] = useState(false);
  const copyLink = () => {
    navigator.clipboard?.writeText(profileUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const StatCard = ({ label, value, sub, up }) => (
    <div style={{ flex: 1, border: "1px solid rgba(0,0,0,0.08)", padding: "14px 14px 12px" }}>
      <div style={{ fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaa", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: "#000", letterSpacing: "-0.01em", lineHeight: 1 }}>{value}</div>
      {sub && (
        <div style={{ fontSize: 9, marginTop: 6, letterSpacing: "0.04em", color: up ? "#000" : "#aaa" }}>
          <span style={{ background: up ? "#CCFF00" : "#f5f5f5", padding: "1px 5px", marginRight: 4 }}>{sub}</span>
          vs last period
        </div>
      )}
    </div>
  );

  return (
    <div className="sb-overlay" style={{ position: "fixed", inset: 0, zIndex: 70, background: "#fff", display: "flex", flexDirection: "column", fontFamily: "'Space Mono','Courier New',monospace" }}>

      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid rgba(0,0,0,0.07)", flexShrink: 0 }}>
        <button onClick={onClose} style={{ fontSize: 22, color: "#000", lineHeight: 1, padding: 4 }}>‹</button>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <svg width="10" height="14" viewBox="0 0 16 22" fill="none"><path d="M2 0 L14 0 L8 9 L13 9 L3 22 L6 12 L1 12 Z" fill="#CCFF00"/></svg>
          <span style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "#000", fontWeight: 700 }}>Dashboard</span>
        </div>
        <div style={{ width: 32 }} />
      </div>

      {/* Artist identity */}
      <div style={{ padding: "16px 16px 12px", flexShrink: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#000", letterSpacing: "-0.01em" }}>{d.artist}</div>
        <div style={{ fontSize: 9, color: "#aaa", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 3, marginBottom: 14 }}>{d.genre}</div>

        {/* Profile link card */}
        <div style={{ border: "1px solid rgba(0,0,0,0.1)", display: "flex", alignItems: "center", overflow: "hidden" }}>
          {/* Link icon */}
          <div style={{ padding: "0 12px", borderRight: "1px solid rgba(0,0,0,0.08)", alignSelf: "stretch", display: "flex", alignItems: "center", background: "rgba(0,0,0,0.02)", flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          </div>
          {/* URL text */}
          <div style={{ flex: 1, padding: "10px 12px", minWidth: 0 }}>
            <div style={{ fontSize: 8, letterSpacing: "0.1em", textTransform: "uppercase", color: "#bbb", marginBottom: 3 }}>Profile Link</div>
            <div style={{ fontSize: 10, color: "#555", letterSpacing: "0.02em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{profileUrl}</div>
          </div>
          {/* Copy button */}
          <button
            onClick={copyLink}
            style={{ flexShrink: 0, padding: "0 16px", alignSelf: "stretch", background: copied ? "#CCFF00" : "#000", color: copied ? "#000" : "#fff", fontSize: 8, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, fontFamily: "inherit", border: "none", cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap" }}
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* Section toggle */}
      <div style={{ display: "flex", padding: "14px 16px 0", gap: 20, borderBottom: "1px solid rgba(0,0,0,0.07)", flexShrink: 0 }}>
        {[["overview","Overview"],["tracks","Top Tracks"],["tour","Tour Dates"]].map(([id, label]) => (
          <button key={id} onClick={() => setSection(id)} style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: section === id ? "#000" : "#bbb", paddingBottom: 10, borderBottom: section === id ? "1px solid #000" : "1px solid transparent", transition: "all 0.15s", background: "none", border: "none", borderBottom: section === id ? "1px solid #000" : "1px solid transparent", cursor: "pointer", fontFamily: "inherit" }}>
            {label}
          </button>
        ))}
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px 40px" }}>

        {section === "overview" && (
          <>
            {/* ── Revenue ── */}
            <div style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaa", marginBottom: 10 }}>Revenue</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
              <StatCard label="Month to Date" value={fmtRevenue(d.revenue.mtd)} sub={pctChange(d.revenue.mtd, d.revenue.mtdPrev)} up={d.revenue.mtd > d.revenue.mtdPrev} />
              <StatCard label="Year to Date"  value={fmtRevenue(d.revenue.ytd)} sub={pctChange(d.revenue.ytd, d.revenue.ytdPrev)} up={d.revenue.ytd > d.revenue.ytdPrev} />
            </div>

            {/* Monthly bar chart */}
            <div style={{ border: "1px solid rgba(0,0,0,0.07)", padding: "14px", marginBottom: 24 }}>
              <div style={{ fontSize: 8, letterSpacing: "0.12em", textTransform: "uppercase", color: "#aaa", marginBottom: 12 }}>Monthly Revenue — 2026</div>
              {(() => {
                const months = [["Jan",210],["Feb",238],["Mar",265],["Apr",291],["May",255],["Jun",278],["Jul",312],["Aug",303],["Sep",289],["Oct",null],["Nov",null],["Dec",null]];
                const max = 320;
                return (
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 60 }}>
                    {months.map(([m, v]) => (
                      <div key={m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <div style={{ width: "100%", background: v ? (m === "Jul" ? "#000" : "#e8e8e8") : "#f5f5f5", height: v ? Math.round((v / max) * 52) : 3, transition: "height 0.3s" }} />
                        <span style={{ fontSize: 7, color: m === "Jul" ? "#000" : "#ccc", letterSpacing: "0.04em" }}>{m}</span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* ── Subscribers ── */}
            <div style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaa", marginBottom: 10 }}>Subscribers</div>

            {/* Total */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <StatCard label="Total Subscribers" value={totalSubs.toLocaleString()} />
              <StatCard label="Paying Subscribers" value={(d.subscribers.supporter + d.subscribers.superfan).toLocaleString()} />
            </div>

            {/* Per-tier breakdown */}
            <div style={{ display: "flex", flexDirection: "column", gap: 1, marginBottom: 24 }}>
              {[
                { id: "superfan",  label: "Superfan",  price: "$9.99/yr", count: d.subscribers.superfan,  color: "#000" },
                { id: "supporter", label: "Supporter", price: "$2.99/yr", count: d.subscribers.supporter, color: "#555" },
                { id: "free",      label: "Free",      price: "Free",     count: d.subscribers.free,       color: "#ccc" },
              ].map(tier => {
                const pct = Math.round((tier.count / totalSubs) * 100);
                return (
                  <div key={tier.id} style={{ border: "1px solid rgba(0,0,0,0.07)", padding: "12px 14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 8, height: 8, background: tier.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 11, color: "#000", letterSpacing: "0.02em" }}>{tier.label}</span>
                        <span style={{ fontSize: 9, color: "#aaa", letterSpacing: "0.06em" }}>{tier.price}</span>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#000" }}>{tier.count.toLocaleString()}</span>
                        <span style={{ fontSize: 9, color: "#bbb", marginLeft: 5 }}>{pct}%</span>
                      </div>
                    </div>
                    <div style={{ height: 3, background: "#f0f0f0" }}>
                      <div style={{ height: "100%", background: tier.color, width: `${pct}%`, transition: "width 0.4s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Revenue per tier */}
            <div style={{ border: "1px solid rgba(0,0,0,0.07)", padding: "14px", marginBottom: 8 }}>
              <div style={{ fontSize: 8, letterSpacing: "0.12em", textTransform: "uppercase", color: "#aaa", marginBottom: 12 }}>Annual Revenue by Tier</div>
              {[
                { label: "Superfan",  count: d.subscribers.superfan,  price: 9.99 },
                { label: "Supporter", count: d.subscribers.supporter, price: 2.99 },
              ].map(t => {
                const gross = t.count * t.price;
                const net   = gross * 0.95;
                return (
                  <div key={t.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                    <span style={{ fontSize: 10, color: "#555", letterSpacing: "0.03em" }}>{t.label}</span>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#000" }}>{fmtRevenue(net)}<span style={{ fontSize: 8, color: "#aaa", fontWeight: 400, marginLeft: 3 }}>net</span></div>
                      <div style={{ fontSize: 9, color: "#ccc" }}>{fmtRevenue(gross)} gross</div>
                    </div>
                  </div>
                );
              })}
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10 }}>
                <span style={{ fontSize: 9, color: "#aaa", letterSpacing: "0.06em" }}>5% platform fee applied</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#000" }}>{fmtRevenue((d.subscribers.superfan * 9.99 + d.subscribers.supporter * 2.99) * 0.95)} / yr</span>
              </div>
            </div>
          </>
        )}

        {section === "tracks" && (
          <>
            <div style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaa", marginBottom: 10 }}>Top 10 — All Time</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {d.topTracks.map((t, i) => {
                const barW = Math.round((t.plays / maxPlays) * 100);
                const up   = t.trend > 0;
                return (
                  <div key={t.title} style={{ border: "1px solid rgba(0,0,0,0.07)", padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 7 }}>
                      <span style={{ fontSize: 10, color: "#ccc", width: 18, flexShrink: 0, letterSpacing: "0.04em" }}>{String(i + 1).padStart(2, "0")}</span>
                      <span style={{ flex: 1, fontSize: 12, color: "#000", letterSpacing: "0.02em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#000", flexShrink: 0 }}>{fmt(t.plays)}</span>
                      <span style={{ fontSize: 9, flexShrink: 0, letterSpacing: "0.04em", color: up ? "#000" : "#bbb", background: up ? "#CCFF00" : "#f5f5f5", padding: "1px 5px", minWidth: 36, textAlign: "center" }}>
                        {t.trend > 0 ? "+" : ""}{t.trend}%
                      </span>
                    </div>
                    <div style={{ height: 2, background: "#f0f0f0", marginLeft: 30 }}>
                      <div style={{ height: "100%", background: i === 0 ? "#000" : "#d0d0d0", width: `${barW}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total plays summary */}
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <StatCard label="Total Plays" value={fmt(d.topTracks.reduce((s, t) => s + t.plays, 0))} />
              <StatCard label="Avg per Track" value={fmt(Math.round(d.topTracks.reduce((s,t) => s+t.plays,0) / d.topTracks.length))} />
            </div>
          </>
        )}

        {/* ── TOUR DATES ── */}
        {section === "tour" && (
          <>
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaa" }}>
                {tourDates.length} date{tourDates.length !== 1 ? "s" : ""} scheduled
              </div>
              <button
                onClick={() => setAddingTour(a => !a)}
                style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, background: addingTour ? "rgba(0,0,0,0.06)" : "#CCFF00", color: "#000", padding: "7px 14px", border: "none", fontFamily: "inherit", cursor: "pointer", transition: "all 0.15s" }}
              >
                {addingTour ? "✕ Cancel" : "+ Add Date"}
              </button>
            </div>

            {/* Add form */}
            {addingTour && (
              <div style={{ border: "1px solid #000", padding: "20px 16px", marginBottom: 20, background: "rgba(204,255,0,0.04)" }}>
                <div style={{ fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>New Tour Date</div>

                {/* Date */}
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 8, letterSpacing: "0.12em", textTransform: "uppercase", color: "#aaa", display: "block", marginBottom: 6 }}>Date *</label>
                  <input
                    type="date"
                    value={tourForm.date}
                    onChange={e => setTF("date", e.target.value)}
                    style={{ width: "100%", border: "1px solid rgba(0,0,0,0.15)", fontSize: 12, padding: "10px 12px", fontFamily: "inherit", outline: "none", background: "transparent", color: "#111" }}
                    onFocus={e => e.target.style.borderColor = "#000"}
                    onBlur={e => e.target.style.borderColor = "rgba(0,0,0,0.15)"}
                  />
                </div>

                {/* Venue */}
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 8, letterSpacing: "0.12em", textTransform: "uppercase", color: "#aaa", display: "block", marginBottom: 6 }}>Venue *</label>
                  <input
                    type="text"
                    value={tourForm.venue}
                    onChange={e => setTF("venue", e.target.value)}
                    placeholder="e.g. The Bowery Ballroom"
                    style={{ width: "100%", border: "1px solid rgba(0,0,0,0.15)", fontSize: 12, padding: "10px 12px", fontFamily: "inherit", outline: "none", background: "transparent", color: "#111" }}
                    onFocus={e => e.target.style.borderColor = "#000"}
                    onBlur={e => e.target.style.borderColor = "rgba(0,0,0,0.15)"}
                  />
                </div>

                {/* City */}
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 8, letterSpacing: "0.12em", textTransform: "uppercase", color: "#aaa", display: "block", marginBottom: 6 }}>City *</label>
                  <input
                    type="text"
                    value={tourForm.city}
                    onChange={e => setTF("city", e.target.value)}
                    placeholder="e.g. New York, NY"
                    style={{ width: "100%", border: "1px solid rgba(0,0,0,0.15)", fontSize: 12, padding: "10px 12px", fontFamily: "inherit", outline: "none", background: "transparent", color: "#111" }}
                    onFocus={e => e.target.style.borderColor = "#000"}
                    onBlur={e => e.target.style.borderColor = "rgba(0,0,0,0.15)"}
                  />
                </div>

                {/* Tickets URL (optional) */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 8, letterSpacing: "0.12em", textTransform: "uppercase", color: "#aaa", display: "block", marginBottom: 6 }}>Ticket Link <span style={{ color: "#ccc" }}>(optional)</span></label>
                  <input
                    type="url"
                    value={tourForm.tickets}
                    onChange={e => setTF("tickets", e.target.value)}
                    placeholder="https://tickets.example.com"
                    style={{ width: "100%", border: "1px solid rgba(0,0,0,0.15)", fontSize: 12, padding: "10px 12px", fontFamily: "inherit", outline: "none", background: "transparent", color: "#111" }}
                    onFocus={e => e.target.style.borderColor = "#000"}
                    onBlur={e => e.target.style.borderColor = "rgba(0,0,0,0.15)"}
                  />
                </div>

                <button
                  onClick={saveTourDate}
                  disabled={!canAddTour}
                  style={{ width: "100%", padding: "13px", background: canAddTour ? "#000" : "rgba(0,0,0,0.08)", color: canAddTour ? "#fff" : "#bbb", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "inherit", cursor: canAddTour ? "pointer" : "default", border: "none", transition: "all 0.15s" }}
                >
                  Save Date →
                </button>
              </div>
            )}

            {/* Tour date list */}
            {tourDates.length === 0 && !addingTour ? (
              <div style={{ textAlign: "center", padding: "52px 0", border: "1px dashed rgba(0,0,0,0.1)" }}>
                <div style={{ fontSize: 22, color: "#e0e0e0", marginBottom: 10 }}>✦</div>
                <div style={{ fontSize: 10, color: "#ccc", letterSpacing: "0.12em", textTransform: "uppercase" }}>No tour dates yet</div>
                <div style={{ fontSize: 9, color: "#ddd", marginTop: 6, letterSpacing: "0.05em" }}>Tap + Add Date to schedule a show</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {tourDates.map((td, i) => {
                  const d = new Date(td.date + "T00:00:00");
                  const month = d.toLocaleString("en", { month: "short" }).toUpperCase();
                  const day   = d.getDate();
                  const year  = d.getFullYear();
                  return (
                    <div key={td.id} style={{ border: "1px solid rgba(0,0,0,0.08)", padding: "14px 14px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                      {/* Date badge */}
                      <div style={{ flexShrink: 0, width: 44, textAlign: "center", background: "#CCFF00", padding: "6px 0" }}>
                        <div style={{ fontSize: 8, letterSpacing: "0.1em", color: "#000", fontWeight: 700 }}>{month}</div>
                        <div style={{ fontSize: 22, fontWeight: 700, color: "#000", lineHeight: 1.1 }}>{day}</div>
                        <div style={{ fontSize: 8, color: "#555", letterSpacing: "0.06em" }}>{year}</div>
                      </div>
                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#000", letterSpacing: "0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{td.venue}</div>
                        <div style={{ fontSize: 10, color: "#888", letterSpacing: "0.06em", marginTop: 3, textTransform: "uppercase" }}>{td.city}</div>
                        {td.tickets && (
                          <div style={{ fontSize: 9, color: "#aaa", marginTop: 6, letterSpacing: "0.04em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            🎟 <span style={{ borderBottom: "1px solid #ddd" }}>{td.tickets}</span>
                          </div>
                        )}
                      </div>
                      {/* Remove */}
                      <button onClick={() => removeTourDate(td.id)} style={{ color: "#ccc", fontSize: 18, lineHeight: 1, flexShrink: 0, padding: "2px 0 0 8px" }}>×</button>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── Account Page ─────────────────────────────────────────────────────────────

const BADGE_DEFS = {
  plays: [
    { id: "listener",     label: "Listener",     icon: "▶",  threshold: 1,   desc: "Played your first track" },
    { id: "tunehead",     label: "Tune Head",    icon: "🎧", threshold: 10,  desc: "10 tracks played" },
    { id: "audiophile",   label: "Audiophile",   icon: "📻", threshold: 50,  desc: "50 tracks played" },
    { id: "chartwatcher", label: "Chart Watcher",icon: "📈", threshold: 100, desc: "100 tracks played" },
  ],
  playlists: [
    { id: "curator",      label: "Curator",      icon: "✦",  threshold: 1,   desc: "Created your first playlist" },
    { id: "dj",           label: "DJ",           icon: "🎚", threshold: 3,   desc: "Created 3 playlists" },
    { id: "director",     label: "Music Director",icon: "🎼",threshold: 5,   desc: "Created 5 playlists" },
  ],
  support: [
    { id: "patron",       label: "Patron",       icon: "⚡",  threshold: 1,   desc: "Supporting 1 artist" },
    { id: "superfan",     label: "Superfan",     icon: "★",  threshold: 3,   desc: "Supporting 3 artists" },
    { id: "champion",     label: "Champion",     icon: "♛",  threshold: 5,   desc: "Supporting 5 artists" },
  ],
};

function AccountPage({ profile, onUpdateProfile, onClose, playCount, playlistCount, supportedCount }) {
  const fileRef = useRef(null);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editEmail, setEditEmail] = useState(profile.email);

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onUpdateProfile(p => ({ ...p, photo: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const saveEdits = () => {
    onUpdateProfile(p => ({ ...p, name: editName, email: editEmail }));
    setEditing(false);
  };

  const counts = { plays: playCount, playlists: playlistCount, support: supportedCount };

  const BadgeRow = ({ category, label }) => {
    const defs = BADGE_DEFS[category];
    const count = counts[category];
    const earned = defs.filter(b => count >= b.threshold);
    const next = defs.find(b => count < b.threshold);
    return (
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaa", marginBottom: 12 }}>{label}</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {defs.map((badge, i) => {
            const unlocked = count >= badge.threshold;
            const gradients = [
              "linear-gradient(135deg, #f5ffcc 0%, #CCFF00 100%)",
              "linear-gradient(135deg, #CCFF00 0%, #a8ee00 100%)",
              "linear-gradient(135deg, #a8ee00 0%, #77cc00 100%)",
              "linear-gradient(135deg, #77cc00 0%, #44aa00 100%)",
            ];
            const bg = unlocked ? gradients[i] || gradients[gradients.length - 1] : "#f9f9f9";
            const borderColor = unlocked ? (i === 0 ? "#aadd00" : i === 1 ? "#88cc00" : i === 2 ? "#559900" : "#336600") : "rgba(0,0,0,0.1)";
            return (
              <div key={badge.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: 72 }}>
                <div style={{ width: 52, height: 52, border: `1px solid ${borderColor}`, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, transition: "all 0.2s", opacity: unlocked ? 1 : 0.35 }}>
                  {badge.icon}
                </div>
                <span style={{ fontSize: 8, letterSpacing: "0.08em", textTransform: "uppercase", color: unlocked ? "#000" : "#ccc", textAlign: "center", lineHeight: 1.3 }}>{badge.label}</span>
              </div>
            );
          })}
        </div>
        {next && (
          <div style={{ marginTop: 10, fontSize: 9, color: "#bbb", letterSpacing: "0.04em" }}>
            Next: <span style={{ color: "#888" }}>{next.label}</span> — {next.threshold - count} more {category === "plays" ? "plays" : category === "playlists" ? "playlists" : "artists"} to go
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="sb-overlay" style={{ position: "fixed", inset: 0, zIndex: 80, background: "#fff", display: "flex", flexDirection: "column", fontFamily: "'Space Mono','Courier New',monospace", overflowY: "auto" }}>
      {/* Header */}
      <div style={{ height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", borderBottom: "1px solid rgba(0,0,0,0.07)", flexShrink: 0, position: "sticky", top: 0, background: "#fff", zIndex: 2 }}>
        <button onClick={onClose} style={{ color: "#888", fontSize: 20, lineHeight: 1 }}>←</button>
        <span style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700 }}>Account</span>
        {editing
          ? <button onClick={saveEdits} style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, background: "#CCFF00", color: "#000", padding: "6px 12px", fontFamily: "inherit" }}>Save</button>
          : <button onClick={() => setEditing(true)} style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "#aaa", fontFamily: "inherit" }}>Edit</button>
        }
      </div>

      <div style={{ padding: "32px 16px 60px" }}>
        {/* Avatar */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 32 }}>
          <div
            onClick={() => fileRef.current?.click()}
            style={{ width: 88, height: 88, border: "1px solid rgba(0,0,0,0.12)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden", marginBottom: 10, position: "relative" }}
          >
            {profile.photo
              ? <img src={profile.photo} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%)" }} />
              : <span style={{ fontSize: 32, color: "#ccc", fontWeight: 700 }}>{(profile.name || "D")[0].toUpperCase()}</span>}
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0)", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 6 }}>
              <span style={{ fontSize: 8, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(0,0,0,0.5)", background: "rgba(255,255,255,0.85)", padding: "2px 6px" }}>Upload</span>
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />
          <div style={{ fontSize: 9, color: "#bbb", letterSpacing: "0.08em", textTransform: "uppercase" }}>Profile Photo</div>
        </div>

        {/* Sign-in info */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaa", marginBottom: 12 }}>Account Info</div>
          <div style={{ border: "1px solid rgba(0,0,0,0.08)", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 8, letterSpacing: "0.12em", textTransform: "uppercase", color: "#bbb", marginBottom: 5 }}>Name</div>
              {editing
                ? <input value={editName} onChange={e => setEditName(e.target.value)} style={{ width: "100%", border: "none", borderBottom: "1px solid rgba(0,0,0,0.2)", fontSize: 13, color: "#111", outline: "none", padding: "2px 0", fontFamily: "inherit", background: "transparent" }} />
                : <div style={{ fontSize: 13, color: "#111", letterSpacing: "0.02em" }}>{profile.name}</div>}
            </div>
            <div style={{ padding: "14px 16px" }}>
              <div style={{ fontSize: 8, letterSpacing: "0.12em", textTransform: "uppercase", color: "#bbb", marginBottom: 5 }}>Email</div>
              {editing
                ? <input value={editEmail} onChange={e => setEditEmail(e.target.value)} style={{ width: "100%", border: "none", borderBottom: "1px solid rgba(0,0,0,0.2)", fontSize: 13, color: "#111", outline: "none", padding: "2px 0", fontFamily: "inherit", background: "transparent" }} />
                : <div style={{ fontSize: 13, color: "#111", letterSpacing: "0.02em" }}>{profile.email}</div>}
            </div>
          </div>
        </div>

        {/* Activity stats row */}
        <div style={{ display: "flex", gap: 0, border: "1px solid rgba(0,0,0,0.08)", marginBottom: 32 }}>
          {[
            { label: "Plays",     value: playCount },
            { label: "Playlists", value: playlistCount },
            { label: "Supporting",value: supportedCount },
          ].map((stat, i) => (
            <div key={stat.label} style={{ flex: 1, textAlign: "center", padding: "14px 8px", borderRight: i < 2 ? "1px solid rgba(0,0,0,0.08)" : "none" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#000", letterSpacing: "-0.01em" }}>{stat.value}</div>
              <div style={{ fontSize: 8, color: "#aaa", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Badges */}
        <div style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaa", marginBottom: 20 }}>Badges</div>
        <BadgeRow category="plays"     label="Plays" />
        <BadgeRow category="playlists" label="Playlists" />
        <BadgeRow category="support"   label="Support" />
      </div>
    </div>
  );
}

// ── Create Playlist Overlay ───────────────────────────────────────────────────

function CreatePlaylistOverlay({ availableArtists, likedArtistNames, onClose, onCreate }) {
  const [playlistName, setPlaylistName] = useState("");
  const [selectedArtists, setSelectedArtists] = useState(new Set());

  const toggleArtist = (name) => {
    setSelectedArtists(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const handleCreate = () => {
    if (!playlistName.trim() || selectedArtists.size === 0) return;
    const artists = [...selectedArtists];
    const tracks = ALL_TRACKS.filter(t => artists.includes(t.artist));
    onCreate({
      id: `pl-${Date.now()}`,
      title: playlistName.trim(),
      artists,
      tracks,
    });
  };

  const canCreate = playlistName.trim().length > 0 && selectedArtists.size > 0;

  return (
    <div className="sb-overlay" style={{ position: "fixed", inset: 0, background: "#fff", zIndex: 70, display: "flex", flexDirection: "column", fontFamily: "'Space Mono', 'Courier New', monospace" }}>
      {/* Header */}
      <div style={{ height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", borderBottom: "1px solid rgba(0,0,0,0.07)", flexShrink: 0 }}>
        <button onClick={onClose} style={{ color: "#888", fontSize: 20, lineHeight: 1 }}>←</button>
        <span style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700 }}>New Playlist</span>
        <button
          onClick={handleCreate}
          disabled={!canCreate}
          style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, background: canCreate ? "#CCFF00" : "rgba(0,0,0,0.06)", color: canCreate ? "#000" : "#bbb", padding: "6px 12px", border: "none", fontFamily: "inherit", cursor: canCreate ? "pointer" : "default", transition: "all 0.15s" }}
        >
          Create
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "24px 16px" }}>
        {/* Playlist name */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaa", marginBottom: 8 }}>Playlist Name</div>
          <input
            autoFocus
            value={playlistName}
            onChange={e => setPlaylistName(e.target.value)}
            placeholder="e.g. Late Night Drive"
            style={{ width: "100%", background: "transparent", border: "1px solid rgba(0,0,0,0.15)", color: "#111", fontSize: 13, letterSpacing: "0.02em", padding: "12px 14px", outline: "none", fontFamily: "inherit" }}
            onFocus={e => e.target.style.borderColor = "#000"}
            onBlur={e => e.target.style.borderColor = "rgba(0,0,0,0.15)"}
          />
        </div>

        {/* Artist picker */}
        <div style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaa", marginBottom: 12 }}>
          Choose Artists
        </div>

        {/* Liked artists section */}
        {likedArtistNames.length > 0 && (
          <div style={{ fontSize: 8, letterSpacing: "0.12em", textTransform: "uppercase", color: "#CCFF00", background: "#000", padding: "3px 8px", display: "inline-block", marginBottom: 10 }}>
            Artists you like
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 0, border: "1px solid rgba(0,0,0,0.07)", marginLeft: -16, marginRight: -16, marginBottom: 20 }}>
          {availableArtists.map((name, i) => {
            const artist = ARTISTS[name];
            const isLiked = likedArtistNames.includes(name);
            const selected = selectedArtists.has(name);
            return (
              <div
                key={name}
                onClick={() => toggleArtist(name)}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: i < availableArtists.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none", cursor: "pointer", background: selected ? "rgba(204,255,0,0.08)" : "#fff", transition: "background 0.12s" }}
              >
                {/* Artist avatar */}
                {artist ? (
                  <img src={artist.hero} alt={name} style={{ width: 40, height: 40, objectFit: "cover", filter: "grayscale(100%)", opacity: 0.8, flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 40, height: 40, background: "#f0f0f0", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#ccc" }}>♪</div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: "#111", letterSpacing: "0.02em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</div>
                  {artist && <div style={{ fontSize: 9, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.07em", marginTop: 2 }}>{artist.genre}</div>}
                  {isLiked && !artist && <div style={{ fontSize: 9, color: "#aaa", letterSpacing: "0.07em", marginTop: 2 }}>From your liked tracks</div>}
                </div>
                {/* Checkbox */}
                <div style={{ width: 20, height: 20, border: `1px solid ${selected ? "#000" : "#ccc"}`, background: selected ? "#CCFF00" : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.12s" }}>
                  {selected && <span style={{ fontSize: 11, color: "#000", lineHeight: 1 }}>✓</span>}
                </div>
              </div>
            );
          })}
        </div>

        {selectedArtists.size > 0 && (
          <div style={{ fontSize: 9, color: "#aaa", letterSpacing: "0.06em", textAlign: "center", paddingBottom: 16 }}>
            {[...selectedArtists].length} artist{selectedArtists.size !== 1 ? "s" : ""} selected · {ALL_TRACKS.filter(t => selectedArtists.has(t.artist)).length} tracks
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────────

export default function MusicDiscoveryApp() {
  const [tab, setTab]               = useState("trending");
  const [query, setQuery]           = useState("");
  const [genreFilter, setGenreFilter] = useState("All");
  const [searchOpen, setSearchOpen] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying]   = useState(false);
  const [progress, setProgress]     = useState(0);
  const [volume, setVolume]         = useState(72);
  const [liked, setLiked]           = useState(new Set());
  const [playerOpen, setPlayerOpen]         = useState(false);
  const [artistSignup, setArtistSignup]     = useState(false);
  const [artistDashboard, setArtistDashboard] = useState(false);
  const [artistPage, setArtistPage]           = useState(null); // artist name string
  const [createPlaylistOpen, setCreatePlaylistOpen] = useState(false);
  const [userPlaylists, setUserPlaylists]     = useState([]);
  const [accountOpen, setAccountOpen]         = useState(false);
  const [userProfile, setUserProfile]         = useState({ name: "David", email: "thedobrien@gmail.com", photo: null });
  const [playCount, setPlayCount]             = useState(0);
  const [supported, setSupported]             = useState(new Set()); // artist names user supports
  const [likedArtists, setLikedArtists]       = useState(new Set()); // artist names user has liked
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) { setIsPlaying(false); return 0; }
          return p + 100 / (parseDuration(currentTrack?.duration || "3:00") * 10);
        });
      }, 100);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, currentTrack]);

  const playTrack = (track) => {
    if (currentTrack?.id === track.id) { setIsPlaying(p => !p); }
    else { setCurrentTrack(track); setProgress(0); setIsPlaying(true); setPlayCount(c => c + 1); }
  };

  const handlePrev = () => {
    const list = tab === "recommend" ? RECOMMENDATIONS : TRENDING;
    const idx = list.findIndex(t => t.id === currentTrack?.id);
    if (idx > 0) playTrack(list[idx - 1]);
  };
  const handleNext = () => {
    const list = tab === "recommend" ? RECOMMENDATIONS : TRENDING;
    const idx = list.findIndex(t => t.id === currentTrack?.id);
    if (idx < list.length - 1) playTrack(list[idx + 1]);
    else if (idx === -1 && list.length > 0) playTrack(list[0]);
  };

  const toggleLike = (id) => {
    setLiked(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const filteredSearch = ALL_TRACKS.filter(t => {
    const q = query.toLowerCase();
    return (!q || t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q) || t.album.toLowerCase().includes(q))
      && (genreFilter === "All" || t.genre === genreFilter);
  });

  // bottom padding: tab bar (57) + mini player (60 when active)
  const bottomPad = currentTrack ? 117 : 57;

  const TABS = [
    { id: "trending",  label: "Charts",   Icon: ChartIcon },
    { id: "discover",  label: "New",      Icon: AlbumIcon },
    { id: "recommend", label: "For You",  Icon: ForYouIcon },
    { id: "playlist",  label: "Playlist", Icon: PlaylistIcon },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#fff", position: "relative", fontFamily: "'Space Mono', 'Courier New', monospace", color: "#000" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: rgba(0,0,0,0.08); }
        ::-webkit-scrollbar { display: none; }
        button { background: none; border: none; cursor: pointer; font-family: inherit; padding: 0; }
        input  { font-family: inherit; }
        @keyframes eq1 { 0%,100%{height:35%} 50%{height:85%} }
        @keyframes eq2 { 0%,100%{height:85%} 50%{height:30%} }
        @keyframes eq3 { 0%,100%{height:55%} 50%{height:95%} }

        /* ── Responsive ── */
        .sb-sidebar   { display: none; }
        .sb-top-header { display: flex; }

        @media (min-width: 768px) {
          .sb-sidebar    { display: flex !important; }
          .sb-top-header { display: none !important; }
          .sb-tab-bar    { display: none !important; }
          .sb-scroll     { margin-left: 220px; padding-bottom: 72px !important; }
          .sb-miniplayer { left: 220px !important; bottom: 0 !important; right: 0 !important; width: auto !important; max-width: none !important; transform: none !important; }
          .sb-overlay    { left: 50% !important; transform: translateX(-50%) !important; max-width: 640px !important; width: 100% !important; }
        }
      `}</style>

      {/* ── Desktop Sidebar ── */}
      <div className="sb-sidebar" style={{ position: "fixed", left: 0, top: 0, bottom: 0, width: 220, borderRight: "1px solid rgba(0,0,0,0.08)", flexDirection: "column", zIndex: 40, background: "#fff" }}>
        <div style={{ padding: "0 20px", height: 52, borderBottom: "1px solid rgba(0,0,0,0.07)", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <BoltLogo />
          <span style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700 }}>Softbolt</span>
        </div>
        <div style={{ flex: 1, paddingTop: 12, overflowY: "auto" }}>
          {TABS.map(({ id, label, Icon }) => {
            const active = tab === id;
            return (
              <button key={id} onClick={() => setTab(id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "13px 20px", background: active ? "#CCFF00" : "transparent", color: active ? "#000" : "#aaa", transition: "all 0.15s", borderLeft: `3px solid ${active ? "#000" : "transparent"}`, fontFamily: "inherit" }}>
                <Icon active={active} />
                <span style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</span>
              </button>
            );
          })}
        </div>
        <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(0,0,0,0.07)", display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
          <button onClick={() => setSearchOpen(true)} style={{ color: "#888", display: "flex", alignItems: "center" }}><SearchIcon /></button>
          <button onClick={() => setAccountOpen(true)} style={{ width: 30, height: 30, border: "1px solid rgba(0,0,0,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#999", overflow: "hidden", flexShrink: 0 }}>
            {userProfile.photo ? <img src={userProfile.photo} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span>{(userProfile.name || "D")[0].toUpperCase()}</span>}
          </button>
          <span style={{ fontSize: 10, color: "#aaa", letterSpacing: "0.04em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userProfile.name}</span>
        </div>
      </div>

      {/* ── Top Header (mobile only) ── */}
      <div className="sb-top-header" style={{ position: "sticky", top: 0, zIndex: 30, background: "#fff", borderBottom: "1px solid rgba(0,0,0,0.07)", padding: "0 16px", height: 52, alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <BoltLogo />
          <span style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, color: "#000" }}>Softbolt</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setSearchOpen(true)} style={{ color: "#888", display: "flex", alignItems: "center", justifyContent: "center", padding: 2 }}>
            <SearchIcon />
          </button>
          <button onClick={() => setAccountOpen(true)} style={{ width: 28, height: 28, border: "1px solid rgba(0,0,0,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#999", letterSpacing: "0.04em", overflow: "hidden", padding: 0, flexShrink: 0 }}>
            {userProfile.photo
              ? <img src={userProfile.photo} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <span>{(userProfile.name || "D")[0].toUpperCase()}</span>}
          </button>
        </div>
      </div>

      {/* ── Scrollable Content ── */}
      <div className="sb-scroll" style={{ paddingBottom: bottomPad }}>

        {/* ── TRENDING ── */}
        {tab === "trending" && (
          <div style={{ padding: "24px 16px 0" }}>
            <SectionHead label="Global Charts" title="Trending Now" />

            {/* Top 3 horizontal scroll */}
            <div style={{ display: "flex", gap: 10, overflowX: "auto", marginBottom: 28, marginLeft: -16, marginRight: -16, paddingLeft: 16, paddingRight: 16 }}>
              {TRENDING.slice(0, 3).map((track, i) => (
                <div key={track.id} onClick={() => playTrack(track)} style={{ flexShrink: 0, width: 180, border: "1px solid rgba(0,0,0,0.07)", padding: 16, cursor: "pointer", background: currentTrack?.id === track.id ? "rgba(0,0,0,0.02)" : "#fff" }}>
                  <div style={{ fontSize: 36, fontWeight: 700, color: "rgba(0,0,0,0.05)", lineHeight: 1, marginBottom: 12, letterSpacing: "-0.02em" }}>{String(i+1).padStart(2,"0")}</div>
                  <img src={track.cover} alt={track.title} style={{ width: 48, height: 48, filter: "grayscale(100%)", opacity: 0.7, marginBottom: 10 }} />
                  <div style={{ fontSize: 12, color: "#111", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{track.title}</div>
                  <div onClick={e => { e.stopPropagation(); setArtistPage(track.artist); }} style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 3, cursor: "pointer", display: "inline-block" }}><span style={{ color: "#000", background: "#CCFF00", padding: "1px 3px" }}>{track.artist}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, alignItems: "center" }}>
                    <span style={{ fontSize: 9, color: "#ccc", letterSpacing: "0.08em", textTransform: "uppercase" }}>{track.genre}</span>
                    <span style={{ fontSize: 9, color: "#ccc" }}>{track.plays}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Artist CTA / Dashboard banner */}
            <div onClick={() => artistDashboard ? null : setArtistSignup(true)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", border: "1px solid rgba(0,0,0,0.08)", marginBottom: 28, cursor: "pointer", background: "rgba(204,255,0,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <svg width="16" height="22" viewBox="0 0 16 22" fill="none"><path d="M2 0 L14 0 L8 9 L13 9 L3 22 L6 12 L1 12 Z" fill="#CCFF00"/></svg>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#000", letterSpacing: "0.02em" }}>Are you an artist?</div>
                  <div style={{ fontSize: 9, color: "#aaa", letterSpacing: "0.06em", marginTop: 2 }}>Join Softbolt and get discovered</div>
                </div>
              </div>
              <span style={{ fontSize: 16, color: "#bbb" }}>›</span>
            </div>

            {/* Full list */}
            <div style={{ fontSize: 9, color: "#aaa", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>Full Chart</div>
            <div style={{ border: "1px solid rgba(0,0,0,0.07)", marginLeft: -16, marginRight: -16 }}>
              {TRENDING.map((track, i) => (
                <TrackRow key={track.id} track={track} index={i} isActive={currentTrack?.id === track.id} isPlaying={isPlaying} onPlay={() => playTrack(track)} liked={liked.has(track.id)} onLike={toggleLike} onArtistTap={setArtistPage} />
              ))}
            </div>
          </div>
        )}

        {/* ── NEW RELEASES ── */}
        {tab === "discover" && (
          <div style={{ padding: "24px 16px 0" }}>
            <SectionHead label="Just Dropped" title="New Releases" />

            {/* 2-col album grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
              {ALBUMS.map(album => (
                <AlbumCard key={album.id} album={album} onPlay={() => { const t = TRENDING.find(t => t.artist === album.artist); if (t) playTrack(t); }} onArtistTap={setArtistPage} />
              ))}
            </div>

            <div style={{ fontSize: 9, color: "#aaa", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>Latest Tracks</div>
            <div style={{ border: "1px solid rgba(0,0,0,0.07)", marginLeft: -16, marginRight: -16 }}>
              {TRENDING.slice(3, 10).map((track, i) => (
                <TrackRow key={track.id} track={track} index={i+3} isActive={currentTrack?.id === track.id} isPlaying={isPlaying} onPlay={() => playTrack(track)} liked={liked.has(track.id)} onLike={toggleLike} onArtistTap={setArtistPage} />
              ))}
            </div>
          </div>
        )}

        {/* ── FOR YOU ── */}
        {tab === "recommend" && (
          <div style={{ padding: "24px 16px 0" }}>
            <SectionHead label="Personalized" title="For You" />

            {liked.size > 0 && (
              <div style={{ marginBottom: 20, padding: "12px 14px", border: "1px solid rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: 10 }}>
                <HeartIcon filled size={14} />
                <div>
                  <div style={{ fontSize: 11, color: "#333" }}>{liked.size} track{liked.size > 1 ? "s" : ""} saved</div>
                  <div style={{ fontSize: 9, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2 }}>Refining your picks</div>
                </div>
              </div>
            )}

            {/* 2-col recommendation grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 32 }}>
              {RECOMMENDATIONS.map(track => (
                <RecommendCard key={track.id} track={track} isActive={currentTrack?.id === track.id} isPlaying={isPlaying} onPlay={() => playTrack(track)} liked={liked.has(track.id)} onLike={toggleLike} onArtistTap={setArtistPage} />
              ))}
            </div>

            <div style={{ fontSize: 9, color: "#aaa", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>Because you like Electronic</div>
            <div style={{ border: "1px solid rgba(0,0,0,0.07)", marginLeft: -16, marginRight: -16 }}>
              {TRENDING.filter(t => ["Electronic", "Synthwave", "Ambient"].includes(t.genre)).map((track, i) => (
                <TrackRow key={track.id} track={track} index={i} isActive={currentTrack?.id === track.id} isPlaying={isPlaying} onPlay={() => playTrack(track)} liked={liked.has(track.id)} onLike={toggleLike} onArtistTap={setArtistPage} />
              ))}
            </div>
          </div>
        )}

        {/* ── PLAYLIST ── */}
        {tab === "playlist" && (() => {
          const likedTracks = ALL_TRACKS.filter(t => liked.has(t.id));
          const allPlaylists = [...userPlaylists];
          return (
            <div style={{ padding: "24px 16px 0" }}>
              {/* Header row */}
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 4 }}>
                <div>
                  <div style={{ fontSize: 9, color: "#aaa", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 4 }}>Your Library</div>
                  <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1 }}>Playlists</div>
                </div>
                <button
                  onClick={() => setCreatePlaylistOpen(true)}
                  style={{ display: "flex", alignItems: "center", gap: 6, background: "#CCFF00", color: "#000", border: "none", padding: "8px 14px", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "inherit", fontWeight: 700, cursor: "pointer", flexShrink: 0 }}
                >
                  + New
                </button>
              </div>
              <div style={{ width: 24, height: 1, background: "rgba(0,0,0,0.12)", marginBottom: 24, marginTop: 12 }} />

              {/* User-created playlists */}
              {allPlaylists.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 0, border: "1px solid rgba(0,0,0,0.07)", marginLeft: -16, marginRight: -16, marginBottom: 28 }}>
                  {allPlaylists.map((pl, i) => (
                    <div key={pl.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: i < allPlaylists.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none", cursor: "pointer" }}>
                      <div style={{ width: 44, height: 44, background: "#CCFF00", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="16" height="22" viewBox="0 0 16 22" fill="none"><path d="M2 0 L14 0 L8 9 L13 9 L3 22 L6 12 L1 12 Z" fill="#000"/></svg>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, color: "#111", letterSpacing: "0.02em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pl.title}</div>
                        <div style={{ fontSize: 9, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 3 }}>{pl.tracks.length} track{pl.tracks.length !== 1 ? "s" : ""} · {pl.artists.join(", ")}</div>
                      </div>
                      <span style={{ fontSize: 16, color: "#ccc" }}>›</span>
                    </div>
                  ))}
                </div>
              )}

              {allPlaylists.length === 0 && (
                <div style={{ textAlign: "center", padding: "32px 0 40px", border: "1px dashed rgba(0,0,0,0.1)", marginLeft: -16, marginRight: -16, marginBottom: 28 }}>
                  <div style={{ fontSize: 10, color: "#ccc", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>No playlists yet</div>
                  <div style={{ fontSize: 9, color: "#ddd", letterSpacing: "0.06em" }}>Tap + New to create your first one</div>
                </div>
              )}

              {/* Liked tracks */}
              <div style={{ fontSize: 9, color: "#aaa", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>
                Liked — {likedTracks.length} track{likedTracks.length !== 1 ? "s" : ""}
              </div>
              {likedTracks.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 0" }}>
                  <div style={{ fontSize: 24, marginBottom: 12, color: "#ddd" }}>♡</div>
                  <div style={{ fontSize: 10, color: "#ccc", letterSpacing: "0.12em", textTransform: "uppercase" }}>No liked tracks yet</div>
                  <div style={{ fontSize: 9, color: "#ddd", marginTop: 6, letterSpacing: "0.06em" }}>Tap ♡ on any track to save it here</div>
                </div>
              ) : (
                <div style={{ border: "1px solid rgba(0,0,0,0.07)", marginLeft: -16, marginRight: -16 }}>
                  {likedTracks.map((track, i) => (
                    <TrackRow key={track.id} track={track} index={i} isActive={currentTrack?.id === track.id} isPlaying={isPlaying} onPlay={() => playTrack(track)} liked={liked.has(track.id)} onLike={toggleLike} onArtistTap={setArtistPage} />
                  ))}
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* ── Create Playlist Overlay ── */}
      {createPlaylistOpen && (() => {
        // Artists from liked tracks + all platform artists
        const likedArtistNames = [...new Set(ALL_TRACKS.filter(t => liked.has(t.id)).map(t => t.artist))];
        const platformArtistNames = Object.keys(ARTISTS);
        const availableArtists = [...new Set([...likedArtistNames, ...platformArtistNames])];

        return (
          <CreatePlaylistOverlay
            availableArtists={availableArtists}
            likedArtistNames={likedArtistNames}
            onClose={() => setCreatePlaylistOpen(false)}
            onCreate={(playlist) => {
              setUserPlaylists(prev => [...prev, playlist]);
              setCreatePlaylistOpen(false);
            }}
          />
        );
      })()}

      {/* ── Search Overlay ── */}
      {searchOpen && (
        <div className="sb-overlay" style={{ position: "fixed", inset: 0, background: "#fff", zIndex: 60, display: "flex", flexDirection: "column", fontFamily: "'Space Mono', 'Courier New', monospace" }}>
          {/* Search header */}
          <div style={{ height: 52, display: "flex", alignItems: "center", gap: 10, padding: "0 16px", borderBottom: "1px solid rgba(0,0,0,0.07)", flexShrink: 0 }}>
            <button onClick={() => { setSearchOpen(false); setQuery(""); setGenreFilter("All"); }} style={{ color: "#888", fontSize: 20, lineHeight: 1, padding: "0 4px 0 0", flexShrink: 0 }}>←</button>
            <div style={{ position: "relative", flex: 1 }}>
              <input
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="artists, tracks, albums..."
                style={{ width: "100%", background: "transparent", border: "1px solid rgba(0,0,0,0.15)", color: "#333", fontSize: 11, letterSpacing: "0.04em", padding: "9px 32px 9px 12px", outline: "none", fontFamily: "inherit" }}
                onFocus={e => e.target.style.borderColor = "rgba(0,0,0,0.4)"}
                onBlur={e => e.target.style.borderColor = "rgba(0,0,0,0.15)"}
              />
              {query && <button onClick={() => setQuery("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "#bbb", fontSize: 18, lineHeight: 1 }}>×</button>}
            </div>
          </div>

          {/* Genre chips */}
          <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "12px 16px", borderBottom: "1px solid rgba(0,0,0,0.05)", flexShrink: 0 }}>
            {GENRES.map(g => (
              <button key={g} onClick={() => setGenreFilter(g)} style={{ flexShrink: 0, fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", padding: "5px 11px", border: "1px solid", borderColor: genreFilter === g ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.1)", color: genreFilter === g ? "#000" : "#bbb", transition: "all 0.15s", fontFamily: "inherit", background: "transparent", cursor: "pointer" }}>
                {g}
              </button>
            ))}
          </div>

          {/* Results */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {filteredSearch.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <div style={{ fontSize: 10, color: "#ccc", letterSpacing: "0.14em", textTransform: "uppercase" }}>No results found</div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 9, color: "#aaa", letterSpacing: "0.1em", textTransform: "uppercase", padding: "14px 16px 8px" }}>
                  {filteredSearch.length} result{filteredSearch.length !== 1 ? "s" : ""}{query ? ` — "${query}"` : ""}
                </div>
                <div style={{ border: "1px solid rgba(0,0,0,0.07)", borderLeft: "none", borderRight: "none" }}>
                  {filteredSearch.map((track, i) => (
                    <TrackRow key={track.id} track={track} index={i} isActive={currentTrack?.id === track.id} isPlaying={isPlaying} onPlay={() => { playTrack(track); setSearchOpen(false); }} liked={liked.has(track.id)} onLike={toggleLike} onArtistTap={name => { setArtistPage(name); setSearchOpen(false); }} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Mini Player ── */}
      <MiniPlayer track={currentTrack} isPlaying={isPlaying} onPlayPause={() => setIsPlaying(p => !p)} progress={progress} onExpand={() => setPlayerOpen(true)} />

      {/* ── Bottom Tab Bar (mobile only) ── */}
      <div className="sb-tab-bar" style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid rgba(0,0,0,0.08)", display: "flex", zIndex: 50 }}>
        {TABS.map(({ id, label, Icon }) => {
          const active = tab === id;
          return (
            <button key={id} onClick={() => setTab(id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "8px 0 10px", gap: 4, color: active ? "#000" : "#ccc", background: active ? "#CCFF00" : "transparent", transition: "background 0.15s, color 0.15s" }}>
              <Icon active={active} />
              <span style={{ fontSize: 8, letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Account Page ── */}
      {accountOpen && (
        <AccountPage
          profile={userProfile}
          onUpdateProfile={setUserProfile}
          onClose={() => setAccountOpen(false)}
          playCount={playCount}
          playlistCount={userPlaylists.length}
          supportedCount={supported.size}
        />
      )}

      {/* ── Artist Sign-up ── */}
      {artistPage && <ArtistPage artistName={artistPage} onClose={() => setArtistPage(null)} onPlay={playTrack} currentTrack={currentTrack} isPlaying={isPlaying} liked={liked} onLike={toggleLike} onArtistTap={setArtistPage} supported={supported} onSupport={name => setSupported(prev => { const next = new Set(prev); next.has(name) ? next.delete(name) : next.add(name); return next; })} likedArtists={likedArtists} onLikeArtist={name => setLikedArtists(prev => { const next = new Set(prev); next.has(name) ? next.delete(name) : next.add(name); return next; })} />}
      {artistSignup && <ArtistSignup onClose={() => setArtistSignup(false)} onOpenDashboard={() => { setArtistSignup(false); setArtistDashboard(true); }} />}
      {artistDashboard && <ArtistDashboard onClose={() => setArtistDashboard(false)} />}

      {/* ── Full Player ── */}
      {playerOpen && (
        <FullPlayer
          track={currentTrack}
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(p => !p)}
          progress={progress}
          onSeek={setProgress}
          onPrev={handlePrev}
          onNext={handleNext}
          volume={volume}
          onVolume={setVolume}
          liked={currentTrack ? liked.has(currentTrack.id) : false}
          onLike={() => currentTrack && toggleLike(currentTrack.id)}
          onClose={() => setPlayerOpen(false)}
        />
      )}
    </div>
  );
}
