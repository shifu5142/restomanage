"use client";

import { useEffect, useMemo } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { RESTAURANT_LOCATION } from "@/lib/delivery/locations";
import type { DeliveryOrder } from "@/types";
import "leaflet/dist/leaflet.css";

const restaurantIcon = L.divIcon({
  className: "",
  html: `<div style="display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:9999px;background:#22c55e;border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.25);font-size:18px;">🍽️</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const statusColors: Record<DeliveryOrder["status"], string> = {
  pending: "#f97316",
  picked_up: "#3b82f6",
  in_transit: "#8b5cf6",
  delivered: "#22c55e",
};

function createDeliveryIcon(status: DeliveryOrder["status"]) {
  const color = statusColors[status];

  return L.divIcon({
    className: "",
    html: `<div style="display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:9999px;background:${color};border:2px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.25);"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
}

function FitMapBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length === 0) return;
    const bounds = L.latLngBounds(positions.map(([lat, lng]) => [lat, lng]));
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 14 });
  }, [map, positions]);

  return null;
}

type DeliveryMapProps = {
  deliveries: DeliveryOrder[];
};

export function DeliveryMap({ deliveries }: DeliveryMapProps) {
  const positions = useMemo(
    () =>
      [
        [RESTAURANT_LOCATION.latitude, RESTAURANT_LOCATION.longitude] as [number, number],
        ...deliveries.map((delivery) => [delivery.latitude, delivery.longitude] as [number, number]),
      ],
    [deliveries]
  );

  const center = useMemo<[number, number]>(
    () => [RESTAURANT_LOCATION.latitude, RESTAURANT_LOCATION.longitude],
    []
  );

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom
      className="z-0 h-[400px] w-full rounded-2xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitMapBounds positions={positions} />
      <Marker
        position={[RESTAURANT_LOCATION.latitude, RESTAURANT_LOCATION.longitude]}
        icon={restaurantIcon}
      >
        <Popup>
          <div className="space-y-1 text-sm">
            <p className="font-semibold">{RESTAURANT_LOCATION.name}</p>
            <p>{RESTAURANT_LOCATION.address}</p>
          </div>
        </Popup>
      </Marker>
      {deliveries.map((delivery) => (
        <Marker
          key={delivery.id}
          position={[delivery.latitude, delivery.longitude]}
          icon={createDeliveryIcon(delivery.status)}
        >
          <Popup>
            <div className="space-y-1 text-sm">
              <p className="font-semibold">{delivery.customerName}</p>
              <p>{delivery.address}</p>
              <p className="capitalize text-muted-foreground">{delivery.status.replace("_", " ")}</p>
              {delivery.driverName && <p>Driver: {delivery.driverName}</p>}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
