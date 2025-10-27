"use client";

import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { GeoJSONSource, MapLayerMouseEvent } from "maplibre-gl";
import { fetchIncidents } from "@/lib/api";
import { useMapStore } from "@/lib/store/mapStore";
import { useMapInstance } from "@/components/map/MapContext";

const INCIDENT_SOURCE_ID = "incidents";
const INCIDENT_LAYER_ID = "incidents-circles";
const INCIDENT_LABEL_LAYER_ID = "incidents-labels";

export function IncidentLayer() {
  const map = useMapInstance();
  const state = useMapStore((store) => ({
    bbox: store.bbox,
    categories: store.categories,
    severity: store.severity,
    q: store.q,
    tStart: store.tStart,
    tEnd: store.tEnd
  }));
  const setSelectedIncident = useMapStore((store) => store.setSelectedIncident);

  const params = useMemo(() => ({
    bbox: state.bbox,
    categories: state.categories?.join(","),
    severityMin: state.severity?.[0],
    severityMax: state.severity?.[1],
    q: state.q,
    timeStart: state.tStart,
    timeEnd: state.tEnd
  }), [state]);

  const { data } = useQuery({
    queryKey: ["incidents", params],
    queryFn: () => fetchIncidents(params)
  });

  useEffect(() => {
    if (!map) return;

    const addLayers = () => {
      if (!map.getSource(INCIDENT_SOURCE_ID)) {
        map.addSource(INCIDENT_SOURCE_ID, {
          type: "geojson",
          data: { type: "FeatureCollection", features: [] }
        });
      }

      if (!map.getLayer(INCIDENT_LAYER_ID)) {
        map.addLayer({
          id: INCIDENT_LAYER_ID,
          type: "circle",
          source: INCIDENT_SOURCE_ID,
          paint: {
            "circle-radius": ["interpolate", ["linear"], ["get", "severity"], 1, 6, 5, 16],
            "circle-color": ["coalesce", ["get", "color"], "#0ea5e9"],
            "circle-opacity": 0.85,
            "circle-stroke-width": 1,
            "circle-stroke-color": "white"
          }
        });
      }

      if (!map.getLayer(INCIDENT_LABEL_LAYER_ID)) {
        map.addLayer({
          id: INCIDENT_LABEL_LAYER_ID,
          type: "symbol",
          source: INCIDENT_SOURCE_ID,
          layout: {
            "text-field": ["get", "title"],
            "text-size": 12,
            "text-offset": [0, 1.2],
            "text-anchor": "top"
          },
          paint: {
            "text-color": "#0f172a"
          },
          minzoom: 12
        });
      }
    };

    addLayers();
    map.on("styledata", addLayers);

    const handleClick = (event: MapLayerMouseEvent) => {
      const feature = event.features?.[0];
      if (feature?.properties?.id) {
        setSelectedIncident(feature.properties.id as string);
      }
    };

    map.on("click", INCIDENT_LAYER_ID, handleClick);

    return () => {
      map.off("styledata", addLayers);
      map.off("click", INCIDENT_LAYER_ID, handleClick);
    };
  }, [map, setSelectedIncident]);

  useEffect(() => {
    if (!map || !data) return;
    const source = map.getSource(INCIDENT_SOURCE_ID) as GeoJSONSource | undefined;
    const features = data.items.map((incident) => ({
      type: "Feature" as const,
      geometry: incident.geom.geometry ?? incident.geom,
      properties: {
        id: incident.id,
        title: incident.title,
        severity: incident.severity,
        color: incident.category?.color ?? "#0ea5e9",
        categoryName: incident.category?.name
      }
    }));
    const collection = {
      type: "FeatureCollection" as const,
      features
    };

    if (source) {
      source.setData(collection as any);
    }
  }, [map, data]);

  return null;
}
