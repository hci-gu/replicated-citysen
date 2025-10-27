"use client";

import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMapInstance } from "@/components/map/MapContext";

export function Search() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const map = useMapInstance();

  const handleSearch = async (event: FormEvent) => {
    event.preventDefault();
    if (!query) return;
    setLoading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_MAPTILER_KEY ?? "";
      const res = await fetch(`https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=${apiKey}`);
      if (res.ok) {
        const data = await res.json();
        const feature = data.features?.[0];
        if (feature) {
          const [lon, lat] = feature.center;
          map.flyTo({ center: [lon, lat], zoom: Math.max(map.getZoom(), 13) });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center gap-2">
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search for an address"
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Searching…" : "Search"}
      </Button>
    </form>
  );
}
