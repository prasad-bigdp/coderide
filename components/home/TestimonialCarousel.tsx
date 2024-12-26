'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

const testimonials = [
  {
    quote: "This platform transformed my learning experience. The structured approach and interactive tasks made learning full-stack development enjoyable and effective.",
    author: "Sarah Johnson",
    role: "Student"
  },
  {
    quote: "As a faculty member, I appreciate the comprehensive tools provided for managing courses and tracking student progress. It's made teaching more efficient.",
    author: "Dr. Michael Chen",
    role: "Faculty"
  },
  {
    quote: "The platform's role-based system and security features make it perfect for educational institutions. It's exactly what we needed.",
    author: "Robert Wilson",
    role: "Administrator"
  }
];

export function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const navigate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrent((current + newDirection + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const timer = setInterval(() => navigate(1), 5000);
    return () => clearInterval(timer);
  }, [current]);

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="relative h-[400px] flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 z-10"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="absolute w-full max-w-3xl text-center px-4"
            >
              <Quote className="w-12 h-12 mx-auto mb-6 text-indigo-600 opacity-50" />
              <p className="text-2xl mb-6 text-gray-700">{testimonials[current].quote}</p>
              <div>
                <p className="font-semibold text-lg">{testimonials[current].author}</p>
                <p className="text-gray-600">{testimonials[current].role}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 z-10"
            onClick={() => navigate(1)}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </section>
  );
}