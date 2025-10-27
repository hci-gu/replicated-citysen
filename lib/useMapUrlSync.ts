import { useShallow } from "zustand/react/shallow";
"use client";

import { useEffect } from "react";
import { useUrlState } from "@/lib/useUrlState";
import { useMapStore } from "@/lib/store/mapStore";

export function useMapUrlSync() {
  const { read, write } = useUrlState();
  const setState = useMapStore((state) => state.setState);
  const storeState = useMapStore(
    useShallow((state) => ({
      bbox: state.bbox,
      zoom: state.zoom,
      q: state.q,
      layers: state.layers,
      tStart: state.tStart,
      tEnd: state.tEnd,
      categories: state.categories,
      severity: state.severity
    }))
  );

  useEffect(() => {
    const initial = read();
    setState(initial);
  }, [read, setState]);

  useEffect(() => {
    write(storeState);
  }, [storeState, write]);
}
