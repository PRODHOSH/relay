import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { latexTemplate, variables } = body;

    if (!latexTemplate) {
      return NextResponse.json({ error: "Missing latexTemplate" }, { status: 400 });
    }

    const response = await fetch("http://localhost:5050/generate-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ latexTemplate, variables: variables || {} })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: "Failed to compile LaTeX", details: errorText }, { status: response.status });
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=preview.pdf"
      }
    });

  } catch (error: any) {
    console.error("Preview PDF Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
