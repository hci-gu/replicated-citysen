import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminCategoriesPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin");
  }

  let categories: Awaited<ReturnType<typeof prisma.category.findMany>> = [];
  let loadError = false;

  try {
    categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  } catch (error) {
    console.error("Failed to load categories:", error);
    loadError = true;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {loadError ? (
        <div className="col-span-full rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          Unable to load categories. Check the database connection and try again.
        </div>
      ) : (
        categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
                {category.name}
              </CardTitle>
              <CardDescription>Slug: {category.slug}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Icon: {category.icon}</span>
              <span>ID: {category.id}</span>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
