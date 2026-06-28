import { useState, useRef, useEffect } from "react";

// ── API BASE (same logic as app.js) ──────────────────────────
const API_BASE = (() => {
  if (
    typeof window !== "undefined" &&
    (window.location.protocol === "file:" ||
      ["5500", "5173"].includes(window.location.port))
  ) {
    return "http://localhost:5000/api";
  }
  return "https://travelbahartt.onrender.com/api";
})();

// ── Category colour map ───────────────────────────────────────
const CAT_COLORS = {
  Heritage:  { bg: "#FFF0E6", text: "#C44D00", dot: "#E85A00" },
  Nature:    { bg: "#E6F5EE", text: "#1A5C3A", dot: "#2D6A4F" },
  Adventure: { bg: "#E6EEFF", text: "#1A3A7A", dot: "#185FA5" },
  Religious: { bg: "#FFF7E0", text: "#7A5500", dot: "#D4A017" },
};

const REGIONS = [
  "All",
  "North India",
  "South India",
  "East India",
  "West India",
  "Central India",
  "Northeast India",
  "Union Territory",
];

// ── Map pin positions keyed by state id ───────────────────────
// Approximate % positions on a 100×100 SVG viewBox (x = left→right, y = top→bottom)
const PIN_POSITIONS = {
  rajasthan:        { x: 22, y: 32 },
  kerala:           { x: 28, y: 82 },
  uttarakhand:      { x: 33, y: 20 },
  meghalaya:        { x: 67, y: 32 },
  goa:              { x: 22, y: 67 },
  himachal_pradesh: { x: 28, y: 14 },
  tamil_nadu:       { x: 34, y: 82 },
  uttar_pradesh:    { x: 40, y: 30 },
  karnataka:        { x: 27, y: 74 },
  west_bengal:      { x: 57, y: 40 },
  gujarat:          { x: 16, y: 48 },
  maharashtra:      { x: 26, y: 58 },
  madhya_pradesh:   { x: 33, y: 43 },
  punjab:           { x: 26, y: 16 },
  andhra_pradesh:   { x: 38, y: 68 },
  telangana:        { x: 36, y: 62 },
  odisha:           { x: 50, y: 55 },
  bihar:            { x: 50, y: 36 },
  assam:            { x: 63, y: 30 },
  jammu_kashmir:    { x: 22, y: 10 },
  ladakh:           { x: 28, y: 8  },
  sikkim:           { x: 60, y: 28 },
  arunachal_pradesh:{ x: 72, y: 26 },
  nagaland:         { x: 71, y: 30 },
  manipur:          { x: 70, y: 34 },
  mizoram:          { x: 68, y: 38 },
  tripura:          { x: 65, y: 40 },
  jharkhand:        { x: 52, y: 44 },
  chhattisgarh:     { x: 40, y: 52 },
  haryana:          { x: 30, y: 22 },
  chandigarh:       { x: 29, y: 18 },
  puducherry:       { x: 37, y: 78 },
  andaman:          { x: 72, y: 72 },
  lakshadweep:      { x: 18, y: 80 },
  delhi:            { x: 33, y: 24 },
};

// ── Transform API state → component shape ────────────────────
function transformState(apiState) {
  const pos = PIN_POSITIONS[apiState.id] || { x: 40, y: 50 };
  return {
    id:       apiState.id,
    name:     apiState.name,
    x:        pos.x,
    y:        pos.y,
    region:   apiState.region,
    category: apiState.category,
    emoji:    apiState.emoji || "📍",
    tagline:  apiState.tagline,
    bestTime: apiState.bestTime,
    places:   (apiState.places || []).length,
    color:    CAT_COLORS[apiState.category]?.dot || "#888",
    destinations: (apiState.places || []).slice(0, 6).map((p) => ({
      name: p.name,
      city: p.city,
      cat:  p.category,
      img:  p.image || "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&q=80",
      best: p.bestTime,
      fee:  p.entryFee || "Check locally",
    })),
  };
}

// ─────────────────────────────────────────────────────────────
export default function MapDiscovery() {
  // ── Data state ──────────────────────────────────────────────
  const [statesData, setStatesData] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [apiError, setApiError]     = useState(null);

  // ── UI state ────────────────────────────────────────────────
  const [selected,      setSelected]      = useState(null);
  const [hovered,       setHovered]       = useState(null);
  const [filterCat,     setFilterCat]     = useState("All");
  const [filterRegion,  setFilterRegion]  = useState("All");
  const [search,        setSearch]        = useState("");
  const [activeDestIdx, setActiveDestIdx] = useState(0);
  const [mapScale,      setMapScale]      = useState(1);

  const panelRef = useRef(null);

  // ── Fetch from API on mount ─────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/states`);
        if (!res.ok) throw new Error(`API returned ${res.status}`);
        const json = await res.json();
        setStatesData((json.data || []).map(transformState));
      } catch (err) {
        setApiError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Derived / filtered list ─────────────────────────────────
  const filtered = statesData.filter((s) => {
    const matchCat    = filterCat   === "All" || s.category === filterCat;
    const matchRegion = filterRegion === "All" || s.region  === filterRegion;
    const matchSearch =
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.destinations.some((d) =>
        d.name.toLowerCase().includes(search.toLowerCase())
      );
    return matchCat && matchRegion && matchSearch;
  });

  const filteredIds = new Set(filtered.map((s) => s.id));

  // ── Helpers ─────────────────────────────────────────────────
  function selectState(state) {
    setSelected(state);
    setActiveDestIdx(0);
    setTimeout(() => panelRef.current?.scrollTo({ top: 0, behavior: "smooth" }), 50);
  }

  const currentDest = selected?.destinations[activeDestIdx];

  // ── Loading screen ──────────────────────────────────────────
  if (loading) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        minHeight: "100vh", background: "#FFFBF5", flexDirection: "column", gap: 16,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{
          width: 48, height: 48, border: "4px solid #EDE0D0",
          borderTopColor: "#FF6B1A", borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }} />
        <div style={{ color: "#7A6050", fontSize: 14 }}>Loading destinations…</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── Error screen ────────────────────────────────────────────
  if (apiError) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        minHeight: "100vh", background: "#FFFBF5", flexDirection: "column", gap: 12,
        fontFamily: "'DM Sans', sans-serif", padding: 24, textAlign: "center",
      }}>
        <div style={{ fontSize: 40 }}>⚠️</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: "#1A1208" }}>
          Could not load destinations
        </div>
        <div style={{ color: "#7A6050", fontSize: 14, maxWidth: 400 }}>
          {apiError}. Make sure the TravelBharat backend is running at{" "}
          <code style={{ background: "#EDE0D0", padding: "2px 6px", borderRadius: 4 }}>{API_BASE}</code>
        </div>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: 8, background: "#FF6B1A", color: "white", border: "none",
            borderRadius: 50, padding: "10px 24px", fontFamily: "inherit",
            fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  // ── Main render ─────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#FFFBF5", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        .state-pin { cursor: pointer; transition: all 0.2s; }
        .pin-circle { transition: all 0.25s cubic-bezier(.34,1.56,.64,1); }
        .dest-thumb { cursor: pointer; border-radius: 10px; overflow: hidden; border: 2px solid transparent; transition: all 0.2s; flex-shrink: 0; }
        .dest-thumb.active { border-color: #FF6B1A; }
        .dest-thumb:hover { transform: translateY(-2px); border-color: #FF6B1A88; }
        .filter-pill { border: 1.5px solid #EDE0D0; background: white; border-radius: 50px; padding: 6px 14px; font-size: 13px; font-weight: 500; cursor: pointer; color: #3D2B1A; transition: all 0.2s; }
        .filter-pill.active { background: #FF6B1A; border-color: #FF6B1A; color: white; }
        .filter-pill:hover:not(.active) { border-color: #FF6B1A; color: #FF6B1A; }
        .state-list-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px; cursor: pointer; border: 1.5px solid transparent; transition: all 0.2s; }
        .state-list-item:hover { background: #FFF0E6; border-color: #FF6B1A44; }
        .state-list-item.active { background: #FF6B1A11; border-color: #FF6B1A; }
        .cat-badge { display: inline-block; padding: 3px 10px; border-radius: 50px; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }
        .close-btn { border: none; background: rgba(255,255,255,0.9); border-radius: 50%; width: 32px; height: 32px; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .close-btn:hover { background: white; transform: scale(1.1); }
        .zoom-btn { border: 1px solid #EDE0D0; background: white; width: 32px; height: 32px; border-radius: 8px; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; color: #3D2B1A; transition: all 0.2s; }
        .zoom-btn:hover { border-color: #FF6B1A; color: #FF6B1A; }
        .map-search { border: 1.5px solid #EDE0D0; border-radius: 50px; padding: 8px 16px 8px 36px; font-size: 13px; font-family: inherit; outline: none; width: 200px; transition: all 0.2s; background: white; color: #2C1A0E; }
        .map-search:focus { border-color: #FF6B1A; width: 240px; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #FF6B1A66; border-radius: 2px; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* ── Top Bar ─────────────────────────────────────────── */}
      <div style={{
        background: "white", borderBottom: "1px solid #EDE0D0",
        padding: "12px 20px", display: "flex", alignItems: "center",
        gap: "16px", flexWrap: "wrap", zIndex: 10,
      }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 900, color: "#FF6B1A", marginRight: 8 }}>
          Travel<span style={{ color: "#1A1208" }}>Bharat</span>
          <span style={{ fontSize: "12px", fontWeight: 400, color: "#7A6050", marginLeft: 8, fontFamily: "DM Sans" }}>
            Map Explorer · {statesData.length} states loaded
          </span>
        </div>

        {/* Search */}
        <div style={{ position: "relative", flex: 1, maxWidth: 260 }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "#7A6050" }}>🔍</span>
          <input
            className="map-search"
            placeholder="Search states or places…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category filters */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["All", "Heritage", "Nature", "Religious", "Adventure"].map((c) => (
            <button key={c} className={`filter-pill${filterCat === c ? " active" : ""}`} onClick={() => setFilterCat(c)}>
              {c}
            </button>
          ))}
        </div>

        {/* Region filter */}
        <select
          value={filterRegion}
          onChange={(e) => setFilterRegion(e.target.value)}
          style={{
            border: "1.5px solid #EDE0D0", borderRadius: 50, padding: "6px 14px",
            fontFamily: "inherit", fontSize: 13, background: "white",
            color: "#3D2B1A", cursor: "pointer", outline: "none",
          }}
        >
          {REGIONS.map((r) => <option key={r}>{r}</option>)}
        </select>

        {/* Back link */}
        <a
          href="index.html"
          style={{ marginLeft: "auto", fontSize: 13, color: "#7A6050", textDecoration: "none", fontWeight: 500, whiteSpace: "nowrap" }}
          onMouseEnter={(e) => (e.target.style.color = "#FF6B1A")}
          onMouseLeave={(e) => (e.target.style.color = "#7A6050")}
        >
          ← Back to Home
        </a>
      </div>

      {/* ── Main layout ─────────────────────────────────────── */}
      <div style={{ display: "flex", flex: 1, height: "calc(100vh - 61px)", overflow: "hidden" }}>

        {/* Left: State List */}
        <div style={{
          width: 220, borderRight: "1px solid #EDE0D0", overflowY: "auto",
          padding: "12px 8px", background: "#FFFBF5", flexShrink: 0,
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#7A6050", textTransform: "uppercase", letterSpacing: 1.5, padding: "4px 12px 10px" }}>
            {filtered.length} of {statesData.length} States
          </div>
          {filtered.map((s) => (
            <div
              key={s.id}
              className={`state-list-item${selected?.id === s.id ? " active" : ""}`}
              onClick={() => selectState(s)}
            >
              <span style={{ fontSize: 20 }}>{s.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1208", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {s.name}
                </div>
                <div style={{ fontSize: 11, color: "#7A6050" }}>{s.places} places</div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: "20px 12px", fontSize: 13, color: "#7A6050", textAlign: "center" }}>
              No states match your filters.
            </div>
          )}
        </div>

        {/* Centre: SVG Map */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden", background: "linear-gradient(145deg, #E8F4F8 0%, #D5EAD0 100%)" }}>

          {/* Zoom controls */}
          <div style={{ position: "absolute", top: 12, right: 12, display: "flex", flexDirection: "column", gap: 4, zIndex: 10 }}>
            <button className="zoom-btn" onClick={() => setMapScale((s) => Math.min(s + 0.2, 2.5))}>+</button>
            <button className="zoom-btn" onClick={() => setMapScale((s) => Math.max(s - 0.2, 0.5))}>−</button>
            <button className="zoom-btn" style={{ fontSize: 11 }} onClick={() => setMapScale(1)}>⟳</button>
          </div>

          {/* Legend */}
          <div style={{
            position: "absolute", bottom: 12, left: 12,
            background: "rgba(255,251,245,0.95)", borderRadius: 10,
            padding: "10px 14px", border: "1px solid #EDE0D0", fontSize: 12,
          }}>
            <div style={{ fontWeight: 600, marginBottom: 8, color: "#3D2B1A", fontSize: 11, letterSpacing: 1, textTransform: "uppercase" }}>Category</div>
            {Object.entries(CAT_COLORS).map(([cat, col]) => (
              <div key={cat} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: col.dot, flexShrink: 0 }} />
                <span style={{ color: "#3D2B1A" }}>{cat}</span>
              </div>
            ))}
            <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #EDE0D0", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#EDE0D0", flexShrink: 0 }} />
              <span style={{ color: "#7A6050" }}>Filtered out</span>
            </div>
          </div>

          {/* SVG */}
          <svg
            viewBox="0 0 100 100"
            style={{ width: "100%", height: "100%", transform: `scale(${mapScale})`, transformOrigin: "center", transition: "transform 0.3s ease" }}
          >
            {/* Decorative India outline blobs */}
            <ellipse cx="38" cy="52" rx="30" ry="42" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.5)" strokeWidth="0.3" />
            <ellipse cx="65" cy="35" rx="12" ry="10" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.3" />
            <ellipse cx="72" cy="72" rx="5" ry="7" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.3" />

            {/* Grid lines */}
            {[20, 40, 60, 80].map((v) => (
              <g key={v}>
                <line x1={v} y1="0" x2={v} y2="100" stroke="rgba(255,255,255,0.15)" strokeWidth="0.2" />
                <line x1="0" y1={v} x2="100" y2={v} stroke="rgba(255,255,255,0.15)" strokeWidth="0.2" />
              </g>
            ))}

            {/* State pins — rendered from live API data */}
            {statesData.map((state) => {
              const isFiltered  = filteredIds.has(state.id);
              const isSelected  = selected?.id === state.id;
              const isHovered   = hovered === state.id;
              const col = CAT_COLORS[state.category] || CAT_COLORS.Heritage;
              const r   = isSelected ? 3.2 : isHovered ? 2.8 : 2.2;

              return (
                <g
                  key={state.id}
                  className="state-pin"
                  onClick={() => isFiltered && selectState(state)}
                  onMouseEnter={() => setHovered(state.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ opacity: isFiltered ? 1 : 0.25 }}
                >
                  {/* Pulse ring for selected state */}
                  {isSelected && (
                    <circle cx={state.x} cy={state.y} r={r + 1.5} fill="none" stroke={col.dot} strokeWidth="0.5" opacity="0.4">
                      <animate attributeName="r"       values={`${r+1};${r+3};${r+1}`}  dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.4;0;0.4"                dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}

                  <circle
                    className="pin-circle"
                    cx={state.x} cy={state.y} r={r}
                    fill={isFiltered ? col.dot : "#C0B5A8"}
                    stroke="white" strokeWidth="0.6"
                  />

                  {/* State name label */}
                  <text
                    x={state.x} y={state.y - r - 0.8}
                    textAnchor="middle"
                    style={{ fontSize: "2px", fontFamily: "DM Sans", fontWeight: 600, fill: "#1A1208", pointerEvents: "none" }}
                  >
                    {state.name.length > 10 ? state.name.split(" ")[0] : state.name}
                  </text>

                  {/* Emoji */}
                  <text
                    x={state.x} y={state.y + 0.8}
                    textAnchor="middle" dominantBaseline="middle"
                    style={{ fontSize: `${r * 0.8}px`, pointerEvents: "none" }}
                  >
                    {state.emoji}
                  </text>
                </g>
              );
            })}

            {/* Hover tooltip */}
            {hovered && !selected && (() => {
              const s = statesData.find((st) => st.id === hovered);
              if (!s || !filteredIds.has(s.id)) return null;
              const tipX = s.x > 70 ? s.x - 22 : s.x + 3;
              const tipY = s.y > 80 ? s.y - 18 : s.y + 3;
              return (
                <g>
                  <rect x={tipX} y={tipY} width={24} height={14} rx="1.5" fill="rgba(26,18,8,0.92)" />
                  <text x={tipX + 12} y={tipY + 5} textAnchor="middle" style={{ fontSize: "2.2px", fill: "white", fontFamily: "DM Sans", fontWeight: 600 }}>
                    {s.name}
                  </text>
                  <text x={tipX + 12} y={tipY + 9} textAnchor="middle" style={{ fontSize: "1.8px", fill: "rgba(255,255,255,0.7)", fontFamily: "DM Sans" }}>
                    {s.places} places · {s.category}
                  </text>
                  <text x={tipX + 12} y={tipY + 12.5} textAnchor="middle" style={{ fontSize: "1.8px", fill: "rgba(255,220,100,0.9)", fontFamily: "DM Sans" }}>
                    Best: {s.bestTime}
                  </text>
                </g>
              );
            })()}
          </svg>

          <div style={{ position: "absolute", bottom: 12, right: 12, fontSize: 10, color: "rgba(0,0,0,0.35)" }}>
            Schematic map · not to scale
          </div>
        </div>

        {/* Right: Detail Panel */}
        <div
          ref={panelRef}
          style={{
            width: selected ? 340 : 0,
            transition: "width 0.35s ease",
            overflow: "hidden",
            borderLeft: selected ? "1px solid #EDE0D0" : "none",
            background: "white",
            overflowY: "auto",
            flexShrink: 0,
          }}
        >
          {selected && (
            <div>
              {/* Hero image */}
              <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
                <img
                  src={currentDest?.img || "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&q=80"}
                  alt={selected.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "all 0.4s ease" }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,10,0,0.9) 0%, transparent 60%)" }} />
                <button className="close-btn" onClick={() => setSelected(null)} style={{ position: "absolute", top: 10, right: 10 }}>✕</button>
                <div style={{ position: "absolute", bottom: 14, left: 14 }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 900, color: "white", lineHeight: 1.1 }}>
                    {selected.emoji} {selected.name}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 4 }}>{selected.tagline}</div>
                </div>
              </div>

              {/* Quick info row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, background: "#EDE0D0" }}>
                {[
                  { icon: "📅", label: "Best Time", val: selected.bestTime },
                  { icon: "🗺️", label: "Region",    val: selected.region.replace(" India", "").replace("Union Territory", "UT") },
                  { icon: "📍", label: "Places",    val: `${selected.places}+` },
                ].map((item) => (
                  <div key={item.label} style={{ background: "#FFFBF5", padding: "10px 8px", textAlign: "center" }}>
                    <div style={{ fontSize: 16 }}>{item.icon}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#1A1208", marginTop: 2 }}>{item.val}</div>
                    <div style={{ fontSize: 10, color: "#7A6050", marginTop: 1 }}>{item.label}</div>
                  </div>
                ))}
              </div>

              {/* Destinations */}
              <div style={{ padding: "16px" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#7A6050", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>
                  Top Attractions
                </div>

                {/* Thumbnail strip */}
                <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 10, marginBottom: 14 }}>
                  {selected.destinations.map((d, i) => (
                    <div
                      key={i}
                      className={`dest-thumb${activeDestIdx === i ? " active" : ""}`}
                      onClick={() => setActiveDestIdx(i)}
                      style={{ width: 72, height: 52 }}
                    >
                      <img src={d.img} alt={d.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  ))}
                </div>

                {/* Active destination card */}
                {currentDest && (
                  <div style={{ background: "#FFFBF5", borderRadius: 12, border: "1.5px solid #EDE0D0", padding: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1rem", color: "#1A1208" }}>
                          {currentDest.name}
                        </div>
                        <div style={{ fontSize: 12, color: "#7A6050", marginTop: 2 }}>📍 {currentDest.city}</div>
                      </div>
                      <span
                        className="cat-badge"
                        style={{ background: CAT_COLORS[currentDest.cat]?.bg, color: CAT_COLORS[currentDest.cat]?.text }}
                      >
                        {currentDest.cat}
                      </span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
                      <div style={{ background: "white", borderRadius: 8, padding: "8px 10px", border: "1px solid #EDE0D0" }}>
                        <div style={{ fontSize: 10, color: "#7A6050", marginBottom: 2 }}>BEST TIME</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#1A1208" }}>{currentDest.best}</div>
                      </div>
                      <div style={{ background: "white", borderRadius: 8, padding: "8px 10px", border: "1px solid #EDE0D0" }}>
                        <div style={{ fontSize: 10, color: "#7A6050", marginBottom: 2 }}>ENTRY FEE</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#1A1208" }}>{currentDest.fee}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Dot navigation */}
                <div style={{ display: "flex", gap: 8, marginTop: 10, justifyContent: "center" }}>
                  {selected.destinations.map((_, i) => (
                    <div
                      key={i}
                      onClick={() => setActiveDestIdx(i)}
                      style={{
                        width: 6, height: 6, borderRadius: "50%",
                        background: activeDestIdx === i ? "#FF6B1A" : "#EDE0D0",
                        cursor: "pointer", transition: "all 0.2s",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div style={{ padding: "0 16px 20px" }}>
                <a
                  href={`state.html?state=${selected.id}`}
                  style={{
                    display: "block", background: "#FF6B1A", color: "white",
                    borderRadius: 50, padding: "12px 20px", textAlign: "center",
                    fontWeight: 600, fontSize: 14, textDecoration: "none",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#E85A00")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#FF6B1A")}
                >
                  Explore {selected.name} in Full →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom stats bar */}
      <div style={{
        background: "#1A1208", color: "rgba(255,255,255,0.6)",
        padding: "8px 20px", display: "flex", gap: "2rem",
        fontSize: 12, alignItems: "center", flexWrap: "wrap",
      }}>
        <span style={{ color: "#D4A017", fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>TravelBharat</span>
        {["Heritage", "Nature", "Adventure", "Religious"].map((cat) => (
          <span key={cat}>
            {CAT_COLORS[cat] && (
              <span style={{ color: CAT_COLORS[cat].dot }}>■ </span>
            )}
            {statesData.filter((s) => s.category === cat).length} {cat}
          </span>
        ))}
        <span style={{ marginLeft: "auto" }}>Click any pin to explore · {statesData.length} states</span>
      </div>
    </div>
  );
}