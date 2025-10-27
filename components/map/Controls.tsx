"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { useMapStore } from "@/lib/store/mapStore";
import { useMapInstance } from "@/components/map/MapContext";
import { LocateFixed, Moon, Sun, Flame } from "lucide-react";

export function Controls() {
  const map = useMapInstance();
  const { basemap, toggleLayer, layers, setState } = useMapStore((state) => ({
    basemap: state.basemap,
    toggleLayer: state.toggleLayer,
    layers: state.layers ?? [],
    setState: state.setState
  }));
  const [locating, setLocating] = useState(false);

  const handleGeolocate = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: [number, number] = [position.coords.longitude, position.coords.latitude];
        map.flyTo({ center: coords, zoom: Math.max(map.getZoom(), 13) });
        setState({ bbox: map.getBounds().toArray().flat().join(",") });
        setLocating(false);
      },
      () => setLocating(false)
    );
  };

  const heatmapEnabled = layers.includes("heatmap");

  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-background/90 p-3 shadow-lg">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium">Basemap</span>
        <div className="flex items-center gap-2">
          <Button
            variant={basemap === "light" ? "default" : "outline"}
            size="sm"
            onClick={() => setState({ basemap: "light" })}
          >
            <Sun className="mr-1 h-4 w-4" /> Light
          </Button>
          <Button
            variant={basemap === "dark" ? "default" : "outline"}
            size="sm"
            onClick={() => setState({ basemap: "dark" })}
          >
            <Moon className="mr-1 h-4 w-4" /> Dark
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Layers</span>
        <Toggle pressed={heatmapEnabled} onPressedChange={() => toggleLayer("heatmap")}
          className="gap-1">
          <Flame className="h-4 w-4" /> Heatmap
        </Toggle>
      </div>
      <Button onClick={handleGeolocate} disabled={locating} size="sm">
        <LocateFixed className="mr-2 h-4 w-4" />
        {locating ? "Locating…" : "Use my location"}
      </Button>
    </div>
  );
}
