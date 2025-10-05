"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getGIBSTileUrl, type GIBSLayer } from "@/lib/gibs-layers";

interface NASAMapProps {
  selectedLayer: GIBSLayer;
  selectedDate: Date;
  onMapClick?: (lat: number, lng: number) => void;
  annotations?: Array<{ id: string; lat: number; lng: number; title: string }>;
  compareLayer?: GIBSLayer | null;
  compareDate?: Date;
  splitView?: boolean;
}

// Custom tile layer for GIBS which uses {z}/{y}/{x} instead of Leaflet's default {z}/{x}/{y}
const GIBSTileLayer = L.TileLayer.extend({
  getTileUrl: function (coords: L.Coords) {
    const url = (this as any)._url
      .replace("{z}", coords.z)
      .replace("{y}", coords.y)
      .replace("{x}", coords.x);
    return url;
  },
});

export default function NASAMap({
  selectedLayer,
  selectedDate,
  onMapClick,
  annotations = [],
  compareLayer,
  compareDate,
  splitView = false,
}: NASAMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const currentTileLayer = useRef<L.TileLayer | null>(null);
  const compareTileLayer = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const sideBySideRef = useRef<L.Control | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    // Initialize map
    const map = L.map(mapContainer.current, {
      center: [20, 0],
      zoom: 3,
      maxZoom: 9,
      minZoom: 2,
      worldCopyJump: true,
    });

    mapInstance.current = map;

    // Add click handler
    if (onMapClick) {
      map.on("click", (e) => {
        onMapClick(e.latlng.lat, e.latlng.lng);
      });
    }

    // Add scale control
    L.control.scale({ imperial: false, metric: true }).addTo(map);

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [onMapClick]);

  // Update main tile layer
  useEffect(() => {
    if (!mapInstance.current) return;

    const tileUrl = getGIBSTileUrl(selectedLayer, selectedDate);

    if (currentTileLayer.current) {
      currentTileLayer.current.remove();
    }

    if (sideBySideRef.current && !splitView) {
      sideBySideRef.current.remove();
      sideBySideRef.current = null;
    }

    const newLayer = new GIBSTileLayer(tileUrl, {
      attribution: "NASA GIBS / EOSDIS",
      maxZoom: 9,
      minZoom: 1,
      tileSize: 256,
      noWrap: false,
      crossOrigin: true,
    });

    if (!splitView && mapInstance.current) {
      newLayer.addTo(mapInstance.current);
    }
    currentTileLayer.current = newLayer;
  }, [selectedLayer, selectedDate, splitView]);

  // Update compare layer for split view
  useEffect(() => {
    if (!mapInstance.current || !splitView || !compareLayer) {
      if (compareTileLayer.current) {
        compareTileLayer.current.remove();
        compareTileLayer.current = null;
      }
      if (sideBySideRef.current) {
        sideBySideRef.current.remove();
        sideBySideRef.current = null;
      }
      if (currentTileLayer.current && !splitView && mapInstance.current) {
        currentTileLayer.current.addTo(mapInstance.current);
      }
      return;
    }

    const compareTileUrl = getGIBSTileUrl(
      compareLayer,
      compareDate || selectedDate
    );

    if (compareTileLayer.current) {
      compareTileLayer.current.remove();
    }

    const newCompareLayer = new GIBSTileLayer(compareTileUrl, {
      attribution: "NASA GIBS / EOSDIS",
      maxZoom: 9,
      minZoom: 1,
      tileSize: 256,
      noWrap: false,
      crossOrigin: true,
    });

    compareTileLayer.current = newCompareLayer;

    // Use side-by-side plugin if available
    // For now, we'll use a simple opacity overlay
    if (currentTileLayer.current && mapInstance.current) {
      currentTileLayer.current.addTo(mapInstance.current);
      currentTileLayer.current.setOpacity(0.5);
    }
    if (mapInstance.current) {
      newCompareLayer.addTo(mapInstance.current);
      newCompareLayer.setOpacity(0.5);
    }
  }, [compareLayer, compareDate, selectedDate, splitView]);

  // Update markers for annotations
  useEffect(() => {
    if (!mapInstance.current) return;

    // Remove existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    annotations.forEach((annotation) => {
      const marker = L.marker([annotation.lat, annotation.lng], {
        icon: L.divIcon({
          className: "custom-annotation-marker",
          html: '<div style="background-color: #3b82f6; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        }),
      }).addTo(mapInstance.current!);

      marker.bindPopup(`<strong>${annotation.title}</strong>`);
      markersRef.current.push(marker);
    });
  }, [annotations]);

  return (
    <div className="relative w-full h-full z-0">
      <div ref={mapContainer} className="w-full h-full z-0" />
      <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-950/90 px-3 py-2 rounded-lg shadow-lg text-xs backdrop-blur-sm z-10">
        <div className="font-semibold">{selectedLayer.name}</div>
        <div className="text-gray-600 dark:text-gray-400">
          {selectedDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>
    </div>
  );
}
