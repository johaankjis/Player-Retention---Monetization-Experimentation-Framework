import { NextResponse } from "next/server"
import { mockExperiments } from "@/lib/mock-data"

export async function GET() {
  return NextResponse.json(mockExperiments)
}
