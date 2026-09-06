"use client";
import React, { useState, useEffect, useRef } from "react";
import { locatePartners, ChannelPartner } from "../lib/api";

const STATES = [
  "All",
  "Telangana",
  "Andhra Pradesh",
  "Maharashtra",
  "Karnataka",
  "Tamil Nadu",
  "Uttar Pradesh",
  "Delhi",
  "Madhya Pradesh",
  "Rajasthan",
  "West Bengal",
];

const CATEGORIES = ["All", "SCA", "PSB", "RRB"];

export const PartnerLocator: React.FC = () => {
  const [partners, setPartners] = useState<ChannelPartner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [stateFilter, setStateFilter] = useState<string>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [activeOnly, setActiveOnly] = useState<boolean>(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState<boolean>(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<ChannelPartner | null>(null);

  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const data = await locatePartners({
        state: stateFilter === "All" ? undefined : stateFilter,
        category: categoryFilter === "All" ? undefined : categoryFilter,
        active_only: activeOnly,
        user_lat: userCoords?.lat,
        user_lng: userCoords?.lng,
        max_distance_km: userCoords ? 500 : undefined,
      });
      setPartners(data);
    } catch (err) {
      console.warn("Failed to fetch partners, using fallback data", err);
      setPartners([
        {
          id: "TS-SCA-01",
          name: "Telangana SC Co-operative Dev Corp (TSSCCDC)",
          category: "SCA",
          state: "Telangana",
          district: "Hyderabad",
          city: "Hyderabad",
          address: "5th Floor, DSS Bhavan, Masab Tank, Hyderabad",
          phone: "040-23391234",
          email: "support@tssccdc.telangana.gov.in",
          contact_person: "K. Satyanarayana, MD",
          latitude: 17.385,
          longitude: 78.4867,
          fund_utilization_rate: 94.2,
          npa_rate: 3.8,
          status: "active",
          status_message: "🟢 Active — Direct SCA channel partner for NSFDC schemes.",
          supported_schemes: ["NSFDC-MCS-01", "NSFDC-MS-02", "NSFDC-TL-03"],
          avg_disbursement_days: 18,
          distance_km: userCoords ? 14.2 : undefined,
        },
        {
          id: "TS-PSB-01",
          name: "State Bank of India — SME Masab Tank",
          category: "PSB",
          state: "Telangana",
          district: "Hyderabad",
          city: "Hyderabad",
          address: "Masab Tank Commercial Branch, Hyderabad",
          phone: "040-23314567",
          email: "sme.masabtank@sbi.co.in",
          contact_person: "M. Anuradha, AGM",
          latitude: 17.401,
          longitude: 78.452,
          fund_utilization_rate: 89.5,
          npa_rate: 2.9,
          status: "active",
          status_message: "🟢 Active — Priority Sector Lending partner.",
          supported_schemes: ["NSFDC-TL-03", "NSFDC-GB-06"],
          avg_disbursement_days: 14,
          distance_km: userCoords ? 18.5 : undefined,
        },
        {
          id: "TS-RRB-01",
          name: "Telangana Grameena Bank — Warangal Branch",
          category: "RRB",
          state: "Telangana",
          district: "Warangal",
          city: "Warangal",
          address: "Head Office Complex, Naimnagar, Hanamkonda",
          phone: "0870-2456789",
          email: "credit.sc@tgb.co.in",
          contact_person: "V. Rama Rao, Regional Manager",
          latitude: 17.9689,
          longitude: 79.5941,
          fund_utilization_rate: 76.8,
          npa_rate: 7.2,
          status: "suspended",
          status_message: "🔴 Routing Diverted — NPA rate (7.2%) exceeds 5% threshold.",
          supported_schemes: ["NSFDC-MCS-01"],
          avg_disbursement_days: 34,
          distance_km: userCoords ? 142.0 : undefined,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, [stateFilter, categoryFilter, activeOnly, userCoords]);

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser");
      return;
    }
    setLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      (err) => {
        console.warn("Geolocation failed", err);
        setGeoError("Location access denied. Displaying national network.");
        setLocating(false);
      },
      { timeout: 8000 }
    );
  };

  // Initialize Map
  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;
    if (leafletMapRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    const map = L.map(mapRef.current, {
      center: [20.5937, 78.9629],
      zoom: 5,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    leafletMapRef.current = map;
  }, []);

  // Update Markers
  useEffect(() => {
    if (!leafletMapRef.current || typeof window === "undefined") return;
    const L = (window as any).L;
    if (!L) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    if (userCoords) {
      const userIcon = L.divIcon({
        className: "user-loc-marker",
        html: `
          <div style="position:relative;">
            <div style="width:16px;height:16px;background:var(--brand-accent);border-radius:50%;border:3px solid #fff;box-shadow:0 0 10px var(--brand-accent);"></div>
            <div style="position:absolute;top:-4px;left:-4px;width:24px;height:24px;background:var(--brand-accent);border-radius:50%;opacity:0.3;animation:radarPulse 1.8s infinite;"></div>
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      userMarkerRef.current = L.marker([userCoords.lat, userCoords.lng], { icon: userIcon })
        .addTo(leafletMapRef.current)
        .bindPopup(`
          <div style="font-family:inherit;font-size:0.8rem;font-weight:700;color:var(--brand-accent);padding:4px;">
            Your Location<br/>
            <span style="font-size:0.72rem;font-weight:400;color:var(--text-muted);">${userCoords.lat.toFixed(4)}°N, ${userCoords.lng.toFixed(4)}°E</span>
          </div>
        `);
    }

    partners.forEach((p) => {
      const isSuspended = p.status === "suspended";
      const markerColor = isSuspended ? "var(--status-danger)" : "var(--status-active)";

      const icon = L.divIcon({
        className: "partner-marker-icon",
        html: `
          <div style="
            width: 24px; height: 24px; border-radius: 50%;
            background: ${markerColor}; border: 2.5px solid #fff;
            box-shadow: 0 2px 8px rgba(0,0,0,0.5);
            display: flex; align-items: center; justify-content: center;
            font-size: 10px; font-weight: 900; color: #fff;
          ">
            ${p.category[0]}
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const distSnippet = p.distance_km
        ? `<div style="font-size:0.75rem;font-weight:700;color:var(--brand-accent);margin:2px 0;">${p.distance_km.toFixed(1)} km away</div>`
        : "";

      const marker = L.marker([p.latitude, p.longitude], { icon })
        .addTo(leafletMapRef.current)
        .bindPopup(`
          <div style="font-family:inherit;min-width:210px;padding:4px;">
            <strong style="font-size:0.9rem;color:var(--text-primary);display:block;margin-bottom:2px;">${p.name}</strong>
            <div style="font-size:0.72rem;color:var(--text-muted);">${p.category} | ${p.city}, ${p.state}</div>
            ${distSnippet}
            <div style="font-size:0.72rem;color:${isSuspended ? "var(--status-danger)" : "var(--status-active)"};font-weight:700;margin:3px 0;">
              ${p.status === "active" ? "Active Channel Partner" : "Suspended (High NPA)"}
            </div>
            <div style="font-size:0.72rem;color:var(--text-secondary);margin:3px 0;">
              NPA: <strong>${p.npa_rate}%</strong> | Util: <strong>${p.fund_utilization_rate}%</strong>
            </div>
            <div style="margin-top:6px;padding-top:4px;border-top:1px solid var(--border-subtle);display:flex;flex-direction:column;gap:3px;font-size:0.75rem;">
              <a href="tel:${p.phone}" style="color:var(--brand-accent);text-decoration:none;font-weight:700;">📞 ${p.phone}</a>
              <a href="mailto:${p.email}" style="color:var(--text-secondary);text-decoration:none;">✉️ ${p.email}</a>
            </div>
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

  const resetAllFilters = () => {
    setStateFilter("All");
    setCategoryFilter("All");
    setActiveOnly(false);
    setUserCoords(null);
  };

  return (
    <div style={{ width: "100%", maxWidth: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            Channel Partner Health & Locator Radar
            <span className="chip chip-cyan" style={{ fontSize: "0.68rem" }}>
              NPA Filter Active
            </span>
          </h2>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
            Geo-spatial routing to State Channelizing Agencies (SCAs), Public Sector Banks (PSBs), and RRBs
          </div>
        </div>

        <button
          onClick={handleGeolocate}
          disabled={locating}
          className="btn-apex"
          style={{ padding: "0.55rem 1.1rem", fontSize: "0.82rem", minHeight: "44px" }}
        >
          {locating ? "Acquiring GPS..." : "📍 Locate Near Me"}
        </button>
      </div>

      {geoError && (
        <div style={{
          background: "var(--status-danger-bg)",
          border: "1px solid var(--status-danger-border)",
          color: "var(--status-danger)",
          padding: "0.6rem 1rem",
          borderRadius: "8px",
          fontSize: "0.8rem",
          marginBottom: "1rem"
        }}>
          {geoError}
        </div>
      )}

      {/* Filter Control Bar */}
      <div className="glass-panel" style={{
        padding: "1rem 1.25rem",
        marginBottom: "1.25rem",
        display: "flex",
        gap: "1rem",
        alignItems: "center",
        flexWrap: "wrap"
      }}>
        {!userCoords && (
          <div style={{ minWidth: "150px" }}>
            <label className="field-label">State Filter</label>
            <select
              className="input-box"
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              aria-label="Filter by state"
            >
              {STATES.map((s) => <option key={s} value={s}>{s === "All" ? "All States" : s}</option>)}
            </select>
          </div>
        )}

        <div style={{ minWidth: "130px" }}>
          <label className="field-label">Partner Category</label>
          <select
            className="input-box"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter by category"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>
            ))}
          </select>
        </div>

        <div style={{ paddingTop: "1rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", fontWeight: "600", color: "var(--text-secondary)", cursor: "pointer", minHeight: "44px" }}>
            <input
              type="checkbox"
              checked={activeOnly}
              onChange={(e) => setActiveOnly(e.target.checked)}
              style={{ width: "18px", height: "18px" }}
            />
            Exclude High NPA Branches (&gt;5%)
          </label>
        </div>

        <div style={{ paddingTop: "1rem", marginLeft: "auto", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
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

      {/* Main Grid: Responsive Map + Partner List */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "1.25rem",
        alignItems: "start"
      }}>
        {/* Map View */}
        <div className="glass-panel" style={{ height: "520px", overflow: "hidden", padding: 0, position: "relative", borderRadius: "12px" }}>
          <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
          {loading && (
            <div style={{
              position: "absolute", top: 12, right: 12,
              background: "var(--bg-card-solid)", padding: "0.4rem 0.85rem",
              borderRadius: "6px", fontSize: "0.75rem", fontWeight: "700",
              border: "1px solid var(--border-subtle)",
              color: "var(--brand-accent)",
              zIndex: 999
            }}>
              Refreshing Network...
            </div>
          )}
        </div>

        {/* Directory List */}
        <div style={{ maxHeight: "520px", overflowY: "auto", paddingRight: "0.25rem" }}>
          {partners.length === 0 ? (
            /* Item 11: Empty State Page / Component */
            <div className="glass-panel" style={{
              padding: "3rem 1.5rem",
              textAlign: "center",
              color: "var(--text-muted)",
              borderRadius: "12px"
            }}>
              <div style={{ fontSize: "2.2rem", marginBottom: "0.5rem" }}>🏢</div>
              <div style={{ fontSize: "1.05rem", fontWeight: "800", color: "var(--text-primary)" }}>
                No Channel Partners Found
              </div>
              <p style={{ fontSize: "0.82rem", marginTop: "0.4rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                No active State Channelizing Agencies or banks matched the selected state, category, or NPA criteria.
              </p>
              <button
                onClick={resetAllFilters}
                className="btn-apex"
                style={{ marginTop: "1.2rem", padding: "0.6rem 1.25rem", fontSize: "0.82rem" }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            partners.map((p, i) => (
              <div
                key={p.id}
                className="glass-panel scheme-card-motion"
                onClick={() => setSelectedPartner(p)}
                style={{
                  padding: "1rem 1.2rem",
                  marginBottom: "0.8rem",
                  animationDelay: `${i * 35}ms`,
                  cursor: "pointer",
                  borderLeft: `4px solid ${p.status === "active" ? "var(--accent-emerald)" : "var(--accent-rose)"}`,
                  background: selectedPartner?.id === p.id ? "var(--bg-card-hover)" : undefined,
                  borderRadius: "10px"
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

                    <div style={{ fontSize: "0.95rem", fontWeight: "800", color: "var(--text-primary)", marginTop: "0.3rem" }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                      {p.address}
                    </div>
                  </div>

                  <span className={`chip ${p.status === "active" ? "chip-emerald" : "chip-rose"}`} style={{ flexShrink: 0 }}>
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
                    <div style={{ fontSize: "0.9rem", fontWeight: "900", color: p.npa_rate < 5 ? "var(--accent-emerald)" : "var(--accent-rose)" }}>
                      {p.npa_rate}%
                    </div>
                    <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: "700" }}>NPA</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "0.9rem", fontWeight: "900", color: "var(--brand-accent)" }}>
                      {p.fund_utilization_rate}%
                    </div>
                    <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: "700" }}>Util.</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "0.9rem", fontWeight: "900", color: "var(--accent-purple)" }}>
                      {p.avg_disbursement_days}d
                    </div>
                    <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: "700" }}>TAT</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "0.9rem", fontWeight: "900", color: "var(--status-warning)" }}>
                      {p.category}
                    </div>
                    <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: "700" }}>Type</div>
                  </div>
                </div>

                {/* Status message */}
                <div style={{
                  fontSize: "0.75rem",
                  color: p.status === "active" ? "var(--accent-emerald)" : "var(--accent-rose)",
                  marginTop: "0.45rem",
                  lineHeight: "1.4"
                }}>
                  {p.status_message.replace(/[🟢🔴]/g, "").trim()}
                </div>

                {/* Item 6: Clickable Email & Item 17: Clickable Phone */}
                <div style={{
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  marginTop: "0.6rem",
                  paddingTop: "0.4rem",
                  borderTop: "1px solid var(--border-subtle)",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <span>Contact: {p.contact_person}</span>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
                    <a
                      href={`tel:${p.phone}`}
                      style={{
                        color: "var(--brand-accent)",
                        fontWeight: "700",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        minHeight: "36px"
                      }}
                      onClick={(e) => e.stopPropagation()}
                      title={`Click to call ${p.name}`}
                    >
                      📞 {p.phone}
                    </a>
                    <a
                      href={`mailto:${p.email}`}
                      style={{
                        color: "var(--text-secondary)",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        minHeight: "36px"
                      }}
                      onClick={(e) => e.stopPropagation()}
                      title={`Click to email ${p.name}`}
                    >
                      ✉️ {p.email}
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
