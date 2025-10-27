import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminIncidentsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin");
  }

  const incidents = await prisma.incident.findMany({
    take: 20,
    orderBy: { reportedAt: "desc" },
    include: { category: true }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Incidents</h2>
        <Link href="/admin/incidents/import" className="text-sm text-primary">
          Import CSV/GeoJSON (coming soon)
        </Link>
      </div>
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Title</th>
              <th className="px-4 py-2 text-left font-medium">Category</th>
              <th className="px-4 py-2 text-left font-medium">Severity</th>
              <th className="px-4 py-2 text-left font-medium">Status</th>
              <th className="px-4 py-2 text-left font-medium">Occurred</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {incidents.map((incident) => (
              <tr key={incident.id}>
                <td className="px-4 py-2 font-medium">{incident.title}</td>
                <td className="px-4 py-2">{incident.category.name}</td>
                <td className="px-4 py-2">{incident.severity}</td>
                <td className="px-4 py-2 capitalize">{incident.status.toLowerCase()}</td>
                <td className="px-4 py-2">{incident.occurredAt.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
