"use client";

import { createContext, useContext } from "react";
import type maplibregl from "maplibre-gl";

export const MapContext = createContext<maplibregl.Map | null>(null);

export function useMapInstance() {
  const map = useContext(MapContext);
  if (!map) {
    throw new Error("Map instance not available");
  }
  return map;
}
