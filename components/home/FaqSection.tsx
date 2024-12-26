'use client';

import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does the learning path work?",
    answer: "Our platform offers a structured learning path with progressive levels. Complete tasks to unlock new content and advance through the curriculum."
  },
  {
    question: "What kind of support is available?",
    answer: "You'll have access to faculty guidance, peer discussions, and comprehensive documentation. Our support team is also available to help with technical issues."
  },
  {
    question: "Can I track my progress?",
    answer: "Yes! Your dashboard shows detailed progress tracking, including completed tasks, current level, and overall course progression."
  },
  {
    question: "How are the courses structured?",
    answer: "Courses are divided into levels, each containing specific tasks and challenges. Complete all tasks in a level to unlock the next one."
  }
];

export function FaqSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600">Find answers to common questions about our platform</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}