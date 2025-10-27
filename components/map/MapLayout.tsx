"use client";

import { useMapUrlSync } from "@/lib/useMapUrlSync";

export function MapLayout({ children }: { children: React.ReactNode }) {
  useMapUrlSync();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col lg:flex-row">
      {children}
    </div>
  );
}
