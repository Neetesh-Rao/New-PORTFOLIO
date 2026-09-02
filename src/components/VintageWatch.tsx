import React, { useEffect, useState, useMemo, useRef } from "react";

export const VintageWatch: React.FC = () => {
  const [time, setTime] = useState<Date>(() => new Date());
  const [isHovered, setIsHovered] = useState(false);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize clock timer
  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Audio setup for realistic tick-tick ambient sound
  useEffect(() => {
    const audio = new Audio("/tick-tick.mp3");
    audio.loop = true;
    audio.volume = 0.55;
    audioRef.current = audio;

    const playAudio = async () => {
      try {
        await audio.play();
        setIsPlayingSound(true);
        cleanupListeners();
      } catch {
        // Autoplay policy waiting for user gesture
        setIsPlayingSound(false);
      }
    };

    const handleFirstInteraction = () => {
      playAudio();
    };

    const cleanupListeners = () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };

    // Try playing immediately
    playAudio();

    // Listen for first interaction to unlock browser audio autoplay
    window.addEventListener("click", handleFirstInteraction, { once: true });
    window.addEventListener("touchstart", handleFirstInteraction, { once: true });
    window.addEventListener("keydown", handleFirstInteraction, { once: true });

    return () => {
      cleanupListeners();
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  // Toggle audio on clock click
  const handleWatchClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current
        .play()
        .then(() => setIsPlayingSound(true))
        .catch(() => {});
    } else {
      audioRef.current.pause();
      setIsPlayingSound(false);
    }
  };

  // Compute continuous smooth angles
  const { secondAngle, minuteAngle, hourAngle, timeString, dateString } = useMemo(() => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    const sAngle = (totalSeconds % 60) * 6; // 6 deg per second
    const mAngle = ((totalSeconds % 3600) / 60) * 6;
    const hAngle = ((totalSeconds % 43200) / 3600) * 30;

    const tString = time.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    const dString = time.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    return {
      secondAngle: sAngle,
      minuteAngle: mAngle,
      hourAngle: hAngle,
      timeString: tString,
      dateString: dString,
    };
  }, [time]);

  // Roman numerals for 12 hours
  const romanNumerals = [
    { text: "XII", angle: 0 },
    { text: "I", angle: 30 },
    { text: "II", angle: 60 },
    { text: "III", angle: 90 },
    { text: "IV", angle: 120 },
    { text: "V", angle: 150 },
    { text: "VI", angle: 180 },
    { text: "VII", angle: 210 },
    { text: "VIII", angle: 240 },
    { text: "IX", angle: 270 },
    { text: "X", angle: 300 },
    { text: "XI", angle: 330 },
  ];

  // 60 minute ticks
  const minuteTicks = Array.from({ length: 60 }, (_, i) => {
    const isHour = i % 5 === 0;
    const angle = i * 6;
    return { isHour, angle, index: i };
  });

  return (
    <aside
      className="vintage-watch-container"
      onClick={handleWatchClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={isPlayingSound ? "Click to mute ticking sound" : "Click to play ticking sound"}
      aria-label={`Current time: ${timeString}. Sound is ${isPlayingSound ? "on" : "off"}. Click to toggle sound.`}
    >
      <div className="vintage-watch-wrapper">
        <svg
          viewBox="0 0 200 216"
          className="vintage-watch-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Sleek Bronze/Brass Bezel */}
            <radialGradient id="sleekBezel" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#d8be92" />
              <stop offset="45%" stopColor="#9c754d" />
              <stop offset="80%" stopColor="#604229" />
              <stop offset="100%" stopColor="#3b2617" />
            </radialGradient>

            {/* Antique Parchment Aged Dial Face */}
            <radialGradient id="sleekDial" cx="50%" cy="48%" r="62%">
              <stop offset="0%" stopColor="#fffdf9" />
              <stop offset="65%" stopColor="#f8f1df" />
              <stop offset="90%" stopColor="#ece0c4" />
              <stop offset="100%" stopColor="#ded0b2" />
            </radialGradient>

            {/* Subtle Glass Dome Sheen */}
            <linearGradient id="sleekGlass" x1="0%" y1="0%" x2="70%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
              <stop offset="35%" stopColor="#ffffff" stopOpacity="0.08" />
              <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            {/* Crown gradient */}
            <linearGradient id="sleekCrown" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e2cca3" />
              <stop offset="50%" stopColor="#8c6840" />
              <stop offset="100%" stopColor="#4c321d" />
            </linearGradient>

            {/* Drop Shadow filter */}
            <filter id="sleekShadow" x="-20%" y="-15%" width="145%" height="145%">
              <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#22140a" floodOpacity="0.22" />
            </filter>

            {/* Hand Shadow filter */}
            <filter id="sleekHandShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0.8" dy="1.5" stdDeviation="1.2" floodColor="#26190f" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Sleek Top Crown */}
          <g transform="translate(0, 4)" filter="url(#sleekShadow)">
            <rect
              x="94"
              y="4"
              width="12"
              height="8"
              rx="2"
              fill="url(#sleekCrown)"
              stroke="#382415"
              strokeWidth="0.6"
            />
            <line x1="97" y1="5" x2="97" y2="11" stroke="#382415" strokeWidth="0.6" />
            <line x1="100" y1="5" x2="100" y2="11" stroke="#382415" strokeWidth="0.6" />
            <line x1="103" y1="5" x2="103" y2="11" stroke="#382415" strokeWidth="0.6" />
          </g>

          {/* Main Watch Case */}
          <g transform="translate(0, 16)" filter="url(#sleekShadow)">
            {/* Slim Outer Bezel */}
            <circle cx="100" cy="100" r="92" fill="url(#sleekBezel)" stroke="#382415" strokeWidth="1" />
            {/* Step line */}
            <circle cx="100" cy="100" r="88.5" fill="none" stroke="#e8d5b5" strokeWidth="0.8" opacity="0.6" />
            {/* Dial background */}
            <circle cx="100" cy="100" r="86.5" fill="url(#sleekDial)" stroke="#523924" strokeWidth="0.8" />

            {/* Railroad Track (Delicate Double Ring) */}
            <circle cx="100" cy="100" r="82.5" fill="none" stroke="#523b28" strokeWidth="0.75" opacity="0.7" />
            <circle cx="100" cy="100" r="77" fill="none" stroke="#523b28" strokeWidth="0.5" opacity="0.7" />

            {/* 60 Minute / Second Ticks */}
            {minuteTicks.map(({ isHour, angle, index }) => (
              <line
                key={index}
                x1="100"
                y1={isHour ? "77" : "79"}
                x2="100"
                y2="82.5"
                stroke="#3e2a1a"
                strokeWidth={isHour ? "1.4" : "0.6"}
                transform={`rotate(${angle} 100 100)`}
                opacity={isHour ? 0.9 : 0.55}
              />
            ))}

            {/* 5-minute delicate dot markers */}
            {romanNumerals.map(({ angle }, i) => (
              <circle
                key={i}
                cx="100"
                cy="74.5"
                r="1"
                fill="#8f2d1b"
                transform={`rotate(${angle} 100 100)`}
              />
            ))}

            {/* Roman Numerals */}
            <g className="roman-numerals">
              {romanNumerals.map(({ text, angle }) => {
                const rad = ((angle - 90) * Math.PI) / 180;
                const x = 100 + 60.5 * Math.cos(rad);
                const y = 100 + 60.5 * Math.sin(rad) + 4.2;
                return (
                  <text
                    key={text}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    className="roman-numeral-text"
                  >
                    {text}
                  </text>
                );
              })}
            </g>

            {/* Sleek Vintage Dial Typography */}
            <g className="vintage-brand-text">
              <text x="100" y="66" textAnchor="middle" className="dial-sub-text-title">
                CHRONOMETER
              </text>
              <text x="100" y="136" textAnchor="middle" className="dial-sub-text-small">
                AUTOMATIC
              </text>
            </g>

            {/* Subtle inner accent ring */}
            <circle cx="100" cy="100" r="42" fill="none" stroke="#755639" strokeWidth="0.5" strokeDasharray="1 2.5" opacity="0.3" />

            {/* Hands Layer */}
            {/* Hour Hand (Sleek Tapered Lance Hand) */}
            <g
              className="watch-hand hour-hand"
              style={{ transform: `rotate(${hourAngle}deg)` }}
              filter="url(#sleekHandShadow)"
            >
              <path
                d="M 98.6 100 L 99 64 L 97.8 54 L 100 36 L 102.2 54 L 101 64 L 101.4 100 L 101.8 110 C 101.8 111.5, 98.2 111.5, 98.2 110 Z"
                fill="#1f1610"
              />
            </g>

            {/* Minute Hand (Sleek Slender Leaf Hand) */}
            <g
              className="watch-hand minute-hand"
              style={{ transform: `rotate(${minuteAngle}deg)` }}
              filter="url(#sleekHandShadow)"
            >
              <path
                d="M 99 100 L 99.2 45 L 98.2 36 L 100 22 L 101.8 36 L 100.8 45 L 101 100 L 101.4 114 C 101.4 115.5, 98.6 115.5, 98.6 114 Z"
                fill="#1f1610"
              />
            </g>

            {/* Second Hand (Slim Red Ticking Needle Hand) */}
            <g
              className="watch-hand second-hand"
              style={{ transform: `rotate(${secondAngle}deg)` }}
              filter="url(#sleekHandShadow)"
            >
              {/* Slender needle */}
              <line x1="100" y1="120" x2="100" y2="18" stroke="#a02619" strokeWidth="0.9" strokeLinecap="round" />
              {/* Counterbalance Ring */}
              <circle cx="100" cy="111" r="2.8" fill="#a02619" />
              <circle cx="100" cy="111" r="1.2" fill="url(#sleekDial)" />
            </g>

            {/* Center Pinion Boss */}
            <circle cx="100" cy="100" r="4.2" fill="url(#sleekBezel)" stroke="#382415" strokeWidth="0.6" />
            <circle cx="100" cy="100" r="1.8" fill="#e8d5b5" />
            <circle cx="99.4" cy="99.4" r="0.6" fill="#ffffff" opacity="0.85" />

            {/* Sleek Curved Glass Highlight */}
            <ellipse
              cx="88"
              cy="72"
              rx="56"
              ry="38"
              fill="url(#sleekGlass)"
              transform="rotate(-28 88 72)"
              pointerEvents="none"
            />
          </g>
        </svg>

        {/* Live Vintage Time Tooltip & Sound Status on Hover */}
        <div className={`vintage-time-badge ${isHovered ? "visible" : ""}`}>
          <div className="badge-time">{timeString}</div>
          <div className="badge-date">{dateString}</div>
          <div className="badge-sound-status">
            {isPlayingSound ? "🔊 Tick sound ON" : "🔇 Sound muted (click to play)"}
          </div>
        </div>
      </div>
    </aside>
  );
};
export default VintageWatch;
