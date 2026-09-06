"use client";
import React, { useState, useEffect, useRef } from "react";
import { ChannelPartner, locatePartners } from "../lib/api";

declare global {
  interface Window {
    L: any;
  }
}

const STATES = [
  "Telangana", "Andhra Pradesh", "Maharashtra", "Tamil Nadu",
  "Karnataka", "Delhi", "Uttar Pradesh", "West Bengal"
];

const CATEGORIES = ["All", "SCA", "PSB", "RRB", "NBFC-MFI"];
const RADIUS_OPTIONS = [15, 25, 50, 100];

export const PartnerLocator: React.FC = () => {
  const [partners, setPartners] = useState<ChannelPartner[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<ChannelPartner | null>(null);
  const [loading, setLoading] = useState(false);
  const [stateFilter, setStateFilter] = useState("Telangana");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [activeOnly, setActiveOnly] = useState(true);
  const [radiusKm, setRadiusKm] = useState(50);

  // Real-time Geolocation State
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);

  // Real-time Geolocation Detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }

    setGeoLoading(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords({ lat: latitude, lng: longitude });
        setGeoLoading(false);

        try {
          setLoading(true);
          const data = await locatePartners({
            user_lat: latitude,
            user_lng: longitude,
            max_distance_km: radiusKm,
            category: categoryFilter === "All" ? undefined : categoryFilter,
            active_only: activeOnly,
          });
          setPartners(data);
        } catch (err) {
          console.warn("Locate API fallback", err);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setGeoLoading(false);
        let msg = "GPS unavailable. Select state manually.";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "Location permission denied. Select state manually.";
        }
        setGeoError(msg);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Load partners by state or GPS
  useEffect(() => {
    let isMounted = true;
    async function loadPartners() {
      setLoading(true);
      try {
        if (userCoords) {
          const data = await locatePartners({
            user_lat: userCoords.lat,
            user_lng: userCoords.lng,
            max_distance_km: radiusKm,
            category: categoryFilter === "All" ? undefined : categoryFilter,
            active_only: activeOnly,
          });
          if (isMounted) setPartners(data);
        } else {
          const data = await locatePartners({
            state: stateFilter,
            category: categoryFilter === "All" ? undefined : categoryFilter,
            active_only: activeOnly,
          });
          if (isMounted) setPartners(data);
        }
      } catch (e) {
        console.warn("Backend partners unavailable", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadPartners();
    return () => { isMounted = false; };
  }, [stateFilter, categoryFilter, activeOnly, userCoords, radiusKm]);

  // Leaflet Map Init
  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;

    const initMap = () => {
      const L = window.L;
      if (!L || leafletMapRef.current) return;

      const centerLat = userCoords ? userCoords.lat : 17.3850;
      const centerLng = userCoords ? userCoords.lng : 78.4867;

      const map = L.map(mapRef.current, {
        zoomControl: true,
        scrollWheelZoom: false,
      }).setView([centerLat, centerLng], 12);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      leafletMapRef.current = map;
    };

    if (window.L) {
      initMap();
    } else {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = initMap;
      document.head.appendChild(script);
    }

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Update Markers
  useEffect(() => {
    const L = window.L;
    if (!L || !leafletMapRef.current) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // User GPS Marker
    if (userCoords) {
      if (userMarkerRef.current) userMarkerRef.current.remove();

      const userIcon = L.divIcon({
        className: "gps-user-pin",
        html: `
          <div style="
            position:relative; width:20px; height:20px;
            background:var(--pin-user); border:3px solid var(--text-contrast);
            border-radius:50%; box-shadow:0 0 12px var(--brand-cyan-glow);
          ">
            <div style="
              position:absolute; top:-5px; left:-5px; width:24px; height:24px;
              border-radius:50%; border:2px solid var(--pin-user); opacity:0.6;
              animation:radarPulse 1.8s infinite;
            "></div>
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      userMarkerRef.current = L.marker([userCoords.lat, userCoords.lng], { icon: userIcon })
        .addTo(leafletMapRef.current)
        .bindPopup(`
          <div style="font-family:inherit;font-size:0.8rem;font-weight:700;color:var(--brand-accent);">
            Current Location<br/>
            <span style="font-size:0.72rem;font-weight:400;color:var(--text-muted);">${userCoords.lat.toFixed(4)}°N, ${userCoords.lng.toFixed(4)}°E</span>
          </div>
        `);
    }

    // Partner Markers
    partners.forEach((p) => {
      const isSuspended = p.status === "suspended";
      const color = isSuspended ? "var(--status-danger)" : p.category === "SCA" ? "var(--pin-sca)" : p.category === "PSB" ? "var(--pin-psb)" : p.category === "RRB" ? "var(--pin-rrb)" : "var(--pin-mfi)";

      const icon = L.divIcon({
        className: `partner-pin-${p.id}`,
        html: `
          <div style="
            background:${color}; width:30px; height:30px; border-radius:50%;
            border:2px solid var(--text-contrast); box-shadow:var(--shadow-subtle);
            display:flex; align-items:center; justify-content:center;
            font-size:10px; color:var(--text-contrast); font-weight:800;
          ">
            ${p.category === "SCA" ? "SCA" : p.category === "PSB" ? "PSB" : p.category === "RRB" ? "RRB" : "MFI"}
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      const distSnippet = p.distance_km !== undefined && p.distance_km !== null
        ? `<div style="font-size:0.75rem;font-weight:700;color:var(--brand-accent);margin:2px 0;">${p.distance_km.toFixed(1)} km away</div>`
        : "";

      const marker = L.marker([p.latitude, p.longitude], { icon })
        .addTo(leafletMapRef.current)
        .bindPopup(`
          <div style="font-family:inherit;min-width:200px;padding:2px;">
            <strong style="font-size:0.88rem;color:var(--text-primary);">${p.name}</strong>
            <div style="font-size:0.72rem;color:var(--text-muted);margin:2px 0;">${p.category} | ${p.city}, ${p.state}</div>
            ${distSnippet}
            <div style="font-size:0.72rem;color:${isSuspended ? 'var(--status-danger)' : 'var(--status-active)'};font-weight:700;margin:2px 0;">
              ${p.status === 'active' ? 'Active' : 'Suspended (High NPA)'}
            </div>
            <div style="font-size:0.72rem;color:var(--text-secondary);">NPA: <strong>${p.npa_rate}%</strong> | Fund Util.: <strong>${p.fund_utilization_rate}%</strong></div>
            <div style="font-size:0.72rem;color:var(--text-muted);margin-top:2px;">${p.phone}</div>
          </div>
        `)
        .on("click", () => setSelectedPartner(p));

      markersRef.current.push(marker);
    });

    if (partners.length > 0) {
      const pts = partners.map((p) => [p.latitude, p.longitude]);
      if (userCoords) pts.push([userCoords.lat, userCoords.lng]);
      const bounds = L.latLngBounds(pts);
      leafletMapRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [partners, userCoords]);

  return (
    <div>
      {/* Section Header */}
      <div className="section-header" style={{ justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--text-primary)" }}>
            Channel Partner Locator
          </h2>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
            State Channelizing Agencies (SCAs), Public Sector Banks, and Regional Rural Banks with NPA health filtering
          </div>
        </div>

        <button
          onClick={handleDetectLocation}
          disabled={geoLoading}
          className="btn-apex"
          style={{
            padding: "0.6rem 1.2rem",
            fontSize: "0.82rem",
            background: userCoords ? "var(--status-active-gradient)" : undefined,
          }}
        >
          {geoLoading ? "Acquiring GPS..." : userCoords ? "GPS Active" : "Detect Location"}
        </button>
      </div>

      {/* GPS Coordinates Bar */}
      {userCoords && (
        <div style={{
          background: "var(--status-active-bg)",
          border: "1px solid var(--status-active-border)",
          padding: "0.7rem 1.1rem",
          borderRadius: "var(--radius-md)",
          marginBottom: "1rem",
          fontSize: "0.8rem",
          color: "var(--status-active)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.75rem"
        }}>
          <div>
            Coordinates: {userCoords.lat.toFixed(4)}°N, {userCoords.lng.toFixed(4)}°E • Sorted by proximity
          </div>
          <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: "700" }}>Radius:</span>
            {RADIUS_OPTIONS.map((r) => (
              <button
                key={r}
                onClick={() => setRadiusKm(r)}
                style={{
                  background: radiusKm === r ? "var(--status-active)" : "var(--bg-surface)",
                  color: radiusKm === r ? "var(--text-contrast)" : "var(--status-active)",
                  border: "1px solid var(--status-active)",
                  padding: "0.2rem 0.55rem",
                  borderRadius: "5px",
                  fontSize: "0.72rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  fontFamily: "inherit"
                }}
              >
                {r} km
              </button>
            ))}
          </div>
        </div>
      )}

      {geoError && (
        <div style={{
          background: "var(--status-warning-bg)",
          border: "1px solid var(--status-warning-border)",
          padding: "0.6rem 1rem",
          borderRadius: "var(--radius-md)",
          marginBottom: "1rem",
          fontSize: "0.8rem",
          color: "var(--status-warning)"
        }}>
          {geoError}
        </div>
      )}

      {/* Filter Bar */}
      <div className="glass-panel" style={{
        padding: "0.9rem 1.25rem",
        marginBottom: "1.25rem",
        display: "flex",
        gap: "1rem",
        alignItems: "center",
        flexWrap: "wrap"
      }}>
        {!userCoords && (
          <div>
            <label className="field-label">State</label>
            <select
              className="input-box"
              style={{ width: "170px" }}
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
            >
              {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        )}

        <div>
          <label className="field-label">Category</label>
          <select
            className="input-box"
            style={{ width: "140px" }}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>
            ))}
          </select>
        </div>

        <div style={{ paddingTop: "1.1rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", fontWeight: "600", color: "var(--text-secondary)", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={activeOnly}
              onChange={(e) => setActiveOnly(e.target.checked)}
            />
            Exclude High NPA Branches
          </label>
        </div>

        <div style={{ paddingTop: "1.1rem", marginLeft: "auto", display: "flex", gap: "0.5rem" }}>
          <span className="chip chip-emerald">
            {partners.filter((p) => p.status === "active").length} Active
          </span>
          {!activeOnly && (
            <span className="chip chip-rose">
              {partners.filter((p) => p.status === "suspended").length} Suspended
            </span>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: "1.25rem" }}>
        {/* Map */}
        <div className="glass-panel" style={{ height: "540px", overflow: "hidden", padding: 0, position: "relative" }}>
          <div ref={mapRef} style={{ width: "100%", height: "100%", borderRadius: "var(--radius-lg)" }} />
          {loading && (
            <div style={{
              position: "absolute", top: 12, right: 12,
              background: "var(--bg-card-solid)", padding: "0.4rem 0.85rem",
              borderRadius: "6px", fontSize: "0.75rem", fontWeight: "700",
              border: "1px solid var(--border-subtle)",
              color: "var(--brand-accent)"
            }}>
              Updating...
            </div>
          )}
        </div>

        {/* Directory List */}
        <div style={{ maxHeight: "540px", overflowY: "auto", paddingRight: "0.3rem" }}>
          {partners.length === 0 ? (
            <div className="glass-panel" style={{ padding: "2.5rem 1.5rem", textAlign: "center", color: "var(--text-muted)" }}>
              <div style={{ fontSize: "0.92rem", fontWeight: "700", color: "var(--text-primary)" }}>
                No Partners Found
              </div>
              <div style={{ fontSize: "0.78rem", marginTop: "0.3rem" }}>
                Try widening your search radius.
              </div>
            </div>
          ) : (
            partners.map((p, i) => (
              <div
                key={p.id}
                className="glass-panel scheme-card-motion"
                style={{
                  padding: "1rem 1.2rem",
                  marginBottom: "0.8rem",
                  animationDelay: `${i * 40}ms`,
                  cursor: "pointer",
                  borderLeft: `4px solid ${p.status === "active" ? "var(--accent-emerald)" : "var(--accent-rose)"}`,
                  background: selectedPartner?.id === p.id ? "var(--bg-card-hover)" : undefined,
                }}
                onClick={() => {
                  setSelectedPartner(p);
                  if (leafletMapRef.current) {
                    leafletMapRef.current.setView([p.latitude, p.longitude], 14, { animate: true });
                  }
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexWrap: "wrap" }}>
                      <span className="chip chip-purple" style={{ fontSize: "0.68rem" }}>
                        {p.category}
                      </span>
                      {p.distance_km !== undefined && p.distance_km !== null && (
                        <span className="chip chip-cyan" style={{ fontSize: "0.68rem" }}>
                          {p.distance_km.toFixed(1)} km away
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: "0.94rem", fontWeight: "800", color: "var(--text-primary)", marginTop: "0.25rem" }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                      {p.address}
                    </div>
                  </div>

                  <span className={`chip ${p.status === "active" ? "chip-emerald" : "chip-rose"}`}>
                    {p.status === "active" ? "Active" : "Suspended"}
                  </span>
                </div>

                {/* Metrics */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "0.4rem",
                  marginTop: "0.75rem",
                  padding: "0.5rem",
                  background: "var(--bg-surface)",
                  borderRadius: "8px",
                  border: "1px solid var(--border-subtle)"
                }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "0.92rem", fontWeight: "900", color: p.npa_rate < 5 ? "var(--accent-emerald)" : "var(--accent-rose)" }}>
                      {p.npa_rate}%
                    </div>
                    <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: "700" }}>NPA</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "0.92rem", fontWeight: "900", color: "var(--brand-accent)" }}>
                      {p.fund_utilization_rate}%
                    </div>
                    <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: "700" }}>Util.</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "0.92rem", fontWeight: "900", color: "var(--accent-purple)" }}>
                      {p.avg_disbursement_days}d
                    </div>
                    <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: "700" }}>TAT</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "0.92rem", fontWeight: "900", color: "var(--status-warning)" }}>
                      {p.category}
                    </div>
                    <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: "700" }}>Type</div>
                  </div>
                </div>

                {/* Message */}
                <div style={{
                  fontSize: "0.75rem",
                  color: p.status === "active" ? "var(--accent-emerald)" : "var(--accent-rose)",
                  marginTop: "0.45rem",
                  lineHeight: "1.4"
                }}>
                  {p.status_message.replace(/[🟢🔴]/g, "").trim()}
                </div>

                {/* Contact */}
                <div style={{
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  marginTop: "0.4rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <span>Contact: {p.contact_person}</span>
                  <a
                    href={`tel:${p.phone}`}
                    style={{ color: "var(--brand-accent)", fontWeight: "700", textDecoration: "none" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {p.phone}
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
