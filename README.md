<div align="center">
  <img src="public/images/logo/relay-logo-text.png" alt="Relay Logo" width="250" />
  <br />
  <p><strong>The local-first document and email engine.</strong></p>
</div>

## What is Relay?
Relay is a privacy-first, fully local application designed to generate dynamic LaTeX PDFs and dispatch bulk emails directly from your machine. No cloud subscriptions. No vendor lock-in. Your CSV data and SMTP credentials never leave your hard drive.

## Tech Stack
| Component | Technology | Purpose |
| --- | --- | --- |
| **Frontend** | Next.js 15 (React 19), TailwindCSS | High-performance, reactive user interface |
| **Backend API** | Next.js API Routes (Node.js) | Orchestrates email queuing and PDF generation logic |
| **Database** | PostgreSQL + Prisma ORM | Stores templates, audiences, and dispatch queues securely |
| **PDF Engine** | Express + Docker (`pdflatex`) | Isolated microservice for lightning-fast LaTeX compilation |
| **Mail Dispatcher**| Node.js Worker (`worker.js`) | Background job processor for throttling SMTP connections |
| **Auth** | NextAuth.js | Secure user session management |

## Comprehensive Feature List
* **Zero-Cost BYO-SMTP:** Connect your own AWS SES, Resend, or local Exchange server.
* **Dynamic LaTeX Engine:** Inject CSV data straight into LaTeX templates to generate un-forgeable, pixel-perfect certificates, invoices, and contracts.
* **Audience Management:** Upload CSV files, auto-detect variables, and save Audience Lists with custom JSON metadata.
* **Templates Studio:** Design HTML, Markdown, and LaTeX templates using a built-in Monaco code editor with instant variable interpolation.
* **PDF Encryption:** Securely lock generated PDFs with 256-bit AES encryption using unique passwords derived from your CSV data.
* **Open Tracking:** Transparent 1x1 tracking pixels automatically injected to track email open rates.
* **Resilient Background Worker:** A decoupled background Node.js queue handles heavy SMTP sending, ensuring your dashboard never hangs during a 10,000 email blast.
* **Offline Privacy:** Perfect for HR and Finance. Salaries and SSNs stay strictly on your local network.

## System Architecture

```mermaid
graph TD
    A[User / Web Browser] -->|HTTP / UI| B(Next.js App / Port 3000)
    B -->|Prisma| C[(PostgreSQL Database)]
    B -->|API Request| D[LaTeX Microservice / Port 5050]
    D -->|Exec pdflatex| E[Local File System]
    F[Background Worker] -->|Polls Queue| C
    F -->|Sends Mail| G[SMTP Provider / Resend]
    F -->|Reads PDFs| E
```

## Database Schema (PostgreSQL)

```mermaid
erDiagram
    User ||--o{ Project : "owns"
    User ||--o{ Template : "owns"
    User ||--o{ EmailQueue : "owns"
    User ||--o{ AudienceList : "owns"
    
    Template ||--o{ EmailQueue : "used as attachment"
    Project ||--o{ EmailQueue : "contains"
    
    AudienceList ||--o{ Contact : "contains"

    User {
        String id PK
        String email UK
        String smtpHost
        String resendKey
    }
    
    Template {
        String id PK
        String name
        String content
        String format "html, markdown, latex"
        String variables
    }
    
    EmailQueue {
        String id PK
        String toEmail
        String subject
        String status "pending, sent, failed"
        DateTime openedAt
    }
    
    AudienceList {
        String id PK
        String name
    }
    
    Contact {
        String id PK
        String email
        String firstName
        String metadata "JSON attributes"
    }
```

## Getting Started

### 1. Install Dependencies
Run the standard NPM install from the root directory:
```bash
npm install
```

### 2. Start the PDF Engine
Relay uses an isolated Docker microservice to compile LaTeX securely and fast:
```bash
cd latex-service
docker-compose up -d
```
*(Alternatively, run `npm install && node server.js` inside the `latex-service` folder if you have pdflatex natively).*

### 3. Boot Up Relay
Start the Next.js frontend and the background mail worker:
```bash
npm run dev
```
In a new terminal window, start the dispatcher:
```bash
node worker.js
```

### 4. Configuration
Create a `.env.local` file with your credentials:
```env
# Database Connection
DATABASE_URL="postgresql://user:pass@host/db"

# Authentication Secret
NEXTAUTH_SECRET="your-super-secret-key"

# Email Provider
RESEND_API_KEY="re_123456789"
```

---
Built for engineers who care about privacy, speed, and owning their data.
