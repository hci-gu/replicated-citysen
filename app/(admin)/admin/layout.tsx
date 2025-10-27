import { ReactNode } from "react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-6 py-12">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Admin</p>
        <h1 className="text-3xl font-bold">CitySen Control Center</h1>
        <p className="text-muted-foreground">Manage incidents, categories, and data sources.</p>
      </header>
      {children}
    </div>
  );
}
