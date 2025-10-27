import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Live incident feeds",
    description: "Monitor verified reports across the city with severity-aware filters."
  },
  {
    title: "Spatial analytics",
    description: "Heatmaps, clusters, and timeline tools make it easy to explore trends."
  },
  {
    title: "Collaborative workflows",
    description: "Bookmark, share, and automate alerts for the areas you care about most."
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="mx-auto flex max-w-6xl flex-col gap-12 px-6 pb-24 pt-16 text-center">
        <div className="space-y-6">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">Urban intelligence reimagined</span>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
            Understand your city in real time with CitySen
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            CitySen brings together incidents, sensors, and civic data in a unified spatial dashboard for operations teams, journalists, and engaged residents.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/map">Open App</Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href="#features">Explore features</Link>
            </Button>
          </div>
        </div>
        <div className="overflow-hidden rounded-3xl border bg-white shadow-lg">
          <Image
            src="/hero-placeholder.svg"
            alt="CitySen map preview"
            width={1200}
            height={720}
            className="h-auto w-full"
            priority
          />
        </div>
      </header>
      <main id="features" className="mx-auto max-w-6xl space-y-12 px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
