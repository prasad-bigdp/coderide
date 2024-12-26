'use client';

import { motion } from 'framer-motion';
import { Code2, Layout, Shield, Zap } from 'lucide-react';

const features = [
  {
    icon: Layout,
    title: 'Role-Based Dashboards',
    description: 'Customized experiences for students, faculty, and administrators.'
  },
  {
    icon: Zap,
    title: 'Progressive Learning',
    description: 'Step-by-step task completion and level progression system.'
  },
  {
    icon: Code2,
    title: 'Interactive Coding',
    description: 'Real-time code execution and instant feedback.'
  },
  {
    icon: Shield,
    title: 'Secure Platform',
    description: 'Enterprise-grade security and data protection.'
  }
];

export function FeatureSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Platform Features</h2>
          <p className="text-xl text-gray-600">Everything you need to excel in your learning journey</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <feature.icon className="w-12 h-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}