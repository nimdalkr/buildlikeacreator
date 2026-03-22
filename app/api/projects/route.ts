import { NextResponse } from "next/server";
import { getCreators, getProjects } from "@/lib/catalog";

export async function GET() {
  const [projects, creators] = await Promise.all([getProjects(), getCreators()]);
  const payload = projects.map((project) => ({
    ...project,
    creator: creators.find((creator) => creator.id === project.creatorId)
  }));

  return NextResponse.json({
    items: payload,
    total: payload.length
  });
}
