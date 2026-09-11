"use client";
import React, { useState, useEffect, useRef } from "react";
import { locatePartners, ChannelPartner, Scheme } from "../lib/api";
import { useLanguage } from "../lib/LanguageContext";
import { ALL_INDIA_STATES } from "../lib/translations";

const CATEGORIES = [
  { value: "All", label: "All Institutional Intermediaries" },
  { value: "SCA", label: "State Channelizing Agencies (SCAs)" },
  { value: "PSB", label: "Public Sector Banks (PSBs)" },
  { value: "RRB", label: "Regional Rural Banks (RRBs)" },
];

const POPULAR_HUBS = [
  { name: "Delhi NCR", lat: 28.6139, lng: 77.2090 },
  { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
  { name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
  { name: "Hyderabad", lat: 17.3850, lng: 78.4867 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707 },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { name: "Lucknow", lat: 26.8467, lng: 80.9462 },
  { name: "Jaipur", lat: 26.9124, lng: 75.7873 },
];

export interface PartnerLocatorProps {
  selectedScheme?: Scheme | null;
  onClearSchemeFilter?: () => void;
  selectedPartner?: ChannelPartner | null;
  onSelectPartner?: (partner: ChannelPartner) => void;
  onViewSchemesForPartner?: (partner: ChannelPartner) => void;
}

export const PartnerLocator: React.FC<PartnerLocatorProps> = ({
  selectedScheme,
  onClearSchemeFilter,
  selectedPartner: propSelectedPartner,
  onSelectPartner,
  onViewSchemesForPartner,
}) => {
  const { t } = useLanguage();
  const [partners, setPartners] = useState<ChannelPartner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [stateFilter, setStateFilter] = useState<string>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [activeOnly, setActiveOnly] = useState<boolean>(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [userLocationLabel, setUserLocationLabel] = useState<string | null>(null);
  const [locating, setLocating] = useState<boolean>(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<ChannelPartner | null>(null);
  const [mapReady, setMapReady] = useState<boolean>(false);

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
        latitude: userCoords?.lat,
        longitude: userCoords?.lng,
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

  // Auto-align category filter when navigating from a specific scheme
  useEffect(() => {
    if (selectedScheme) {
      const channelList = selectedScheme.eligibility_criteria?.channel_partners || [];
      if (channelList.includes("SCA") && !channelList.includes("PSB")) {
        setCategoryFilter("SCA");
      } else if (channelList.includes("PSB") && !channelList.includes("SCA")) {
        setCategoryFilter("PSB");
      } else if (channelList.includes("RRB") && !channelList.includes("PSB")) {
        setCategoryFilter("RRB");
      }
    }
  }, [selectedScheme]);

  // Set specific location and fly map
  const applyLocation = (lat: number, lng: number, label: string) => {
    setUserCoords({ lat, lng });
    setUserLocationLabel(label);
    setGeoError(null);
    setLocating(false);

    if (leafletMapRef.current) {
      try {
        leafletMapRef.current.flyTo([lat, lng], 10, { duration: 1.2 });
      } catch (e) {}
    }
  };

  // Robust Geolocation with IP Fallback & Hub options
  const handleGeolocate = async () => {
    setLocating(true);
    setGeoError(null);

    const tryIpFallback = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3500) });
        if (res.ok) {
          const ipData = await res.json();
          if (ipData && typeof ipData.latitude === "number" && typeof ipData.longitude === "number") {
            const cityName = ipData.city || ipData.region || "Network IP";
            applyLocation(ipData.latitude, ipData.longitude, `${cityName} (via Network IP)`);
            return true;
          }
        }
      } catch (e) {
        console.warn("IP Geolocation attempt 1 failed", e);
      }

      try {
        const res2 = await fetch("https://ipwho.is/", { signal: AbortSignal.timeout(3500) });
        if (res2.ok) {
          const d2 = await res2.json();
          if (d2.success && typeof d2.latitude === "number" && typeof d2.longitude === "number") {
            const cityName = d2.city || "Network Location";
            applyLocation(d2.latitude, d2.longitude, `${cityName} (via Network IP)`);
            return true;
          }
        }
      } catch (e2) {
        console.warn("IP Geolocation attempt 2 failed", e2);
      }

      return false;
    };

    if (!navigator.geolocation) {
      const ok = await tryIpFallback();
      if (!ok) {
        setGeoError(t("locator_geo_unsupported", "Browser GPS not supported. Please pick your city below or click on the map."));
        setLocating(false);
      }
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        applyLocation(pos.coords.latitude, pos.coords.longitude, "Your Current GPS Location");
      },
      async (err) => {
        console.warn("Browser GPS failed, attempting IP fallback...", err);
        const ok = await tryIpFallback();
        if (!ok) {
          setGeoError(
            t(
              "locator_geo_denied",
              "Location access was blocked or timed out. Click a city below or tap anywhere on the map to locate branches nearby!"
            )
          );
          setLocating(false);
        }
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
    );
  };

  const handleClearLocation = () => {
    setUserCoords(null);
    setUserLocationLabel(null);
    setGeoError(null);
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }
    if (leafletMapRef.current) {
      leafletMapRef.current.setView([22.5937, 79.9629], 5);
    }
  };

  // Robust Leaflet Map Initialization with Retries & Click Listener
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

        // Click on map to set custom location point
        map.on("click", (e: any) => {
          applyLocation(e.latlng.lat, e.latlng.lng, `Pinned (${e.latlng.lat.toFixed(2)}°, ${e.latlng.lng.toFixed(2)}°)`);
        });

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

    // Remove existing partner markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Render User Location Beacon
    if (userCoords) {
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
      }
      const userIcon = L.divIcon({
        className: "user-location-beacon",
        html: `
          <div style="position:relative; width:34px; height:34px; display:flex; align-items:center; justify-content:center;">
            <div style="position:absolute; width:100%; height:100%; border-radius:50%; background:rgba(37,99,235,0.35); animation:pulse 1.8s infinite ease-out;"></div>
            <div style="width:20px; height:20px; border-radius:50%; background:#2563eb; border:3px solid #ffffff; box-shadow:0 0 14px rgba(37,99,235,0.9); display:flex; align-items:center; justify-content:center; color:white; font-size:10px; font-weight:bold;">📍</div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      userMarkerRef.current = L.marker([userCoords.lat, userCoords.lng], {
        icon: userIcon,
        zIndexOffset: 1000,
      })
        .addTo(leafletMapRef.current)
        .bindPopup(`
          <div style="font-family: inherit; font-size: 12px; font-weight: 700; color: #1e3a8a;">
            📍 ${userLocationLabel || "Your Selected Location"}
          </div>
        `);
    } else if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    // Render Partner Markers
    partners.forEach((partner) => {
      const isSuspended = partner.status === "suspended";
      const markerColor = isSuspended ? "#ef4444" : "#10b981";

      const customIcon = L.divIcon({
        className: "custom-map-marker",
        html: `<div style="
          background: ${markerColor};
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 11px;
          font-weight: 800;
        ">${partner.category[0]}</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const distInfo = partner.distance_km !== undefined ? `<strong>Distance:</strong> ${partner.distance_km.toFixed(1)} km<br/>` : "";

      const marker = L.marker([partner.latitude, partner.longitude], { icon: customIcon })
        .addTo(leafletMapRef.current)
        .bindPopup(`
          <div style="font-family: inherit; font-size: 12px; color: #1e293b; max-width: 220px;">
            <strong style="font-size: 13px; color: #0f172a;">${partner.name}</strong><br/>
            <span style="color: #64748b; font-size: 11px;">${partner.category} • ${partner.city}, ${partner.state}</span><br/>
            ${distInfo}
            <strong>NPA Rate:</strong> ${partner.npa_rate}% | <strong>TAT:</strong> ${partner.avg_disbursement_days}d<br/>
            ${isSuspended ? "<span style='color: #ef4444; font-weight: 700;'>Suspended (>5% NPA)</span>" : "<span style='color: #10b981; font-weight: 700;'>Active Channel</span>"}
          </div>
        `);

      marker.on("click", () => setSelectedPartner(partner));
      markersRef.current.push(marker);
    });

    // Auto fit bounds only if user hasn't explicitly localized
    if (!userCoords && partners.length > 0 && markersRef.current.length > 0) {
      const group = L.featureGroup(markersRef.current);
      try {
        leafletMapRef.current.fitBounds(group.getBounds().pad(0.12));
      } catch (e) {}
    }
  }, [partners, mapReady, userCoords, userLocationLabel]);

  const handleSelectPartner = (p: ChannelPartner) => {
    setSelectedPartner(p);
    if (leafletMapRef.current) {
      leafletMapRef.current.flyTo([p.latitude, p.longitude], 12, { duration: 1.2 });
      const target = markersRef.current.find((m) => {
        const ll = m.getLatLng();
        return Math.abs(ll.lat - p.latitude) < 0.001 && Math.abs(ll.lng - p.longitude) < 0.001;
      });
      if (target) {
        target.openPopup();
      }
    }
  };

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

        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
          {userCoords && (
            <button
              onClick={handleClearLocation}
              className="btn-secondary"
              style={{ padding: "0.55rem 0.9rem", fontSize: "0.78rem", borderRadius: "8px" }}
            >
              ✖ {t("locator_reset_view", "Reset View")}
            </button>
          )}

          <button
            onClick={handleGeolocate}
            disabled={locating}
            className="btn-apex"
            style={{ padding: "0.65rem 1.25rem", fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "0.4rem", minHeight: "42px" }}
          >
            <span>📍</span>
            <span>{locating ? t("locator_locating", "Locating Nearby...") : t("locator_locate_me", "Locate Near Me")}</span>
          </button>
        </div>
      </div>

      {/* Active Location Banner */}
      {userCoords && (
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(14, 165, 233, 0.12)",
          border: "1.5px solid rgba(14, 165, 233, 0.4)",
          padding: "0.65rem 1rem",
          borderRadius: "8px",
          marginBottom: "1rem",
          fontSize: "0.8rem"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "1rem" }}>📍</span>
            <span style={{ color: "var(--text-primary)" }}>
              <strong>{t("locator_active_loc", "Proximity Radar Active")}:</strong> {userLocationLabel}
            </span>
            <span className="chip chip-cyan" style={{ fontSize: "0.68rem" }}>
              {partners.length} {t("locator_channels_nearby", "Channels Sorted by Distance")}
            </span>
          </div>

          <button
            onClick={handleClearLocation}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--brand-accent)",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "0.75rem",
              textDecoration: "underline"
            }}
          >
            {t("locator_show_all", "Show All-India")}
          </button>
        </div>
      )}

      {/* Geolocation Warning & Quick Hub Selector */}
      {geoError && (
        <div style={{
          background: "rgba(245, 158, 11, 0.12)",
          border: "1px solid rgba(245, 158, 11, 0.3)",
          padding: "0.75rem 1rem",
          borderRadius: "8px",
          marginBottom: "1rem"
        }}>
          <div style={{ fontSize: "0.8rem", color: "var(--text-primary)", marginBottom: "0.5rem", fontWeight: "600" }}>
            ⚠️ {geoError}
          </div>
          <div style={{ fontSize: "0.74rem", color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
            {t("locator_quick_cities", "Quick-select your region to view nearby institutional branches:")}
          </div>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {POPULAR_HUBS.map((h) => (
              <button
                key={h.name}
                onClick={() => applyLocation(h.lat, h.lng, `${h.name} Region`)}
                className="chip chip-purple"
                style={{ cursor: "pointer", fontSize: "0.72rem", padding: "0.3rem 0.6rem", border: "none" }}
              >
                📍 {h.name}
              </button>
            ))}
          </div>
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

          <div style={{
            position: "absolute",
            bottom: "10px",
            left: "10px",
            zIndex: 10,
            background: "rgba(15, 23, 42, 0.85)",
            backdropFilter: "blur(6px)",
            color: "#f8fafc",
            fontSize: "0.7rem",
            padding: "0.35rem 0.7rem",
            borderRadius: "6px",
            border: "1px solid rgba(255, 255, 255, 0.15)"
          }}>
            💡 {t("locator_map_tip", "Tip: Click anywhere on the map to find nearby partners")}
          </div>

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
                Try switching the State or Category filter to "All" or resetting the proximity radius.
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
                onClick={() => handleSelectPartner(p)}
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
                        <span className="chip chip-emerald" style={{ fontSize: "0.68rem", fontWeight: "700" }}>
                          🎯 {p.distance_km.toFixed(1)} {t("locator_km_away", "km away")}
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

                {/* Routing Recommendation or Status Message */}
                {p.routing_recommendation && (
                  <div style={{ fontSize: "0.72rem", color: "var(--brand-accent)", fontWeight: "700", marginBottom: "0.35rem" }}>
                    {p.routing_recommendation}
                  </div>
                )}
                <div style={{ fontSize: "0.74rem", color: isSuspended ? "var(--status-danger)" : "var(--status-active)", marginBottom: "0.65rem" }}>
                  {p.status_message}
                </div>

                                {/* Approved Schemes & Direct Return Action */}
                <div style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}>
                  <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: "700", marginBottom: "0.25rem" }}>
                    Approved Lending Schemes:
                  </div>
                  <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                    {(p.supported_schemes || ["PMEGP", "MUDRA", "Stand-Up India"]).map((s, idx) => (
                      <span key={idx} className="chip chip-purple" style={{ fontSize: "0.65rem", padding: "0.15rem 0.45rem" }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {onViewSchemesForPartner && (
                  <div style={{ marginBottom: "0.5rem" }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectPartner(p);
                        onSelectPartner?.(p);
                        onViewSchemesForPartner(p);
                      }}
                      className="btn-apex"
                      style={{
                        padding: "0.35rem 0.75rem",
                        fontSize: "0.75rem",
                        width: "100%",
                        cursor: "pointer",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.35rem",
                      }}
                    >
                      <span>👉</span>
                      <span>Select & View Matching Schemes</span>
                    </button>
                  </div>
                )}

                {/* Address & Direct Actions */}
                <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", borderTop: "1px solid var(--border-subtle)", paddingTop: "0.5rem" }}>
                  <div style={{ marginBottom: "0.4rem" }}>🏢 {p.address}</div>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
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
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectPartner(p); onSelectPartner?.(p);
                      }}
                      className="chip chip-purple"
                      style={{ border: "none", cursor: "pointer", fontSize: "0.72rem", padding: "0.25rem 0.55rem" }}
                    >
                      🗺️ Focus on Map
                    </button>
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
