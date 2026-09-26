import React from "react";
import Link from "next/link";
import { FolderTree, FileCode2, Mail, Image as ImageIcon, Send, Clock, Users, ArrowRight, Settings, Library } from "lucide-react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function EcommerceDashboard() {
  const session = await getServerSession(authOptions);
  
  
  if (!session?.user?.email) {
    redirect(`/signin`);
  }

  // Fetch some stats from DB for the dashboard
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true }
  });

  if (!user) {
    redirect(`/signin`);
  }

  const [totalEmailsSent, pendingEmails, totalAudiences] = await Promise.all([
    prisma.emailQueue.count({
      where: { userId: user.id, status: 'sent' }
    }),
    prisma.emailQueue.count({
      where: { userId: user.id, status: 'pending' }
    }),
    prisma.audienceList.count({
      where: { userId: user.id }
    })
  ]);

  const quickLinks = [
    {
      id: "campaigns",
      name: "Campaigns",
      description: "Manage and launch your email and PDF generation campaigns.",
      icon: <Send className="size-6 text-gray-800 dark:text-white/90" />,
      href: `/campaigns`
    },
    {
      id: "audience",
      name: "Audience Lists",
      description: "Manage your contacts, import CSVs, and view subscriber details.",
      icon: <Users className="size-6 text-gray-800 dark:text-white/90" />,
      href: `/audience`
    },
    {
      id: "templates",
      name: "Templates Studio",
      description: "Design HTML, Markdown, and LaTeX templates with dynamic variables.",
      icon: <FileCode2 className="size-6 text-gray-800 dark:text-white/90" />,
      href: `/templates`
    },
    {
      id: "pdf-library",
      name: "PDF Library",
      description: "Access, download, and manage all your generated LaTeX PDFs.",
      icon: <Library className="size-6 text-gray-800 dark:text-white/90" />,
      href: `/pdf-library`
    },
    {
      id: "settings",
      name: "Settings & Config",
      description: "Configure SMTP, manage your profile, and update application settings.",
      icon: <Settings className="size-6 text-gray-800 dark:text-white/90" />,
      href: `/settings`
    }
  ];

  const stats = [
    {
      label: "Total Emails Sent",
      value: totalEmailsSent.toString(),
      icon: <Send className="text-brand-500" size={24} />,
      bg: "bg-brand-50 dark:bg-brand-500/10"
    },
    {
      label: "Pending in Queue",
      value: pendingEmails.toString(),
      icon: <Clock className="text-warning-500" size={24} />,
      bg: "bg-warning-50 dark:bg-warning-500/10"
    },
    {
      label: "Audience Lists",
      value: totalAudiences.toString(),
      icon: <Users className="text-success-500" size={24} />,
      bg: "bg-success-50 dark:bg-success-500/10"
    }
  ];

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Dashboard" />
      
      <div className="flex items-center gap-5 rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/3">
        {session?.user?.image ? (
          <img src={session.user.image} alt={session.user.name || "User"} referrerPolicy="no-referrer" className="h-16 w-16 rounded-full object-cover shadow-sm" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-2xl font-bold text-brand-600 dark:bg-brand-500/20 dark:text-brand-400">
            {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
          </div>
        )}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white/90">
            Welcome back, {session?.user?.name?.split(" ")[0] || "User"}!
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Here is an overview of your active projects and campaigns.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
            <div className={`flex h-14 w-14 items-center justify-center rounded-full ${stat.bg}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
              <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4 mt-2">
          Quick Navigation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickLinks.map((link) => (
            <Link href={link.href} key={link.id} className="block group relative h-full">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              <div className="relative rounded-2xl border border-gray-200 bg-white p-6 md:p-8 dark:border-gray-700/50 dark:bg-gray-800/80 hover:border-brand-300 dark:hover:border-brand-500/50 shadow-sm hover:shadow-md transition-all h-full flex flex-col backdrop-blur-sm z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400 group-hover:scale-110 transition-transform">
                    {link.icon}
                  </div>
                  <ArrowRight size={20} className="text-gray-300 dark:text-gray-600 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
                </div>
                <div className="flex-1 mt-2">
                  <h4 className="text-lg font-bold text-gray-800 dark:text-white/90 mb-3 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {link.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {link.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
