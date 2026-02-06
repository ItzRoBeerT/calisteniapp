
import RoadmapBuilderClient from "@/components/roadmaps/RoadmapBuilderClient";
import { notFound } from "next/navigation";

export default function Page() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }
  return <RoadmapBuilderClient />;
}
