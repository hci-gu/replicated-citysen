export interface IncidentFeature {
  id: string;
  title: string;
  description?: string;
  categoryId: string;
  severity: number;
  occurredAt: string;
  reportedAt: string;
  geom: any;
  category: {
    id: string;
    name: string;
    color: string;
    icon: string;
  };
}

export interface IncidentListResponse {
  items: IncidentFeature[];
  nextCursor: string | null;
  totalApprox: number | null;
}

export async function fetchIncidents(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    search.set(key, String(value));
  });
  const res = await fetch(`/api/incidents?${search.toString()}`);
  if (!res.ok) {
    throw new Error("Failed to load incidents");
  }
  return (await res.json()) as IncidentListResponse;
}

export async function fetchIncident(id: string) {
  const res = await fetch(`/api/incidents/${id}`);
  if (!res.ok) {
    throw new Error("Failed to load incident");
  }
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch(`/api/categories`);
  if (!res.ok) {
    throw new Error("Failed to load categories");
  }
  return res.json();
}
