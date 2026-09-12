"use client";

import { useState } from "react";

const faqs = [
  { question: "Do I need to practice yoga to stay at Nomad?", answer: "No. Yoga is part of the Nomad atmosphere, but guests can choose how much or how little they participate." },
  { question: "Can I stay if I am travelling alone?", answer: "Yes. The hostel is designed to make solo travellers feel comfortable meeting others, while still leaving space for quiet time." },
  { question: "Are private rooms available?", answer: "Yes, depending on availability. Live inventory will confirm the room types available for your dates." },
  { question: "Can friends book together?", answer: "Yes. Friends and travel partners can explore shared or twin room options once live availability is connected." },
  { question: "Is Wi-Fi available?", answer: "Yes. Reliable Wi-Fi is available across shared areas." },
  { question: "Can I work remotely from the hostel?", answer: "Yes. There are shared work and reading corners for quiet, focused time." },
  { question: "How do I know if a room is available?", answer: "Live availability will be shown through the booking system once the hostel inventory integration is connected." },
  { question: "When will payment be required?", answer: "Final payment timing and methods will be shown during the live booking flow once payment integration is enabled." },
] as const;

export function HostelFAQ() {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  return (
    <div className="hostel-faq-list">
      {faqs.map((faq, index) => {
        const isOpen = openQuestion === faq.question;
        const panelId = `hostel-faq-panel-${index}`;
        return (
          <article className={`hostel-faq-item${isOpen ? " is-open" : ""}`} key={faq.question}>
            <h3>
              <button aria-controls={panelId} aria-expanded={isOpen} type="button" onClick={() => setOpenQuestion(isOpen ? null : faq.question)}>
                <span>{faq.question}</span>
                <span aria-hidden="true" className="hostel-faq-symbol">{isOpen ? "−" : "+"}</span>
              </button>
            </h3>
            <div className="hostel-faq-answer" id={panelId} role="region" aria-label={faq.question}>
              <div><p>{faq.answer}</p></div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
