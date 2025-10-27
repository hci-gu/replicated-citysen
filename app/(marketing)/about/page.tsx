import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About CitySen"
};

const paragraphs = [
  "CitySen is a civic technology initiative focused on making complex urban data accessible to the communities who need it most.",
  "We ingest a growing catalog of municipal feeds, community reports, and partner APIs to provide a holistic situational awareness platform.",
  "Our team believes transparency, accessibility, and interoperability are foundational to equitable cities."
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-16">
      <h1 className="text-4xl font-bold">About CitySen</h1>
      {paragraphs.map((content) => (
        <p key={content} className="text-lg text-muted-foreground">
          {content}
        </p>
      ))}
    </div>
  );
}
