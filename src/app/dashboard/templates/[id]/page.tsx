import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import TemplateEditor from "./TemplateEditor";

export default async function TemplatePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/");

  const user = await prisma.user.findUnique({ where: { email: session.user.email }});
  const template = await prisma.template.findFirst({
    where: { id: params.id, userId: user!.id }
  });

  if (!template) {
    redirect("/dashboard/templates");
  }

  return (
    <div className="p-6 h-full">
      <TemplateEditor 
        id={template.id} 
        initialName={template.name} 
        initialContent={template.content}
        initialFormat={template.format}
      />
    </div>
  );
}
