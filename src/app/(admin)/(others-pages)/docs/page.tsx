import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { BookOpen, Rocket, FileCode2, Users, FileText, Settings, ShieldAlert, Code } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Relay - Documentation",
  description: "Comprehensive guide and documentation for Relay Platform",
};

export default function DocsPage() {
  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Documentation" />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Sidebar Nav (Sticky) */}
        <div className="xl:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/5 space-y-2 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90 px-3">
              Table of Contents
            </h3>
            <nav className="flex flex-col space-y-1">
              <a href="#introduction" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5 transition-colors">
                <Rocket size={18} className="text-brand-500" />
                Introduction
              </a>
              <a href="#templates" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5 transition-colors">
                <FileCode2 size={18} className="text-brand-500" />
                Template System
              </a>
              <a href="#audiences" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5 transition-colors">
                <Users size={18} className="text-brand-500" />
                Audience & Lists
              </a>
              <a href="#campaigns" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5 transition-colors">
                <BookOpen size={18} className="text-brand-500" />
                Campaigns
              </a>
              <a href="#pdf-library" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5 transition-colors">
                <FileText size={18} className="text-brand-500" />
                PDF Library
              </a>
              <a href="#configuration" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5 transition-colors">
                <Settings size={18} className="text-brand-500" />
                Configuration
              </a>
              <a href="#worker" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5 transition-colors">
                <Settings size={18} className="text-brand-500" />
                Background Worker
              </a>
              <a href="#api" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5 transition-colors">
                <FileCode2 size={18} className="text-brand-500" />
                API Documentation
              </a>
              <a href="#database" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5 transition-colors">
                <FileText size={18} className="text-brand-500" />
                Database Schema
              </a>
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="xl:col-span-3 space-y-6">
          {/* Section: Introduction */}
          <section id="introduction" className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 dark:border-gray-800 dark:bg-white/5 scroll-mt-24 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white/90 flex items-center gap-3">
              <Rocket className="text-brand-500" />
              Introduction to Relay
            </h2>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                Welcome to <strong>Relay</strong>, the unified platform for managing drop-in HTML email templates, dynamic PDF generation, and scalable email dispatching. Whether you are generating certificates for hundreds of event attendees or sending out customized monthly invoices, Relay provides all the tools you need in one centralized dashboard.
              </p>
              <div className="mt-6 rounded-xl bg-brand-50 p-5 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20">
                <h4 className="text-brand-700 dark:text-brand-400 font-semibold mb-2 flex items-center gap-2">
                  <ShieldAlert size={18} />
                  Core Philosophy
                </h4>
                <p className="text-brand-600/80 dark:text-brand-400/80 text-sm leading-relaxed">
                  Relay is built on the principle of separating <strong>design (Templates)</strong>, <strong>data (Audiences)</strong>, and <strong>delivery (Campaigns)</strong>. By decoupling these components, you can easily reuse templates across different campaigns and continuously iterate without breaking existing workflows.
                </p>
              </div>
            </div>
          </section>

          {/* Section: Templates */}
          <section id="templates" className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 dark:border-gray-800 dark:bg-white/5 scroll-mt-24 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white/90 flex items-center gap-3">
              <FileCode2 className="text-brand-500" />
              Template System
            </h2>
            <div className="prose prose-gray dark:prose-invert max-w-none text-gray-500 dark:text-gray-400 leading-relaxed">
              <p className="mb-4">
                The Template Editor allows you to write, preview, and save reusable designs. Relay supports three distinct syntax engines:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li><strong>HTML Engine:</strong> Write raw HTML and inline CSS. This is ideal for exact pixel-perfect control over your email designs.</li>
                <li><strong>Markdown Engine:</strong> Quickly draft text-heavy emails using standard Markdown formatting. Relay will automatically compile it to HTML during dispatch.</li>
                <li><strong>LaTeX Engine:</strong> Designed specifically for generating beautiful PDF attachments (like certificates or mathematical reports).</li>
              </ul>
              <h4 className="text-gray-800 dark:text-white/90 font-semibold mt-6 mb-3">Template Variables</h4>
              <p>
                You can inject dynamic variables into any template using the handlebars-style syntax <code>{"{{"} variable_name {"}}"}</code>. When a campaign is executed, these placeholders will be seamlessly replaced by columns in your Audience CSV.
              </p>
              <div className="mt-4 bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-300">
                <span className="text-brand-400">{"<h1>"}</span>Hello {"{{"} firstName {"}}"},<span className="text-brand-400">{"</h1>"}</span><br />
                Your total due is: <span className="text-success-400">{"{{"} totalAmount {"}}"}</span>
              </div>
            </div>
          </section>

          {/* Section: Audiences */}
          <section id="audiences" className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 dark:border-gray-800 dark:bg-white/5 scroll-mt-24 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white/90 flex items-center gap-3">
              <Users className="text-brand-500" />
              Audience & Lists
            </h2>
            <div className="prose prose-gray dark:prose-invert max-w-none text-gray-500 dark:text-gray-400 leading-relaxed">
              <p className="mb-4">
                An Audience is a collection of contacts that you intend to message. You can manage multiple audiences and attach them to different campaigns. 
              </p>
              <h4 className="text-gray-800 dark:text-white/90 font-semibold mt-6 mb-3">Uploading Data</h4>
              <p>
                Currently, Relay supports importing contacts via <strong>CSV files</strong>. The CSV file <em>must</em> contain a column named <code>email</code>. All other columns (e.g., <code>firstName</code>, <code>invoiceId</code>) are automatically parsed and made available as variables for your templates.
              </p>
            </div>
          </section>

          {/* Section: Campaigns */}
          <section id="campaigns" className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 dark:border-gray-800 dark:bg-white/5 scroll-mt-24 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white/90 flex items-center gap-3">
              <BookOpen className="text-brand-500" />
              Campaigns
            </h2>
            <div className="prose prose-gray dark:prose-invert max-w-none text-gray-500 dark:text-gray-400 leading-relaxed">
              <p className="mb-4">
                Campaigns orchestrate the entire process of matching your Audience with your Templates, compiling the final outputs, and queuing them for dispatch. We offer two primary modes of operation:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <h4 className="text-gray-800 dark:text-white/90 font-semibold mb-2">Common PDF Blast</h4>
                  <p className="text-sm">
                    Upload a single, pre-existing PDF file (or generate one from a template) and send it as an identical attachment to all users in a chosen Audience list.
                  </p>
                </div>
                <div className="rounded-xl border border-brand-200 p-5 dark:border-brand-500/30 bg-brand-50/50 dark:bg-brand-500/5">
                  <h4 className="text-brand-700 dark:text-brand-400 font-semibold mb-2 flex items-center gap-2">
                    <Code size={16} />
                    Dynamic Individual PDFs
                  </h4>
                  <p className="text-sm">
                    Generate completely unique PDFs for every user in your CSV. The engine will loop through the Audience, compile the template individually replacing all variables, and dispatch personalized emails with unique PDF attachments.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section: PDF Library */}
          <section id="pdf-library" className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 dark:border-gray-800 dark:bg-white/5 scroll-mt-24 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white/90 flex items-center gap-3">
              <FileText className="text-brand-500" />
              PDF Library
            </h2>
            <div className="prose prose-gray dark:prose-invert max-w-none text-gray-500 dark:text-gray-400 leading-relaxed">
              <p>
                The PDF Library is your central repository for all generated documents. When you run a Dynamic PDF campaign, Relay automatically compiles the documents and saves them securely. 
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-4">
                <li><strong>Inline Viewing:</strong> Click on any PDF to view it directly in the browser using the built-in Relay PDF viewer without needing to download it.</li>
                <li><strong>Batch Organization:</strong> PDFs are automatically grouped by the specific Campaign execution batch, ensuring you can always trace a document back to its dispatch event.</li>
              </ul>
            </div>
          </section>

          {/* Section: Configuration */}
          <section id="configuration" className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 dark:border-gray-800 dark:bg-white/5 scroll-mt-24 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white/90 flex items-center gap-3">
              <Settings className="text-brand-500" />
              System Configuration
            </h2>
            <div className="prose prose-gray dark:prose-invert max-w-none text-gray-500 dark:text-gray-400 leading-relaxed">
              <p className="mb-4">
                Relay relies on external email providers to actually deliver the messages. Before you can launch any campaign, you must configure your API keys in the <strong>Settings</strong> page.
              </p>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-gray-800 dark:text-white/90 font-medium mb-1">Resend API (Recommended)</h4>
                  <p className="text-sm">Modern, developer-friendly email provider. You just need to provide your API Key.</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-gray-800 dark:text-white/90 font-medium mb-1">SMTP (Nodemailer)</h4>
                  <p className="text-sm">For custom infrastructure, you can supply standard SMTP credentials (Host, Port, User, Pass).</p>
                </div>
              </div>
              <p className="mt-4 text-sm bg-warning-50 dark:bg-warning-500/10 text-warning-700 dark:text-warning-400 p-3 rounded-lg border border-warning-200 dark:border-warning-500/20">
                <strong>Note:</strong> You must also select an "Active Provider" from the settings to tell Relay which configured service should be used when processing the queue.
              </p>
            </div>
          </section>

          {/* Section: Background Worker */}
          <section id="worker" className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 dark:border-gray-800 dark:bg-white/5 scroll-mt-24 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white/90 flex items-center gap-3">
              <Settings className="text-brand-500" />
              Background Worker (worker.js)
            </h2>
            <div className="prose prose-gray dark:prose-invert max-w-none text-gray-500 dark:text-gray-400 leading-relaxed">
              <p className="mb-4">
                Relay uses a background node process (<code>worker.js</code>) to safely and reliably dispatch queued emails. 
                Instead of blocking your web requests when sending 1,000+ emails, the web server simply adds jobs to the database's <strong>EmailQueue</strong>, and the worker processes them asynchronously.
              </p>
              
              <h4 className="text-gray-800 dark:text-white/90 font-semibold mt-6 mb-3">When and How to Run</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Local Development:</strong> You can run the worker once to clear the queue by executing <code>node worker.js --once</code> in a separate terminal.</li>
                <li><strong>Production:</strong> The worker should run continuously as a daemon. You can start it via PM2: <code>pm2 start worker.js --name "relay-worker"</code>. It polls the database every few seconds for new `pending` emails.</li>
              </ul>
              <div className="mt-4 bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-300">
                // Example of running the worker in the foreground<br />
                <span className="text-success-400">$</span> node worker.js<br />
                <span className="text-gray-500">[Worker] Started pulling from EmailQueue...</span>
              </div>
            </div>
          </section>

          {/* Section: API Documentation */}
          <section id="api" className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 dark:border-gray-800 dark:bg-white/5 scroll-mt-24 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white/90 flex items-center gap-3">
              <FileCode2 className="text-brand-500" />
              API Documentation
            </h2>
            <div className="prose prose-gray dark:prose-invert max-w-none text-gray-500 dark:text-gray-400 leading-relaxed space-y-6">
              
              <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <h4 className="text-gray-800 dark:text-white/90 font-semibold mb-2"><code>POST /api/latex-batch</code></h4>
                <p className="text-sm mb-2">Generates multiple PDFs concurrently from a LaTeX template and a JSON array of variable objects.</p>
                <p className="text-xs font-mono bg-gray-200 dark:bg-gray-900 p-2 rounded">Payload: {"{ latexTemplate, variableSets, batchName, projectId, passwordField }"}</p>
                <p className="text-xs mt-2 text-gray-500">If <code>passwordField</code> is provided, it forwards the password to the <code>latex-service</code> for 256-bit AES PDF encryption.</p>
              </div>

              <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <h4 className="text-gray-800 dark:text-white/90 font-semibold mb-2"><code>POST /api/process-queue</code></h4>
                <p className="text-sm mb-2">The endpoint triggered by <code>worker.js</code>. It finds all `pending` emails in the database, injects tracking links and pixels, and dispatches them via Resend or SMTP.</p>
              </div>

              <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <h4 className="text-gray-800 dark:text-white/90 font-semibold mb-2"><code>GET /api/track/open</code> & <code>GET /api/track/click</code></h4>
                <p className="text-sm">These endpoints handle analytics. <code>/open</code> returns a 1x1 transparent GIF and records the `openedAt` timestamp. <code>/click</code> records the `clickedAt` timestamp and instantly redirects the user to the destination URL.</p>
              </div>
            </div>
          </section>

          {/* Section: Database Schema */}
          <section id="database" className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 dark:border-gray-800 dark:bg-white/5 scroll-mt-24 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white/90 flex items-center gap-3">
              <FileText className="text-brand-500" />
              Database Schema Overview
            </h2>
            <div className="prose prose-gray dark:prose-invert max-w-none text-gray-500 dark:text-gray-400 leading-relaxed">
              <p className="mb-4">
                Relay uses PostgreSQL and Prisma ORM to manage state. The key entities in the system include:
              </p>
              
              <ul className="list-disc pl-5 space-y-3">
                <li>
                  <strong className="text-gray-700 dark:text-gray-300">Project (Campaign)</strong>: The highest-level entity organizing a dispatch event. Contains `type` (e.g., dynamic-pdf) and `status`.
                </li>
                <li>
                  <strong className="text-gray-700 dark:text-gray-300">Template</strong>: Stores the raw code (`html`, `markdown`, or `latex`) and automatically extracted `variables`.
                </li>
                <li>
                  <strong className="text-gray-700 dark:text-gray-300">AudienceList & Contact</strong>: Represents the structured data uploaded via CSV. Contacts store a `metadata` JSON field containing all custom CSV columns.
                </li>
                <li>
                  <strong className="text-gray-700 dark:text-gray-300">EmailQueue</strong>: The most critical table for dispatch and tracking.
                  <ul className="list-circle pl-5 mt-2 space-y-1 text-sm">
                    <li><code>status</code>: 'pending', 'sent', or 'failed'</li>
                    <li><code>attachmentPath</code>: Absolute path to the locally compiled PDF file</li>
                    <li><code>openedAt</code> & <code>clickedAt</code>: Updated dynamically by tracking APIs</li>
                  </ul>
                </li>
              </ul>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
