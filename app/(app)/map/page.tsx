import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Sidebar } from "@/components/panels/Sidebar";
import { DetailsDrawer } from "@/components/panels/DetailsDrawer";
import { MapLayout } from "@/components/map/MapLayout";

const MapView = dynamic(() => import("@/components/map/MapView"), { ssr: false });

export default function MapPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">Loading map…</div>}>
      <MapLayout>
        <aside className="relative z-20 h-full w-full max-w-md border-r bg-background">
          <Sidebar />
        </aside>
        <main className="relative flex-1">
          <Suspense fallback={<div className="absolute inset-0 flex items-center justify-center">Loading map…</div>}>
            <MapView />
          </Suspense>
          <DetailsDrawer />
        </main>
      </MapLayout>
    </Suspense>
  );
}
