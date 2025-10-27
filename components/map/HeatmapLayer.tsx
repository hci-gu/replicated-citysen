"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { GeoJSONSource } from "maplibre-gl";
import { useMapInstance } from "@/components/map/MapContext";
import { useMapStore } from "@/lib/store/mapStore";

const HEATMAP_SOURCE_ID = "incident-heatmap";
const HEATMAP_LAYER_ID = "incident-heatmap-layer";

async function fetchHeatmap(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (!value) return;
    search.set(key, String(value));
  });
  const res = await fetch(`/api/stats/heatmap?${search.toString()}`);
  if (!res.ok) {
    throw new Error("Failed to load heatmap");
  }
  return res.json() as Promise<{ points: { coordinates: [number, number]; weight: number }[] }>;
}

export function HeatmapLayer() {
  const map = useMapInstance();
  const { layers, tStart, tEnd } = useMapStore((state) => ({
    layers: state.layers ?? [],
    tStart: state.tStart,
    tEnd: state.tEnd
  }));
  const enabled = layers.includes("heatmap");

  const { data } = useQuery({
    queryKey: ["heatmap", { tStart, tEnd }],
    queryFn: () => fetchHeatmap({ timeStart: tStart, timeEnd: tEnd }),
    enabled
  });

  useEffect(() => {
    if (!map || !enabled) return;

    const addHeatmap = () => {
      if (!map.getSource(HEATMAP_SOURCE_ID)) {
        map.addSource(HEATMAP_SOURCE_ID, {
          type: "geojson",
          data: { type: "FeatureCollection", features: [] }
        });
      }

      if (!map.getLayer(HEATMAP_LAYER_ID)) {
        map.addLayer({
          id: HEATMAP_LAYER_ID,
          type: "heatmap",
          source: HEATMAP_SOURCE_ID,
          maxzoom: 15,
          paint: {
            "heatmap-weight": ["get", "weight"],
            "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 0.5, 15, 1.5],
            "heatmap-color": [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              0,
              "rgba(33,102,172,0)",
              0.2,
              "rgb(103,169,207)",
              0.4,
              "rgb(209,229,240)",
              0.6,
              "rgb(253,219,199)",
              0.8,
              "rgb(239,138,98)",
              1,
              "rgb(178,24,43)"
            ],
            "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 10, 15, 40],
            "heatmap-opacity": 0.6
          }
        });
      }
    };

    addHeatmap();
    map.on("styledata", addHeatmap);

    return () => {
      map.off("styledata", addHeatmap);
    };
  }, [map, enabled]);

  useEffect(() => {
    if (!map || !data || !enabled) return;
    const source = map.getSource(HEATMAP_SOURCE_ID) as GeoJSONSource | undefined;
    const collection = {
      type: "FeatureCollection" as const,
      features: data.points.map((point) => ({
        type: "Feature" as const,
        geometry: {
          type: "Point" as const,
          coordinates: point.coordinates
        },
        properties: { weight: point.weight }
      }))
    };

    if (source) {
      source.setData(collection as any);
    }
  }, [map, data, enabled]);

  useEffect(() => {
    if (!map || enabled) return;
    if (map.getLayer(HEATMAP_LAYER_ID)) {
      map.removeLayer(HEATMAP_LAYER_ID);
    }
    if (map.getSource(HEATMAP_SOURCE_ID)) {
      map.removeSource(HEATMAP_SOURCE_ID);
    }
  }, [map, enabled]);

  return null;
}
