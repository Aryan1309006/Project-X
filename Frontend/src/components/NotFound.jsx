import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faHome, faPlugCircleXmark } from "@fortawesome/free-solid-svg-icons";

function NotFound() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center
                    bg-slate-950 text-white px-6 relative overflow-hidden
                    [background-image:linear-gradient(to_right,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)]
                    [background-size:72px_72px]">

      {/* ── Glows ── */}
      <div className="absolute inset-0
                      bg-[radial-gradient(circle_at_50%_40%,rgba(16,185,129,0.12),transparent_60%)]
                      pointer-events-none" />
      <div className="absolute top-10 left-10 w-72 h-72
                      bg-emerald-500/5 rounded-full blur-3xl
                      animate-[pulse_6s_ease-in-out_infinite]
                      pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80
                      bg-teal-500/5 rounded-full blur-3xl
                      animate-[pulse_8s_ease-in-out_infinite]
                      pointer-events-none" />

      {/* ── Spark particles ── */}
      {[...Array(5)].map((_, i) => (
        <div key={i}
          className="absolute w-0.5 h-0.5 rounded-full bg-emerald-400
                     animate-[ping_3s_ease-in-out_infinite] pointer-events-none"
          style={{
            top:              `${20 + i * 14}%`,
            left:             `${10 + i * 18}%`,
            animationDelay:   `${i * 0.5}s`,
            animationDuration:`${2 + i * 0.4}s`,
            opacity: 0.5,
          }} />
      ))}

      {/* ── Electric arc SVG ── */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10"
        xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="35%" x2="100%" y2="15%"
          stroke="url(#arcG)" strokeWidth="1" />
        <line x1="0" y1="75%" x2="100%" y2="55%"
          stroke="url(#arcG)" strokeWidth="0.5" />
        <defs>
          <linearGradient id="arcG" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#10b981" stopOpacity="0" />
            <stop offset="50%"  stopColor="#10b981" stopOpacity="1" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* ── Content ── */}
      <div className="relative flex flex-col items-center text-center max-w-md">

        {/* Bolt icon */}
        <div className={`relative mb-8
                         transition-all duration-700 ease-out
                         ${visible
                           ? "opacity-100 translate-y-0 scale-100"
                           : "opacity-0 translate-y-6 scale-75"
                         }`}>
          {/* Outer ping */}
          <div className="absolute inset-0 rounded-full
                          bg-emerald-400/20 animate-ping opacity-30" />
          {/* Glow */}
          <div className="absolute inset-0 rounded-full
                          bg-emerald-400/10 blur-xl" />
          {/* Icon box */}
          <div className="relative w-24 h-24 rounded-full
                          bg-gradient-to-br from-slate-800 to-slate-900
                          border border-white/10
                          flex items-center justify-center
                          shadow-2xl shadow-emerald-900/40">
            <FontAwesomeIcon icon={faPlugCircleXmark}
              className="text-4xl text-emerald-400" />
          </div>
        </div>

        {/* 404 */}
        <h1 className={`font-extrabold tracking-tight leading-none mb-2
                         transition-all duration-700 ease-out delay-100
                         ${visible
                           ? "opacity-100 translate-y-0 blur-none"
                           : "opacity-0 translate-y-4 blur-sm"
                         }`}>
          <span className="text-8xl bg-gradient-to-r from-emerald-300
                           via-teal-300 to-emerald-400
                           bg-clip-text text-transparent
                           drop-shadow-[0_0_40px_rgba(16,185,129,0.4)]">
            404
          </span>
        </h1>

        {/* Electric underline */}
        <div className={`h-px w-32 mx-auto mb-5
                         bg-gradient-to-r from-transparent
                         via-emerald-400 to-transparent
                         transition-all duration-1000 ease-out delay-300
                         ${visible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}`} />

        {/* Page not found */}
        <h2 className={`text-xl font-bold text-white mb-3
                         transition-all duration-600 ease-out delay-200
                         ${visible
                           ? "opacity-100 translate-y-0"
                           : "opacity-0 translate-y-3"
                         }`}>
          Station Disconnected
        </h2>

        <p className={`text-gray-400 text-sm leading-relaxed mb-8
                        transition-all duration-600 ease-out delay-300
                        ${visible
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-3"
                        }`}>
          Oops! This charging point is offline. The page you're looking
          for doesn't exist or has been unplugged.
        </p>

        {/* Buttons */}
        <div className={`flex items-center gap-3
                         transition-all duration-600 ease-out delay-[400ms]
                         ${visible
                           ? "opacity-100 translate-y-0"
                           : "opacity-0 translate-y-3"
                         }`}>

          <button onClick={() => navigate("/")}
            className="flex items-center gap-2
                       bg-gradient-to-r from-emerald-500 to-teal-500
                       text-white px-6 py-3 rounded-xl
                       text-sm font-semibold
                       shadow-lg shadow-emerald-900/30
                       hover:shadow-xl hover:shadow-emerald-900/40
                       hover:scale-105 hover:brightness-110
                       active:scale-95
                       transition-all duration-200">
            <FontAwesomeIcon icon={faHome} className="text-xs" />
            Go to Home
          </button>

          <button onClick={() => navigate(-1)}
            className="flex items-center gap-2
                       bg-white/5 border border-white/10
                       text-gray-300 px-6 py-3 rounded-xl
                       text-sm font-semibold
                       hover:bg-white/10 hover:border-white/20
                       hover:text-white hover:scale-105
                       active:scale-95
                       transition-all duration-200">
            <FontAwesomeIcon icon={faBolt} className="text-emerald-400 text-xs" />
            Go Back
          </button>

        </div>

        {/* Bottom tag */}
        <p className={`mt-10 text-gray-600 text-xs flex items-center gap-1.5
                        transition-all duration-600 ease-out delay-500
                        ${visible ? "opacity-100" : "opacity-0"}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
          EV Bharat · Charging India
        </p>

      </div>
    </div>
  );
}

export default NotFound;
