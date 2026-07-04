"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: 'Do I have to use the Resend API?',
    answer: 'Not at all. Relay is completely agnostic. You can plug in a Resend API key or any custom SMTP credentials, like Amazon SES, Mailgun, or even your own mail server.'
  },
  {
    question: 'How does the batching engine work?',
    answer: 'When you queue an email blast, we store it in your database. A background cron job pings the queue endpoint every few minutes and sends them out in small chunks to respect rate limits.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes. Your SMTP credentials and templates are stored securely in your own Neon PostgreSQL database. We do not track or store your mailing lists.'
  },
  {
    question: 'Can I use React Email components?',
    answer: 'Currently, Relay accepts raw HTML and Markdown. You can easily export HTML from React Email and drop it right into our editor.'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="w-full py-32 px-5 sm:px-8 max-w-[800px] mx-auto text-white">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-[#8888a8] text-lg">Everything you need to know about the product and billing.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border border-white/20 rounded-none bg-[#111118] overflow-hidden shadow-[4px_4px_0px_rgba(176,48,136,0.3)]">
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
            >
              <span className="font-semibold text-lg">{faq.question}</span>
              {openIndex === idx ? <Minus className="text-[#8888a8]" /> : <Plus className="text-[#8888a8]" />}
            </button>
            <AnimatePresence>
              {openIndex === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-6 text-[#8888a8]"
                >
                  {faq.answer}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
