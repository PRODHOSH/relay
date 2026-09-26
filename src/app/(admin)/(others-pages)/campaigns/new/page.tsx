"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Editor from "@monaco-editor/react";
import { marked } from "marked";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { Mail, Code2, Send, ArrowRight, ArrowLeft, Users, FileText, CheckCircle2, FileJson, ShieldAlert, FileOutput, Plus, Trash2, Upload, File as FileIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getTemplates } from "@/app/(admin)/(others-pages)/templates/actions";
import { getAudienceLists } from "@/app/(admin)/(others-pages)/audience/actions";

// -- TYPES --
type AttachmentType = "dynamic_latex" | "static_latex" | "upload";

interface Attachment {
  id: string;
  type: AttachmentType;
  name: string;
  content: string; // Latex code if applicable
  file: File | null; // Uploaded file if applicable
}

const WIZARD_STORAGE_KEY = "relay_campaign_wizard_draft";

export default function NewCampaignWizard() {
  const { data: session } = useSession();
  const router = useRouter();
  
  // -- WIZARD STATE --
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [launchProgress, setLaunchProgress] = useState(-1);
  const [isRestored, setIsRestored] = useState(false);

  const [availableTemplates, setAvailableTemplates] = useState<any[]>([]);
  const [availableAudiences, setAvailableAudiences] = useState<any[]>([]);

  useEffect(() => {
    getTemplates().then(setAvailableTemplates).catch(console.error);
    getAudienceLists().then(setAvailableAudiences).catch(console.error);
  }, []);

  // -- STEP 1: Configuration --
  const [campaignName, setCampaignName] = useState("");
  const [emailFormat, setEmailFormat] = useState<"html" | "markdown" | "plain">("html");
  
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [enablePassword, setEnablePassword] = useState(false);
  const [passwordField, setPasswordField] = useState("");

  const addAttachment = (type: AttachmentType) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newAtt: Attachment = {
      id,
      type,
      name: type === "upload" ? "Uploaded PDF" : type === "dynamic_latex" ? "Dynamic PDF" : "Static PDF",
      content: type.includes("latex") ? "\\documentclass{article}\n\\begin{document}\n\nHello World!\n\n\\end{document}" : "",
      file: null,
    };
    setAttachments([...attachments, newAtt]);
  };

  const updateAttachment = (id: string, updates: Partial<Attachment>) => {
    setAttachments(attachments.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const removeAttachment = (id: string) => {
    setAttachments(attachments.filter(a => a.id !== id));
    if (activeEditorId === id) setActiveEditorId("email");
  };

  // -- STEP 2: Audience --
  const [csvText, setCsvText] = useState("name,email,role,offer_date\nAlice,alice@example.com,Developer,2026-10-01\nBob,bob@example.com,Designer,2026-10-05");
  
  const parsedCsv = useMemo(() => {
    try {
      const lines = csvText.trim().split('\n');
      if (lines.length === 0) return { headers: [], rows: [] };
      const headers = lines[0].split(',').map(h => h.trim().replace(/['"]/g, ''));
      const rows = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/['"]/g, ''));
        const obj: any = {};
        headers.forEach((h, i) => { obj[h] = values[i] || ''; });
        return obj;
      });
      return { headers, rows };
    } catch(e) {
      return { headers: [], rows: [] };
    }
  }, [csvText]);

  // -- STEP 3: Content --
  const [emailSubject, setEmailSubject] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");

  const [emailCode, setEmailCode] = useState(`<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f5; padding: 40px;">
  <div style="max-w-2xl margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
    <h1 style="color: #18181b; font-size: 24px; margin-bottom: 20px;">Welcome to Relay, {{name}}! 👋</h1>
    <p style="color: #52525b; font-size: 16px; line-height: 1.6;">We're thrilled to have you on board. You can now start sending personalized PDFs and Emails at scale.</p>
  </div>
</body>
</html>`);

  const [activeEditorId, setActiveEditorId] = useState<string>("email"); 
  const [splitRatio, setSplitRatio] = useState(50);
  
  // -- STEP 4 Options --
  const [savePdfsLocally, setSavePdfsLocally] = useState(false);

  // -- PERSISTENCE LOGIC --
  useEffect(() => {
    const draft = localStorage.getItem(WIZARD_STORAGE_KEY);
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.campaignName) setCampaignName(parsed.campaignName);
        if (parsed.emailFormat) setEmailFormat(parsed.emailFormat);
        if (parsed.attachments) setAttachments(parsed.attachments);
        if (parsed.enablePassword) setEnablePassword(parsed.enablePassword);
        if (parsed.passwordField) setPasswordField(parsed.passwordField);
        if (parsed.csvText) setCsvText(parsed.csvText);
        if (parsed.emailSubject) setEmailSubject(parsed.emailSubject);
        if (parsed.senderName) setSenderName(parsed.senderName);
        if (parsed.senderEmail) setSenderEmail(parsed.senderEmail);
        if (parsed.emailCode) setEmailCode(parsed.emailCode);
        if (parsed.savePdfsLocally !== undefined) setSavePdfsLocally(parsed.savePdfsLocally);
        toast.success("Draft restored from previous session", { id: "draft-restore", icon: '📝' });
      } catch(e) {
        console.error("Failed to parse draft", e);
      }
    }
    setIsRestored(true);
  }, []);

  useEffect(() => {
    if (!isRestored) return;
    const draft = {
      campaignName,
      emailFormat,
      // Omit File objects from attachments to prevent stringify errors
      attachments: attachments.map(a => ({ ...a, file: null })),
      enablePassword,
      passwordField,
      csvText,
      emailSubject,
      senderName,
      senderEmail,
      emailCode,
      savePdfsLocally
    };
    localStorage.setItem(WIZARD_STORAGE_KEY, JSON.stringify(draft));
  }, [campaignName, emailFormat, attachments, enablePassword, passwordField, csvText, emailSubject, senderName, senderEmail, emailCode, savePdfsLocally, isRestored]);

  const clearDraft = () => {
    localStorage.removeItem(WIZARD_STORAGE_KEY);
  }

  // -- FETCH DEFAULTS FROM SETTINGS --
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.settings) {
          const { senderName: sName, name, resendFrom, smtpUser, email, emailProvider } = data.settings;
          const defaultName = sName || name || "";
          const defaultEmail = emailProvider === 'resend' ? (resendFrom || email) : (smtpUser || email);
          
          setSenderName(prev => prev || defaultName || "");
          setSenderEmail(prev => prev || defaultEmail || "");
        }
      })
      .catch(console.error);
  }, []);

  const renderEmailPreview = () => {
    let preview = emailCode;
    if (parsedCsv.rows.length > 0) {
      const firstRow = parsedCsv.rows[0];
      parsedCsv.headers.forEach(h => {
        const regex = new RegExp("\\{\\{\\s*" + h + "\\s*\\}\\}", 'g');
        preview = preview.replace(regex, firstRow[h] || '');
      });
    }
    if (emailFormat === "markdown") return marked.parse(preview) as string;
    return preview;
  };

  const hasDynamicAttachments = attachments.some(a => a.type === "dynamic_latex");

  // -- PREVIEW PDF --
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  useEffect(() => {
    setPdfPreviewUrl(null);
  }, [activeEditorId]);

  const handlePreviewPdf = async (att: Attachment) => {
    if (parsedCsv.rows.length === 0) return toast.error("No audience data to preview with");
    if (!att.content) return toast.error("LaTeX content is empty");
    
    setIsPreviewLoading(true);
    try {
      const res = await fetch('/api/latex-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latexTemplate: att.content,
          variables: parsedCsv.rows[0],
          projectId: "preview"
        })
      });
      
      if (!res.ok) {
        const errorText = await res.json().catch(() => ({}));
        throw new Error(errorText.error || "Failed to generate preview");
      }
      
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setPdfPreviewUrl(url);
    } catch (err: any) {
      toast.error(err.message || "Preview failed");
      setPdfPreviewUrl(null);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  // -- HANDLERS --
  const handleLaunch = async () => {
    if (!campaignName) return toast.error("Campaign Name is required");
    if (parsedCsv.rows.length === 0) return toast.error("Audience data is empty");
    if (!emailSubject) return toast.error("Email Subject is required");
    if (!senderName) return toast.error("From Name is required");
    if (!senderEmail) return toast.error("From Email is required");
    
    setIsSubmitting(true);
    setLaunchProgress(0);

    const progressInterval = setInterval(() => {
      setLaunchProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.floor(Math.random() * 15) + 5; 
      });
    }, 400);
    
    try {
      const formData = new FormData();
      
      const payload = {
        campaignName,
        emailFormat,
        enablePassword,
        passwordField,
        emailSubject,
        senderName,
        senderEmail,
        emailCode,
        savePdfsLocally,
        audience: parsedCsv.rows,
        attachments: attachments.map(a => ({ id: a.id, type: a.type, name: a.name, content: a.content }))
      };
      
      formData.append("payload", JSON.stringify(payload));
      
      attachments.forEach(att => {
        if (att.type === 'upload' && att.file) {
          formData.append(`file_${att.id}`, att.file);
        }
      });

      const resLaunch = await fetch('/api/campaigns/launch', {
        method: 'POST',
        body: formData
      });
      
      const dataLaunch = await resLaunch.json();

      if(!resLaunch.ok) throw new Error(dataLaunch.error || "Failed to launch campaign");
      
      clearInterval(progressInterval);
      setLaunchProgress(100);
      toast.success("Campaign queued successfully!");

    } catch(err: any) {
      clearInterval(progressInterval);
      setLaunchProgress(-1);
      setIsSubmitting(false);
      toast.error(err.message || "An error occurred");
    } 
  };

  const activeAttachment = attachments.find(a => a.id === activeEditorId);

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-h-screen">
      
      {/* LOADING OVERLAY */}
      {launchProgress >= 0 && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
            <div className="w-24 h-24 mb-6 relative flex items-center justify-center">
              {launchProgress < 100 ? (
                <>
                  <svg className="animate-spin absolute h-full w-full text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="font-bold text-gray-700 dark:text-gray-200 text-lg z-10">{launchProgress}%</span>
                </>
              ) : (
                <div className="w-full h-full bg-green-500 text-white rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                  <CheckCircle2 size={48} />
                </div>
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
              {launchProgress === 100 ? "Sent Successfully!" : "Launching Campaign..."}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center text-sm">
              {launchProgress === 100 ? "Campaign has been queued successfully." : "Generating PDFs and queuing emails. Please don't close this window."}
            </p>
            {launchProgress === 100 && (
              <div className="mt-6 flex gap-3 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Button variant="outline" className="flex-1" onClick={() => { setLaunchProgress(-1); clearDraft(); router.push('/campaigns'); }}>
                  Close
                </Button>
                <Button className="flex-1 bg-brand-600 hover:bg-brand-700 text-white" onClick={() => { setLaunchProgress(-1); clearDraft(); router.push('/logs'); }}>
                  View Logs
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <PageBreadcrumb pageTitle="Campaign Wizard" />
        <div className="flex items-center bg-white dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          {["Configuration", "Audience", "Content", "Launch"].map((label, index) => {
            const s = index + 1;
            const isActive = step === s;
            const isCompleted = step > s;
            return (
              <button 
                key={s} 
                onClick={() => setStep(s)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive ? 'bg-brand-500 text-white shadow-sm' : 
                  isCompleted ? 'text-brand-600 dark:text-brand-400 hover:bg-gray-50 dark:hover:bg-gray-700/50' : 
                  'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                {isCompleted ? <CheckCircle2 size={16} /> : <span className="w-4 h-4 flex items-center justify-center rounded-full bg-current opacity-20 text-[10px]">{s}</span>}
                {label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden flex flex-col relative">
        <div className="flex-1 overflow-hidden relative">
          
          {/* STEP 1 */}
          {step === 1 && (
            <div className="h-full overflow-y-auto p-6 md:p-10 custom-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="max-w-4xl mx-auto space-y-10">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-800 dark:text-white/90">Campaign Blueprint</h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">Let's start with the basic configuration of your campaign.</p>
                </div>

                <div>
                  <Label className="text-lg">Campaign Name</Label>
                  <Input 
                    placeholder="e.g. Q4 Offer Letters" 
                    value={campaignName} 
                    onChange={(e) => setCampaignName(e.target.value)} 
                    className="mt-2 text-lg py-3"
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-lg">Email Body Format</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div onClick={() => setEmailFormat('html')} className={`cursor-pointer border-2 rounded-xl p-5 transition-all ${emailFormat === 'html' ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}>
                      <Code2 className={`mb-3 ${emailFormat === 'html' ? 'text-brand-500' : 'text-gray-400'}`} size={28} />
                      <h4 className="font-semibold text-gray-800 dark:text-white">HTML / Markdown</h4>
                      <p className="text-sm text-gray-500 mt-1">Rich text, buttons, and custom branding.</p>
                    </div>
                    <div onClick={() => setEmailFormat('plain')} className={`cursor-pointer border-2 rounded-xl p-5 transition-all ${emailFormat === 'plain' ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}>
                      <FileText className={`mb-3 ${emailFormat === 'plain' ? 'text-brand-500' : 'text-gray-400'}`} size={28} />
                      <h4 className="font-semibold text-gray-800 dark:text-white">Plain Text</h4>
                      <p className="text-sm text-gray-500 mt-1">Simple, high-deliverability text emails.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg mb-0">Attachments (PDFs)</Label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => addAttachment('dynamic_latex')} className="text-xs py-1.5 h-auto">
                        <Plus size={14} className="mr-1" /> Dynamic (LaTeX)
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => addAttachment('static_latex')} className="text-xs py-1.5 h-auto">
                        <Plus size={14} className="mr-1" /> Static (LaTeX)
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => addAttachment('upload')} className="text-xs py-1.5 h-auto">
                        <Upload size={14} className="mr-1" /> Upload PDF
                      </Button>
                    </div>
                  </div>
                  
                  {attachments.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-10 flex flex-col items-center justify-center text-gray-500">
                      <FileIcon size={32} className="text-gray-400 mb-3" />
                      <p>No attachments added.</p>
                      <p className="text-sm text-gray-400 mt-1">Add a PDF attachment to include with your emails.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {attachments.map((att) => (
                        <div key={att.id} className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
                          <div className={`p-2 rounded-lg ${att.type === 'dynamic_latex' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : att.type === 'static_latex' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'}`}>
                            {att.type.includes('latex') ? <Code2 size={20} /> : <FileText size={20} />}
                          </div>
                          <div className="flex-1 flex gap-4 items-center flex-wrap">
                            <Input 
                              value={att.name} 
                              onChange={(e) => updateAttachment(att.id, { name: e.target.value })}
                              className="max-w-[200px] h-9"
                            />
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              {att.type === 'dynamic_latex' ? 'Dynamic (LaTeX)' : att.type === 'static_latex' ? 'Static (LaTeX)' : 'Uploaded PDF'}
                            </div>
                            
                            {att.type === 'upload' && (
                              <div className="flex-1 flex items-center">
                                <input 
                                  type="file" 
                                  accept="application/pdf"
                                  className="text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 dark:file:bg-brand-900/30 dark:file:text-brand-400"
                                  onChange={(e) => {
                                    if(e.target.files && e.target.files[0]) {
                                      updateAttachment(att.id, { file: e.target.files[0] });
                                    }
                                  }}
                                />
                              </div>
                            )}
                          </div>
                          <button onClick={() => removeAttachment(att.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors shrink-0">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {hasDynamicAttachments && (
                  <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 p-5 rounded-xl animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-start gap-3">
                      <ShieldAlert className="text-orange-500 mt-0.5" size={20} />
                      <div className="flex-1">
                        <h4 className="font-semibold text-orange-800 dark:text-orange-400">PDF Password Protection</h4>
                        <p className="text-sm text-orange-600 dark:text-orange-300/80 mb-3">Secure generated PDFs with a password derived from your CSV data.</p>
                        
                        <label className="flex items-center gap-2 cursor-pointer mb-3">
                          <input type="checkbox" checked={enablePassword} onChange={e => setEnablePassword(e.target.checked)} className="rounded text-brand-500 focus:ring-brand-500" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Enable 256-bit AES Encryption</span>
                        </label>

                        {enablePassword && (
                          <Input 
                            placeholder="CSV Column Name (e.g. dob or phone)" 
                            value={passwordField}
                            onChange={e => setPasswordField(e.target.value)}
                            className="bg-white dark:bg-gray-900 border-orange-200 dark:border-orange-700 focus:border-brand-500"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="h-full flex flex-col p-6 md:p-10 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="max-w-4xl mx-auto w-full h-full flex flex-col space-y-6">
                <div className="text-center shrink-0">
                  <h2 className="text-3xl font-bold text-gray-800 dark:text-white/90">Define Audience</h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">Paste your CSV data below or upload a file. We automatically extract headers to use as variables.</p>
                  <div className="mt-4 flex justify-center">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-brand-50 hover:bg-brand-100 dark:bg-brand-500/10 dark:hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 font-medium rounded-lg transition-colors text-sm shadow-sm">
                      <Upload size={16} />
                      Upload CSV File
                      <input 
                        type="file" 
                        accept=".csv" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (evt) => {
                              const text = evt.target?.result as string;
                              setCsvText(text);
                            };
                            reader.readAsText(file);
                          }
                          e.target.value = '';
                        }} 
                      />
                    </label>
                    {availableAudiences.length > 0 && (
                      <select 
                        className="ml-4 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        onChange={(e) => {
                          const listId = e.target.value;
                          if (!listId) return;
                          const list = availableAudiences.find(a => a.id === listId);
                          if (!list || !list.contacts) return;
                          
                          const allKeys = new Set(["email", "firstName", "lastName"]);
                          list.contacts.forEach((c: any) => {
                            if (c.metadata) {
                              try { Object.keys(JSON.parse(c.metadata)).forEach(k => allKeys.add(k)); } catch(e){}
                            }
                          });
                          const headers = Array.from(allKeys);
                          const rows = list.contacts.map((c: any) => {
                            let meta: any = {};
                            try { meta = JSON.parse(c.metadata || "{}"); } catch(e){}
                            return headers.map(h => {
                              if (h === 'email') return c.email;
                              if (h === 'firstName') return c.firstName || '';
                              if (h === 'lastName') return c.lastName || '';
                              return meta[h] || '';
                            }).join(",");
                          });
                          setCsvText([headers.join(","), ...rows].join("\n"));
                          toast.success(`Imported ${list.contacts.length} contacts from ${list.name}`);
                          e.target.value = "";
                        }}
                      >
                        <option value="">Load existing Audience...</option>
                        {availableAudiences.map(a => (
                          <option key={a.id} value={a.id}>{a.name} ({a.contacts.length} contacts)</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                <div className="flex-1 min-h-0 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden focus-within:border-brand-500 transition-colors shadow-inner flex flex-col relative">
                  <div className="absolute inset-0">
                    <Editor
                      height="100%"
                      language="csv"
                      theme="vs-dark"
                      value={csvText}
                      onChange={(v) => setCsvText(v || "")}
                      options={{ minimap: { enabled: false }, padding: { top: 16 } }}
                    />
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-100 dark:border-gray-800 shrink-0">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <FileJson size={18} className="text-brand-500" />
                    Detected Variables ({parsedCsv.headers.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {parsedCsv.headers.map(h => (
                      <span key={h} className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-3 py-1 rounded-full text-xs font-mono text-brand-600 dark:text-brand-400 shadow-sm">
                        {`{{${h}}}`}
                      </span>
                    ))}
                    {parsedCsv.headers.length === 0 && <span className="text-sm text-gray-500">No valid headers detected.</span>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="px-6 md:px-10 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex flex-wrap gap-4 items-center justify-between shrink-0">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">Content Studio</h2>
                  <p className="text-xs text-gray-500 mt-1">Design your email and attachments.</p>
                </div>
                {availableTemplates.length > 0 && (
                  <select 
                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 max-w-[300px] truncate"
                    onChange={(e) => {
                      const templateId = e.target.value;
                      if (!templateId) return;
                      const template = availableTemplates.find(t => t.id === templateId);
                      if (!template) return;
                      
                      if (activeEditorId === "email") {
                        if (template.format === "latex") {
                           toast.error("Cannot load LaTeX template into email body.");
                        } else {
                           setEmailCode(template.content);
                           setEmailFormat(template.format as any);
                           toast.success(`Loaded HTML/MD template: ${template.name}`);
                        }
                      } else {
                        if (template.format !== "latex") {
                           toast.error("Cannot load HTML/MD template into PDF attachment.");
                        } else {
                           updateAttachment(activeEditorId, { content: template.content });
                           toast.success(`Loaded LaTeX template: ${template.name}`);
                        }
                      }
                      e.target.value = "";
                    }}
                  >
                    <option value="">Apply existing Template...</option>
                    {availableTemplates.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.format.toUpperCase()})</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex-1 flex overflow-hidden">
                <div style={{ width: `${splitRatio}%` }} className="flex flex-col border-r border-gray-200 dark:border-gray-800 bg-[#1e1e1e]">
                  <div className="flex overflow-x-auto bg-[#252526] border-b border-[#3c3c3c] no-scrollbar">
                    <button 
                      onClick={() => setActiveEditorId("email")}
                      className={`px-4 py-2.5 text-xs font-mono whitespace-nowrap border-r border-[#3c3c3c] flex items-center gap-2 transition-colors ${activeEditorId === "email" ? "bg-[#1e1e1e] text-blue-400 border-t-2 border-t-blue-500" : "text-gray-400 hover:bg-[#2a2d2e]"}`}
                    >
                      <Mail size={14} /> Email Body
                    </button>
                    {attachments.map(att => (
                      <button 
                        key={att.id}
                        onClick={() => setActiveEditorId(att.id)}
                        className={`px-4 py-2.5 text-xs font-mono whitespace-nowrap border-r border-[#3c3c3c] flex items-center gap-2 transition-colors ${activeEditorId === att.id ? "bg-[#1e1e1e] text-purple-400 border-t-2 border-t-purple-500" : "text-gray-400 hover:bg-[#2a2d2e]"}`}
                      >
                        {att.type.includes('latex') ? <Code2 size={14} /> : <FileText size={14} />} 
                        {att.name}
                      </button>
                    ))}
                  </div>

                  <div className="flex-1 relative">
                    {activeEditorId === "email" ? (
                      <Editor
                        height="100%"
                        language={emailFormat === 'html' ? 'html' : 'markdown'}
                        theme="vs-dark"
                        value={emailCode}
                        onChange={(v) => setEmailCode(v || "")}
                        options={{ minimap: { enabled: false }, padding: { top: 16 }, fontSize: 13 }}
                      />
                    ) : activeAttachment?.type.includes('latex') ? (
                      <Editor
                        height="100%"
                        language="latex"
                        theme="vs-dark"
                        value={activeAttachment.content}
                        onChange={(v) => updateAttachment(activeAttachment.id, { content: v || "" })}
                        options={{ minimap: { enabled: false }, padding: { top: 16 }, fontSize: 13 }}
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-400 flex-col gap-3">
                        <Upload size={32} />
                        <p>Uploaded PDF: {activeAttachment?.file?.name || "No file selected"}</p>
                        {activeAttachment?.file && <span className="text-xs opacity-70">({(activeAttachment.file.size / 1024).toFixed(1)} KB)</span>}
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-1 cursor-col-resize hover:bg-brand-500 transition-colors z-10" />

                <div style={{ width: `${100 - splitRatio}%` }} className="bg-gray-100 dark:bg-gray-900 flex flex-col overflow-hidden">
                  <div className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-xs font-mono text-gray-600 dark:text-gray-400 uppercase tracking-wider border-b border-gray-300 dark:border-gray-700 flex justify-between items-center shrink-0">
                    <span>Live Preview ({activeEditorId === "email" ? "Email" : "Attachment"})</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 lowercase">Row 1:</span>
                      <span className="text-brand-600 dark:text-brand-400 font-bold bg-white dark:bg-gray-900 px-2 py-0.5 rounded">{parsedCsv.rows[0]?.email || 'No Data'}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-4 overflow-y-auto">
                    {activeEditorId === "email" ? (
                      emailFormat === 'plain' ? (
                        <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                          {renderEmailPreview()}
                        </pre>
                      ) : (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full min-h-full overflow-hidden">
                          {emailFormat === 'html' ? (
                            <iframe srcDoc={renderEmailPreview()} className="w-full h-full min-h-[500px] border-none bg-white" />
                          ) : (
                            <div className="prose dark:prose-invert max-w-none p-6" dangerouslySetInnerHTML={{ __html: renderEmailPreview() }} />
                          )}
                        </div>
                      )
                    ) : (
                      <div className="h-full flex flex-col gap-4">
                        {activeAttachment?.type === 'upload' ? (
                          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-500 bg-gray-50 dark:bg-gray-800/30 flex-col gap-4">
                             <FileText size={48} className="text-blue-400" />
                             <p className="text-center font-medium">Uploaded PDF File</p>
                             <p className="text-sm text-gray-400 max-w-xs text-center">
                               The uploaded file will be attached as-is to all emails.
                             </p>
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-end shrink-0">
                              <Button size="sm" onClick={() => activeAttachment && handlePreviewPdf(activeAttachment)} disabled={isPreviewLoading} className="text-xs">
                                {isPreviewLoading ? "Generating..." : "Render LaTeX Preview"}
                              </Button>
                            </div>
                            <div className="flex-1 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/30 overflow-hidden relative">
                              {pdfPreviewUrl ? (
                                <iframe src={pdfPreviewUrl} className="w-full h-full border-none" />
                              ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 gap-4">
                                  <Code2 size={48} className="text-purple-400" />
                                  <p className="text-center font-medium">PDF Compilation Preview</p>
                                  <p className="text-sm text-gray-400 max-w-xs text-center">
                                    Click "Render LaTeX Preview" to compile and view the first row's document.
                                  </p>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="h-full overflow-y-auto p-6 md:p-10 animate-in fade-in zoom-in-95 duration-500 custom-scrollbar">
              <div className="max-w-2xl mx-auto space-y-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-brand-50 dark:bg-brand-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileOutput className="text-brand-500" size={40} />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 dark:text-white/90">Ready to Launch</h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">Review your campaign details before queuing.</p>
                </div>

                <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-5">
                  <h3 className="font-bold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 mb-2 flex items-center gap-2">
                    <Mail size={18} className="text-brand-500" /> Sending Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm">From Name</Label>
                      <Input placeholder="e.g. John Doe" value={senderName} onChange={e => setSenderName(e.target.value)} className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-sm">From Email Address</Label>
                      <Input placeholder="e.g. john@company.com" value={senderEmail} onChange={e => setSenderEmail(e.target.value)} className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm">Email Subject Line</Label>
                    <Input placeholder="e.g. Welcome to the Team!" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} className="mt-1" />
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/30 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
                  <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Campaign Name</span>
                    <span className="font-semibold text-gray-800 dark:text-white">{campaignName || '—'}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Audience Size</span>
                    <span className="font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 px-3 py-1 rounded-full">{parsedCsv.rows.length} recipients</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Email Format</span>
                    <span className="font-semibold text-gray-800 dark:text-white uppercase">{emailFormat}</span>
                  </div>
                  <div className="flex flex-col py-3 border-b border-gray-200 dark:border-gray-700 gap-2">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Attachments ({attachments.length})</span>
                    {attachments.length > 0 ? (
                      <div className="space-y-2 mt-1">
                        {attachments.map(att => (
                          <div key={att.id} className="flex items-center gap-2 text-sm bg-white dark:bg-gray-800 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
                            {att.type.includes('latex') ? <Code2 size={14} className="text-purple-500" /> : <FileText size={14} className="text-blue-500" />}
                            <span className="font-medium">{att.name}</span>
                            <span className="text-gray-400 ml-auto text-xs">{att.type === 'upload' ? 'Upload' : att.type === 'static_latex' ? 'Static LaTeX' : 'Dynamic LaTeX'}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm italic">No attachments added</span>
                    )}
                  </div>
                  {hasDynamicAttachments && (
                    <>
                      <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col">
                          <span className="text-gray-800 dark:text-white font-medium text-sm">Save PDFs Locally</span>
                          <span className="text-xs text-gray-500">Store a copy of all generated dynamic PDFs on your server disk</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={savePdfsLocally} onChange={(e) => setSavePdfsLocally(e.target.checked)} className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-500"></div>
                        </label>
                      </div>
                      <div className="flex justify-between py-3">
                        <span className="text-gray-500 dark:text-gray-400 font-medium">PDF Security</span>
                        <span className={`font-semibold px-3 py-1 rounded-full text-xs ${enablePassword ? 'text-success-700 bg-success-50 dark:bg-success-500/10' : 'text-gray-500 bg-gray-100 dark:bg-gray-700'}`}>
                          {enablePassword ? `Encrypted (${passwordField})` : 'Unencrypted'}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* BOTTOM NAVIGATION BAR */}
        <div className="p-4 md:p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center shrink-0 z-20">
          <Button 
            variant="outline" 
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1 || isSubmitting}
            className="w-32"
          >
            <ArrowLeft size={18} className="mr-2" /> Back
          </Button>
          
          <div className="hidden md:flex gap-2 text-sm text-gray-400 font-medium">
            Step {step} of 4
          </div>

          {step < 4 ? (
            <Button 
              onClick={() => {
                if(step === 1 && !campaignName) return toast.error("Please enter a campaign name");
                setStep(step + 1);
              }}
              className="w-32"
            >
              Next <ArrowRight size={18} className="ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleLaunch} 
              disabled={isSubmitting}
              className="w-40 bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/30"
            >
              {isSubmitting ? "Queueing..." : "Launch Campaign"} <Send size={18} className="ml-2" />
            </Button>
          )}
        </div>

      </div>
    </div>
  );
}
