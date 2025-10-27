"use client";

import { useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export type UrlState = {
  bbox?: string;
  zoom?: number;
  q?: string;
  layers?: string[];
  tStart?: string;
  tEnd?: string;
  categories?: string[];
  severity?: [number, number];
};

const keys: (keyof UrlState)[] = ["bbox", "zoom", "q", "layers", "tStart", "tEnd", "categories", "severity"];

export function useUrlState() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const read = useCallback((): UrlState => {
    const params = new URLSearchParams(searchParams.toString());
    const state: UrlState = {};
    keys.forEach((key) => {
      const value = params.get(key as string);
      if (!value) return;
      if (key === "layers" || key === "categories") {
        state[key] = value.split(",");
      } else if (key === "severity") {
        const [min, max] = value.split(",").map(Number);
        state.severity = [min ?? 1, max ?? 5];
      } else if (key === "zoom") {
        state.zoom = Number(value);
      } else {
        (state as Record<string, unknown>)[key] = value;
      }
    });
    return state;
  }, [searchParams]);

  const write = useCallback(
    (nextState: Partial<UrlState>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(nextState).forEach(([key, value]) => {
        if (!value || (Array.isArray(value) && value.length === 0)) {
          params.delete(key);
          return;
        }
        if (Array.isArray(value)) {
          params.set(key, value.join(","));
        } else {
          params.set(key, String(value));
        }
      });
      router.replace(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  const hydrateFromUrl = useCallback(() => {
    // reading triggers hydration
    read();
  }, [read]);

  return { read, write, hydrateFromUrl };
}
