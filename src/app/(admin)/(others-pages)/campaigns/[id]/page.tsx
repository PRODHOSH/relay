import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Badge from "@/components/ui/badge/Badge";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Mail, CheckCircle2, XCircle, Clock, Eye, MousePointerClick } from "lucide-react";

export default async function CampaignAnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect(`/signin`);
  }

  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      emails: {
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });

  if (!project) {
    redirect('/campaigns');
  }

  const emails = project.emails;
  const total = emails.length;
  const sent = emails.filter(e => e.status === 'sent').length;
  const failed = emails.filter(e => e.status === 'failed').length;
  const pending = emails.filter(e => e.status === 'pending').length;
  const opened = emails.filter(e => e.openedAt).length;

  const sentPercentage = total > 0 ? Math.round((sent / total) * 100) : 0;
  const openPercentage = sent > 0 ? Math.round((opened / sent) * 100) : 0;

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle={`${project.name} Analytics`} />

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/5 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Recipients</p>
              <h3 className="mt-2 text-3xl font-bold text-gray-800 dark:text-white/90">{total}</h3>
            </div>
            <div className="p-3 bg-brand-50 dark:bg-brand-500/10 rounded-xl">
              <Mail className="text-brand-500" size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/5 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Successfully Sent</p>
              <h3 className="mt-2 text-3xl font-bold text-success-600 dark:text-success-400">{sent}</h3>
              <p className="text-xs text-gray-400 mt-1">{sentPercentage}% completion</p>
            </div>
            <div className="p-3 bg-success-50 dark:bg-success-500/10 rounded-xl">
              <CheckCircle2 className="text-success-500" size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/5 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Unique Opens</p>
              <h3 className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">{opened}</h3>
              <p className="text-xs text-gray-400 mt-1">{openPercentage}% open rate</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
              <Eye className="text-blue-500" size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/5 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Failed / Pending</p>
              <h3 className="mt-2 text-3xl font-bold text-gray-800 dark:text-white/90">
                <span className="text-error-500">{failed}</span> <span className="text-gray-300">/</span> <span className="text-warning-500">{pending}</span>
              </h3>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <Clock className="text-gray-500" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/5 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Campaign Progress</h4>
        <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex">
          {total > 0 ? (
            <>
              <div style={{ width: `${(sent/total)*100}%` }} className="bg-success-500 h-full transition-all duration-500"></div>
              <div style={{ width: `${(failed/total)*100}%` }} className="bg-error-500 h-full transition-all duration-500"></div>
              <div style={{ width: `${(pending/total)*100}%` }} className="bg-warning-500 h-full transition-all duration-500"></div>
            </>
          ) : (
             <div className="w-full bg-gray-200 dark:bg-gray-700 h-full"></div>
          )}
        </div>
        <div className="flex justify-between mt-3 text-sm text-gray-500">
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-success-500"></span> Sent ({sent})</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-warning-500"></span> Pending ({pending})</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-error-500"></span> Failed ({failed})</div>
        </div>
      </div>

      {/* RECIPIENT TABLE */}
      <div className="rounded-2xl border border-gray-200 bg-white pt-4 pb-3 dark:border-gray-800 dark:bg-white/5 shadow-sm overflow-hidden">
        <div className="px-6 pb-4 border-b border-gray-100 dark:border-gray-800">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">Recipient Details</h4>
        </div>
        <div className="max-w-full overflow-x-auto px-4 sm:px-6">
          <Table>
            <TableHeader className="border-y border-gray-100 dark:border-gray-800">
              <TableRow>
                <TableCell isHeader className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Email Address</TableCell>
                <TableCell isHeader className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Subject</TableCell>
                <TableCell isHeader className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Delivery Status</TableCell>
                <TableCell isHeader className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Read Status</TableCell>
                <TableCell isHeader className="py-3 text-end text-theme-xs font-medium text-gray-500 dark:text-gray-400">Sent At</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {emails.map((email) => (
                <TableRow key={email.id}>
                  <TableCell className="py-3">
                    <p className="text-theme-sm font-medium text-gray-800 dark:text-white/90">{email.toEmail}</p>
                  </TableCell>
                  <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                    {email.subject}
                  </TableCell>
                  <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        email.status === "sent"
                          ? "success"
                          : email.status === "pending"
                            ? "warning"
                            : "error"
                      }
                    >
                      {email.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                    {email.openedAt ? (
                      <span className="flex items-center gap-1.5 text-success-600 dark:text-success-500 font-medium">
                        <Eye size={14} /> Read
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-gray-400">
                        <Eye size={14} /> Unread
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400 text-end">
                    {email.sentAt ? email.sentAt.toLocaleString() : '—'}
                  </TableCell>
                </TableRow>
              ))}
              {emails.length === 0 && (
                <TableRow>
                  <td colSpan={5} className="py-8 text-center text-gray-500 text-sm">No recipients found.</td>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

    </div>
  );
}
