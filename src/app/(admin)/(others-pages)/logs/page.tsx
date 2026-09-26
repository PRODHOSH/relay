"use client";

import React, { useState, useEffect } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import { toast } from "react-hot-toast";
import { Activity, Mail, FileText, Settings, RefreshCw, Server } from "lucide-react";

export default function LogsPage() {
  const [activeTab, setActiveTab] = useState<"emails" | "system">("emails");
  const [emailLogs, setEmailLogs] = useState<any[]>([]);
  const [systemLogs, setSystemLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/logs');
      if (response.ok) {
        const data = await response.json();
        setEmailLogs(data.emailLogs || []);
        setSystemLogs(data.systemLogs || []);
      } else {
        toast.error("Failed to load logs");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while fetching logs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent": return <Badge size="sm" color="success">Sent</Badge>;
      case "pending": return <Badge size="sm" color="warning">Pending</Badge>;
      case "failed": return <Badge size="sm" color="error">Failed</Badge>;
      default: return <Badge size="sm" color="primary">{status}</Badge>;
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes("email") || action.includes("campaign")) return <Mail size={16} className="text-brand-500" />;
    if (action.includes("pdf") || action.includes("template")) return <FileText size={16} className="text-blue-500" />;
    if (action.includes("settings") || action.includes("config")) return <Settings size={16} className="text-gray-500" />;
    return <Server size={16} className="text-gray-400" />;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <PageBreadcrumb pageTitle="System Logs & Dispatch History" />
        <button 
          onClick={fetchLogs} 
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 transition"
        >
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>
      
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800 dark:bg-gray-900/50">
        <div className="flex border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setActiveTab("emails")}
            className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              activeTab === "emails" 
                ? "text-brand-600 border-b-2 border-brand-500 bg-brand-50/50 dark:text-brand-400 dark:border-brand-500 dark:bg-brand-500/10" 
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50"
            }`}
          >
            <Mail size={18} />
            Email Dispatch Logs
          </button>
          <button
            onClick={() => setActiveTab("system")}
            className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              activeTab === "system" 
                ? "text-brand-600 border-b-2 border-brand-500 bg-brand-50/50 dark:text-brand-400 dark:border-brand-500 dark:bg-brand-500/10" 
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50"
            }`}
          >
            <Activity size={18} />
            System & Event Logs
          </button>
        </div>

        <div className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4 animate-pulse">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg dark:border-gray-800">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded"></div>
                      <div className="h-3 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
                    </div>
                  </div>
                  <div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                </div>
              ))}
            </div>
          ) : activeTab === "emails" ? (
            emailLogs.length === 0 ? (
              <div className="p-12 text-center text-gray-500">No emails have been queued or sent yet.</div>
            ) : (
              <div className="max-w-full overflow-x-auto">
                <Table>
                  <TableHeader className="border-y border-gray-100 dark:border-gray-800">
                    <TableRow>
                      <TableCell isHeader className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Date/Time</TableCell>
                      <TableCell isHeader className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Recipient</TableCell>
                      <TableCell isHeader className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Subject</TableCell>
                      <TableCell isHeader className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Status</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {emailLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                          {new Date(log.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell className="py-3 text-theme-sm font-medium text-gray-800 dark:text-gray-200">
                          {log.toEmail}
                        </TableCell>
                        <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400 max-w-[300px] truncate">
                          {log.subject}
                        </TableCell>
                        <TableCell className="py-3">
                          {getStatusBadge(log.status)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )
          ) : (
            systemLogs.length === 0 ? (
              <div className="p-12 text-center text-gray-500">No system events recorded yet.</div>
            ) : (
              <div className="max-w-full overflow-x-auto">
                <Table>
                  <TableHeader className="border-y border-gray-100 dark:border-gray-800">
                    <TableRow>
                      <TableCell isHeader className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 w-48">Date/Time</TableCell>
                      <TableCell isHeader className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 w-48">Action</TableCell>
                      <TableCell isHeader className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Details</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {systemLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                          {new Date(log.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell className="py-3 text-theme-sm font-medium text-gray-800 dark:text-gray-200">
                          <div className="flex items-center gap-2">
                            {getActionIcon(log.action.toLowerCase())}
                            {log.action}
                          </div>
                        </TableCell>
                        <TableCell className="py-3 text-theme-sm font-mono text-gray-500 dark:text-gray-400 truncate max-w-md">
                          {log.details || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
