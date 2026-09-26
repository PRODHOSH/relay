import React from "react";
import Link from "next/link";
import { FolderTree, Trash2, Edit3, Plus } from "lucide-react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Badge from "@/components/ui/badge/Badge";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Button from "@/components/ui/button/Button";

export default async function ProjectsDashboard() {
  const session = await getServerSession(authOptions);
  
  
  if (!session?.user?.email) {
    redirect(`/signin`);
  }

  // Fetch real projects from DB
  const existingProjects = await prisma.project.findMany({
    where: {
      user: {
        email: session.user.email
      }
    },
    include: {
      emails: true
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });

  const getTypeName = (type: string) => {
    switch (type) {
      case "dynamic-pdf": return "Dynamic PDF Generator";
      case "static-pdf": return "Static PDF Distribution";
      case "html-email": return "HTML/Markdown Emails";
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageBreadcrumb pageTitle="All Campaigns" />
        <Link href={`/campaigns/new`}>
          <Button className="gap-2">
            <Plus size={18} />
            New Campaign
          </Button>
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-4 pb-3 sm:px-6 dark:border-gray-800 dark:bg-white/5">
        <div className="max-w-full overflow-x-auto">
          {existingProjects.length === 0 ? (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
              <FolderTree className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
              <p>No projects found. Create one above to get started!</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="border-y border-gray-100 dark:border-gray-800">
                <TableRow>
                  <TableCell isHeader className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Project Name</TableCell>
                  <TableCell isHeader className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Type</TableCell>
                  <TableCell isHeader className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Status</TableCell>
                  <TableCell isHeader className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Analytics</TableCell>
                  <TableCell isHeader className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Last Modified</TableCell>
                  <TableCell isHeader className="py-3 text-end text-theme-xs font-medium text-gray-500 dark:text-gray-400">Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                {existingProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="py-3">
                      <Link href={`/campaigns/${project.id}`} className="text-theme-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 underline-offset-2 hover:underline">
                        {project.name}
                      </Link>
                    </TableCell>
                    <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      {getTypeName(project.type)}
                    </TableCell>
                    <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      <Badge
                        size="sm"
                        color={
                          project.status === "Active"
                            ? "success"
                            : project.status === "Completed"
                              ? "primary"
                              : "warning"
                        }
                      >
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      {project.emails && project.emails.length > 0 ? (
                        <div className="flex flex-col gap-1 text-xs">
                          <span className="text-gray-600 dark:text-gray-400">Sent: {project.emails.filter((e: any) => e.status === 'sent').length}/{project.emails.length}</span>
                          <span className="text-brand-600 dark:text-brand-400 font-medium">Opened: {Math.round((project.emails.filter((e: any) => e.openedAt).length / project.emails.filter((e: any) => e.status === 'sent').length) * 100 || 0)}%</span>
                          <span className="text-success-600 dark:text-success-500 font-medium">Clicked: {Math.round((project.emails.filter((e: any) => e.clickedAt).length / project.emails.filter((e: any) => e.status === 'sent').length) * 100 || 0)}%</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">No data</span>
                      )}
                    </TableCell>
                    <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      {project.updatedAt.toLocaleDateString()}
                    </TableCell>
                    <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      <div className="flex justify-end gap-2">
                        <Link href={`/campaigns/${project.id}/edit`} className="p-2 text-gray-500 hover:text-brand-500 transition-colors">
                          <Edit3 size={18} />
                        </Link>
                        <button className="p-2 text-gray-500 hover:text-error-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
