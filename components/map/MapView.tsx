"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapContext } from "@/components/map/MapContext";
import { useMapStore } from "@/lib/store/mapStore";
import { Controls } from "@/components/map/Controls";
import { IncidentLayer } from "@/components/map/IncidentLayer";
import { HeatmapLayer } from "@/components/map/HeatmapLayer";
import { Search } from "@/components/map/Search";

export default function MapView() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const basemap = useMapStore((state) => state.basemap);
  const setState = useMapStore((state) => state.setState);
  const maptilerKey = process.env.NEXT_PUBLIC_MAPTILER_KEY ?? "GET_YOUR_KEY";
  const lightStyle = `https://api.maptiler.com/maps/streets/style.json?key=${maptilerKey}`;
  const darkStyle = `https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${maptilerKey}`;

  useEffect(() => {
    if (containerRef.current && !map) {
      const instance = new maplibregl.Map({
        container: containerRef.current,
        style: basemap === "dark" ? darkStyle : lightStyle,
        center: [11.97, 57.7],
        zoom: 11
      });

      instance.addControl(new maplibregl.NavigationControl(), "top-right");

      instance.on("load", () => {
        const bounds = instance.getBounds().toArray().flat().join(",");
        setState({ bbox: bounds, zoom: instance.getZoom() });
      });

      instance.on("moveend", () => {
        const bounds = instance.getBounds().toArray().flat().join(",");
        setState({
          bbox: bounds,
          zoom: instance.getZoom()
        });
      });

      setMap(instance);
      return () => {
        instance.remove();
        setMap(null);
      };
    }
  }, [basemap, darkStyle, lightStyle, map, setState]);

  useEffect(() => {
    if (map) {
      const style = basemap === "dark" ? darkStyle : lightStyle;
      map.setStyle(style);
    }
  }, [basemap, darkStyle, lightStyle, map]);

  return (
    <MapContext.Provider value={map}>
      <div ref={containerRef} className="absolute inset-0" />
      {map && (
        <>
          <div className="pointer-events-none absolute inset-0">
            <div className="pointer-events-auto absolute left-4 top-4 flex max-w-md flex-col gap-3">
              <Search />
              <Controls />
            </div>
          </div>
          <IncidentLayer />
          <HeatmapLayer />
        </>
      )}
    </MapContext.Provider>
  );
}
