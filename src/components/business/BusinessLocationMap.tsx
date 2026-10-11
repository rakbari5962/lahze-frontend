"use client";

import { useEffect, useRef, useState } from "react";

import {
  MapContainer,
  Marker,
  TileLayer,
  ZoomControl,
  useMap,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import { getCityMapCenter as fetchCityMapCenter } from "../../services/location.service";

interface BusinessLocationMapProps {
  cityId: number | null;
  latitude: number | null;
  longitude: number | null;
  onLocationChange: (
    latitude: number,
    longitude: number
  ) => void;
}

const IRAN_OVERVIEW: [number, number] = [32.4279, 53.6880];

const markerIcon = L.divIcon({
  className: "lahze-map-marker-wrapper",
  html: `
    <div class="lahze-map-marker">
      <div class="lahze-map-marker-pulse"></div>
      <div class="lahze-map-marker-pin">
        <div class="lahze-map-marker-dot"></div>
      </div>
    </div>
  `,
  iconSize: [54, 68],
  iconAnchor: [27, 61],
});


function CityViewportController({
  cityId,
  cityCenter,
  hasSavedLocation,
}: {
  cityId: number | null;
  cityCenter: [number, number] | null;
  hasSavedLocation: boolean;
}) {
  const map = useMap();
  const previousCityId = useRef<number | null>(cityId);
  const pendingCityChange = useRef(false);
  const appliedCenterCityId = useRef<number | null>(
    cityCenter ? cityId : null
  );

  useEffect(() => {
    const cityChanged = previousCityId.current !== cityId;

    if (cityChanged) {
      previousCityId.current = cityId;

      if (cityCenter) {
        map.setView(cityCenter, 12, { animate: true });
        pendingCityChange.current = false;
        appliedCenterCityId.current = cityId;
      } else {
        pendingCityChange.current = cityId !== null;
        appliedCenterCityId.current = null;
        map.setView(IRAN_OVERVIEW, 5, { animate: true });
      }

      return;
    }

    if (!cityCenter) {
      return;
    }

    // A newly selected city's center may arrive asynchronously.
    if (pendingCityChange.current) {
      map.setView(cityCenter, 12, { animate: true });
      pendingCityChange.current = false;
      appliedCenterCityId.current = cityId;
      return;
    }

    // Preserve the current viewport when a business location is saved.
    // Mark this city as handled even when we intentionally do not recenter.
    if (appliedCenterCityId.current !== cityId) {
      if (!hasSavedLocation) {
        map.setView(cityCenter, 12, { animate: true });
      }

      appliedCenterCityId.current = cityId;
    }
  }, [cityId, cityCenter, hasSavedLocation, map]);

  return null;
}

function MapClickHandler({
  onLocationChange,
}: {
  onLocationChange: (
    latitude: number,
    longitude: number
  ) => void;
}) {
  useMapEvents({
    click(event) {
      onLocationChange(
        Number(event.latlng.lat.toFixed(7)),
        Number(event.latlng.lng.toFixed(7))
      );
    },
  });

  return null;
}


function CurrentLocationButton({
  onLocationChange,
}: {
  onLocationChange: (
    latitude: number,
    longitude: number
  ) => void;
}) {
  const map = useMap();

  function handleCurrentLocation() {
    if (!navigator.geolocation) {
      window.alert(
        "مرورگر شما از موقعیت مکانی پشتیبانی نمی‌کند."
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const latitude =
          Number(
            position.coords.latitude.toFixed(7)
          );

        const longitude =
          Number(
            position.coords.longitude.toFixed(7)
          );

        onLocationChange(
          latitude,
          longitude
        );

        map.setView(
          [latitude, longitude],
          17,
          {
            animate: true,
          }
        );
      },

      error => {
        if (
          error.code ===
          error.PERMISSION_DENIED
        ) {
          window.alert(
            "دسترسی به موقعیت مکانی فعال نیست. لطفاً اجازه دسترسی به موقعیت مکانی را در مرورگر یا تنظیمات گوشی فعال کنید."
          );

          return;
        }

        if (
          error.code ===
          error.POSITION_UNAVAILABLE
        ) {
          window.alert(
            "موقعیت فعلی شما در دسترس نیست. لطفاً دوباره تلاش کنید."
          );

          return;
        }

        window.alert(
          "دریافت موقعیت فعلی انجام نشد. لطفاً دوباره تلاش کنید."
        );
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  }

  return (
    <button
      type="button"
      className="business-map-location-button"
      onClick={handleCurrentLocation}
      aria-label="استفاده از موقعیت فعلی"
      title="موقعیت من"
    >
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="3"
          stroke="currentColor"
          strokeWidth="2"
        />

        <path
          d="M12 2v4M12 18v4M2 12h4M18 12h4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />

        <circle
          cx="12"
          cy="12"
          r="8"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.35"
        />
      </svg>

      <span>موقعیت من</span>
    </button>
  );
}


export default function BusinessLocationMap({
  cityId,
  latitude,
  longitude,
  onLocationChange,
}: BusinessLocationMapProps) {
  const hasSavedLocation =
    latitude !== null &&
    longitude !== null &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude);

  const savedPosition: [number, number] | null =
    hasSavedLocation
      ? [latitude as number, longitude as number]
      : null;

  const [loadedCityCenter, setLoadedCityCenter] = useState<{
    cityId: number | null;
    center: [number, number] | null;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (cityId === null) {
      setLoadedCityCenter({ cityId: null, center: null });
      return () => {
        cancelled = true;
      };
    }

    setLoadedCityCenter(null);

    fetchCityMapCenter(cityId)
      .then((result) => {
        const latitude = result.latitude;
        const longitude = result.longitude;

        const center: [number, number] | null =
          typeof latitude === "number" &&
          Number.isFinite(latitude) &&
          typeof longitude === "number" &&
          Number.isFinite(longitude)
            ? [latitude, longitude]
            : null;

        if (!cancelled) {
          setLoadedCityCenter({ cityId, center });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoadedCityCenter({ cityId, center: null });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [cityId]);

  const cityCenter =
    loadedCityCenter?.cityId === cityId
      ? loadedCityCenter.center
      : null;

  const position: [number, number] =
    savedPosition ?? cityCenter ?? IRAN_OVERVIEW;

  const initialZoom = savedPosition ? 16 : cityCenter ? 12 : 5;

  return (
    <div className="business-location-map-shell">

      <div className="business-location-map-hint">
        <span className="business-location-map-hint-dot" />

        نشانگر را روی محل دقیق کسب‌وکارتان قرار دهید
      </div>


      <MapContainer
        center={position}
        zoom={initialZoom}
        zoomControl={false}
        scrollWheelZoom={true}
        className="business-location-map"
      >

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />


                <CityViewportController cityId={cityId} cityCenter={cityCenter} hasSavedLocation={hasSavedLocation} />

        <ZoomControl
          position="bottomright"
        />


        <MapClickHandler
          onLocationChange={
            onLocationChange
          }
        />


        <CurrentLocationButton
          onLocationChange={
            onLocationChange
          }
        />


        {savedPosition && (
          <Marker
            position={savedPosition}
            icon={markerIcon}
            draggable={true}
            eventHandlers={{
              dragend(event) {
                const marker = event.target as L.Marker;
                const next = marker.getLatLng();

                onLocationChange(
                  Number(next.lat.toFixed(7)),
                  Number(next.lng.toFixed(7))
                );
              },
            }}
          />
        )}

      </MapContainer>


      <div className="business-location-map-overlay">

        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <circle
            cx="12"
            cy="10"
            r="2.5"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>

        <span>
          نقطه دقیق کسب‌وکار را انتخاب کنید
        </span>

      </div>

    </div>
  );
}