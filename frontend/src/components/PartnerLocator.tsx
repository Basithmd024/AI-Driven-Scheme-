"use client";
import React, { useState, useEffect, useRef } from "react";
import { locatePartners, ChannelPartner } from "../lib/api";
import { useLanguage } from "../lib/LanguageContext";
import { ALL_INDIA_STATES } from "../lib/translations";

const CATEGORIES = [
  { value: "All", label: "All Institutional Intermediaries" },
  { value: "SCA", label: "State Channelizing Agencies (SCAs)" },
  { value: "PSB", label: "Public Sector Banks (PSBs)" },
  { value: "RRB", label: "Regional Rural Banks (RRBs)" },
];

export const PartnerLocator: React.FC = () => {
  const { t } = useLanguage();
  const [partners, setPartners] = useState<ChannelPartner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [stateFilter, setStateFilter] = useState<string>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [activeOnly, setActiveOnly] = useState<boolean>(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState<boolean>(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<ChannelPartner | null>(null);
  const [mapReady, setMapReady] = useState<boolean>(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

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
        setGeoError("Location access denied. Showing All-India network.");
        setLocating(false);
      },
      { timeout: 8000 }
    );
  };

  // Robust Leaflet Map Initialization with Retries
  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;
    if (leafletMapRef.current) return;

    let checkCount = 0;
    const initMap = () => {
      const L = (window as any).L;
      if (!L) {
        checkCount++;
        if (checkCount < 20) {
          setTimeout(initMap, 250);
        }
        return;
      }

      try {
        if (!mapRef.current) return;
        const map = L.map(mapRef.current, {
          center: [22.5937, 79.9629],
          zoom: 5,
          zoomControl: true,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
          maxZoom: 18,
        }).addTo(map);

        leafletMapRef.current = map;
        setMapReady(true);
        setTimeout(() => {
          map.invalidateSize();
        }, 400);
      } catch (e) {
        console.warn("Leaflet initialization error:", e);
      }
    };

    initMap();

    return () => {
      if (leafletMapRef.current) {
        try {
          leafletMapRef.current.remove();
        } catch (e) {}
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Sync Markers on Partner or Selection Change
  useEffect(() => {
    if (!leafletMapRef.current || typeof window === "undefined") return;
    const L = (window as any).L;
    if (!L) return;

    // Remove existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    partners.forEach((partner) => {
      const isSuspended = partner.status === "suspended";
      const markerColor = isSuspended ? "#ef4444" : "#10b981";

      const customIcon = L.divIcon({
        className: "custom-map-marker",
        html: `<div style="
          background: ${markerColor};
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 10px;
          font-weight: 800;
        ">${partner.category[0]}</div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      const marker = L.marker([partner.latitude, partner.longitude], { icon: customIcon })
        .addTo(leafletMapRef.current)
        .bindPopup(`
          <div style="font-family: inherit; font-size: 12px; color: #1e293b;">
            <strong>${partner.name}</strong><br/>
            <span style="color: #64748b;">${partner.category} • ${partner.city}, ${partner.state}</span><br/>
            <strong>NPA Rate:</strong> ${partner.npa_rate}% | <strong>TAT:</strong> ${partner.avg_disbursement_days}d<br/>
            ${isSuspended ? "<span style=\"color: #ef4444; font-weight: 700;\">Suspended (>5% NPA)</span>" : "<span style=\"color: #10b981; font-weight: 700;\">Active Channel</span>"}
          </div>
        `);

      marker.on("click", () => setSelectedPartner(partner));
      markersRef.current.push(marker);
    });

    if (partners.length > 0 && markersRef.current.length > 0) {
      const group = L.featureGroup(markersRef.current);
      try {
        leafletMapRef.current.fitBounds(group.getBounds().pad(0.15));
      } catch (e) {}
    }
  }, [partners, mapReady]);

  const activeCount = partners.filter((p) => p.status === "active").length;
  const suspendedCount = partners.filter((p) => p.status === "suspended").length;

  return (
    <div style={{ width: "100%" }}>
      {/* Header with Title & Geolocation */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--text-primary)", margin: 0 }}>
              {t("locator_heading", "National Channel Partner Radar & Branch Locator")}
            </h2>
            <span className="chip chip-cyan" style={{ fontSize: "0.68rem" }}>
              All-India Network
            </span>
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px" }}>
            {t("locator_subheading", "Locate verified State Channelizing Agencies (SCAs), Public Sector Banks (PSBs), and Regional Rural Banks (RRBs) across India.")}
          </div>
        </div>

        <button
          onClick={handleGeolocate}
          disabled={locating}
          className="btn-apex"
          style={{ padding: "0.65rem 1.25rem", fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "0.4rem", minHeight: "42px" }}
        >
          <span>📍</span>
          <span>{locating ? t("locator_locating", "Locating...") : t("locator_locate_me", "Locate Near Me")}</span>
        </button>
      </div>

      {geoError && (
        <div className="field-error-msg" style={{ marginBottom: "1rem", padding: "0.5rem 0.8rem", borderRadius: "6px" }}>
          ⚠️ {geoError}
        </div>
      )}

      {/* Control Bar: Filters & Health Ticker */}
      <div className="glass-panel" style={{ padding: "1rem 1.25rem", marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
            {/* Category Dropdown */}
            <div>
              <label style={{ fontSize: "0.72rem", fontWeight: "700", color: "var(--text-muted)", display: "block", marginBottom: "0.25rem" }}>
                {t("locator_filter_category", "Partner Category")}
              </label>
              <select
                className="input-box"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{ padding: "0.45rem 0.75rem", fontSize: "0.8rem", minWidth: "160px" }}
                aria-label="Filter by partner category"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* All-India State Dropdown */}
            <div>
              <label style={{ fontSize: "0.72rem", fontWeight: "700", color: "var(--text-muted)", display: "block", marginBottom: "0.25rem" }}>
                {t("locator_filter_state", "State / UT")}
              </label>
              <select
                className="input-box"
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                style={{ padding: "0.45rem 0.75rem", fontSize: "0.8rem", minWidth: "160px" }}
                aria-label="Filter by state"
              >
                <option value="All">All States & UTs</option>
                {ALL_INDIA_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* High NPA Filter Checkbox */}
            <div style={{ display: "flex", alignItems: "center", marginTop: "1.2rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.45rem", fontSize: "0.8rem", color: "var(--text-secondary)", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={activeOnly}
                  onChange={(e) => setActiveOnly(e.target.checked)}
                  style={{ width: "16px", height: "16px" }}
                />
                {t("locator_exclude_npa", "Exclude High NPA Branches (>5%)")}
              </label>
            </div>
          </div>

          {/* Network Health Counts */}
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <span className="chip chip-emerald" style={{ fontSize: "0.74rem", fontWeight: "700" }}>
              ● {activeCount} {t("locator_active_badge", "Active Channels")}
            </span>
            {suspendedCount > 0 && (
              <span className="chip chip-rose" style={{ fontSize: "0.74rem", fontWeight: "700" }}>
                ● {suspendedCount} {t("locator_suspended_badge", "Suspended (>5% NPA)")}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map & Cards */}
      <div className="partner-locator-grid" style={{
        display: "grid",
        gridTemplateColumns: "1.2fr 1fr",
        gap: "1.25rem",
        minHeight: "540px"
      }}>
        {/* Left Column: Interactive Map */}
        <div
          className="glass-panel"
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "12px",
            minHeight: "480px",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <div
            ref={mapRef}
            style={{
              width: "100%",
              height: "100%",
              minHeight: "480px",
              background: "var(--bg-card)",
              zIndex: 1
            }}
          />

          {!mapReady && (
            <div style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--bg-surface)",
              zIndex: 2,
              padding: "1.5rem",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🗺️</div>
              <div style={{ fontWeight: "800", color: "var(--text-primary)", fontSize: "1rem" }}>
                Connecting to All-India Channel Radar...
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", maxWidth: "320px", marginTop: "4px" }}>
                Loading interactive geo-spatial markers for SCAs, PSBs, and RRB banking points nationwide.
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Branch List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", maxHeight: "650px", overflowY: "auto", paddingRight: "0.25rem" }}>
          {loading && (
            <div className="glass-panel" style={{ padding: "2rem", textAlign: "center", color: "var(--brand-accent)" }}>
              Scanning All-India institutional database...
            </div>
          )}

          {!loading && partners.length === 0 && (
            <div className="glass-panel" style={{ padding: "2.5rem 1.5rem", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🏛️</div>
              <div style={{ fontWeight: "800", color: "var(--text-primary)" }}>No Intermediaries Found</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                Try switching the State or Category filter to "All" to view channels nationwide.
              </div>
            </div>
          )}

          {!loading && partners.map((p) => {
            const isSuspended = p.status === "suspended";
            const isSelected = selectedPartner?.id === p.id;

            return (
              <div
                key={p.id}
                className="glass-panel"
                onClick={() => setSelectedPartner(p)}
                style={{
                  padding: "1.1rem",
                  borderRadius: "10px",
                  border: isSelected
                    ? "2px solid var(--brand-accent)"
                    : isSuspended
                    ? "1px solid rgba(239, 68, 68, 0.3)"
                    : "1px solid var(--border-subtle)",
                  cursor: "pointer",
                  background: isSelected ? "var(--bg-surface)" : "var(--bg-card)",
                  transition: "border 0.2s ease"
                }}
              >
                {/* Partner Top Bar */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem", marginBottom: "0.4rem" }}>
                  <div>
                    <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", flexWrap: "wrap" }}>
                      <span className={p.category === "SCA" ? "chip chip-purple" : p.category === "PSB" ? "chip chip-cyan" : "chip chip-amber"} style={{ fontSize: "0.65rem" }}>
                        {p.category}
                      </span>
                      {p.distance_km !== undefined && (
                        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                          📍 {p.distance_km.toFixed(1)} {t("locator_km_away", "km away")}
                        </span>
                      )}
                    </div>
                    <div style={{ fontWeight: "800", color: "var(--text-primary)", fontSize: "0.95rem", marginTop: "0.25rem" }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {p.city}, {p.state}
                    </div>
                  </div>

                  <span className={isSuspended ? "chip chip-rose" : "chip chip-emerald"} style={{ fontSize: "0.68rem" }}>
                    {isSuspended ? t("locator_suspended_badge", "Suspended") : t("locator_active_badge", "Active")}
                  </span>
                </div>

                {/* Metrics Row */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "0.5rem",
                  background: "var(--bg-surface)",
                  padding: "0.55rem",
                  borderRadius: "6px",
                  margin: "0.65rem 0",
                  textAlign: "center"
                }}>
                  <div>
                    <div style={{ fontSize: "0.66rem", color: "var(--text-muted)", fontWeight: "700" }}>
                      {t("locator_npa", "NPA Rate")}
                    </div>
                    <div style={{ fontSize: "0.9rem", fontWeight: "800", color: p.npa_rate > 5 ? "var(--status-danger)" : "var(--status-active)" }}>
                      {p.npa_rate}%
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.66rem", color: "var(--text-muted)", fontWeight: "700" }}>
                      {t("locator_util", "Utilization")}
                    </div>
                    <div style={{ fontSize: "0.9rem", fontWeight: "800", color: "var(--brand-accent)" }}>
                      {p.fund_utilization_rate}%
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.66rem", color: "var(--text-muted)", fontWeight: "700" }}>
                      {t("locator_tat", "TAT")}
                    </div>
                    <div style={{ fontSize: "0.9rem", fontWeight: "800", color: "var(--text-primary)" }}>
                      {p.avg_disbursement_days}d
                    </div>
                  </div>
                </div>

                {/* Status Message */}
                <div style={{ fontSize: "0.74rem", color: isSuspended ? "var(--status-danger)" : "var(--status-active)", marginBottom: "0.65rem" }}>
                  {p.status_message}
                </div>

                {/* Address & Direct Actions */}
                <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", borderTop: "1px solid var(--border-subtle)", paddingTop: "0.5rem" }}>
                  <div style={{ marginBottom: "0.4rem" }}>🏢 {p.address}</div>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {p.phone && (
                      <a
                        href={`tel:${p.phone}`}
                        className="chip chip-cyan"
                        style={{ textDecoration: "none", fontSize: "0.72rem", padding: "0.25rem 0.55rem" }}
                      >
                        📞 {p.phone}
                      </a>
                    )}
                    {p.email && (
                      <a
                        href={`mailto:${p.email}`}
                        className="chip chip-emerald"
                        style={{ textDecoration: "none", fontSize: "0.72rem", padding: "0.25rem 0.55rem" }}
                      >
                        ✉️ {p.email}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
