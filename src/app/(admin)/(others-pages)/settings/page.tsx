"use client";

import React, { useState, useEffect } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { toast } from "react-hot-toast";
import { Save, User, Mail, Server, Key } from "lucide-react";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [settings, setSettings] = useState({
    name: "",
    email: "",
    image: "",
    emailProvider: "smtp",
    smtpHost: "",
    smtpPort: "",
    smtpUser: "",
    smtpPass: "",
    resendKey: "",
    resendFrom: "",
    senderName: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          if (data.settings) {
            setSettings({
              ...data.settings,
              smtpPort: data.settings.smtpPort?.toString() || ""
            });
          }
        }
      } catch (error) {
        toast.error("Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      
      if (response.ok) {
        toast.success("Settings saved successfully!");
      } else {
        toast.error("Failed to save settings");
      }
    } catch (error) {
      toast.error("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto pb-10 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-md mb-6"></div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm h-48 dark:border-gray-800 dark:bg-white/5">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="flex-1 space-y-4">
              <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-800 rounded"></div>
              <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-800 rounded"></div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm h-64 dark:border-gray-800 dark:bg-white/5">
          <div className="h-6 w-1/4 bg-gray-200 dark:bg-gray-800 rounded mb-6"></div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <PageBreadcrumb pageTitle="Account & System Settings" />
      
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Profile Settings */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/3">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
            <User className="text-brand-500" size={20} />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Profile Information</h3>
          </div>
          
          <div className="flex items-start gap-6">
            {settings.image ? (
              <img src={settings.image} alt="Profile" className="h-20 w-20 rounded-full object-cover shadow-sm" />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-3xl font-bold text-brand-600 dark:bg-brand-500/20 dark:text-brand-400">
                {settings.name ? settings.name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label>Display Name</Label>
                <Input type="text" name="name" value={settings.name || ""} onChange={handleChange} />
              </div>
              <div>
                <Label>Account Email</Label>
                <Input type="email" value={settings.email || ""} disabled className="bg-gray-50 dark:bg-gray-800/50" />
                <p className="mt-1 text-xs text-gray-500">Managed via NextAuth / Google</p>
              </div>
            </div>
          </div>
        </div>

        {/* Email Provider Configuration */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/3">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
            <Mail className="text-brand-500" size={20} />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Email Delivery Provider</h3>
          </div>
          
          <div className="mb-6">
            <Label className="mb-3 block">Active Provider</Label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="emailProvider"
                  value="resend" 
                  checked={settings.emailProvider === "resend"} 
                  onChange={handleChange} 
                  className="w-4 h-4 text-brand-500 border-gray-300 focus:ring-brand-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Resend API (Recommended)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="emailProvider"
                  value="smtp" 
                  checked={settings.emailProvider === "smtp"} 
                  onChange={handleChange} 
                  className="w-4 h-4 text-brand-500 border-gray-300 focus:ring-brand-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Custom SMTP (Nodemailer)</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
             <div>
                <Label>Default Sender Name</Label>
                <Input type="text" name="senderName" placeholder="e.g. Acme Corp" value={settings.senderName || ""} onChange={handleChange} />
              </div>
          </div>

          {settings.emailProvider === "resend" && (
            <div className="space-y-5 bg-brand-50/50 dark:bg-brand-500/5 border border-brand-100 dark:border-brand-500/10 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Key className="text-brand-500" size={16} />
                <h4 className="font-medium text-brand-700 dark:text-brand-400">Resend Configuration</h4>
              </div>
              <div className="grid grid-cols-1 gap-5">
                <div>
                  <Label>Resend API Key</Label>
                  <Input type="password" name="resendKey" placeholder="re_xxxxxxxxxxxxxx" value={settings.resendKey || ""} onChange={handleChange} />
                </div>
                <div>
                  <Label>Verified "From" Domain/Email</Label>
                  <Input type="text" name="resendFrom" placeholder="updates@yourdomain.com" value={settings.resendFrom || ""} onChange={handleChange} />
                  <p className="mt-1 text-xs text-gray-500">Must be a verified domain in your Resend dashboard.</p>
                </div>
              </div>
            </div>
          )}

          {settings.emailProvider === "smtp" && (
            <div className="space-y-5 bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Server className="text-gray-500" size={16} />
                <h4 className="font-medium text-gray-700 dark:text-gray-300">SMTP Server Configuration</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Label>SMTP Host</Label>
                  <Input type="text" name="smtpHost" placeholder="smtp.gmail.com" value={settings.smtpHost || ""} onChange={handleChange} />
                </div>
                <div>
                  <Label>SMTP Port</Label>
                  <Input type="number" name="smtpPort" placeholder="587" value={settings.smtpPort || ""} onChange={handleChange} />
                </div>
                <div>
                  <Label>SMTP Username / Email</Label>
                  <Input type="text" name="smtpUser" placeholder="you@gmail.com" value={settings.smtpUser || ""} onChange={handleChange} />
                </div>
                <div>
                  <Label>SMTP Password / App Password</Label>
                  <Input type="password" name="smtpPass" placeholder="********" value={settings.smtpPass || ""} onChange={handleChange} />
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end pt-4">
          <Button type="submit" className="gap-2 px-8" disabled={isSaving}>
            <Save size={18} />
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
