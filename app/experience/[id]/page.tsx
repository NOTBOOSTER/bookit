import { notFound } from "next/navigation";
import ExperienceDetails from "@/app/components/experience/ExperienceDetails";

async function getExperienceDetails(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/experiences?id=${id}`, {
    cache: "no-store",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await getExperienceDetails(id);

  if (!data) {
    notFound();
  }

  return <ExperienceDetails experience={data.experience} slots={data.slots} />;
}
