"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Virtuoso } from "react-virtuoso";
import { fetchCategories, fetchIncidents } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useMapStore } from "@/lib/store/mapStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function Sidebar() {
  const { q, severity, categories, tStart, tEnd, setState } = useMapStore((state) => ({
    q: state.q ?? "",
    severity: state.severity ?? [1, 5],
    categories: state.categories ?? [],
    tStart: state.tStart,
    tEnd: state.tEnd,
    setState: state.setState
  }));
  const bbox = useMapStore((state) => state.bbox);
  const setSelectedIncident = useMapStore((state) => state.setSelectedIncident);

  const params = useMemo(
    () => ({
      bbox,
      q,
      severityMin: severity[0],
      severityMax: severity[1],
      categories: categories.join(","),
      timeStart: tStart,
      timeEnd: tEnd
    }),
    [bbox, q, severity, categories, tStart, tEnd]
  );

  const { data: incidentData } = useQuery({
    queryKey: ["incidents", params],
    queryFn: () => fetchIncidents(params)
  });

  const { data: categoryData } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: Infinity
  });

  const toggleCategory = (id: string) => {
    const set = new Set(categories);
    if (set.has(id)) {
      set.delete(id);
    } else {
      set.add(id);
    }
    setState({ categories: Array.from(set) });
  };

  const handleSeverityChange = (value: number[]) => {
    setState({ severity: [value[0], value[1]] as [number, number] });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-4 border-b p-4">
        <Input
          value={q}
          onChange={(event) => setState({ q: event.target.value })}
          placeholder="Filter incidents"
        />
        <div className="space-y-2">
          <div className="text-sm font-medium">Time window</div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "24h", hours: 24 },
              { label: "7d", hours: 24 * 7 },
              { label: "30d", hours: 24 * 30 }
            ].map((preset) => {
              const windowStart = new Date(Date.now() - preset.hours * 3600 * 1000);
              const active =
                tStart && tEnd
                  ? Math.abs(new Date(tEnd).getTime() - new Date(tStart).getTime() - preset.hours * 3600 * 1000) < 60 * 1000
                  : false;
              return (
                <Button
                  type="button"
                  key={preset.label}
                  size="sm"
                  variant={active ? "default" : "outline"}
                  onClick={() =>
                    setState({
                      tStart: windowStart.toISOString(),
                      tEnd: new Date().toISOString()
                    })
                  }
                >
                  {preset.label}
                </Button>
              );
            })}
            <Button type="button" size="sm" variant={!tStart && !tEnd ? "default" : "outline"} onClick={() => setState({ tStart: undefined, tEnd: undefined })}>
              Any time
            </Button>
          </div>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium">Severity</span>
            <span className="text-muted-foreground">{severity[0]} – {severity[1]}</span>
          </div>
          <Slider
            value={severity as unknown as number[]}
            min={1}
            max={5}
            step={1}
            onValueChange={handleSeverityChange}
          />
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium">Categories</div>
          <div className="flex flex-wrap gap-2">
            {categoryData?.map((category: any) => {
              const active = categories.includes(category.id);
              return (
                <Button
                  type="button"
                  key={category.id}
                  size="sm"
                  variant={active ? "default" : "outline"}
                  onClick={() => toggleCategory(category.id)}
                >
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: category.color }} />
                  <span className="ml-2">{category.name}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="list" className="h-full">
          <TabsList className="m-4">
            <TabsTrigger value="list">Results</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="h-[calc(100%-4rem)] overflow-hidden">
            <Virtuoso
              data={incidentData?.items ?? []}
              className="h-full"
              itemContent={(_, incident) => (
                <div className="px-4 pb-2">
                  <button
                    className="w-full rounded-lg border bg-card p-4 text-left shadow-sm transition hover:border-primary"
                    onClick={() => setSelectedIncident(incident.id)}
                  >
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{new Date(incident.occurredAt).toLocaleString()}</span>
                      <span className="font-medium">Severity {incident.severity}</span>
                    </div>
                    <h3 className="mt-2 text-base font-semibold">{incident.title}</h3>
                    <p className="text-sm text-muted-foreground">{incident.category?.name}</p>
                  </button>
                </div>
              )}
            />
          </TabsContent>
          <TabsContent value="timeline" className="p-4 text-sm text-muted-foreground">
            Drag the timeline slider to scrub through recent activity. (Coming soon)
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
