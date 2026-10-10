"use client";

import {
  MapContainer,
  Marker,
  TileLayer,
  ZoomControl,
  useMap,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";

interface BusinessLocationMapProps {
  latitude: number | null;
  longitude: number | null;
  onLocationChange: (
    latitude: number,
    longitude: number
  ) => void;
}

const TEHRAN_AZADI: [number, number] = [
  35.6997,
  51.3370,
];

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
  latitude,
  longitude,
  onLocationChange,
}: BusinessLocationMapProps) {
  const hasSavedLocation =
    latitude !== null &&
    longitude !== null &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude);

  const position: [number, number] =
    hasSavedLocation
      ? [latitude, longitude]
      : TEHRAN_AZADI;

  return (
    <div className="business-location-map-shell">

      <div className="business-location-map-hint">
        <span className="business-location-map-hint-dot" />

        نشانگر را روی محل دقیق کسب‌وکارتان قرار دهید
      </div>


      <MapContainer
        center={position}
        zoom={
          hasSavedLocation
            ? 16
            : 15
        }
        zoomControl={false}
        scrollWheelZoom={true}
        className="business-location-map"
      >

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />


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


        <Marker
          position={position}
          icon={markerIcon}
          draggable={true}
          eventHandlers={{
            dragend(event) {
              const marker =
                event.target as L.Marker;

              const next =
                marker.getLatLng();

              onLocationChange(
                Number(
                  next.lat.toFixed(7)
                ),
                Number(
                  next.lng.toFixed(7)
                )
              );
            },
          }}
        />

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