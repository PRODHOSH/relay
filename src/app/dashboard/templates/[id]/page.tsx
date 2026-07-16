import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import TemplateEditor from "./TemplateEditor";

export default async function TemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/");

  const user = await prisma.user.findUnique({ where: { email: session.user.email }});
  const template = await prisma.template.findFirst({
    where: { id, userId: user!.id }
  });

  if (!template) {
    redirect("/dashboard/templates");
  }

  return (
    <div className="max-w-6xl mx-auto py-10 h-full">
      <TemplateEditor 
        id={template.id} 
        initialName={template.name} 
        initialContent={template.content}
        initialFormat={template.format}
        initialDesignJson={template.designJson}
      />
    </div>
  );
}
