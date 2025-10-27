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

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {categories.map((category) => (
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
      ))}
    </div>
  );
}
