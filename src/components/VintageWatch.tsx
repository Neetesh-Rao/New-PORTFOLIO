import React, { useEffect, useState, useMemo } from "react";

export const VintageWatch: React.FC = () => {
  const [time, setTime] = useState<Date>(() => new Date());
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Initial sync
    setTime(new Date());

    // Update every second in lockstep with system clock
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Compute smooth continuous angles to prevent backward jumps
  const { secondAngle, minuteAngle, hourAngle, timeString, dateString } = useMemo(() => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    const sAngle = (totalSeconds % 60) * 6; // 360 / 60 = 6 deg
    const mAngle = ((totalSeconds % 3600) / 60) * 6; // smooth with seconds
    const hAngle = ((totalSeconds % 43200) / 3600) * 30; // 360 / 12 = 30 deg

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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`Current time: ${timeString}`}
    >
      <div className="vintage-watch-wrapper">
        <svg
          viewBox="0 0 200 230"
          className="vintage-watch-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Outer Bronze/Brass Bezel Gradient */}
            <radialGradient id="bezelGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#d5b57f" />
              <stop offset="35%" stopColor="#966d43" />
              <stop offset="70%" stopColor="#5a3d24" />
              <stop offset="100%" stopColor="#301e12" />
            </radialGradient>

            {/* Inner Brass Rim */}
            <linearGradient id="innerRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e8cf9f" />
              <stop offset="50%" stopColor="#8d673b" />
              <stop offset="100%" stopColor="#4e331c" />
            </linearGradient>

            {/* Antique Parchment Aged Dial Face */}
            <radialGradient id="agedDialGrad" cx="50%" cy="48%" r="58%">
              <stop offset="0%" stopColor="#fffef9" />
              <stop offset="65%" stopColor="#faf2de" />
              <stop offset="85%" stopColor="#ede0c2" />
              <stop offset="100%" stopColor="#dcc7a0" />
            </radialGradient>

            {/* Subtle Glass Dome Sheen */}
            <linearGradient id="glassReflection" x1="0%" y1="0%" x2="70%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
              <stop offset="35%" stopColor="#ffffff" stopOpacity="0.1" />
              <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            {/* Pocket watch loop crown gradient */}
            <linearGradient id="crownGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ecd3a6" />
              <stop offset="50%" stopColor="#8f6b40" />
              <stop offset="100%" stopColor="#432a18" />
            </linearGradient>

            {/* Drop Shadow filter */}
            <filter id="watchShadow" x="-20%" y="-15%" width="145%" height="145%">
              <feDropShadow dx="0" dy="7" stdDeviation="6" floodColor="#1e1108" floodOpacity="0.32" />
            </filter>

            {/* Hand Shadow filter */}
            <filter id="handShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#2c1e14" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Pocket Watch Top Ring / Bow & Winder */}
          <g className="pocket-watch-top" filter="url(#watchShadow)">
            {/* Top Loop / Bow */}
            <path
              d="M 82 25 C 82 10, 118 10, 118 25"
              fill="none"
              stroke="url(#crownGrad)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Crown / Winder Knob */}
            <rect
              x="92"
              y="20"
              width="16"
              height="12"
              rx="2.5"
              fill="url(#crownGrad)"
              stroke="#2e1d11"
              strokeWidth="0.8"
            />
            {/* Winder ribs */}
            <line x1="95" y1="21" x2="95" y2="31" stroke="#2e1d11" strokeWidth="0.8" />
            <line x1="98" y1="21" x2="98" y2="31" stroke="#2e1d11" strokeWidth="0.8" />
            <line x1="102" y1="21" x2="102" y2="31" stroke="#2e1d11" strokeWidth="0.8" />
            <line x1="105" y1="21" x2="105" y2="31" stroke="#2e1d11" strokeWidth="0.8" />
          </g>

          {/* Main Watch Case */}
          <g transform="translate(0, 30)" filter="url(#watchShadow)">
            {/* Outer Stepped Bezel */}
            <circle cx="100" cy="100" r="92" fill="url(#bezelGrad)" stroke="#2b1a0e" strokeWidth="1.5" />
            <circle cx="100" cy="100" r="86" fill="none" stroke="url(#innerRimGrad)" strokeWidth="2.5" />
            <circle cx="100" cy="100" r="83" fill="#2b1a0e" />

            {/* Dial Background Face */}
            <circle cx="100" cy="100" r="81" fill="url(#agedDialGrad)" stroke="#694d33" strokeWidth="0.8" />

            {/* Railroad Track (Double Ring for Minutes) */}
            <circle cx="100" cy="100" r="77.5" fill="none" stroke="#4a3728" strokeWidth="1" opacity="0.8" />
            <circle cx="100" cy="100" r="71" fill="none" stroke="#4a3728" strokeWidth="0.7" opacity="0.8" />

            {/* 60 Minute / Second Ticks */}
            {minuteTicks.map(({ isHour, angle, index }) => (
              <line
                key={index}
                x1="100"
                y1={isHour ? "71" : "73.5"}
                x2="100"
                y2="77.5"
                stroke="#382618"
                strokeWidth={isHour ? "1.8" : "0.75"}
                transform={`rotate(${angle} 100 100)`}
                opacity={isHour ? 0.95 : 0.65}
              />
            ))}

            {/* 5-minute diamond / dot markers */}
            {romanNumerals.map(({ angle }, i) => (
              <circle
                key={i}
                cx="100"
                cy="69"
                r="1.4"
                fill="#822e1b"
                transform={`rotate(${angle} 100 100)`}
              />
            ))}

            {/* Roman Numerals */}
            <g className="roman-numerals">
              {romanNumerals.map(({ text, angle }) => {
                // Calculate position on radius ~ 55
                const rad = ((angle - 90) * Math.PI) / 180;
                const x = 100 + 55 * Math.cos(rad);
                const y = 100 + 55 * Math.sin(rad) + 4.5; // slight font vertical baseline centering
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

            {/* Vintage Dial Embellishment / Brand Text */}
            <g className="vintage-brand-text">
              <text x="100" y="68" textAnchor="middle" className="dial-sub-text-title">
                CHRONOMÈTRE
              </text>
              <line x1="82" y1="71" x2="118" y2="71" stroke="#684a32" strokeWidth="0.5" opacity="0.6" />
              <text x="100" y="132" textAnchor="middle" className="dial-sub-text-small">
                AUTOMATIC
              </text>
              <text x="100" y="140" textAnchor="middle" className="dial-sub-text-tiny">
                EST. 2026
              </text>
            </g>

            {/* Inner Decorative Golden Ring */}
            <circle cx="100" cy="100" r="38" fill="none" stroke="#6c4e33" strokeWidth="0.6" strokeDasharray="1.5 2.5" opacity="0.4" />

            {/* Hands Layer with Shadows */}
            {/* Hour Hand (Ornate Antique Spade Hand) */}
            <g
              className="watch-hand hour-hand"
              style={{ transform: `rotate(${hourAngle}deg)` }}
              filter="url(#handShadow)"
            >
              <path
                d="M 98 100 L 98 70 C 94 67, 93 61, 97 54 C 99 50, 100 44, 100 42 C 100 44, 101 50, 103 54 C 107 61, 106 67, 102 70 L 102 100 L 102.5 112 C 102.5 114, 97.5 114, 97.5 112 Z"
                fill="#20150d"
              />
              {/* Spade Cutout */}
              <circle cx="100" cy="58" r="2.2" fill="url(#agedDialGrad)" />
            </g>

            {/* Minute Hand (Breguet / Tapered Spear Hand) */}
            <g
              className="watch-hand minute-hand"
              style={{ transform: `rotate(${minuteAngle}deg)` }}
              filter="url(#handShadow)"
            >
              <path
                d="M 98.6 100 L 98.8 45 C 95 41, 96 33, 100 27 C 104 33, 105 41, 101.2 45 L 101.4 100 L 101.8 116 C 101.8 118, 98.2 118, 98.2 116 Z"
                fill="#20150d"
              />
              {/* Moon Eye Cutout */}
              <circle cx="100" cy="37" r="2.2" fill="url(#agedDialGrad)" />
            </g>

            {/* Second Hand (Vintage Red Ticking Needle Hand with Counterbalance) */}
            <g
              className="watch-hand second-hand"
              style={{ transform: `rotate(${secondAngle}deg)` }}
              filter="url(#handShadow)"
            >
              {/* Needle pointer */}
              <line x1="100" y1="122" x2="100" y2="24" stroke="#a72a1d" strokeWidth="1.1" strokeLinecap="round" />
              {/* Tapered end */}
              <polygon points="98.8,32 101.2,32 100,20" fill="#a72a1d" />
              {/* Counterbalance Ring */}
              <circle cx="100" cy="112" r="3.2" fill="#a72a1d" />
              <circle cx="100" cy="112" r="1.4" fill="url(#agedDialGrad)" />
            </g>

            {/* Center Pinion / Brass Nut */}
            <circle cx="100" cy="100" r="5.5" fill="url(#bezelGrad)" stroke="#2b1a0e" strokeWidth="0.8" />
            <circle cx="100" cy="100" r="2.5" fill="#e8cf9f" />
            <circle cx="99" cy="99" r="0.8" fill="#ffffff" opacity="0.75" />

            {/* Glass Curved Glare Overlay */}
            <ellipse
              cx="92"
              cy="76"
              rx="62"
              ry="42"
              fill="url(#glassReflection)"
              transform="rotate(-25 92 76)"
              pointerEvents="none"
            />
          </g>
        </svg>

        {/* Live Vintage Time Tooltip on Hover */}
        <div className={`vintage-time-badge ${isHovered ? "visible" : ""}`}>
          <div className="badge-time">{timeString}</div>
          <div className="badge-date">{dateString}</div>
        </div>
      </div>
    </aside>
  );
};
export default VintageWatch;
