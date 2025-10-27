"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useMapStore } from "@/lib/store/mapStore";
import { fetchIncident } from "@/lib/api";
import { BadgeCheck, ExternalLink } from "lucide-react";

export function DetailsDrawer() {
  const { selectedIncidentId, detailsOpen, setSelectedIncident } = useMapStore((state) => ({
    selectedIncidentId: state.selectedIncidentId,
    detailsOpen: state.detailsOpen,
    setSelectedIncident: state.setSelectedIncident
  }));

  const { data } = useQuery({
    queryKey: ["incident", selectedIncidentId],
    queryFn: () => fetchIncident(selectedIncidentId ?? ""),
    enabled: Boolean(selectedIncidentId)
  });

  return (
    <Sheet open={detailsOpen} onOpenChange={(open) => !open && setSelectedIncident(undefined)}>
      <SheetContent side="right" className="w-full max-w-lg overflow-y-auto">
        {data ? (
          <div className="space-y-6">
            <SheetHeader>
              <SheetTitle>{data.title}</SheetTitle>
              <SheetDescription className="flex flex-wrap items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium">
                  <BadgeCheck className="h-3 w-3" /> {data.category?.name}
                </span>
                <span>{new Date(data.occurredAt).toLocaleString()}</span>
                <span>Severity {data.severity}</span>
              </SheetDescription>
            </SheetHeader>
            {data.description && <p className="text-sm leading-relaxed text-muted-foreground">{data.description}</p>}
            {Array.isArray(data.media) && data.media.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold uppercase text-muted-foreground">Media</h3>
                <div className="grid grid-cols-2 gap-3">
                  {data.media.map((url: string) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative block h-32 w-full overflow-hidden rounded-md"
                    >
                      <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs text-white opacity-0 transition group-hover:opacity-100">
                        View
                      </span>
                      <Image
                        src={url}
                        alt="Incident media"
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover"
                        unoptimized
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
            {data.sourceUrl && (
              <a
                href={data.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary"
              >
                View source <ExternalLink className="h-4 w-4" />
              </a>
            )}
            {data.geom?.geometry?.coordinates && (
              <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
                Location: {data.geom.geometry.coordinates[1].toFixed(4)}, {data.geom.geometry.coordinates[0].toFixed(4)}
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Select an incident to view details.</p>
        )}
      </SheetContent>
    </Sheet>
  );
}
