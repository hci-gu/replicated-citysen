import { create } from "zustand";
import { UrlState } from "@/lib/useUrlState";

export interface MapUiState extends UrlState {
  selectedIncidentId?: string;
  detailsOpen: boolean;
  basemap: "light" | "dark";
}

interface MapStore extends MapUiState {
  setState: (state: Partial<MapUiState>) => void;
  toggleLayer: (layer: string) => void;
  setSelectedIncident: (id: string | undefined) => void;
}

export const useMapStore = create<MapStore>((set, get) => ({
  detailsOpen: false,
  basemap: "light",
  setState: (state) => set(state),
  toggleLayer: (layer) => {
    const layers = new Set(get().layers ?? []);
    if (layers.has(layer)) {
      layers.delete(layer);
    } else {
      layers.add(layer);
    }
    set({ layers: Array.from(layers) });
  },
  setSelectedIncident: (id) => set({ selectedIncidentId: id, detailsOpen: !!id })
}));
